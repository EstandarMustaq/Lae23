import { optionalEnv, requireEnv } from "@ponte-segura/shared";

export type AppConfig = {
  port: number;
  databaseUrl: string;
  nodeId: string;
  nodeName: string;
};

export function loadConfig(): AppConfig {
  return {
    port: Number(optionalEnv("PORT", "3000")),
    databaseUrl: requireEnv("DATABASE_URL"),
    nodeId: requireEnv("NODE_ID"),
    nodeName: optionalEnv("NODE_NAME", "node-local")
  };
}

export const APP_CONFIG = Symbol("APP_CONFIG");
