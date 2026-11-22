# SkyClaim · Autonomous Flight Disruption & Claim Verifier

> **Telegraph Hackathon Season II Official Entry**  
> **Track:** Track 03 — Apps & Agents  
> **Mission:** Mission 15 — Consumer Automation  
> **Payment & Settlement Layer:** x402 Protocol · Circle USDC on Base Sepolia (Chain ID: 84532)

---

## 🏆 The Receipt Box & Sponsor Verification Matrix

| Protocol Component | Network / Environment | Identifier / Address | Verification Link |
| :--- | :--- | :--- | :--- |
| **Telegraph Diamond Contract** | Base Sepolia (`84532`) | `0x5a2324aA18613FAD4e44bDF0d6c73Ec1f6D87ff8` | [Basescan Explorer](https://sepolia.basescan.org/address/0x5a2324aA18613FAD4e44bDF0d6c73Ec1f6D87ff8) |
| **Circle USDC (x402 Gate)** | Base Sepolia (`84532`) | `0x036CbD53842c5426634e7929541eC2318f3dCF7e` | [Basescan Explorer](https://sepolia.basescan.org/token/0x036CbD53842c5426634e7929541eC2318f3dCF7e) |
| **Live Node Engine** | HTTP / WS Engine | `http://13.237.89.59:7044` | [Healthz Endpoint](http://13.237.89.59:7044/miner-dispatcher/healthz) · [2,189 Miners Index](http://13.237.89.59:7044/engine/v1/subnets) |
| **Miner 1: Transit Telemetry** | `TRAVEL_TRANSIT_LOCK_GENERAL` | Miner `ttl-nws` (`m-106005`) | [`lib/skyclaim-consensus.ts#L225`](lib/skyclaim-consensus.ts) |
| **Miner 2: Weather Disruption** | `STORM_ALERT_GENERAL` | Miner `SkyWire MET Norway` (`m-79335`) | [`lib/skyclaim-consensus.ts#L239`](lib/skyclaim-consensus.ts) |

---

## ⏱️ 90-Second Human Judge Quickstart

This repository implements **Zero-Config Sandbox Resilience**. It compiles, tests, and boots in sterile environments with **no `.env` file required**.

```bash
# 1. Install dependencies
npm install

# 2. Run deterministic CI/CD test suite (100% automated pass)
npm test

# 3. Build optimized production bundle
npm run build

# 4. Boot Web Terminal on port 3000
npm start
```

### Try Surface A: Web Terminal
Open **[http://localhost:3000](http://localhost:3000)** in your browser:
1. Click **Preset 1 (BA178)**: Flight delayed +3h 35m + clear weather $\to$ **€600 Approved Claim Package**.
2. Click **Preset 2 (DL401)**: Flight arrived +14m $\to$ **Ineligible on-time rejection ($0.02 saved)**.
3. Click **Preset 3 (AF112)**: Flight delayed 4h + severe blizzard at ORD $\to$ **Fail-closed conflict alert**.
4. Click **"The Receipt Box"** to inspect live Base Sepolia contract addresses and payment proofs.

### Try Surface B: Telegram Bot & CLI Simulator
```bash
# Run interactive Telegram bot simulation (all 3 scenarios with 100% fidelity)
npm run bot:sim

# Or run live on Telegram (set TELEGRAM_BOT_TOKEN in .env)
npm run bot
```

---

## 📋 The 5 Commercial Summary Questions (Season II Rules §8)

### 01. Who is it for?
**Airline passengers, travel agents, and corporate expense managers.** Under EU261 and UK261, passengers on delayed flights (>3 hours) are legally owed up to **€600 (£520)** in cash compensation, but over 85% of eligible passengers never claim because manual airline portals are intentionally labyrinthine and airlines routinely contest claims citing "extraordinary circumstances".

### 02. What does it improve?
Replaces 45-day claims-management companies (who charge 35-50% contingency fees) and slow manual filings with an **autonomous 20-second verification loop costing just $0.02 USDC**. By purchasing independent transit and weather intelligence simultaneously, SkyClaim pre-emptively disproves the airline's standard Article 5(3) "bad weather" defense before the claim is even submitted.

### 03. What does it do today?
1. Accepts flight number and date via Telegram (`/claim BA178 2026-11-20`) or Web UI.
2. Buys two parallel x402 intelligence queries for **$0.02 USDC total**:
   - `TRAVEL_TRANSIT_LOCK_GENERAL`: Fetches gate arrival telemetry and delay duration.
   - `STORM_ALERT_GENERAL`: Checks MET Norway & NOAA weather hazard locks at route hubs.
3. Applies a **Fail-Closed Consensus Rule**:
   - **Approved:** Delay $\ge$ 180 min AND Weather == Clear $\to$ Emits formatted EU261 claim pack.
   - **Ineligible:** Delay $<$ 180 min $\to$ Clean statutory threshold rejection.
   - **Fail-Closed Conflict:** Delay $\ge$ 180 min AND Severe Storm Alert $\to$ Halts automated filing, flags extraordinary circumstances defense, and generates appeal evidence dossier.
4. Settles micro-payments on **Base Sepolia (84532)** with gasless EIP-712 `TransferWithAuthorization` using Circle USDC.

### 04. Why would someone adopt it?
Passengers get their rightful statutory compensation with zero contingency fees; corporate travel desks recover hundreds of thousands in travel disruptions automatically; claims carry cryptographic on-chain receipts that make airline denials legally defensible in court.

### 05. How can someone try it?
1. Clone this repository and run `npm run build && npm start`.
2. Use the 3 built-in 1-click presets or enter any arbitrary flight number.
3. Test the Telegram Bot via `npm run bot:sim` or live with a bot token.

---

## 🏗️ Consensus Architecture: "Consensus Before Action"

```
                              ┌─────────────────────────────────┐
                              │     SKYCLAIM TELEGRAM / WEB     │
                              │     /claim BA178 2026-11-20     │
                              └────────────────┬────────────────┘
                                               │
                        Parallel Dispatched x402 Queries ($0.01 each)
                        ┌──────────────────────┴──────────────────────┐
                        ▼                                             ▼
             ┌─────────────────────┐                       ┌─────────────────────┐
             │       MINER 1       │                       │       MINER 2       │
             │ TRAVEL_TRANSIT_LOCK │                       │     STORM_ALERT     │
             │   (ttl-nws m-106005)│                       │  (SkyWire m-79335)  │
             └──────────┬──────────┘                       └──────────┬──────────┘
                        │                                             │
                        │ Delay: +215 mins                            │ Weather: CAVOK (Clear)
                        │ Gate Arrival: 21:35                         │ Storm Alert: FALSE
                        │                                             │
                        └──────────────────────┬──────────────────────┘
                                               ▼
                              ┌─────────────────────────────────┐
                              │   CONSENSUS & FAIL-CLOSED GATE  │
                              │  Delay >= 180m AND Weather Clr? │
                              └────────────────┬────────────────┘
                                               │
                       ┌───────────────────────┴───────────────────────┐
                       ▼                                               ▼
             [ CONSENSUS REACHED ]                           [ EVIDENCE CONFLICT ]
               €600 Claim Generated                            Fail-Closed Warning
            Statutory Pack + 2 Receipts                   Article 5(3) Weather Defense Flag
```

---

## 🛡️ Pre-Submission Verification

- [x] **Starred the Telegraph Bounties repository**: Starred `github.com/telegraphprotocol/bounties` (Rule §5).
- [x] **Zero-Config Sandbox Resilience**: Passed with NO `.env` file present.
- [x] **3 Explicit Reviewer Scenarios**: Passed deterministically in `npm test`.
- [x] **Production Build Clean**: Compiled with Next.js 16 (0 errors).
