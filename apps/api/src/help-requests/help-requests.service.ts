import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import {
  type CreateHelpRequestInput,
  type NearbyQuery,
  type UpdateHelpRequestStatusInput
} from "@ponte-segura/contracts";
import {
  helpRequestNeeds,
  helpRequests,
  type Database
} from "@ponte-segura/database";
import { distanceKm } from "@ponte-segura/domain";
import { createId } from "@ponte-segura/shared";
import { eq } from "drizzle-orm";
import { APP_CONFIG, type AppConfig } from "../config.js";
import { DATABASE } from "../database.provider.js";
import { OutboxService } from "../outbox.service.js";
import { rowPoint } from "../rows.js";

@Injectable()
export class HelpRequestsService {
  constructor(
    @Inject(DATABASE) private readonly database: Database,
    @Inject(APP_CONFIG) private readonly config: AppConfig,
    private readonly outbox: OutboxService
  ) {}

  list() {
    return this.database.db.select().from(helpRequests);
  }

  async nearby(query: NearbyQuery) {
    const rows = await this.list();

    return rows.filter((row) => {
      const distance = distanceKm(
        { latitude: query.latitude, longitude: query.longitude },
        rowPoint(row)
      );

      return distance <= query.radiusKm;
    });
  }

  async get(id: string) {
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

    return { ...request, needs };
  }

  async create(input: CreateHelpRequestInput) {
    const id = createId();

    await this.database.db.transaction(async (tx) => {
      await tx.insert(helpRequests).values({
        id,
        originNodeId: this.config.nodeId,
        reporterId: input.reporterId,
        title: input.title,
        description: input.description,
        urgency: input.urgency,
        status: "OPEN",
        latitude: input.latitude.toString(),
        longitude: input.longitude.toString()
      });

      for (const need of input.needs) {
        await tx.insert(helpRequestNeeds).values({
          id: createId(),
          helpRequestId: id,
          needType: need.needType,
          quantity: need.quantity,
          status: "OPEN"
        });
      }

      await this.outbox.append(
        tx,
        this.outbox.createEnvelope({
          eventType: "HELP_REQUEST_CREATED",
          aggregateType: "help_request",
          aggregateId: id,
          originNodeId: this.config.nodeId,
          payload: input
        })
      );
    });

    return { id };
  }

  async updateStatus(id: string, input: UpdateHelpRequestStatusInput) {
    await this.database.db.transaction(async (tx) => {
      const [updated] = await tx
        .update(helpRequests)
        .set({ status: input.status, updatedAt: new Date() })
        .where(eq(helpRequests.id, id))
        .returning({ id: helpRequests.id });

      if (!updated) {
        throw new NotFoundException("Help request not found");
      }

      await this.outbox.append(
        tx,
        this.outbox.createEnvelope({
          eventType: "HELP_REQUEST_UPDATED",
          aggregateType: "help_request",
          aggregateId: id,
          originNodeId: this.config.nodeId,
          payload: input
        })
      );
    });

    return { id, status: input.status };
  }
}
