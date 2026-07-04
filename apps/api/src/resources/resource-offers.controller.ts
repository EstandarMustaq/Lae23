import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import {
  createResourceOfferSchema,
  nearbyQuerySchema,
  type CreateResourceOfferInput,
  type NearbyQuery
} from "@ponte-segura/contracts";
import { ZodValidationPipe } from "../zod-validation.pipe.js";
import { ResourceOffersService } from "./resource-offers.service.js";

@Controller("resource-offers")
export class ResourceOffersController {
  constructor(private readonly resourceOffers: ResourceOffersService) {}

  @Get()
  list() {
    return this.resourceOffers.list();
  }

  @Get("nearby")
  nearby(@Query(new ZodValidationPipe(nearbyQuerySchema)) query: NearbyQuery) {
    return this.resourceOffers.nearby(query);
  }

  @Post()
  create(
    @Body(new ZodValidationPipe(createResourceOfferSchema))
    body: CreateResourceOfferInput
  ) {
    return this.resourceOffers.create(body);
  }
}
