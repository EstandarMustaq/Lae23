import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import {
  createVolunteerSchema,
  nearbyQuerySchema,
  updateVolunteerAvailabilitySchema,
  type CreateVolunteerInput,
  type NearbyQuery,
  type UpdateVolunteerAvailabilityInput
} from "@ponte-segura/contracts";
import { ZodValidationPipe } from "../zod-validation.pipe.js";
import { VolunteersService } from "./volunteers.service.js";

@Controller("volunteers")
export class VolunteersController {
  constructor(private readonly volunteers: VolunteersService) {}

  @Get()
  list() {
    return this.volunteers.list();
  }

  @Get("nearby")
  nearby(@Query(new ZodValidationPipe(nearbyQuerySchema)) query: NearbyQuery) {
    return this.volunteers.nearby(query);
  }

  @Post()
  create(
    @Body(new ZodValidationPipe(createVolunteerSchema))
    body: CreateVolunteerInput
  ) {
    return this.volunteers.create(body);
  }

  @Patch(":id/availability")
  updateAvailability(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(updateVolunteerAvailabilitySchema))
    body: UpdateVolunteerAvailabilityInput
  ) {
    return this.volunteers.updateAvailability(id, body);
  }
}
