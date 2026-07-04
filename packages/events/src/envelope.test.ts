import { describe, expect, it } from "vitest";
import { createEventEnvelope } from "./envelope.js";

describe("createEventEnvelope", () => {
  it("creates a typed event envelope with schema version", () => {
    const envelope = createEventEnvelope({
      eventId: "0197d845-0000-7000-8000-000000000001",
      eventType: "NODE_HANDSHAKE_COMPLETED",
      aggregateType: "sync_peer",
      aggregateId: "0197d845-0000-7000-8000-000000000002",
      originNodeId: "0197d845-0000-7000-8000-000000000003",
      occurredAt: new Date("2026-07-04T08:30:00.000Z"),
      payload: {
        peerNodeId: "0197d845-0000-7000-8000-000000000002",
        peerName: "node-chokwe",
        peerBaseUrl: "https://node-chokwe.example.org"
      }
    });

    expect(envelope).toEqual({
      eventId: "0197d845-0000-7000-8000-000000000001",
      eventType: "NODE_HANDSHAKE_COMPLETED",
      aggregateType: "sync_peer",
      aggregateId: "0197d845-0000-7000-8000-000000000002",
      originNodeId: "0197d845-0000-7000-8000-000000000003",
      occurredAt: "2026-07-04T08:30:00.000Z",
      schemaVersion: 1,
      payload: {
        peerNodeId: "0197d845-0000-7000-8000-000000000002",
        peerName: "node-chokwe",
        peerBaseUrl: "https://node-chokwe.example.org"
      }
    });
  });
});
