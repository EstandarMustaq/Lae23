import type { GeoPoint } from "./location.js";
import type { NeedType, ResourceType, VolunteerResource, VolunteerSkill } from "./needs.js";
import type {
  AssignmentStatus,
  HelpRequestStatus,
  MissionStatus,
  Urgency,
  UserRole
} from "./statuses.js";

export type User = {
  id: string;
  displayName: string;
  phone?: string;
  role: UserRole;
};

export type CommunityNode = {
  id: string;
  name: string;
  baseUrl?: string;
};

export type Incident = {
  id: string;
  originNodeId: string;
  reporterId?: string;
  title: string;
  description?: string;
  location: GeoPoint;
  urgency: Urgency;
};

export type HelpRequestNeed = {
  id: string;
  helpRequestId: string;
  needType: NeedType;
  quantity: number;
  status: HelpRequestStatus;
};

export type HelpRequest = {
  id: string;
  originNodeId: string;
  reporterId?: string;
  title: string;
  description?: string;
  urgency: Urgency;
  status: HelpRequestStatus;
  location: GeoPoint;
  needs: HelpRequestNeed[];
};

export type ResourceOffer = {
  id: string;
  originNodeId: string;
  donorId?: string;
  resourceType: ResourceType;
  quantity: number;
  availableNow: boolean;
  location: GeoPoint;
};

export type Volunteer = {
  id: string;
  originNodeId: string;
  userId?: string;
  displayName: string;
  skills: VolunteerSkill[];
  resources: VolunteerResource[];
  maximumDistanceKm: number;
  availableNow: boolean;
  verified: boolean;
  location: GeoPoint;
};

export type MissionAssignment = {
  id: string;
  missionId: string;
  assigneeType: "VOLUNTEER" | "DONOR" | "ORGANIZATION";
  assigneeId: string;
  needType?: NeedType;
  status: AssignmentStatus;
};

export type Mission = {
  id: string;
  originNodeId: string;
  helpRequestId: string;
  status: MissionStatus;
  assignments: MissionAssignment[];
};
