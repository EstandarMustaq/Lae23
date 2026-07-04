import { Controller, Get, Param, Post } from "@nestjs/common";
import { MatchingService } from "./matching.service.js";

@Controller("matching")
export class MatchingController {
  constructor(private readonly matching: MatchingService) {}

  @Get("help-requests/:id/candidates")
  candidates(@Param("id") id: string) {
    return this.matching.candidatesForHelpRequest(id);
  }

  @Post("help-requests/:id/run")
  run(@Param("id") id: string) {
    return this.matching.runForHelpRequest(id);
  }
}
