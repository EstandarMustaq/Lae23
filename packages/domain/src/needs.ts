export const needTypes = [
  "DRINKING_WATER",
  "FOOD",
  "MEDICINE",
  "SHELTER",
  "EVACUATION",
  "TRANSPORT",
  "FIRST_AID",
  "FUEL",
  "BLANKETS"
] as const;

export type NeedType = (typeof needTypes)[number];

export const resourceTypes = needTypes;

export type ResourceType = NeedType;

export const volunteerSkills = [
  "DRIVER",
  "FIRST_AID",
  "BOAT_OPERATOR",
  "MEDICAL",
  "LOGISTICS",
  "COMMUNITY_COORDINATION"
] as const;

export type VolunteerSkill = (typeof volunteerSkills)[number];

export const volunteerResources = [
  "VEHICLE",
  "BOAT",
  "MOTORCYCLE",
  "RADIO",
  "MEDICAL_KIT"
] as const;

export type VolunteerResource = (typeof volunteerResources)[number];
