
import * as fs from "fs";
import * as path from "path";
import {
  POLYMARKET_PRIVATE_KEY,
  POLYMARKET_PROXY,
  POLYMARKET_CLOB_URL,
  POLYMARKET_CHAIN_ID,
  POLYMARKET_TICK_SIZE,
  POLYMARKET_NEG_RISK,
  POLYMARKET_CREDENTIAL_PATH,
  POLYMARKET_SIGNATURE_TYPE,
  POLYMARKET_MIN_USD,
  ARB_DRY_RUN,
} from "../lib/config";
import { appendMonitorLogWithTimestamp } from "../lib/monitor-logger";

export type PlacePolyResult = { orderId: string } | { error: string } | null;

export interface PlacePolymarketOrderOptions {
  tickSize?: "0.01" | "0.001" | "0.0001";
  negRisk?: boolean;
  forcePlace?: boolean;
}

let cachedClient: Awaited<ReturnType<typeof buildClobClient>> | null = null;
let cachedClientKey: string = "";

async function buildClobClient(): Promise<
  import("@polymarket/clob-client").ClobClient
> {
  const { Wallet } = await import("ethers");
  const { ClobClient } = await import("@polymarket/clob-client");
  const host = POLYMARKET_CLOB_URL;
  const chainId = POLYMARKET_CHAIN_ID;
  const signer = new Wallet(
    POLYMARKET_PRIVATE_KEY.startsWith("0x")
      ? POLYMARKET_PRIVATE_KEY
      : `0x${POLYMARKET_PRIVATE_KEY}`
  );

  let creds: import("@polymarket/clob-client").ApiKeyCreds;
  if (POLYMARKET_CREDENTIAL_PATH && fs.existsSync(POLYMARKET_CREDENTIAL_PATH)) {
    const raw = fs.readFileSync(
      path.resolve(process.cwd(), POLYMARKET_CREDENTIAL_PATH),
      "utf8"
    );
    const parsed = JSON.parse(raw) as { key: string; secret: string; passphrase: string };
    const secretBase64 = (parsed.secret ?? "")
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    creds = {
      key: parsed.key,
      secret: secretBase64,
      passphrase: parsed.passphrase ?? "",
    };
  } else {
    const tempClient = new ClobClient(host, chainId, signer);
    creds = await tempClient.createOrDeriveApiKey();
  }

  return new ClobClient(host, chainId, signer, creds, POLYMARKET_SIGNATURE_TYPE, POLYMARKET_PROXY);
}

function getClientKey(): string {
  return `${POLYMARKET_CLOB_URL}|${POLYMARKET_CHAIN_ID}|${POLYMARKET_CREDENTIAL_PATH || "derive"}|${POLYMARKET_SIGNATURE_TYPE}`;
}

function roundPriceToTickSize(price: number, tickSize: string): number {
  const decimals =
    tickSize === "0.01"
      ? 2
      : tickSize === "0.001"
        ? 3
        : tickSize === "0.0001"
          ? 4
          : 4;
  const mult = 10 ** decimals;
  return Math.round(price * mult) / mult;
}

async function getClobClient(): Promise<
  import("@polymarket/clob-client").ClobClient
> {
  const key = getClientKey();
  if (cachedClient && cachedClientKey === key) return cachedClient;
  cachedClient = await buildClobClient();
  cachedClientKey = key;
  return cachedClient;
}

export function clearPolymarketClientCache(): void {
  cachedClient = null;
  cachedClientKey = "";
}

export async function placePolymarketOrder(
  tokenId: string,
  price: number,
  size: number,
  options?: PlacePolymarketOrderOptions
): Promise<PlacePolyResult> {
  if (!POLYMARKET_PRIVATE_KEY || !POLYMARKET_PROXY) {
    const msg = `[Polymarket] Not configured (missing POLYMARKET_PRIVATE_KEY or POLYMARKET_PROXY). Would buy token ${tokenId.slice(0, 8)}... @ ${price.toFixed(3)} x${size}`;
    console.log(msg);
    appendMonitorLogWithTimestamp(msg);
    return null;
  }
  if (ARB_DRY_RUN && !options?.forcePlace) {
    return null;
  }
  const minUsd = POLYMARKET_MIN_USD > 0 ? POLYMARKET_MIN_USD : 1;
  if (price * size < minUsd) {
    const msg = `Polymarket order notional $${(price * size).toFixed(2)} below min $${minUsd}. Use size >= ${Math.ceil(minUsd / price)} (or set POLYMARKET_MIN_USD).`;
    console.error(msg);
    appendMonitorLogWithTimestamp(msg);
    return { error: msg };
  }
  try {
    const { Side, OrderType } = await import("@polymarket/clob-client");
    const clobClient = await getClobClient();
    const tickSize = options?.tickSize ?? POLYMARKET_TICK_SIZE;
    const negRisk = options?.negRisk ?? POLYMARKET_NEG_RISK;

    const roundedPrice = roundPriceToTickSize(price, tickSize);
    const resp = await clobClient.createAndPostOrder(
      {
        tokenID: tokenId,
        price: roundedPrice,
        side: Side.BUY,
        size,
      },
      { tickSize, negRisk },
      OrderType.GTC
    );
    const data = resp as { orderID?: string; orderId?: string; error?: string };
    const orderId = data.orderID ?? data.orderId;
    if (data.error || !orderId) {
      const errMsg = data.error ?? "No order ID in response";
      console.error("Polymarket order failed:", errMsg);
      appendMonitorLogWithTimestamp(`Polymarket order failed: ${errMsg}`);
      return { error: errMsg };
    }
    const msg = `Polymarket order placed: ${orderId} token=${tokenId.slice(0, 12)}... price=${roundedPrice} size=${size}`;
    console.log(msg);
    appendMonitorLogWithTimestamp(msg);
    return { orderId: String(orderId) };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    const resp = (err as { response?: { data?: unknown } })?.response?.data;
    const detail = resp != null ? ` ${JSON.stringify(resp)}` : "";
    console.error("Polymarket order failed:", msg + detail);
    appendMonitorLogWithTimestamp(`Polymarket order failed: ${msg}${detail}`);
    return { error: detail ? `${msg}${detail}` : msg };
  }
}
