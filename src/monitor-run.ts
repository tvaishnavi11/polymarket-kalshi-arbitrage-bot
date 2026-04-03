
import {
  startDualPriceMonitor,
  formatDualPricesLine,
} from "./monitor";
import { checkArbAndPlaceOrders } from "./arb";
import { appendMonitorLog } from "./lib/monitor-logger";
import { acquireMonitorLock, releaseMonitorLock } from "./lib/monitor-lock";
import { validateRequiredEnvOrExit } from "./lib/validate-env";

async function main(): Promise<void> {
  validateRequiredEnvOrExit();
  acquireMonitorLock();

  const intervalMs = parseInt(
    process.env.KALSHI_MONITOR_INTERVAL_MS ?? "200",
    10
  );
  const ticker = process.env.KALSHI_MONITOR_TICKER; 
  const restartOnQuarterHour =
    process.env.KALSHI_MONITOR_NO_RESTART !== "true" && process.env.KALSHI_MONITOR_NO_RESTART !== "1";

 
  const stop = await startDualPriceMonitor({
    kalshiTicker: ticker || undefined,
    intervalMs,
    restartProcessOnQuarterHour: restartOnQuarterHour,
    onPrices: (p) => {
      const line = formatDualPricesLine(p);
      console.log(line);
      appendMonitorLog(line, p.fetchedAt);
      checkArbAndPlaceOrders(p).catch((err: unknown) => {
        console.error("Arb error:", err);
      });
    },
    onError: (err) => {
      console.error("Monitor error:", err);
    },
  });

  process.on("SIGINT", () => {
    console.log("\nStopping monitor...");
    stop();
    releaseMonitorLock();
    process.exit(0);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
