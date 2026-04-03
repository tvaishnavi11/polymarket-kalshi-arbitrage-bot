import "dotenv/config";

const BASE_PATHS = {
  prod: "https://api.elections.kalshi.com/trade-api/v2",
  demo: "https://demo-api.kalshi.co/trade-api/v2",
} as const;

const PEM_HEADER = "-----BEGIN RSA PRIVATE KEY-----";
const PEM_FOOTER = "-----END RSA PRIVATE KEY-----";


function normalizePrivateKeyPem(value: string): string {
  const trimmed = value.trim();
  let base64 = trimmed
    .replace(/-----BEGIN RSA PRIVATE KEY-----/g, "")
    .replace(/-----END RSA PRIVATE KEY-----/g, "")
    .replace(/\s+/g, "");
  if (!base64) return trimmed;
  const lines: string[] = [];
  for (let i = 0; i < base64.length; i += 64) {
    lines.push(base64.slice(i, i + 64));
  }
  return `${PEM_HEADER}\n${lines.join("\n")}\n${PEM_FOOTER}`;
}

function getPrivateKeyPem(): string {
  const raw = process.env.KALSHI_PRIVATE_KEY_PEM ?? "";
  if (!raw) return "";
  return normalizePrivateKeyPem(raw);
}

export const config = {
  apiKey: process.env.KALSHI_API_KEY ?? "",
  privateKeyPath: process.env.KALSHI_PRIVATE_KEY_PATH ?? "",
  /** PEM string for private key, normalized for SDK (optional if KALSHI_PRIVATE_KEY_PATH is set) */
  get privateKeyPem(): string {
    return getPrivateKeyPem();
  },
  /** Use demo environment when true */
  demo: process.env.KALSHI_DEMO === "true",
  basePath:
    process.env.KALSHI_BASE_PATH ??
    (process.env.KALSHI_DEMO === "true" ? BASE_PATHS.demo : BASE_PATHS.prod),
} as const;

/** Bot: Bitcoin up/down series (15-minute BTC price up or down) */
export const BTC_SERIES_TICKER = "KXBTC15M";

/** Bot: max number of open Bitcoin up/down markets to consider (default 15) */
export const BOT_MAX_MARKETS = parseInt(
  process.env.KALSHI_BOT_MAX_MARKETS ?? "1",
  10
);

/** Bot: side to buy — "yes" = up, "no" = down */
export const BOT_SIDE = (process.env.KALSHI_BOT_SIDE ?? "yes") as "yes" | "no";

/** Bot: limit price in cents (1–99). Use ask to take liquidity. */
export const BOT_PRICE_CENTS = parseInt(
  process.env.KALSHI_BOT_PRICE_CENTS ?? "50",
  10
);

/** Bot: contracts per order */
export const BOT_CONTRACTS = parseInt(
  process.env.KALSHI_BOT_CONTRACTS ?? "1",
  10
);

/** Bot: if set, only log and do not place orders */
export const BOT_DRY_RUN = process.env.KALSHI_BOT_DRY_RUN === "true";

/** Arb: sum of opposite sides below this triggers opportunity (default 0.92). Buy only when sum is in [ARB_SUM_LOW, ARB_SUM_THRESHOLD). */
export const ARB_SUM_THRESHOLD = parseFloat(
  process.env.ARB_SUM_THRESHOLD ?? "0.92"
);

/** Arb: lower limit for sum; only buy when sum >= this (default 0.75). Sums below are ignored (e.g. bad data). */
export const ARB_SUM_LOW = parseFloat(
  process.env.ARB_SUM_LOW ?? "0.75"
);

/** Arb: price buffer added to captured ask for limit order (default 0.01). */
export const ARB_PRICE_BUFFER = parseFloat(
  process.env.ARB_PRICE_BUFFER ?? "0.01"
);

/** Arb: same token amount on both platforms (Kalshi contracts = Polymarket shares). Default 1 = minimum that works on both. */
export const ARB_SIZE = parseFloat(
  process.env.ARB_SIZE ?? process.env.ARB_KALSHI_CONTRACTS ?? process.env.ARB_POLY_SIZE ?? "1"
);

export const ARB_KALSHI_MIN = 1;

export const ARB_POLY_MIN = 1;

export const POLYMARKET_MIN_USD = parseFloat(process.env.POLYMARKET_MIN_USD ?? "1");

export const ARB_DRY_RUN = process.env.ARB_DRY_RUN === "true";

export const POLYMARKET_PRIVATE_KEY = process.env.POLYMARKET_PRIVATE_KEY ?? "";

export const POLYMARKET_PROXY = process.env.POLYMARKET_PROXY ?? "";

export const POLYMARKET_CLOB_URL = process.env.POLYMARKET_CLOB_URL ?? process.env.CLOB_API_URL ?? "https://clob.polymarket.com";

export const POLYMARKET_CHAIN_ID = parseInt(process.env.POLYMARKET_CHAIN_ID ?? process.env.CHAIN_ID ?? "137", 10);

export const POLYMARKET_TICK_SIZE = (process.env.POLYMARKET_TICK_SIZE ?? process.env.COPYTRADE_TICK_SIZE ?? "0.01") as "0.01" | "0.001" | "0.0001";

export const POLYMARKET_NEG_RISK = process.env.POLYMARKET_NEG_RISK === "true" || process.env.COPYTRADE_NEG_RISK === "true";

export const POLYMARKET_CREDENTIAL_PATH = process.env.POLYMARKET_CREDENTIAL_PATH ?? "";

export const POLYMARKET_SIGNATURE_TYPE = (() => {
  const raw = process.env.POLYMARKET_SIGNATURE_TYPE ?? "";
  if (raw === "0" || raw === "1" || raw === "2") return parseInt(raw, 10);
  return POLYMARKET_PROXY ? 2 : 1;
})();
