import { Injectable } from "@nestjs/common";
import {
  createHelpRequestSchema,
  createIncidentSchema,
  createMissionSchema,
  createResourceOfferSchema,
  createVolunteerSchema,
  federationHandshakeSchema,
  updateHelpRequestStatusSchema,
  updateMissionStatusSchema,
  updateVolunteerAvailabilitySchema,
  type FederationEventInput
} from "@ponte-segura/contracts";
import {
  helpRequestNeeds,
  helpRequests,
  incidents,
  missionAssignments,
  missions,
  nodes,
  resourceOffers,
  syncPeers,
  volunteers,
  type Database
} from "@ponte-segura/database";
import { createId } from "@ponte-segura/shared";
import { eq } from "drizzle-orm";
import { z } from "zod";

type Transaction = Parameters<Parameters<Database["db"]["transaction"]>[0]>[0];

@Injectable()
export class RemoteEventApplierService {
  async apply(tx: Transaction, event: FederationEventInput): Promise<void> {
    switch (event.eventType) {
      case "INCIDENT_REPORTED":
        await this.applyIncidentReported(tx, event);
        return;
      case "HELP_REQUEST_CREATED":
        await this.applyHelpRequestCreated(tx, event);
        return;
      case "HELP_REQUEST_UPDATED":
        await this.applyHelpRequestUpdated(tx, event);
        return;
      case "RESOURCE_OFFERED":
        await this.applyResourceOffered(tx, event);
        return;
      case "VOLUNTEER_REGISTERED":
        await this.applyVolunteerRegistered(tx, event);
        return;
      case "VOLUNTEER_AVAILABILITY_UPDATED":
        await this.applyVolunteerAvailabilityUpdated(tx, event);
        return;
      case "MISSION_CREATED":
        await this.applyMissionCreated(tx, event);
        return;
      case "MISSION_STATUS_CHANGED":
        await this.applyMissionStatusChanged(tx, event);
        return;
      case "NODE_HANDSHAKE_COMPLETED":
        await this.applyNodeHandshakeCompleted(tx, event);
        return;
      default:
        return;
    }
  }

  private async applyIncidentReported(
    tx: Transaction,
    event: FederationEventInput
  ) {
    const payload = createIncidentSchema.parse(event.payload);

    await tx
      .insert(incidents)
      .values({
        id: event.aggregateId,
        originNodeId: event.originNodeId,
        reporterId: payload.reporterId,
        title: payload.title,
        description: payload.description,
        urgency: payload.urgency,
        latitude: payload.latitude.toString(),
        longitude: payload.longitude.toString()
      })
      .onConflictDoUpdate({
        target: incidents.id,
        set: {
          title: payload.title,
          description: payload.description,
          urgency: payload.urgency,
          latitude: payload.latitude.toString(),
          longitude: payload.longitude.toString(),
          updatedAt: new Date()
        }
      });
  }

  private async applyHelpRequestCreated(
    tx: Transaction,
    event: FederationEventInput
  ) {
    const payload = createHelpRequestSchema.parse(event.payload);

    await tx
      .insert(helpRequests)
      .values({
        id: event.aggregateId,
        originNodeId: event.originNodeId,
        reporterId: payload.reporterId,
        title: payload.title,
        description: payload.description,
        urgency: payload.urgency,
        status: "OPEN",
        latitude: payload.latitude.toString(),
        longitude: payload.longitude.toString()
      })
      .onConflictDoUpdate({
        target: helpRequests.id,
        set: {
          title: payload.title,
          description: payload.description,
          urgency: payload.urgency,
          latitude: payload.latitude.toString(),
          longitude: payload.longitude.toString(),
          updatedAt: new Date()
        }
      });

    for (const need of payload.needs) {
      await tx.insert(helpRequestNeeds).values({
        id: createId(),
        helpRequestId: event.aggregateId,
        needType: need.needType,
        quantity: need.quantity,
        status: "OPEN"
      });
    }
  }

  private async applyHelpRequestUpdated(
    tx: Transaction,
    event: FederationEventInput
  ) {
    const payload = updateHelpRequestStatusSchema.parse(event.payload);

    await tx
      .update(helpRequests)
      .set({ status: payload.status, updatedAt: new Date() })
      .where(eq(helpRequests.id, event.aggregateId));
  }

  private async applyResourceOffered(
    tx: Transaction,
    event: FederationEventInput
  ) {
    const payload = createResourceOfferSchema.parse(event.payload);

    await tx
      .insert(resourceOffers)
      .values({
        id: event.aggregateId,
        originNodeId: event.originNodeId,
        donorId: payload.donorId,
        resourceType: payload.resourceType,
        quantity: payload.quantity,
        availableNow: payload.availableNow,
        latitude: payload.latitude.toString(),
        longitude: payload.longitude.toString()
      })
      .onConflictDoUpdate({
        target: resourceOffers.id,
        set: {
          resourceType: payload.resourceType,
          quantity: payload.quantity,
          availableNow: payload.availableNow,
          latitude: payload.latitude.toString(),
          longitude: payload.longitude.toString(),
          updatedAt: new Date()
        }
      });
  }

  private async applyVolunteerRegistered(
    tx: Transaction,
    event: FederationEventInput
  ) {
    const payload = createVolunteerSchema.parse(event.payload);

    await tx
      .insert(volunteers)
      .values({
        id: event.aggregateId,
        originNodeId: event.originNodeId,
        userId: payload.userId,
        displayName: payload.displayName,
        skills: payload.skills,
        resources: payload.resources,
        maximumDistanceKm: payload.maximumDistanceKm,
        availableNow: payload.availableNow,
        verified: payload.verified,
        latitude: payload.latitude.toString(),
        longitude: payload.longitude.toString()
      })
      .onConflictDoUpdate({
        target: volunteers.id,
        set: {
          displayName: payload.displayName,
          skills: payload.skills,
          resources: payload.resources,
          maximumDistanceKm: payload.maximumDistanceKm,
          availableNow: payload.availableNow,
          verified: payload.verified,
          latitude: payload.latitude.toString(),
          longitude: payload.longitude.toString(),
          updatedAt: new Date()
        }
      });
  }

  private async applyVolunteerAvailabilityUpdated(
    tx: Transaction,
    event: FederationEventInput
  ) {
    const payload = updateVolunteerAvailabilitySchema.parse(event.payload);

    await tx
      .update(volunteers)
      .set({ availableNow: payload.availableNow, updatedAt: new Date() })
      .where(eq(volunteers.id, event.aggregateId));
  }

  private async applyMissionCreated(
    tx: Transaction,
    event: FederationEventInput
  ) {
    const payload = createMissionSchema.parse(event.payload);

    await tx
      .insert(missions)
      .values({
        id: event.aggregateId,
        originNodeId: event.originNodeId,
        helpRequestId: payload.helpRequestId,
        status: "DRAFT"
      })
      .onConflictDoUpdate({
        target: missions.id,
        set: {
          helpRequestId: payload.helpRequestId,
          updatedAt: new Date()
        }
      });

    for (const assignment of payload.assignments) {
      await tx.insert(missionAssignments).values({
        id: createId(),
        missionId: event.aggregateId,
        assigneeType: assignment.assigneeType,
        assigneeId: assignment.assigneeId,
        needType: assignment.needType,
        status: assignment.status
      });
    }
  }

  private async applyMissionStatusChanged(
    tx: Transaction,
    event: FederationEventInput
  ) {
    const payload = updateMissionStatusSchema.parse(event.payload);

    await tx
      .update(missions)
      .set({ status: payload.status, updatedAt: new Date() })
      .where(eq(missions.id, event.aggregateId));
  }

  private async applyNodeHandshakeCompleted(
    tx: Transaction,
    event: FederationEventInput
  ) {
    const payload = z
      .object({
        peerNodeId: z.string().uuid(),
        peerName: z.string().min(2).max(120),
        peerBaseUrl: z.string().url()
      })
      .parse(event.payload);
    const handshake = federationHandshakeSchema.parse({
      nodeId: payload.peerNodeId,
      name: payload.peerName,
      baseUrl: payload.peerBaseUrl
    });

    await tx
      .insert(nodes)
      .values({
        id: handshake.nodeId,
        name: handshake.name,
        baseUrl: handshake.baseUrl
      })
      .onConflictDoUpdate({
        target: nodes.id,
        set: {
          name: handshake.name,
          baseUrl: handshake.baseUrl,
          updatedAt: new Date()
        }
      });

    await tx
      .insert(syncPeers)
      .values({
        id: createId(),
        nodeId: handshake.nodeId,
        name: handshake.name,
        baseUrl: handshake.baseUrl,
        lastHandshakeAt: new Date()
      })
      .onConflictDoUpdate({
        target: syncPeers.nodeId,
        set: {
          name: handshake.name,
          baseUrl: handshake.baseUrl,
          lastHandshakeAt: new Date(),
          updatedAt: new Date()
        }
      });
  }
}
