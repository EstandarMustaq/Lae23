import {
  assignmentStatuses,
  helpRequestStatuses,
  missionStatuses,
  needTypes,
  resourceTypes,
  urgencies,
  volunteerResources,
  volunteerSkills
} from "@ponte-segura/domain";
import { domainEventTypes } from "@ponte-segura/events";
import { z } from "zod";

export const geoPointSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180)
});

export const createIncidentSchema = z.object({
  reporterId: z.string().uuid().optional(),
  title: z.string().min(3).max(150),
  description: z.string().max(2000).optional(),
  urgency: z.enum(urgencies),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180)
});

export const createHelpRequestSchema = z.object({
  reporterId: z.string().uuid().optional(),
  title: z.string().min(3).max(150),
  description: z.string().max(2000).optional(),
  urgency: z.enum(urgencies),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  needs: z
    .array(
      z.object({
        needType: z.enum(needTypes),
        quantity: z.number().int().positive().default(1)
      })
    )
    .min(1)
});

export const updateHelpRequestStatusSchema = z.object({
  status: z.enum(helpRequestStatuses)
});

export const nearbyQuerySchema = z.object({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  radiusKm: z.coerce.number().positive().max(500).default(20)
});

export const createResourceOfferSchema = z.object({
  donorId: z.string().uuid().optional(),
  resourceType: z.enum(resourceTypes),
  quantity: z.number().int().positive(),
  availableNow: z.boolean().default(true),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180)
});

export const createVolunteerSchema = z.object({
  userId: z.string().uuid().optional(),
  displayName: z.string().min(2).max(120),
  skills: z.array(z.enum(volunteerSkills)).default([]),
  resources: z.array(z.enum(volunteerResources)).default([]),
  maximumDistanceKm: z.number().positive().max(500).default(20),
  availableNow: z.boolean().default(true),
  verified: z.boolean().default(false),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180)
});

export const updateVolunteerAvailabilitySchema = z.object({
  availableNow: z.boolean()
});

export const createMissionSchema = z.object({
  helpRequestId: z.string().uuid(),
  assignments: z
    .array(
      z.object({
        assigneeType: z.enum(["VOLUNTEER", "DONOR", "ORGANIZATION"]),
        assigneeId: z.string().uuid(),
        needType: z.enum(needTypes).optional(),
        status: z.enum(assignmentStatuses).default("PROPOSED")
      })
    )
    .min(1)
});

export const updateMissionStatusSchema = z.object({
  status: z.enum(missionStatuses)
});

export const federationHandshakeSchema = z.object({
  nodeId: z.string().uuid(),
  name: z.string().min(2).max(120),
  baseUrl: z.string().url()
});

export const federationEventsQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(500).default(100),
  after: z.string().datetime().optional()
});

export const federationEventSchema = z.object({
  eventId: z.string().uuid(),
  eventType: z.enum(domainEventTypes),
  aggregateType: z.string().min(2),
  aggregateId: z.string().uuid(),
  originNodeId: z.string().uuid(),
  occurredAt: z.string().datetime(),
  schemaVersion: z.number().int().positive(),
  payload: z.unknown()
});

export const federationEventIngestionResponseSchema = z.object({
  received: z.boolean(),
  eventId: z.string().uuid(),
  duplicate: z.boolean().default(false)
});

export type CreateIncidentInput = z.infer<typeof createIncidentSchema>;
export type CreateHelpRequestInput = z.infer<typeof createHelpRequestSchema>;
export type UpdateHelpRequestStatusInput = z.infer<
  typeof updateHelpRequestStatusSchema
>;
export type NearbyQuery = z.infer<typeof nearbyQuerySchema>;
export type CreateResourceOfferInput = z.infer<typeof createResourceOfferSchema>;
export type CreateVolunteerInput = z.infer<typeof createVolunteerSchema>;
export type UpdateVolunteerAvailabilityInput = z.infer<
  typeof updateVolunteerAvailabilitySchema
>;
export type CreateMissionInput = z.infer<typeof createMissionSchema>;
export type UpdateMissionStatusInput = z.infer<typeof updateMissionStatusSchema>;
export type FederationHandshakeInput = z.infer<typeof federationHandshakeSchema>;
export type FederationEventsQuery = z.infer<typeof federationEventsQuerySchema>;
export type FederationEventInput = z.infer<typeof federationEventSchema>;
export type FederationEventIngestionResponse = z.infer<
  typeof federationEventIngestionResponseSchema
>;
