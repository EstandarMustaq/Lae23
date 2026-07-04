import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import {
  createHelpRequestSchema,
  nearbyQuerySchema,
  updateHelpRequestStatusSchema,
  type CreateHelpRequestInput,
  type NearbyQuery,
  type UpdateHelpRequestStatusInput
} from "@ponte-segura/contracts";
import { ZodValidationPipe } from "../zod-validation.pipe.js";
import { HelpRequestsService } from "./help-requests.service.js";

@Controller("help-requests")
export class HelpRequestsController {
  constructor(private readonly helpRequests: HelpRequestsService) {}

  @Get()
  list() {
    return this.helpRequests.list();
  }

  @Get("nearby")
  nearby(@Query(new ZodValidationPipe(nearbyQuerySchema)) query: NearbyQuery) {
    return this.helpRequests.nearby(query);
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.helpRequests.get(id);
  }

  @Post()
  create(
    @Body(new ZodValidationPipe(createHelpRequestSchema))
    body: CreateHelpRequestInput
  ) {
    return this.helpRequests.create(body);
  }

  @Patch(":id/status")
  updateStatus(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(updateHelpRequestStatusSchema))
    body: UpdateHelpRequestStatusInput
  ) {
    return this.helpRequests.updateStatus(id, body);
  }
}
