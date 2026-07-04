import { Module } from "@nestjs/common";
import { APP_CONFIG, loadConfig } from "./config.js";
import { databaseProvider } from "./database.provider.js";
import { FederationController } from "./federation/federation.controller.js";
import { FederationService } from "./federation/federation.service.js";
import { RemoteEventApplierService } from "./federation/remote-event-applier.service.js";
import { HealthController } from "./health.controller.js";
import { HelpRequestsController } from "./help-requests/help-requests.controller.js";
import { HelpRequestsService } from "./help-requests/help-requests.service.js";
import { IncidentsController } from "./incidents/incidents.controller.js";
import { IncidentsService } from "./incidents/incidents.service.js";
import { MatchingController } from "./matching/matching.controller.js";
import { MatchingService } from "./matching/matching.service.js";
import { MissionsController } from "./missions/missions.controller.js";
import { MissionsService } from "./missions/missions.service.js";
import { OutboxService } from "./outbox.service.js";
import { ResourceOffersController } from "./resources/resource-offers.controller.js";
import { ResourceOffersService } from "./resources/resource-offers.service.js";
import { VolunteersController } from "./volunteers/volunteers.controller.js";
import { VolunteersService } from "./volunteers/volunteers.service.js";

@Module({
  controllers: [
    HealthController,
    IncidentsController,
    HelpRequestsController,
    ResourceOffersController,
    VolunteersController,
    MatchingController,
    MissionsController,
    FederationController
  ],
  providers: [
    {
      provide: APP_CONFIG,
      useFactory: loadConfig
    },
    databaseProvider,
    OutboxService,
    RemoteEventApplierService,
    IncidentsService,
    HelpRequestsService,
    ResourceOffersService,
    VolunteersService,
    MatchingService,
    MissionsService,
    FederationService
  ]
})
export class AppModule {}
