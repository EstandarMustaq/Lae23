import { describe, expect, it } from "vitest";
import { RemoteEventApplierService } from "./remote-event-applier.service.js";

describe("RemoteEventApplierService", () => {
  it("applies HELP_REQUEST_CREATED without appending outbox events", async () => {
    const inserted: unknown[] = [];
    const tx = {
      insert: () => ({
        values: (value: unknown) => {
          inserted.push(value);
          return { onConflictDoUpdate: async () => undefined };
        }
      })
    };
    const service = new RemoteEventApplierService();

    await service.apply(tx as never, {
      eventId: "0197d845-0000-7000-8000-000000000010",
      eventType: "HELP_REQUEST_CREATED",
      aggregateType: "help_request",
      aggregateId: "0197d845-0000-7000-8000-000000000011",
      originNodeId: "0197d845-0000-7000-8000-000000000012",
      occurredAt: "2026-07-04T08:30:00.000Z",
      schemaVersion: 1,
      payload: {
        title: "Familia isolada",
        urgency: "CRITICAL",
        latitude: -24.5333,
        longitude: 32.9833,
        needs: [{ needType: "DRINKING_WATER", quantity: 5 }]
      }
    });

    expect(inserted).toHaveLength(2);
    expect(inserted[0]).toMatchObject({
      id: "0197d845-0000-7000-8000-000000000011",
      originNodeId: "0197d845-0000-7000-8000-000000000012",
      title: "Familia isolada",
      status: "OPEN"
    });
    expect(inserted[1]).toMatchObject({
      helpRequestId: "0197d845-0000-7000-8000-000000000011",
      needType: "DRINKING_WATER",
      quantity: 5
    });
  });

  it("applies RESOURCE_OFFERED", async () => {
    const inserted: unknown[] = [];
    const tx = {
      insert: () => ({
        values: (value: unknown) => {
          inserted.push(value);
          return { onConflictDoUpdate: async () => undefined };
        }
      })
    };
    const service = new RemoteEventApplierService();

    await service.apply(tx as never, {
      eventId: "0197d845-0000-7000-8000-000000000020",
      eventType: "RESOURCE_OFFERED",
      aggregateType: "resource_offer",
      aggregateId: "0197d845-0000-7000-8000-000000000021",
      originNodeId: "0197d845-0000-7000-8000-000000000022",
      occurredAt: "2026-07-04T08:30:00.000Z",
      schemaVersion: 1,
      payload: {
        resourceType: "DRINKING_WATER",
        quantity: 100,
        availableNow: true,
        latitude: -24.5333,
        longitude: 32.9833
      }
    });

    expect(inserted[0]).toMatchObject({
      id: "0197d845-0000-7000-8000-000000000021",
      resourceType: "DRINKING_WATER",
      quantity: 100
    });
  });

  it("applies VOLUNTEER_REGISTERED and MISSION_CREATED", async () => {
    const inserted: unknown[] = [];
    const tx = {
      insert: () => ({
        values: (value: unknown) => {
          inserted.push(value);
          return { onConflictDoUpdate: async () => undefined };
        }
      })
    };
    const service = new RemoteEventApplierService();

    await service.apply(tx as never, {
      eventId: "0197d845-0000-7000-8000-000000000030",
      eventType: "VOLUNTEER_REGISTERED",
      aggregateType: "volunteer",
      aggregateId: "0197d845-0000-7000-8000-000000000031",
      originNodeId: "0197d845-0000-7000-8000-000000000032",
      occurredAt: "2026-07-04T08:30:00.000Z",
      schemaVersion: 1,
      payload: {
        displayName: "Voluntario",
        skills: ["DRIVER"],
        resources: ["VEHICLE"],
        maximumDistanceKm: 20,
        availableNow: true,
        verified: false,
        latitude: -24.5333,
        longitude: 32.9833
      }
    });
    await service.apply(tx as never, {
      eventId: "0197d845-0000-7000-8000-000000000040",
      eventType: "MISSION_CREATED",
      aggregateType: "mission",
      aggregateId: "0197d845-0000-7000-8000-000000000041",
      originNodeId: "0197d845-0000-7000-8000-000000000032",
      occurredAt: "2026-07-04T08:31:00.000Z",
      schemaVersion: 1,
      payload: {
        helpRequestId: "0197d845-0000-7000-8000-000000000050",
        assignments: [
          {
            assigneeType: "VOLUNTEER",
            assigneeId: "0197d845-0000-7000-8000-000000000031",
            needType: "TRANSPORT",
            status: "PROPOSED"
          }
        ]
      }
    });

    expect(inserted).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ displayName: "Voluntario" }),
        expect.objectContaining({
          id: "0197d845-0000-7000-8000-000000000041",
          helpRequestId: "0197d845-0000-7000-8000-000000000050"
        }),
        expect.objectContaining({
          missionId: "0197d845-0000-7000-8000-000000000041",
          assigneeType: "VOLUNTEER"
        })
      ])
    );
  });
});
