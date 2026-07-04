import { describe, expect, it } from "vitest";
import { rankCandidates } from "./matching.js";

describe("rankCandidates", () => {
  it("orders compatible offers by score and distance", () => {
    const candidates = rankCandidates(
      {
        id: "req-1",
        urgency: "CRITICAL",
        needs: ["DRINKING_WATER", "MEDICINE"],
        location: { latitude: -24.5333, longitude: 32.9833 }
      },
      [
        {
          id: "far-water",
          type: "RESOURCE",
          resourceTypes: ["DRINKING_WATER"],
          location: { latitude: -24.7, longitude: 33.1 },
          availableNow: true,
          capacity: 100,
          verified: false
        },
        {
          id: "near-medicine",
          type: "RESOURCE",
          resourceTypes: ["MEDICINE"],
          location: { latitude: -24.54, longitude: 32.99 },
          availableNow: true,
          capacity: 10,
          verified: true
        },
        {
          id: "blankets",
          type: "RESOURCE",
          resourceTypes: ["BLANKETS"],
          location: { latitude: -24.54, longitude: 32.99 },
          availableNow: true,
          capacity: 10,
          verified: true
        }
      ]
    );

    expect(candidates).toHaveLength(2);
    expect(candidates[0]?.offerId).toBe("near-medicine");
    expect(candidates[0]?.matchedNeeds).toEqual(["MEDICINE"]);
  });
});
