
import * as fs from "fs";
import * as path from "path";

const LOGS_DIR = "logs";
const LOCK_FILE = path.join(LOGS_DIR, "monitor.lock");

function isPidRunning(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}


function killExistingAndRemoveLock(): void {
  let existing: string;
  try {
    existing = fs.readFileSync(LOCK_FILE, "utf8").trim();
  } catch {
    return;
  }
  const existingPid = parseInt(existing, 10);
  if (!Number.isFinite(existingPid)) return;
  if (existingPid === process.pid) {
    try {
      fs.unlinkSync(LOCK_FILE);
    } catch {
      // ignore
    }
    return;
  }
  if (isPidRunning(existingPid)) {
    try {
      process.kill(existingPid, "SIGTERM");
    } catch {
      // ignore
    }
  }
  try {
    fs.unlinkSync(LOCK_FILE);
  } catch {
  }
}

export function acquireMonitorLock(): void {
  try {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
  } catch {
  }
  killExistingAndRemoveLock();
  const pid = process.pid;
  const content = String(pid);

  try {
    fs.writeFileSync(LOCK_FILE, content, { flag: "wx" });
    return;
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException)?.code !== "EEXIST") throw err;
  }

  let existing: string;
  try {
    existing = fs.readFileSync(LOCK_FILE, "utf8").trim();
  } catch {
    existing = "";
  }
  const existingPid = parseInt(existing, 10);
  if (Number.isFinite(existingPid) && isPidRunning(existingPid)) {
    console.error(
      `Another monitor is already running (PID ${existingPid}). Only one instance is allowed. Exiting.`
    );
    process.exit(1);
  }

  try {
    fs.writeFileSync(LOCK_FILE, content);
  } catch (e) {
    console.error("Monitor lock file error:", e);
    process.exit(1);
  }
}

export function releaseMonitorLock(): void {
  try {
    fs.unlinkSync(LOCK_FILE);
  } catch {
  }
}
