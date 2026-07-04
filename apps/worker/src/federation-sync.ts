import {
  outboxEventDeliveries,
  outboxEvents,
  syncPeers,
  type Database
} from "@ponte-segura/database";
import type { DomainEventEnvelope } from "@ponte-segura/events";
import { createId } from "@ponte-segura/shared";
import { asc, eq, ne } from "drizzle-orm";

type OutboxEventRow = typeof outboxEvents.$inferSelect;
type DeliveryRow = typeof outboxEventDeliveries.$inferSelect;
type PeerRow = typeof syncPeers.$inferSelect;
type FetchLike = (
  url: string,
  init: {
    method: "POST";
    headers: Record<string, string>;
    body: string;
  }
) => Promise<{
  ok: boolean;
  status: number;
  text: () => Promise<string>;
}>;

export type FederationSyncResult = {
  deliveriesCreated: number;
  delivered: number;
  failed: number;
};

export function outboxRowToEnvelope(
  row: OutboxEventRow
): DomainEventEnvelope {
  return {
    eventId: row.id,
    eventType: row.eventType as DomainEventEnvelope["eventType"],
    aggregateType: row.aggregateType,
    aggregateId: row.aggregateId,
    originNodeId: row.originNodeId,
    occurredAt: row.occurredAt.toISOString(),
    schemaVersion: row.schemaVersion,
    payload: row.payload
  };
}

export function peerEventUrl(peer: Pick<PeerRow, "baseUrl">): string {
  return `${peer.baseUrl.replace(/\/+$/, "")}/api/federation/events`;
}

export function nextRetryAt(now: Date, attemptCount: number): Date {
  const delayMs = Math.min(60_000, 1000 * 2 ** Math.max(0, attemptCount));
  return new Date(now.getTime() + delayMs);
}

export function isDeliveryDue(
  delivery: Pick<DeliveryRow, "status" | "nextAttemptAt">,
  now: Date
): boolean {
  return delivery.status !== "DELIVERED" && delivery.nextAttemptAt <= now;
}

export async function sendEventToPeer(input: {
  event: OutboxEventRow;
  peer: PeerRow;
  fetchImpl: FetchLike;
}) {
  const response = await input.fetchImpl(peerEventUrl(input.peer), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(outboxRowToEnvelope(input.event))
  });

  if (response.ok) {
    return { delivered: true, error: null };
  }

  const text = await response.text();
  return {
    delivered: false,
    error: `HTTP ${response.status}${text ? `: ${text}` : ""}`
  };
}

export async function processFederationSync(
  database: Database,
  options: {
    fetchImpl?: FetchLike;
    now?: Date;
    maxEvents?: number;
    maxDeliveries?: number;
  } = {}
): Promise<FederationSyncResult> {
  const db = database.db;
  const now = options.now ?? new Date();
  const fetchImpl = options.fetchImpl ?? fetch;
  const maxEvents = options.maxEvents ?? 100;
  const maxDeliveries = options.maxDeliveries ?? 50;
  let deliveriesCreated = 0;
  let delivered = 0;
  let failed = 0;

  const peers = await db.select().from(syncPeers);
  const events = await db
    .select()
    .from(outboxEvents)
    .orderBy(asc(outboxEvents.createdAt))
    .limit(maxEvents);

  for (const event of events) {
    for (const peer of peers) {
      if (peer.nodeId === event.originNodeId) {
        continue;
      }

      const inserted = await db
        .insert(outboxEventDeliveries)
        .values({
          id: createId(),
          outboxEventId: event.id,
          peerNodeId: peer.nodeId,
          status: "PENDING",
          nextAttemptAt: now
        })
        .onConflictDoNothing()
        .returning({ id: outboxEventDeliveries.id });

      if (inserted.length > 0) {
        deliveriesCreated += inserted.length;
        await db
          .update(outboxEvents)
          .set({ synchronizedAt: null })
          .where(eq(outboxEvents.id, event.id));
      }
    }

    if (!event.processedAt) {
      await db
        .update(outboxEvents)
        .set({ processedAt: now })
        .where(eq(outboxEvents.id, event.id));
    }
  }

  const deliveryRows = await db
    .select()
    .from(outboxEventDeliveries)
    .where(ne(outboxEventDeliveries.status, "DELIVERED"))
    .limit(maxDeliveries);

  for (const delivery of deliveryRows.filter((row) => isDeliveryDue(row, now))) {
    const [event] = await db
      .select()
      .from(outboxEvents)
      .where(eq(outboxEvents.id, delivery.outboxEventId))
      .limit(1);
    const [peer] = await db
      .select()
      .from(syncPeers)
      .where(eq(syncPeers.nodeId, delivery.peerNodeId))
      .limit(1);

    if (!event || !peer) {
      continue;
    }

    const result = await sendEventToPeer({ event, peer, fetchImpl });

    if (result.delivered) {
      delivered += 1;
      await db
        .update(outboxEventDeliveries)
        .set({
          status: "DELIVERED",
          lastError: null,
          deliveredAt: now,
          updatedAt: now
        })
        .where(eq(outboxEventDeliveries.id, delivery.id));
      await markEventSynchronizedWhenComplete(database, event.id, now);
      continue;
    }

    failed += 1;
    await db
      .update(outboxEventDeliveries)
      .set({
        status: "FAILED",
        attemptCount: delivery.attemptCount + 1,
        lastError: result.error,
        nextAttemptAt: nextRetryAt(now, delivery.attemptCount + 1),
        updatedAt: now
      })
      .where(eq(outboxEventDeliveries.id, delivery.id));
  }

  return { deliveriesCreated, delivered, failed };
}

async function markEventSynchronizedWhenComplete(
  database: Database,
  outboxEventId: string,
  now: Date
) {
  const peers = await database.db.select().from(syncPeers);

  if (peers.length === 0) {
    return;
  }

  const deliveries = await database.db
    .select()
    .from(outboxEventDeliveries)
    .where(eq(outboxEventDeliveries.outboxEventId, outboxEventId));
  const deliveredPeerIds = new Set(
    deliveries
      .filter((delivery) => delivery.status === "DELIVERED")
      .map((delivery) => delivery.peerNodeId)
  );

  if (peers.every((peer) => deliveredPeerIds.has(peer.nodeId))) {
    await database.db
      .update(outboxEvents)
      .set({ synchronizedAt: now })
      .where(eq(outboxEvents.id, outboxEventId));
  }
}
