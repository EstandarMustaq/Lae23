import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import {
  type CreateMissionInput,
  type UpdateMissionStatusInput
} from "@ponte-segura/contracts";
import {
  missionAssignments,
  missions,
  type Database
} from "@ponte-segura/database";
import { createId } from "@ponte-segura/shared";
import { eq } from "drizzle-orm";
import { APP_CONFIG, type AppConfig } from "../config.js";
import { DATABASE } from "../database.provider.js";
import { OutboxService } from "../outbox.service.js";

@Injectable()
export class MissionsService {
  constructor(
    @Inject(DATABASE) private readonly database: Database,
    @Inject(APP_CONFIG) private readonly config: AppConfig,
    private readonly outbox: OutboxService
  ) {}

  async get(id: string) {
    const [mission] = await this.database.db
      .select()
      .from(missions)
      .where(eq(missions.id, id))
      .limit(1);

    if (!mission) {
      throw new NotFoundException("Mission not found");
    }

    const assignments = await this.database.db
      .select()
      .from(missionAssignments)
      .where(eq(missionAssignments.missionId, id));

    return { ...mission, assignments };
  }

  async create(input: CreateMissionInput) {
    const id = createId();

    await this.database.db.transaction(async (tx) => {
      await tx.insert(missions).values({
        id,
        originNodeId: this.config.nodeId,
        helpRequestId: input.helpRequestId,
        status: "DRAFT"
      });

      for (const assignment of input.assignments) {
        await tx.insert(missionAssignments).values({
          id: createId(),
          missionId: id,
          assigneeType: assignment.assigneeType,
          assigneeId: assignment.assigneeId,
          needType: assignment.needType,
          status: assignment.status
        });
      }

      await this.outbox.append(
        tx,
        this.outbox.createEnvelope({
          eventType: "MISSION_CREATED",
          aggregateType: "mission",
          aggregateId: id,
          originNodeId: this.config.nodeId,
          payload: input
        })
      );
    });

    return { id };
  }

  async updateStatus(id: string, input: UpdateMissionStatusInput) {
    await this.database.db.transaction(async (tx) => {
      const [updated] = await tx
        .update(missions)
        .set({ status: input.status, updatedAt: new Date() })
        .where(eq(missions.id, id))
        .returning({ id: missions.id });

      if (!updated) {
        throw new NotFoundException("Mission not found");
      }

      await this.outbox.append(
        tx,
        this.outbox.createEnvelope({
          eventType: "MISSION_STATUS_CHANGED",
          aggregateType: "mission",
          aggregateId: id,
          originNodeId: this.config.nodeId,
          payload: input
        })
      );
    });

    return { id, status: input.status };
  }
}
