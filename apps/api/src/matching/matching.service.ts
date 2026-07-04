import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import {
  helpRequestNeeds,
  helpRequests,
  resourceOffers,
  volunteers,
  type Database
} from "@ponte-segura/database";
import {
  rankCandidates,
  type MatchableHelpRequest,
  type MatchableOffer,
  type NeedType,
  type ResourceType
} from "@ponte-segura/domain";
import { eq } from "drizzle-orm";
import { APP_CONFIG, type AppConfig } from "../config.js";
import { DATABASE } from "../database.provider.js";
import { OutboxService } from "../outbox.service.js";
import { rowPoint } from "../rows.js";

@Injectable()
export class MatchingService {
  constructor(
    @Inject(DATABASE) private readonly database: Database,
    @Inject(APP_CONFIG) private readonly config: AppConfig,
    private readonly outbox: OutboxService
  ) {}

  async candidatesForHelpRequest(id: string) {
    const request = await this.buildRequest(id);
    const offers = await this.buildOffers();

    return rankCandidates(request, offers);
  }

  async runForHelpRequest(id: string) {
    const candidates = await this.candidatesForHelpRequest(id);

    await this.database.db.transaction(async (tx) => {
      await this.outbox.append(
        tx,
        this.outbox.createEnvelope({
          eventType: "MATCH_SEARCH_STARTED",
          aggregateType: "help_request",
          aggregateId: id,
          originNodeId: this.config.nodeId,
          payload: { candidateCount: candidates.length }
        })
      );
    });

    return { helpRequestId: id, candidates };
  }

  private async buildRequest(id: string): Promise<MatchableHelpRequest> {
    const [request] = await this.database.db
      .select()
      .from(helpRequests)
      .where(eq(helpRequests.id, id))
      .limit(1);

    if (!request) {
      throw new NotFoundException("Help request not found");
    }

    const needs = await this.database.db
      .select()
      .from(helpRequestNeeds)
      .where(eq(helpRequestNeeds.helpRequestId, id));

    return {
      id: request.id,
      urgency: request.urgency as MatchableHelpRequest["urgency"],
      needs: needs.map((need) => need.needType as NeedType),
      location: rowPoint(request)
    };
  }

  private async buildOffers(): Promise<MatchableOffer[]> {
    const resourceRows = await this.database.db.select().from(resourceOffers);
    const volunteerRows = await this.database.db.select().from(volunteers);

    return [
      ...resourceRows.map((row) => ({
        id: row.id,
        type: "RESOURCE" as const,
        resourceTypes: [row.resourceType as ResourceType],
        location: rowPoint(row),
        availableNow: row.availableNow,
        capacity: row.quantity,
        verified: false
      })),
      ...volunteerRows.map((row) => ({
        id: row.id,
        type: "VOLUNTEER" as const,
        resourceTypes: volunteerNeedCoverage(row.skills, row.resources),
        location: rowPoint(row),
        availableNow: row.availableNow,
        capacity: row.maximumDistanceKm,
        verified: row.verified
      }))
    ];
  }
}

function volunteerNeedCoverage(skills: string[], resources: string[]): ResourceType[] {
  const coverage = new Set<ResourceType>();

  if (resources.includes("VEHICLE") || resources.includes("MOTORCYCLE")) {
    coverage.add("TRANSPORT");
    coverage.add("EVACUATION");
  }

  if (resources.includes("BOAT")) {
    coverage.add("TRANSPORT");
    coverage.add("EVACUATION");
  }

  if (
    resources.includes("MEDICAL_KIT") ||
    skills.includes("FIRST_AID") ||
    skills.includes("MEDICAL")
  ) {
    coverage.add("FIRST_AID");
    coverage.add("MEDICINE");
  }

  if (skills.includes("LOGISTICS") || skills.includes("COMMUNITY_COORDINATION")) {
    coverage.add("SHELTER");
    coverage.add("FOOD");
    coverage.add("DRINKING_WATER");
  }

  return [...coverage];
}
