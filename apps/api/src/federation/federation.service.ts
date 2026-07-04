import { Inject, Injectable } from "@nestjs/common";
import {
  federationEventSchema,
  federationEventsQuerySchema,
  federationHandshakeSchema,
  type FederationEventsQuery
} from "@ponte-segura/contracts";
import {
  inboxEvents,
  nodes,
  outboxEventDeliveries,
  outboxEvents,
  syncPeers,
  type Database
} from "@ponte-segura/database";
import { createId } from "@ponte-segura/shared";
import { desc, eq, gt } from "drizzle-orm";
import { APP_CONFIG, type AppConfig } from "../config.js";
import { DATABASE } from "../database.provider.js";
import { OutboxService } from "../outbox.service.js";
import { RemoteEventApplierService } from "./remote-event-applier.service.js";

@Injectable()
export class FederationService {
  constructor(
    @Inject(DATABASE) private readonly database: Database,
    @Inject(APP_CONFIG) private readonly config: AppConfig,
    private readonly outbox: OutboxService,
    private readonly remoteEventApplier: RemoteEventApplierService
  ) {}

  listNodes() {
    return this.database.db.select().from(syncPeers);
  }

  async handshake(input: unknown) {
    const body = federationHandshakeSchema.parse(input);

    await this.database.db.transaction(async (tx) => {
      await tx
        .insert(syncPeers)
        .values({
          id: createId(),
          nodeId: body.nodeId,
          name: body.name,
          baseUrl: body.baseUrl,
          lastHandshakeAt: new Date()
        })
        .onConflictDoUpdate({
          target: syncPeers.nodeId,
          set: {
            name: body.name,
            baseUrl: body.baseUrl,
            lastHandshakeAt: new Date(),
            updatedAt: new Date()
          }
        });

      await tx
        .insert(nodes)
        .values({
          id: body.nodeId,
          name: body.name,
          baseUrl: body.baseUrl
        })
        .onConflictDoUpdate({
          target: nodes.id,
          set: {
            name: body.name,
            baseUrl: body.baseUrl,
            updatedAt: new Date()
          }
        });

      await this.outbox.append(
        tx,
        this.outbox.createEnvelope({
          eventType: "NODE_HANDSHAKE_COMPLETED",
          aggregateType: "sync_peer",
          aggregateId: body.nodeId,
          originNodeId: this.config.nodeId,
          payload: {
            peerNodeId: body.nodeId,
            peerName: body.name,
            peerBaseUrl: body.baseUrl
          }
        })
      );
    });

    return {
      accepted: true,
      nodeId: this.config.nodeId,
      nodeName: this.config.nodeName
    };
  }

  async events(input: unknown) {
    const query = federationEventsQuerySchema.parse(input);
    const rows = await this.database.db
      .select()
      .from(outboxEvents)
      .where(buildAfterFilter(query))
      .orderBy(desc(outboxEvents.occurredAt))
      .limit(query.limit);

    return rows.map((row) => ({
      eventId: row.id,
      eventType: row.eventType,
      aggregateType: row.aggregateType,
      aggregateId: row.aggregateId,
      originNodeId: row.originNodeId,
      occurredAt: row.occurredAt.toISOString(),
      schemaVersion: row.schemaVersion,
      payload: row.payload
    }));
  }

  deliveries() {
    return this.database.db
      .select()
      .from(outboxEventDeliveries)
      .orderBy(desc(outboxEventDeliveries.updatedAt))
      .limit(100);
  }

  async receiveEvent(input: unknown) {
    const event = federationEventSchema.parse(input);

    return this.database.db.transaction(async (tx) => {
      const [inserted] = await tx
        .insert(inboxEvents)
        .values({
          id: createId(),
          eventId: event.eventId,
          eventType: event.eventType,
          originNodeId: event.originNodeId,
          schemaVersion: event.schemaVersion,
          payload: event
        })
        .onConflictDoNothing()
        .returning({ id: inboxEvents.id, eventId: inboxEvents.eventId });

      if (!inserted) {
        return { received: true, eventId: event.eventId, duplicate: true };
      }

      if (event.originNodeId !== this.config.nodeId) {
        await this.remoteEventApplier.apply(tx, event);
      }

      await tx
        .update(inboxEvents)
        .set({ processedAt: new Date() })
        .where(eq(inboxEvents.id, inserted.id));

      return { received: true, eventId: event.eventId, duplicate: false };
    });
  }
}

function buildAfterFilter(query: FederationEventsQuery) {
  if (!query.after) {
    return undefined;
  }

  return gt(outboxEvents.occurredAt, new Date(query.after));
}
