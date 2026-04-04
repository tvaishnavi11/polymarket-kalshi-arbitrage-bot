

const GAMMA_API_BASE = "https://gamma-api.polymarket.com";
const CLOB_API_BASE = "https://clob.polymarket.com";

function slugForCurrent15m(market: string): string {
  const d = new Date();
  d.setSeconds(0, 0);
  d.setMilliseconds(0);
  const m = d.getMinutes();
  const slotMin = Math.floor(m / 15) * 15;
  d.setMinutes(slotMin, 0, 0);
  const timestamp = Math.floor(d.getTime() / 1000);
  return `${market}-updown-15m-${timestamp}`;
}

function parseJsonArray<T>(raw: unknown): T[] {
  if (Array.isArray(raw)) return raw as T[];
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw) as unknown;
      return Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch {
      return [];
    }
  }
  return [];
}

async function fetchTokenIdsForSlug(
  slug: string
): Promise<{ upTokenId: string; downTokenId: string; conditionId: string }> {
  const url = `${GAMMA_API_BASE}/markets/slug/${slug}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Gamma API ${res.status} ${res.statusText} for slug=${slug}`);
  }
  const data = (await res.json()) as {
    outcomes?: unknown;
    clobTokenIds?: unknown;
    conditionId?: string;
  };
  const outcomes = parseJsonArray<string>(data.outcomes);
  const tokenIds = parseJsonArray<string>(data.clobTokenIds);
  const conditionId = typeof data.conditionId === "string" ? data.conditionId : "";
  const upIdx = outcomes.indexOf("Up");
  const downIdx = outcomes.indexOf("Down");
  if (upIdx < 0 || downIdx < 0) {
    throw new Error(`Missing Up/Down outcomes for slug=${slug} (outcomes: ${JSON.stringify(outcomes)})`);
  }
  if (!tokenIds[upIdx] || !tokenIds[downIdx]) {
    throw new Error(`Missing token ids for slug=${slug}`);
  }
  return {
    upTokenId: tokenIds[upIdx],
    downTokenId: tokenIds[downIdx],
    conditionId,
  };
}

let tokenIdsCache: { slug: string; upTokenId: string; downTokenId: string } | null = null;

export async function getTokenIdsForSlugCached(
  slug: string
): Promise<{ upTokenId: string; downTokenId: string }> {
  const c = tokenIdsCache;
  if (c && c.slug === slug) return { upTokenId: c.upTokenId, downTokenId: c.downTokenId };
  const fresh = await fetchTokenIdsForSlug(slug);
  tokenIdsCache = { slug, upTokenId: fresh.upTokenId, downTokenId: fresh.downTokenId };
  return { upTokenId: fresh.upTokenId, downTokenId: fresh.downTokenId };
}

async function getBestAskForToken(tokenId: string): Promise<number | null> {
  const url = `${CLOB_API_BASE}/book?token_id=${encodeURIComponent(tokenId)}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = (await res.json()) as { asks?: Array<{ price: string; size: string }> };
  const asks = data.asks;
  if (!Array.isArray(asks) || asks.length === 0) return null;
  let best = Infinity;
  for (const level of asks) {
    const p = parseFloat(level.price);
    if (Number.isFinite(p) && p < best) best = p;
  }
  return best === Infinity ? null : best;
}

export interface PolymarketPrices {
  slug: string;
  upAsk: number;
  downAsk: number;
  fetchedAt: Date;
}


export async function getPolymarketAskPrices(market: string = "btc"): Promise<PolymarketPrices | null> {
  const slug = slugForCurrent15m(market);
  try {
    const { upTokenId, downTokenId } = await getTokenIdsForSlugCached(slug);
    const [upAsk, downAsk] = await Promise.all([
      getBestAskForToken(upTokenId),
      getBestAskForToken(downTokenId),
    ]);
    if (upAsk == null || downAsk == null) return null;
    return {
      slug,
      upAsk,
      downAsk,
      fetchedAt: new Date(),
    };
  } catch {
    return null;
  }
}
