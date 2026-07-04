import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import {
  createMissionSchema,
  updateMissionStatusSchema,
  type CreateMissionInput,
  type UpdateMissionStatusInput
} from "@ponte-segura/contracts";
import { ZodValidationPipe } from "../zod-validation.pipe.js";
import { MissionsService } from "./missions.service.js";

@Controller("missions")
export class MissionsController {
  constructor(private readonly missions: MissionsService) {}

  @Get(":id")
  get(@Param("id") id: string) {
    return this.missions.get(id);
  }

  @Post()
  create(
    @Body(new ZodValidationPipe(createMissionSchema))
    body: CreateMissionInput
  ) {
    return this.missions.create(body);
  }

  @Patch(":id/status")
  updateStatus(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(updateMissionStatusSchema))
    body: UpdateMissionStatusInput
  ) {
    return this.missions.updateStatus(id, body);
  }
}
