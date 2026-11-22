# SkyClaim · Technical Tutorial & Architecture Guide

> **Learn how to build an autonomous flight disruption shield that verifies airline weather excuses using Telegraph Protocol's x402 micropayments on Base Sepolia.**

---

## 1. The Real-World Disruption Problem

Under European Regulation (EC) No 261/2004 and UK Air Passenger Rights:
- Flights delayed $\ge 3$ hours on arrival entitle passengers to **€250, €400, or €600** statutory cash compensation.
- **The Airline Defense:** Under Article 5(3), airlines are exempt from paying if they prove the delay was caused by *"extraordinary circumstances which could not have been avoided"*, most commonly claiming bad weather or air traffic control.

**SkyClaim** checks the airline's most common excuse at the exact moment of delay:
1. When a 3+ hour arrival delay is detected on a transatlantic departure, SkyClaim immediately verifies departure weather alert intelligence for the US departure airport via Telegraph Protocol (`TRAVEL_TRANSIT_LOCK_GENERAL`).
2. If severe storm/ground-stop alerts are active, SkyClaim warns the passenger that the airline holds an extraordinary circumstances defense (`FAIL_CLOSED_WEATHER`), preventing doomed disputes.
3. If weather is clear, SkyClaim issues `ELIGIBLE_FOR_CLAIM`, generating a complete EU261 claim draft with statutory delay basis and eligible compensation range (€300 to €600, subject to Article 7(2)(c)), pre-emptively closing the airline's weather excuse.

---

## 2. Honest Data Boundaries: FIXTURE vs. LIVE vs. SIMULATED

To ensure transparent and reproducible adjudication, SkyClaim enforces explicit data labeling:

| Component | Nature | Description |
| :--- | :--- | :--- |
| **Preset Telemetry** | `[FIXTURE]` | Deterministic test vectors for hypothetical flights and departure weather. |
| **Live Departure Weather** | `[LIVE]` | Real-time weather alert query purchased via Telegraph x402 ($0.01 USDC on Base Sepolia). |
| **Free-Input Baseline** | `[SIMULATED]` | Zero-cost baseline when `AGENT_PRIVATE_KEY` is not present in environment. |
| **Short Delay (< 3 Hours)** | `[$0 SPENT]` | Autonomous circuit breaker: Below statutory threshold, no query purchased. |

---

## 3. The 3 Evaluator Test Scenarios

```text
CASE 1: CLEAN DELAY (Hypothetical BA178 JFK -> LHR)
Arrival delay: 3h 42m (flight data: FIXTURE). Weather at departure: no active alerts (FIXTURE). The airline's weather excuse is not supported by this evidence. Draft claim ready. Eligible compensation to be checked under EU261 Article 7(2): €300 to €600.

CASE 2: MINOR DELAY (Hypothetical DL401 JFK -> CDG)
Arrival delay: 1h 05m (flight data: FIXTURE). Below the 3 hour statutory threshold. Ineligible; no claim drafted and no purchase made ($0 spent).

CASE 3: WEATHER RISK (Hypothetical AF112 ORD -> CDG)
Arrival delay: 4h 10m (flight data: FIXTURE). Severe weather blizzard alert active at departure (FIXTURE). The airline holds an extraordinary circumstances defense under Article 5(3). Verdict: FAIL_CLOSED_WEATHER. Fails closed to prevent doomed dispute.
```

---

## 4. The x402 Micropayment Protocol on Base Sepolia

Every intelligence check on SkyClaim is an on-chain paid API request:
1. The agent makes an HTTP request to the Telegraph node (`POST /engine/v1/ask`).
2. The node challenges with `HTTP 402 Payment Required` containing the base64 challenge specifying asset (`Circle USDC: 0x036CbD53842c5426634e7929541eC2318f3dCF7e`) and amount (`10000` = $0.01 USDC) on Base Sepolia (`84532`).
3. The agent signs an EIP-712 typed data payload: `TransferWithAuthorization` (EIP-3009).
4. The signed authorization is returned in the `PAYMENT-SIGNATURE` header.
5. The facilitator settles the payment on-chain, and the node returns the verified weather intelligence and cryptographic receipt.

---

## 5. How to Reproduce & Test

### Step 1: Clone and Run Test Suite
```bash
git clone https://github.com/kellycryptos/SkyClaim.git
cd SkyClaim
npm install
npm test
```

### Step 2: Verify the Live Telegraph x402 Purchase
```bash
# Connects to live Telegraph node and verifies the real x402 challenge negotiation
npm run purchase:live
```

### Step 3: Run Interactive Telegram Bot Simulator
```bash
# Simulates all 3 labeled evaluator presets directly in terminal
npm run bot:sim
```

### Step 4: Run the Web UI
```bash
npm run build
npm start
# Open http://localhost:3000 to test the 1-click presets or query any US airport code
```
