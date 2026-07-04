import { describe, expect, it } from "vitest";
import {
  federationEventSchema,
  federationEventsQuerySchema,
  federationHandshakeSchema
} from "./schemas.js";

describe("federation schemas", () => {
  it("validates the handshake contract", () => {
    const result = federationHandshakeSchema.parse({
      nodeId: "0197d845-0000-7000-8000-000000000002",
      name: "node-chokwe",
      baseUrl: "https://node-chokwe.example.org"
    });

    expect(result.name).toBe("node-chokwe");
  });

  it("rejects unknown event types", () => {
    const result = federationEventSchema.safeParse({
      eventId: "0197d845-0000-7000-8000-000000000001",
      eventType: "UNKNOWN_EVENT",
      aggregateType: "help_request",
      aggregateId: "0197d845-0000-7000-8000-000000000002",
      originNodeId: "0197d845-0000-7000-8000-000000000003",
      occurredAt: "2026-07-04T08:30:00.000Z",
      schemaVersion: 1,
      payload: {}
    });

    expect(result.success).toBe(false);
  });

  it("applies query defaults and coercion", () => {
    const result = federationEventsQuerySchema.parse({
      limit: "25",
      after: "2026-07-04T08:30:00.000Z"
    });

    expect(result).toEqual({
      limit: 25,
      after: "2026-07-04T08:30:00.000Z"
    });
  });
});
