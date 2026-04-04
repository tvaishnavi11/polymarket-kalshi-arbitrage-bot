

function getEnv(name: string): string {
  return (process.env[name] ?? "").trim();
}


export function validateRequiredEnv(): void {
  const missing: string[] = [];

  const apiKey = getEnv("KALSHI_API_KEY");
  if (!apiKey) missing.push("KALSHI_API_KEY");

  const keyPath = getEnv("KALSHI_PRIVATE_KEY_PATH");
  const keyPem = getEnv("KALSHI_PRIVATE_KEY_PEM");
  if (!keyPath && !keyPem) {
    missing.push("KALSHI_PRIVATE_KEY_PATH or KALSHI_PRIVATE_KEY_PEM");
  }

  const polyKey = getEnv("POLYMARKET_PRIVATE_KEY");
  const polyProxy = getEnv("POLYMARKET_PROXY");
  if (polyKey && !polyProxy) {
    missing.push("POLYMARKET_PROXY (required when POLYMARKET_PRIVATE_KEY is set)");
  }

  if (missing.length === 0) return;

  const message =
    "Missing required environment variable(s):\n  - " +
    missing.join("\n  - ") +
    "\n\nSet them in .env (see .env.sample) and try again.";
  throw new Error(message);
}


export function validateRequiredEnvOrExit(): void {
  try {
    validateRequiredEnv();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("\n[Config] " + msg + "\n");
    process.exit(1);
  }
}
