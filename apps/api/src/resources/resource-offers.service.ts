import { Inject, Injectable } from "@nestjs/common";
import {
  type CreateResourceOfferInput,
  type NearbyQuery
} from "@ponte-segura/contracts";
import { resourceOffers, type Database } from "@ponte-segura/database";
import { distanceKm } from "@ponte-segura/domain";
import { createId } from "@ponte-segura/shared";
import { APP_CONFIG, type AppConfig } from "../config.js";
import { DATABASE } from "../database.provider.js";
import { OutboxService } from "../outbox.service.js";
import { rowPoint } from "../rows.js";

@Injectable()
export class ResourceOffersService {
  constructor(
    @Inject(DATABASE) private readonly database: Database,
    @Inject(APP_CONFIG) private readonly config: AppConfig,
    private readonly outbox: OutboxService
  ) {}

  list() {
    return this.database.db.select().from(resourceOffers);
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

  async create(input: CreateResourceOfferInput) {
    const id = createId();

    await this.database.db.transaction(async (tx) => {
      await tx.insert(resourceOffers).values({
        id,
        originNodeId: this.config.nodeId,
        donorId: input.donorId,
        resourceType: input.resourceType,
        quantity: input.quantity,
        availableNow: input.availableNow,
        latitude: input.latitude.toString(),
        longitude: input.longitude.toString()
      });

      await this.outbox.append(
        tx,
        this.outbox.createEnvelope({
          eventType: "RESOURCE_OFFERED",
          aggregateType: "resource_offer",
          aggregateId: id,
          originNodeId: this.config.nodeId,
          payload: input
        })
      );
    });

    return { id };
  }
}
