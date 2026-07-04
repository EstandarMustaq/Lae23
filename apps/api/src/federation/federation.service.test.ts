import { describe, expect, it } from "vitest";
import type { Database } from "@ponte-segura/database";
import type { OutboxService } from "../outbox.service.js";
import type { RemoteEventApplierService } from "./remote-event-applier.service.js";
import { FederationService } from "./federation.service.js";

const localNodeId = "0197d845-0000-7000-8000-000000000001";
const peerNodeId = "0197d845-0000-7000-8000-000000000002";

describe("FederationService", () => {
  it("stores a peer handshake and appends NODE_HANDSHAKE_COMPLETED", async () => {
    const inserted: unknown[] = [];
    const appended: unknown[] = [];
    const tx = {
      insert: () => ({
        values: (value: unknown) => {
          inserted.push(value);
          return {
            onConflictDoUpdate: async () => undefined
          };
        }
      })
    };
    const database = {
      db: {
        transaction: async (callback: (transaction: typeof tx) => Promise<void>) =>
          callback(tx)
      }
    } as unknown as Database;
    const outbox = {
      createEnvelope: (input: unknown) => input,
      append: async (_tx: unknown, envelope: unknown) => {
        appended.push(envelope);
      }
    } as unknown as OutboxService;
    const service = new FederationService(
      database,
      { port: 3000, databaseUrl: "", nodeId: localNodeId, nodeName: "node-local" },
      outbox,
      {} as RemoteEventApplierService
    );

    const result = await service.handshake({
      nodeId: peerNodeId,
      name: "node-chokwe",
      baseUrl: "https://node-chokwe.example.org"
    });

    expect(result.accepted).toBe(true);
    expect(inserted).toHaveLength(2);
    expect(appended).toContainEqual({
      eventType: "NODE_HANDSHAKE_COMPLETED",
      aggregateType: "sync_peer",
      aggregateId: peerNodeId,
      originNodeId: localNodeId,
      payload: {
        peerNodeId,
        peerName: "node-chokwe",
        peerBaseUrl: "https://node-chokwe.example.org"
      }
    });
  });

  it("returns federation event envelopes with limit support", async () => {
    const database = {
      db: {
        select: () => ({
          from: () => ({
            where: () => ({
              orderBy: () => ({
                limit: async (limit: number) =>
                  [
                    {
                      id: "0197d845-0000-7000-8000-000000000010",
                      eventType: "HELP_REQUEST_CREATED",
                      aggregateType: "help_request",
                      aggregateId: "0197d845-0000-7000-8000-000000000011",
                      originNodeId: localNodeId,
                      occurredAt: new Date("2026-07-04T08:30:00.000Z"),
                      schemaVersion: 1,
                      payload: { title: "Pedido" }
                    }
                  ].slice(0, limit)
              })
            })
          })
        })
      }
    } as unknown as Database;
    const service = new FederationService(
      database,
      { port: 3000, databaseUrl: "", nodeId: localNodeId, nodeName: "node-local" },
      {} as OutboxService,
      {} as RemoteEventApplierService
    );

    await expect(service.events({ limit: "1" })).resolves.toEqual([
      {
        eventId: "0197d845-0000-7000-8000-000000000010",
        eventType: "HELP_REQUEST_CREATED",
        aggregateType: "help_request",
        aggregateId: "0197d845-0000-7000-8000-000000000011",
        originNodeId: localNodeId,
        occurredAt: "2026-07-04T08:30:00.000Z",
        schemaVersion: 1,
        payload: { title: "Pedido" }
      }
    ]);
  });

  it("treats duplicate received events as idempotent", async () => {
    const tx = {
      insert: () => ({
        values: () => ({
          onConflictDoNothing: () => ({
            returning: async () => []
          })
        })
      })
    };
    const database = {
      db: {
        transaction: async (
          callback: (transaction: typeof tx) => Promise<unknown>
        ) => callback(tx)
      }
    } as unknown as Database;
    const service = new FederationService(
      database,
      { port: 3000, databaseUrl: "", nodeId: localNodeId, nodeName: "node-local" },
      {} as OutboxService,
      {} as RemoteEventApplierService
    );

    await expect(
      service.receiveEvent({
        eventId: "0197d845-0000-7000-8000-000000000020",
        eventType: "HELP_REQUEST_CREATED",
        aggregateType: "help_request",
        aggregateId: "0197d845-0000-7000-8000-000000000021",
        originNodeId: peerNodeId,
        occurredAt: "2026-07-04T08:30:00.000Z",
        schemaVersion: 1,
        payload: { title: "Pedido" }
      })
    ).resolves.toEqual({
      received: true,
      eventId: "0197d845-0000-7000-8000-000000000020",
      duplicate: true
    });
  });

  it("applies new received events and marks them processed", async () => {
    const updated: unknown[] = [];
    const tx = {
      insert: () => ({
        values: () => ({
          onConflictDoNothing: () => ({
            returning: async () => [
              {
                id: "0197d845-0000-7000-8000-000000000030",
                eventId: "0197d845-0000-7000-8000-000000000020"
              }
            ]
          })
        })
      }),
      update: () => ({
        set: (value: unknown) => {
          updated.push(value);
          return { where: async () => undefined };
        }
      })
    };
    const database = {
      db: {
        transaction: async (
          callback: (transaction: typeof tx) => Promise<unknown>
        ) => callback(tx)
      }
    } as unknown as Database;
    const applied: unknown[] = [];
    const remoteEventApplier = {
      apply: async (_tx: unknown, event: unknown) => {
        applied.push(event);
      }
    } as unknown as RemoteEventApplierService;
    const service = new FederationService(
      database,
      { port: 3000, databaseUrl: "", nodeId: localNodeId, nodeName: "node-local" },
      {} as OutboxService,
      remoteEventApplier
    );

    await expect(
      service.receiveEvent({
        eventId: "0197d845-0000-7000-8000-000000000020",
        eventType: "HELP_REQUEST_CREATED",
        aggregateType: "help_request",
        aggregateId: "0197d845-0000-7000-8000-000000000021",
        originNodeId: peerNodeId,
        occurredAt: "2026-07-04T08:30:00.000Z",
        schemaVersion: 1,
        payload: {
          title: "Familia isolada",
          urgency: "CRITICAL",
          latitude: -24.5333,
          longitude: 32.9833,
          needs: [{ needType: "DRINKING_WATER", quantity: 5 }]
        }
      })
    ).resolves.toEqual({
      received: true,
      eventId: "0197d845-0000-7000-8000-000000000020",
      duplicate: false
    });
    expect(applied).toHaveLength(1);
    expect(updated).toHaveLength(1);
  });
});
