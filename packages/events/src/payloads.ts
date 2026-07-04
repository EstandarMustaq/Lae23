import type {
  AssignmentStatus,
  NeedType,
  ResourceType,
  HelpRequestStatus,
  MissionStatus,
  Urgency,
  VolunteerResource,
  VolunteerSkill
} from "@ponte-segura/domain";
import type { DomainEventType } from "./event-types.js";

export type HelpRequestNeedPayload = {
  needType: NeedType;
  quantity: number;
};

export type IncidentReportedPayload = {
  reporterId?: string;
  title: string;
  description?: string;
  urgency: Urgency;
  latitude: number;
  longitude: number;
};

export type HelpRequestCreatedPayload = {
  reporterId?: string;
  title: string;
  description?: string;
  urgency: Urgency;
  latitude: number;
  longitude: number;
  needs: HelpRequestNeedPayload[];
};

export type HelpRequestUpdatedPayload = {
  status?: HelpRequestStatus;
};

export type HelpRequestNeedAddedPayload = HelpRequestNeedPayload & {
  helpRequestId: string;
};

export type ResourceOfferedPayload = {
  donorId?: string;
  resourceType: ResourceType;
  quantity: number;
  availableNow: boolean;
  latitude: number;
  longitude: number;
};

export type VolunteerRegisteredPayload = {
  userId?: string;
  displayName: string;
  skills: VolunteerSkill[];
  resources: VolunteerResource[];
  maximumDistanceKm: number;
  availableNow: boolean;
  verified: boolean;
  latitude: number;
  longitude: number;
};

export type VolunteerAvailabilityUpdatedPayload = {
  availableNow: boolean;
};

export type MatchSearchStartedPayload = {
  candidateCount: number;
};

export type MissionAssignmentCreatedPayload = {
  assigneeType: "VOLUNTEER" | "DONOR" | "ORGANIZATION";
  assigneeId: string;
  needType?: NeedType;
  status: AssignmentStatus;
};

export type MissionCreatedPayload = {
  helpRequestId: string;
  assignments: MissionAssignmentCreatedPayload[];
};

export type MissionStatusChangedPayload = {
  status: MissionStatus;
};

export type OutboxEventPublishedPayload = {
  eventId: string;
};

export type NodeHandshakeCompletedPayload = {
  peerNodeId: string;
  peerName: string;
  peerBaseUrl: string;
};

export type DomainEventPayloadMap = {
  INCIDENT_REPORTED: IncidentReportedPayload;
  HELP_REQUEST_CREATED: HelpRequestCreatedPayload;
  HELP_REQUEST_UPDATED: HelpRequestUpdatedPayload;
  HELP_REQUEST_NEED_ADDED: HelpRequestNeedAddedPayload;
  RESOURCE_OFFERED: ResourceOfferedPayload;
  VOLUNTEER_REGISTERED: VolunteerRegisteredPayload;
  VOLUNTEER_AVAILABILITY_UPDATED: VolunteerAvailabilityUpdatedPayload;
  MATCH_SEARCH_STARTED: MatchSearchStartedPayload;
  MISSION_CREATED: MissionCreatedPayload;
  MISSION_ASSIGNMENT_CREATED: MissionAssignmentCreatedPayload;
  MISSION_STATUS_CHANGED: MissionStatusChangedPayload;
  OUTBOX_EVENT_PUBLISHED: OutboxEventPublishedPayload;
  NODE_HANDSHAKE_COMPLETED: NodeHandshakeCompletedPayload;
};

export type DomainEventPayload<TEventType extends DomainEventType> =
  DomainEventPayloadMap[TEventType];
