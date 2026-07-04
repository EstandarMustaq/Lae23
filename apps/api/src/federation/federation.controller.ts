import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { FederationService } from "./federation.service.js";

@Controller("federation")
export class FederationController {
  constructor(private readonly federation: FederationService) {}

  @Get("nodes")
  nodes() {
    return this.federation.listNodes();
  }

  @Post("handshake")
  handshake(@Body() body: unknown) {
    return this.federation.handshake(body);
  }

  @Get("events")
  events(@Query() query: unknown) {
    return this.federation.events(query);
  }

  @Get("deliveries")
  deliveries() {
    return this.federation.deliveries();
  }

  @Post("events")
  receiveEvent(@Body() body: unknown) {
    return this.federation.receiveEvent(body);
  }
}
