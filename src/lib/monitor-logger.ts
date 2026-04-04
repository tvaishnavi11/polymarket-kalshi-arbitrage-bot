
import * as fs from "fs";
import * as path from "path";

const LOGS_DIR = "logs";

function timeBucket15m(d: Date): string {
  const y = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = Math.floor(d.getMinutes() / 15) * 15;
  const minStr = String(min).padStart(2, "0");
  return `${y}-${month}-${day}_${h}-${minStr}`;
}

function ensureLogsDir(): void {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

export function appendMonitorLog(line: string, at: Date): void {
  ensureLogsDir();
  const bucket = timeBucket15m(at);
  const filename = `monitor_${bucket}.log`;
  const filepath = path.join(LOGS_DIR, filename);
  fs.appendFile(filepath, line + "\n", "utf8", (err) => {
    if (err) console.error("Monitor log append error:", err);
  });
}

export function appendMonitorLogWithTimestamp(message: string): void {
  const at = new Date();
  appendMonitorLog(`[${at.toISOString()}] ${message}`, at);
}
