# SkyClaim · Same-Day Flight Disruption Shield

> SkyClaim checks the airline's most common excuse. When a flight is delayed 3+ hours, it buys live weather alerts for the departure airport through Telegraph. If a severe alert is active, it flags the claim as high risk. Otherwise it drafts an EU261/UK261 claim with the receipt attached. Draft only, not legal advice. Coverage: US departures to Europe on EU/UK carriers. Testnet only.

---

## ⚡ Positioning & Purpose

- **Timing:** SkyClaim triggers the moment a 3+ hour delay is detected, buying weather evidence immediately before transient storms clear at the departure airport.
- **Jurisdiction & Coverage:** NWS alerts cover US airports; EU261 and UK261 cover flights departing the EU/UK or arriving in Europe on EU/UK carriers. The honest jurisdiction slice is **US departures to Europe on EU/UK carriers** (e.g., British Airways, Air France, Lufthansa flying out of JFK, ORD, BOS). US domestic flights have no statutory compensation regime and are outside this scope.
- **Architecture:** One flight delay lookup paired with **one verified Telegraph weather intelligence purchase** ($0.01 USDC via x402 on Base Sepolia).

---

## 🎯 The 3 Evaluator Test Scenarios

```text
CASE 1: CLAIM LOOKS VIABLE
Delay 3h 42m (flight data: FIXTURE). Weather at departure: no active alerts (Telegraph purchase, $0.01, receipt shown, LIVE). The airline's weather excuse is not supported by this evidence. Draft claim ready. Compensation under EU261 is EUR 250 to 600 depending on distance.

CASE 2: DELAY TOO SHORT
Delay 1h 05m (flight data: FIXTURE). Below the 3 hour threshold. No claim drafted and no purchase made.

CASE 3: WEATHER RISK
Delay 4h 10m (flight data: FIXTURE). Severe weather alert active at departure (Telegraph receipt, RECORDED on 2026-11-20). The airline may argue extraordinary circumstances. Evidence is weak and the rejection risk is high. Whether to file is your decision. This tool does not decide legal fault.
```

In addition, reviewers can use the **Free-Input Mode** to enter any US departure airport (e.g., `JFK`, `ORD`, `BOS`, `MIA`) to query real-time live current alerts through Telegraph.

---

## 🏆 The Receipt Box & Sponsor Verification Matrix

| Protocol Component | Network / Environment | Identifier / Address | Verification Link |
| :--- | :--- | :--- | :--- |
| **Telegraph Diamond Contract** | Base Sepolia (`84532`) | `0x5a2324aA18613FAD4e44bDF0d6c73Ec1f6D87ff8` | [Basescan Explorer](https://sepolia.basescan.org/address/0x5a2324aA18613FAD4e44bDF0d6c73Ec1f6D87ff8) |
| **Circle USDC (x402 Gate)** | Base Sepolia (`84532`) | `0x036CbD53842c5426634e7929541eC2318f3dCF7e` | [Basescan Explorer](https://sepolia.basescan.org/token/0x036CbD53842c5426634e7929541eC2318f3dCF7e) |
| **Live Node Engine** | HTTP Engine | `http://13.237.89.59:7044` | [Node Healthz](http://13.237.89.59:7044/miner-dispatcher/healthz) · [Miners Index](http://13.237.89.59:7044/engine/v1/subnets) |
| **Live Signal Receipt (JFK Check)** | `STORM_ALERT_GENERAL` | Miner `PREFLIGHT Infrastructure Signals` ($0.01) | [`0x19f108...5bead2`](https://anjoman.ai/dashboard/explore/signals/0x19f108d99be48cfa2a65c0e080c3085815fe0e890429632a3d4209b0a75bead2) |
| **Recorded Signal Receipt (ORD Storm)**| `STORM_ALERT_GENERAL` | Miner `ttl-nws` (`m-106005`) | [`lib/skyclaim-consensus.ts#L38`](lib/skyclaim-consensus.ts) |

---

## ⏱️ 90-Second Human Judge Quickstart

This repository implements strict **Zero-Config Sandbox Resilience**. It compiles, tests, and boots in sterile environments with **no `.env` file required**.

```bash
# 1. Install dependencies
npm install

# 2. Run deterministic CI/CD test suite
npm test

# 3. Verify real live Telegraph x402 purchase end-to-end
npm run purchase:live

# 4. Build optimized production bundle
npm run build

# 5. Boot Web Terminal on port 3000
npm start
```

### Try Surface A: Telegram Bot Simulator
```bash
# Run interactive Telegram bot simulation (all 3 scenarios with 100% fidelity)
npm run bot:sim

# Or run live on Telegram (set TELEGRAM_BOT_TOKEN in .env)
npm run bot
```

### Try Surface B: Web Interface
Open **[http://localhost:3000](http://localhost:3000)**:
1. **Case 1 (BA178 JFK → LHR)**: Click to see `LIVE` weather purchase ($0.01) refuting the weather excuse, generating a €600 draft claim.
2. **Case 2 (DL401 JFK → CDG)**: Click to see minor delay ($< 3$h) resulting in $0 spent and no claim.
3. **Case 3 (AF112 ORD → CDG)**: Click to see high-risk alert flag (`RECORDED`) warning that airline holds an extraordinary circumstances defense.
4. **Live US Airport Query**: Enter any 3-letter US airport code to fetch current real-time alerts.

---

## 📋 The 5 Commercial Summary Questions (Season II Rules §8)

### 01. Who is it for?
Passengers, travel agents, and corporate travel desks managing transatlantic flights on EU/UK carriers departing US airports. When a flight is delayed 3+ hours, passengers are entitled to **€250–€600** under EU261/UK261, but airlines routinely deny claims citing weather.

### 02. What does it improve?
Automates verification at the moment of delay. Instead of passengers spending weeks disputing an airline's generic weather excuse, SkyClaim purchases timestamped departure weather intelligence through Telegraph for **$0.01 USDC**, establishing whether weather alerts were actually active.

### 03. What does it do today?
1. Detects flight delay duration.
2. If delay $\ge$ 3 hours, purchases live weather alert intelligence for the US departure airport via Telegraph (`STORM_ALERT_GENERAL`).
3. Evaluates 3 explicit outcomes:
   - **Case 1 (Viable):** Weather clear $\to$ Drafts EU261 claim with on-chain receipt.
   - **Case 2 (Ineligible):** Delay $< 3$h $\to$ No purchase made, no claim drafted.
   - **Case 3 (Weather Risk):** Severe weather alert active $\to$ Flags high rejection risk.
4. Settles x402 micro-payments on **Base Sepolia (84532)** with Circle USDC.

### 04. Why would someone adopt it?
Corporate travel desks and consumers gain timestamped, immutable proof of departure weather conditions, avoiding doomed claims when weather defense is strong and providing instant evidence packs when claims are viable.

### 05. How can someone try it?
1. Clone this repository and run `npm run build && npm start`.
2. Open `http://localhost:3000` to run the 3 labeled presets or test a live US airport code.
3. Run `npm run bot:sim` to test the full Telegram bot flow in terminal.
