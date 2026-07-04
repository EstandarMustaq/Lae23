import { Inject, Injectable } from "@nestjs/common";
import type { CreateIncidentInput } from "@ponte-segura/contracts";
import { incidents, type Database } from "@ponte-segura/database";
import { createId } from "@ponte-segura/shared";
import { APP_CONFIG, type AppConfig } from "../config.js";
import { DATABASE } from "../database.provider.js";
import { OutboxService } from "../outbox.service.js";

@Injectable()
export class IncidentsService {
  constructor(
    @Inject(DATABASE) private readonly database: Database,
    @Inject(APP_CONFIG) private readonly config: AppConfig,
    private readonly outbox: OutboxService
  ) {}

  list() {
    return this.database.db.select().from(incidents);
  }

  async create(input: CreateIncidentInput) {
    const id = createId();

    await this.database.db.transaction(async (tx) => {
      await tx.insert(incidents).values({
        id,
        originNodeId: this.config.nodeId,
        reporterId: input.reporterId,
        title: input.title,
        description: input.description,
        urgency: input.urgency,
        latitude: input.latitude.toString(),
        longitude: input.longitude.toString()
      });

      await this.outbox.append(
        tx,
        this.outbox.createEnvelope({
          eventType: "INCIDENT_REPORTED",
          aggregateType: "incident",
          aggregateId: id,
          originNodeId: this.config.nodeId,
          payload: input
        })
      );
    });

    return { id };
  }
}
