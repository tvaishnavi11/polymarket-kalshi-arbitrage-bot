
import {
  startDualPriceMonitor,
  formatDualPricesLine,
} from "./monitor";
import logger from "terminal-prettier";
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

  logger.info(
    `Starting dual price monitor ( Polymarket  && Kalshi, poll every ${intervalMs}ms${ticker ? ` ticker=${ticker}` : ", first open BTC up/down market"}${restartOnQuarterHour && !ticker ? ", restart process at :00/:15/:30/:45" : ""})...`
  );
  
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
