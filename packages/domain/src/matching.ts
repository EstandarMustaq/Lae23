import type { GeoPoint } from "./location.js";
import { distanceKm } from "./location.js";
import type { NeedType, ResourceType } from "./needs.js";
import type { Urgency } from "./statuses.js";

export type MatchableHelpRequest = {
  id: string;
  urgency: Urgency;
  needs: NeedType[];
  location: GeoPoint;
};

export type MatchableOffer = {
  id: string;
  type: "RESOURCE" | "VOLUNTEER";
  resourceTypes: ResourceType[];
  location: GeoPoint;
  availableNow: boolean;
  capacity: number;
  verified: boolean;
};

export type MatchCandidate = {
  offerId: string;
  offerType: MatchableOffer["type"];
  score: number;
  distanceKm: number;
  matchedNeeds: NeedType[];
};

const urgencyScore: Record<Urgency, number> = {
  LOW: 10,
  MEDIUM: 30,
  HIGH: 60,
  CRITICAL: 100
};

export function scoreOffer(
  request: MatchableHelpRequest,
  offer: MatchableOffer
): MatchCandidate {
  const distance = distanceKm(request.location, offer.location);
  const matchedNeeds = request.needs.filter((need) =>
    offer.resourceTypes.includes(need)
  );

  const distanceScore = distance <= 5 ? 50 : distance <= 20 ? 25 : 0;
  const resourceScore = matchedNeeds.length > 0 ? 60 : 0;
  const availabilityScore = offer.availableNow ? 40 : 0;
  const capacityScore = offer.capacity > 0 ? 30 : 0;
  const trustScore = offer.verified ? 20 : 0;

  return {
    offerId: offer.id,
    offerType: offer.type,
    score:
      urgencyScore[request.urgency] +
      distanceScore +
      resourceScore +
      availabilityScore +
      capacityScore +
      trustScore,
    distanceKm: Number(distance.toFixed(2)),
    matchedNeeds
  };
}

export function rankCandidates(
  request: MatchableHelpRequest,
  offers: MatchableOffer[]
): MatchCandidate[] {
  return offers
    .map((offer) => scoreOffer(request, offer))
    .filter((candidate) => candidate.matchedNeeds.length > 0)
    .sort((a, b) => b.score - a.score || a.distanceKm - b.distanceKm);
}
