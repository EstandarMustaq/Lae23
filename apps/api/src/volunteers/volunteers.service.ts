import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import {
  type CreateVolunteerInput,
  type NearbyQuery,
  type UpdateVolunteerAvailabilityInput
} from "@ponte-segura/contracts";
import { volunteers, type Database } from "@ponte-segura/database";
import { distanceKm } from "@ponte-segura/domain";
import { createId } from "@ponte-segura/shared";
import { eq } from "drizzle-orm";
import { APP_CONFIG, type AppConfig } from "../config.js";
import { DATABASE } from "../database.provider.js";
import { OutboxService } from "../outbox.service.js";
import { rowPoint } from "../rows.js";

@Injectable()
export class VolunteersService {
  constructor(
    @Inject(DATABASE) private readonly database: Database,
    @Inject(APP_CONFIG) private readonly config: AppConfig,
    private readonly outbox: OutboxService
  ) {}

  list() {
    return this.database.db.select().from(volunteers);
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

  async create(input: CreateVolunteerInput) {
    const id = createId();

    await this.database.db.transaction(async (tx) => {
      await tx.insert(volunteers).values({
        id,
        originNodeId: this.config.nodeId,
        userId: input.userId,
        displayName: input.displayName,
        skills: input.skills,
        resources: input.resources,
        maximumDistanceKm: input.maximumDistanceKm,
        availableNow: input.availableNow,
        verified: input.verified,
        latitude: input.latitude.toString(),
        longitude: input.longitude.toString()
      });

      await this.outbox.append(
        tx,
        this.outbox.createEnvelope({
          eventType: "VOLUNTEER_REGISTERED",
          aggregateType: "volunteer",
          aggregateId: id,
          originNodeId: this.config.nodeId,
          payload: input
        })
      );
    });

    return { id };
  }

  async updateAvailability(
    id: string,
    input: UpdateVolunteerAvailabilityInput
  ) {
    await this.database.db.transaction(async (tx) => {
      const [updated] = await tx
        .update(volunteers)
        .set({ availableNow: input.availableNow, updatedAt: new Date() })
        .where(eq(volunteers.id, id))
        .returning({ id: volunteers.id });

      if (!updated) {
        throw new NotFoundException("Volunteer not found");
      }

      await this.outbox.append(
        tx,
        this.outbox.createEnvelope({
          eventType: "VOLUNTEER_AVAILABILITY_UPDATED",
          aggregateType: "volunteer",
          aggregateId: id,
          originNodeId: this.config.nodeId,
          payload: input
        })
      );
    });

    return { id, availableNow: input.availableNow };
  }
}
