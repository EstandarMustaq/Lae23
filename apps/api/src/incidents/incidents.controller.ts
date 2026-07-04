import { Body, Controller, Get, Post } from "@nestjs/common";
import { createIncidentSchema, type CreateIncidentInput } from "@ponte-segura/contracts";
import { ZodValidationPipe } from "../zod-validation.pipe.js";
import { IncidentsService } from "./incidents.service.js";

@Controller("incidents")
export class IncidentsController {
  constructor(private readonly incidents: IncidentsService) {}

  @Get()
  list() {
    return this.incidents.list();
  }

  @Post()
  create(
    @Body(new ZodValidationPipe(createIncidentSchema))
    body: CreateIncidentInput
  ) {
    return this.incidents.create(body);
  }
}
