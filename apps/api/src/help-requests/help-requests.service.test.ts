import { describe, expect, it } from "vitest";
import type { Database } from "@ponte-segura/database";
import type { OutboxService } from "../outbox.service.js";
import { HelpRequestsService } from "./help-requests.service.js";

const localNodeId = "0197d845-0000-7000-8000-000000000001";

describe("HelpRequestsService", () => {
  it("creates a help request and appends HELP_REQUEST_CREATED", async () => {
    const inserted: unknown[] = [];
    const appended: unknown[] = [];
    const tx = {
      insert: () => ({
        values: async (value: unknown) => {
          inserted.push(value);
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
    const service = new HelpRequestsService(
      database,
      { port: 3000, databaseUrl: "", nodeId: localNodeId, nodeName: "node-local" },
      outbox
    );

    const result = await service.create({
      title: "Familia isolada",
      description: "Cinco pessoas aguardam evacuacao.",
      urgency: "CRITICAL",
      latitude: -24.5333,
      longitude: 32.9833,
      needs: [{ needType: "DRINKING_WATER", quantity: 5 }]
    });

    expect(result.id).toEqual(expect.any(String));
    expect(inserted).toHaveLength(2);
    expect(appended).toContainEqual({
      eventType: "HELP_REQUEST_CREATED",
      aggregateType: "help_request",
      aggregateId: result.id,
      originNodeId: localNodeId,
      payload: {
        title: "Familia isolada",
        description: "Cinco pessoas aguardam evacuacao.",
        urgency: "CRITICAL",
        latitude: -24.5333,
        longitude: 32.9833,
        needs: [{ needType: "DRINKING_WATER", quantity: 5 }]
      }
    });
  });
});
