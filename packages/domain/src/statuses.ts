export const helpRequestStatuses = [
  "OPEN",
  "TRIAGED",
  "MATCHING",
  "MISSION_CREATED",
  "IN_PROGRESS",
  "RESOLVED",
  "CANCELLED"
] as const;

export type HelpRequestStatus = (typeof helpRequestStatuses)[number];

export const urgencies = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;

export type Urgency = (typeof urgencies)[number];

export const missionStatuses = [
  "DRAFT",
  "ASSIGNED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED"
] as const;

export type MissionStatus = (typeof missionStatuses)[number];

export const assignmentStatuses = [
  "PROPOSED",
  "ACCEPTED",
  "DECLINED",
  "COMPLETED"
] as const;

export type AssignmentStatus = (typeof assignmentStatuses)[number];

export const userRoles = [
  "PUBLIC",
  "COMMUNITY_VERIFIED",
  "VOLUNTEER_VERIFIED",
  "ORGANIZATION_VERIFIED",
  "EMERGENCY_OPERATOR",
  "ADMIN"
] as const;

export type UserRole = (typeof userRoles)[number];
