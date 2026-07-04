import { createDatabase } from "@ponte-segura/database";
import type { Provider } from "@nestjs/common";
import { APP_CONFIG, type AppConfig } from "./config.js";

export const DATABASE = Symbol("DATABASE");

export const databaseProvider: Provider = {
  provide: DATABASE,
  inject: [APP_CONFIG],
  useFactory: (config: AppConfig) => createDatabase(config.databaseUrl)
};
