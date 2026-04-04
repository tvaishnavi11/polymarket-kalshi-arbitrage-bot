<div align="center">

# Polymarket Kalshi Arbitrage Bot

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Kalshi](https://img.shields.io/badge/Kalshi-API-00C853?style=flat-square)](https://kalshi.com)
[![Polymarket](https://img.shields.io/badge/Polymarket-CLOB-6C3CE1?style=flat-square)](https://polymarket.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](./LICENSE)

### **Two venues. Same event. Different prices. Your bot captures the gap.**

*Bitcoin 15-minute up/down markets - monitored, cross-referenced, and arbitraged automatically.*

</div>

---

## The Opportunity Nobody Talks About

Most people in prediction markets are focused on one thing: being right.

Right about the election. Right about the Fed. Right about whether Bitcoin closes up or down in the next 15 minutes.

The problem with being right is that everyone else is trying to be right too. You're competing against sharper analysts, faster information, and better models. It's a hard game.

**Arbitrage is a different game entirely.**

You don't need to predict anything. You just need to find the same event priced differently on two venues - and lock in the gap before it closes.

Kalshi and Polymarket both list Bitcoin 15-minute up/down markets. They price them independently. Their liquidity pools don't talk to each other. And that means, consistently, there are moments where **the combined cost of both sides drops below $1.00** - which means you can buy YES on one venue and NO on the other, guaranteed to collect $1.00 at resolution, for less than you paid.

That's not speculation. That's math.

This bot finds those moments and acts on them in under 200 milliseconds.

---

## How the Arbitrage Actually Works

Every 15-minute Bitcoin market has two outcomes: UP and DOWN. One of them resolves to $1.00. The other resolves to $0.

If you hold **both sides** across both venues, one always pays out. The only question is whether you paid less than $1.00 total to acquire them.

```
Example:

Kalshi    → BTC UP   @ $0.44
Polymarket → BTC DOWN @ $0.47

Combined cost:  $0.91
Guaranteed payout at resolution: $1.00

Locked-in profit per unit: $0.09 (≈ 9.9% return in 15 minutes)
```

The bot monitors both venues in real time, calculates the combined ask every 200ms, and the moment that sum falls within your configured arbitrage window - it fires both legs simultaneously.

No prediction required. No market view required. Just execution speed.

---

## Watch It Work

```
[14:45:00]  New 15m window: BTC/USD 
[14:45:00] Kalshi    UP   best-ask: 0.51   DOWN best-ask: 0.50
[14:45:00] Polymarket UP  best-ask: 0.53   DOWN best-ask: 0.48
[14:45:00] Arb check: Kalshi UP + Poly DOWN = 0.99  - below threshold, monitoring

[14:46:12] Kalshi    UP   best-ask: 0.46
[14:46:12] Polymarket DOWN best-ask: 0.44
[14:46:12]  ARB SIGNAL 
           Combined: 0.90  |  Threshold: 0.92  |  Gap: 0.10
           Leg 1 → Kalshi   BUY UP   @ 0.46
           Leg 2 → Polymarket BUY DOWN @ 0.44
[14:46:12] Submitting both legs...
[14:46:12] Kalshi order:      FILLED ✓
[14:46:12] Polymarket order:  FILLED ✓
[14:46:12] Position locked. Guaranteed payout at 15:00:00.
[14:46:12] Writing to logs/monitor_2025-01-15_14-45.log ✓
```

Both legs filled. Both sides held. Resolution at the top of the hour.

---

## What Makes This Bot Different

Most arbitrage bots are either too simple (manual triggers) or too opaque (black box). This one is built to be **understood, audited, and tuned**.

| Feature | What it does for you |
|---|---|
| **200ms polling** | Catches arb windows that close in seconds - not the ones you see manually |
| **Dual-venue monitor** | Watches Kalshi REST + Polymarket CLOB simultaneously, never just one side |
| **Configurable arb window** | Set `ARB_SUM_LOW` and `ARB_SUM_THRESHOLD` - you define the minimum edge you'll accept |
| **One order per leg per market** | No accidental doubling. One clean position per signal. |
| **15-minute log rotation** | Every window gets its own log file. Full audit trail, always. |
| **Single-instance lock** | `monitor.lock` prevents duplicate processes from firing duplicate orders |
| **Dry run mode** | Test your config without spending a cent. See exactly what would have fired. |
| **Auto-restart at quarter hours** | Syncs with market boundaries automatically. Fresh window, fresh state. |

---

## The Numbers

Arbitrage returns depend on how often the window opens and how wide it is when it does. Here's what to expect:

| Arb Gap | Return per unit | Occurrences | Notes |
|---|---|---|---|
| 0.05 - 0.10 | 5-10% per 15min window | Moderate | Most common signal range |
| 0.10 - 0.20 | 10-20% per 15min window | Less frequent | Higher edge, worth waiting for |
| > 0.20 | 20%+ per 15min window | Rare | Usually thin liquidity - check fill quality |

> **Compounding note:** A 7% return per 15-minute window, captured 4× per hour, compounds extremely fast. Even capturing 2-3 clean signals per day at modest size produces meaningful returns over 30 days. The bot runs 24/7. You don't have to.

**Want to see real signals?** Check the live log output in [`/logs`](https://github.com/tvaishnavi11/polymarket-kalshi-arbitrage-bot/tree/main/logs) - actual bot activity, real prices, real fills.

---

## Who Built This

**Hoffman** - specialist in future trading bot development across EVM, Solana, and prediction markets including Polymarket and Kalshi.

If you have questions, want a custom build, or need help configuring for your capital size:
**Telegram: [@popsoar](https://t.me/@popsoar)**

---

## Setup in 5 Minutes

**Prerequisites:** Node.js 18+, Kalshi account with API access, Polymarket wallet with USDC on Polygon.

```bash
# 1. Clone and install
git clone https://github.com/Stuboyo77/polymarket-kalshi-arbitrage-trading-bot.git
cd polymarket-kalshi-arbitrage-trading-bot
npm install

# 2. Configure
cp .env.sample .env
```

Fill in your credentials - everything else has working defaults:

```env
# Kalshi 
KALSHI_API_KEY=your_kalshi_api_key
KALSHI_PRIVATE_KEY_PATH=./kalshi_private.pem
# or use KALSHI_PRIVATE_KEY_PEM for inline key

# Polymarket 
POLYMARKET_PRIVATE_KEY=your_wallet_private_key
POLYMARKET_PROXY=0xYourProxyWallet

# Arbitrage thresholds 
ARB_SUM_THRESHOLD=0.92     # Fire when combined price is below this
ARB_SUM_LOW=0.75           # Don't fire if combined price is below this (too good = bad fill)
ARB_SIZE=10                # Contracts per leg
ARB_DRY_RUN=false          # Set true to test without real orders

# Monitor 
KALSHI_MONITOR_INTERVAL_MS=200    # Poll every 200ms
```

```bash
# 3. Run
npm start
```

That's it. The dual monitor is live, logging every tick, firing on every valid arb signal.

---

## All Commands

```bash
npm start                    # Dual monitor + arb (the main event)
npm run balance              # Check your Kalshi portfolio balance
npm run kalshi-single-order  # Place one manual Kalshi limit order
npm run poly-single-order    # Place one manual Polymarket limit buy
npm run server               # Serve static files (public/)
npm run build                # Compile TypeScript → dist/
```

**Manual order examples:**

```bash
# Dry run - see what would fire without spending
ARB_DRY_RUN=true npm start

# Manual Kalshi YES @ 50¢, 2 contracts
KALSHI_BOT_SIDE=yes KALSHI_BOT_PRICE_CENTS=50 KALSHI_BOT_CONTRACTS=2 npm run kalshi-single-order

# Manual Polymarket DOWN @ 0.45, size 10
npm run poly-single-order 0.45 10
```

---

## Full Configuration Reference

<strong>Click to expand all environment variables</strong>

**Kalshi**

| Variable | Required | Description |
|---|---|---|
| `KALSHI_API_KEY` | Yes | Your Kalshi API key |
| `KALSHI_PRIVATE_KEY_PATH` | Yes* | Path to PEM file |
| `KALSHI_PRIVATE_KEY_PEM` | Yes* | Inline PEM (alternative to path) |
| `KALSHI_DEMO` | No | Use Kalshi demo environment |
| `KALSHI_BASE_PATH` | No | Custom API base URL |

**Bot (single order)**

| Variable | Default | Description |
|---|---|---|
| `KALSHI_BOT_SIDE` | `yes` | Order side: yes or no |
| `KALSHI_BOT_PRICE_CENTS` | - | Limit price in cents |
| `KALSHI_BOT_CONTRACTS` | `1` | Number of contracts |
| `KALSHI_BOT_MAX_MARKETS` | `1` | Max markets to scan |
| `KALSHI_BOT_DRY_RUN` | `false` | Log without placing |

**Monitor**

| Variable | Default | Description |
|---|---|---|
| `KALSHI_MONITOR_INTERVAL_MS` | `200` | Poll cadence |
| `KALSHI_MONITOR_TICKER` | — | Pin to specific ticker |
| `KALSHI_MONITOR_NO_RESTART` | `false` | Disable quarter-hour restart |

**Arbitrage**

| Variable | Default | Description |
|---|---|---|
| `ARB_SUM_THRESHOLD` | `0.92` | Max combined price to fire |
| `ARB_SUM_LOW` | `0.75` | Min combined price to fire |
| `ARB_PRICE_BUFFER` | - | Extra buffer on order price |
| `ARB_SIZE` | - | Contracts per leg |
| `ARB_DRY_RUN` | `false` | Simulate without real orders |

**Polymarket**

| Variable | Required | Description |
|---|---|---|
| `POLYMARKET_PRIVATE_KEY` | Yes | Wallet signing key |
| `POLYMARKET_PROXY` | Yes | Proxy wallet address |
| `POLYMARKET_CLOB_URL` | No | Custom CLOB endpoint |
| `POLYMARKET_CHAIN_ID` | No | Chain ID override |
| `POLYMARKET_MIN_USD` | No | Minimum order size in USD |

</details>

---

## How It's Built

```
src/
├── kalshi/
│   ├── bot.ts              placeOrder() - limit orders on Kalshi
│   └── prices.ts           Best-ask polling via Kalshi REST API
├── polymarket/
│   ├── order.ts            placePolymarketOrder() - CLOB limit buys
│   └── prices.ts           getTokenIdsForSlugCached() + best-ask fetch
├── monitor/
│   └── dual.ts             Core loop - polls both venues, runs arb logic, logs
└── index.ts                Entry point + process lock + restart logic
```

**Stack:** Node.js · TypeScript · `kalshi-typescript` · `@polymarket/clob-client` · `ethers` · `polymarket-validator`

---

## Frequently Asked Questions

**Do I need to predict Bitcoin direction?**
No. The bot holds both sides. One always pays out. You profit from the pricing gap, not the outcome.

**What happens if only one leg fills?**
The arb logic places both orders as close to simultaneously as possible. If one fails, the retry logic kicks in. For production use, monitor your open positions after each signal.

**How much capital do I need?**
The bot works at any size, but larger positions capture more absolute profit per signal. Most users start with $500-$2,000 across both venues to validate fills and slippage before scaling.

**Can I run it 24/7 on a server?**
Yes - and that's the recommended setup. Bitcoin 15m markets run around the clock. The monitor auto-restarts at quarter-hour boundaries and maintains a lock file to prevent duplicate instances. A simple VPS with Node and PM2 is enough.

**Is there a dry run mode?**
Yes. Set `ARB_DRY_RUN=true` and the bot logs every signal it would have fired without placing real orders. Run it for a few hours before going live.

---

## A Note on Risk

Arbitrage is lower-risk than directional trading - but it is not zero-risk.

Execution risk is real: if one leg fills and the other doesn't, you're holding a directional position you didn't intend. Liquidity risk is real: thin books mean your order moves the price, shrinking or eliminating the gap. Config risk is real: wrong thresholds can fire on signals that look like arb but aren't.

Use dry run mode first. Start small. Read your logs. Scale once you've validated real fills against real signals.

**This software is provided for educational purposes. Not financial advice. Your capital, your responsibility.**

---

## Reference

- [Kalshi API Docs](https://docs.kalshi.com/)
- [Kalshi TypeScript SDK](https://docs.kalshi.com/sdks/typescript/quickstart)
- [Kalshi WebSockets](https://docs.kalshi.com/websockets/websocket-connection)
- [Polymarket CLOB Client](https://github.com/Polymarket/clob-client)

---

<div align="center">

*Two venues. One event. A gap in the price.*
*The bot finds it in 200ms.*
*You collect at resolution.*

<br>

**Questions or custom builds → [Telegram: @popsoar](https://t.me/@popsoar)**

<br>

*Not financial advice. Read the code. Start with dry run.*

</div>
