import { createDatabase } from "@ponte-segura/database";
import { optionalEnv, requireEnv } from "@ponte-segura/shared";
import { processFederationSync } from "./federation-sync.js";

const database = createDatabase(requireEnv("DATABASE_URL"));
const intervalMs = Number(optionalEnv("WORKER_INTERVAL_MS", "5000"));

async function loop() {
  try {
    const result = await processFederationSync(database);
    console.log(JSON.stringify({ message: "federation_sync_processed", ...result }));
  } catch (error) {
    console.error(
      JSON.stringify({
        message: "worker_iteration_failed",
        error: error instanceof Error ? error.message : String(error)
      })
    );
  }
}

setInterval(loop, intervalMs);
await loop();
