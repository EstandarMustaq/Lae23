import { describe, expect, it } from "vitest";
import {
  isDeliveryDue,
  nextRetryAt,
  outboxRowToEnvelope,
  peerEventUrl,
  sendEventToPeer
} from "./federation-sync.js";

const event = {
  id: "0197d845-0000-7000-8000-000000000010",
  eventType: "HELP_REQUEST_CREATED",
  aggregateType: "help_request",
  aggregateId: "0197d845-0000-7000-8000-000000000011",
  originNodeId: "0197d845-0000-7000-8000-000000000012",
  schemaVersion: 1,
  payload: { title: "Pedido" },
  occurredAt: new Date("2026-07-04T08:30:00.000Z"),
  processedAt: null,
  synchronizedAt: null,
  createdAt: new Date("2026-07-04T08:30:00.000Z")
};

const peer = {
  id: "0197d845-0000-7000-8000-000000000020",
  nodeId: "0197d845-0000-7000-8000-000000000021",
  name: "node-chokwe",
  baseUrl: "https://node-chokwe.example.org/",
  lastHandshakeAt: null,
  createdAt: new Date("2026-07-04T08:00:00.000Z"),
  updatedAt: new Date("2026-07-04T08:00:00.000Z")
};

describe("federation sync worker helpers", () => {
  it("builds federation envelopes from outbox rows", () => {
    expect(outboxRowToEnvelope(event)).toEqual({
      eventId: event.id,
      eventType: "HELP_REQUEST_CREATED",
      aggregateType: "help_request",
      aggregateId: event.aggregateId,
      originNodeId: event.originNodeId,
      occurredAt: "2026-07-04T08:30:00.000Z",
      schemaVersion: 1,
      payload: { title: "Pedido" }
    });
  });

  it("normalizes peer event URLs", () => {
    expect(peerEventUrl(peer)).toBe(
      "https://node-chokwe.example.org/api/federation/events"
    );
  });

  it("sends an event to a peer", async () => {
    const calls: unknown[] = [];
    const result = await sendEventToPeer({
      event,
      peer,
      fetchImpl: async (url, init) => {
        calls.push({ url, init });
        return { ok: true, status: 200, text: async () => "" };
      }
    });

    expect(result).toEqual({ delivered: true, error: null });
    expect(calls).toHaveLength(1);
  });

  it("reports failed peer delivery and schedules retry", async () => {
    const result = await sendEventToPeer({
      event,
      peer,
      fetchImpl: async () => ({
        ok: false,
        status: 503,
        text: async () => "unavailable"
      })
    });

    expect(result).toEqual({
      delivered: false,
      error: "HTTP 503: unavailable"
    });
    expect(nextRetryAt(new Date("2026-07-04T08:30:00.000Z"), 2)).toEqual(
      new Date("2026-07-04T08:30:04.000Z")
    );
  });

  it("detects due deliveries", () => {
    const now = new Date("2026-07-04T08:30:00.000Z");

    expect(
      isDeliveryDue({ status: "FAILED", nextAttemptAt: now }, now)
    ).toBe(true);
    expect(
      isDeliveryDue({
        status: "DELIVERED",
        nextAttemptAt: new Date("2026-07-04T08:00:00.000Z")
      }, now)
    ).toBe(false);
  });
});
