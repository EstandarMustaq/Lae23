import { Controller, Get, Inject } from "@nestjs/common";
import { APP_CONFIG, type AppConfig } from "./config.js";

@Controller("health")
export class HealthController {
  constructor(@Inject(APP_CONFIG) private readonly config: AppConfig) {}

  @Get()
  check() {
    return {
      status: "ok",
      nodeId: this.config.nodeId,
      nodeName: this.config.nodeName
    };
  }
}
