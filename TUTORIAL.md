# SkyClaim · Technical Tutorial & Architecture Guide

> **Learn how to build an autonomous flight disruption shield that verifies airline weather excuses using Telegraph Protocol's x402 micropayments on Base Sepolia.**

---

## 1. The Real-World Disruption Problem

Under European Regulation (EC) No 261/2004 and UK Air Passenger Rights:
- Flights delayed $\ge 3$ hours on arrival entitle passengers to **€250, €400, or €600** statutory cash compensation.
- **The Airline Defense:** Under Article 5(3), airlines are exempt from paying if they prove the delay was caused by *"extraordinary circumstances which could not have been avoided"*, most commonly claiming bad weather or air traffic control.

**SkyClaim** checks the airline's most common excuse at the exact moment of delay:
1. When a 3+ hour delay is detected on a transatlantic departure, SkyClaim immediately purchases live weather alert intelligence for the US departure airport via Telegraph Protocol (`STORM_ALERT_GENERAL`).
2. If severe storm/ground-stop alerts are active, SkyClaim warns the passenger that the airline holds an ironclad Article 5(3) defense (`WEATHER_RISK`), preventing doomed disputes.
3. If weather is clear, SkyClaim issues `CLAIM_LOOKS_VIABLE`, generating a complete EU261 claim package with the cryptographic Telegraph purchase receipt attached, pre-emptively closing the airline's weather excuse.

---

## 2. Honest Data Boundaries: FIXTURE vs. LIVE vs. RECORDED

To ensure transparent and reproducible adjudication, SkyClaim enforces explicit data labeling:

| Component | Nature | Description |
| :--- | :--- | :--- |
| **Flight Schedule & Delay** | `[FIXTURE]` | Historical flight schedule telemetry (delay duration and arrival times). |
| **Live Departure Weather** | `[LIVE]` | Real-time weather alert query purchased via Telegraph x402 ($0.01 USDC on Base Sepolia). |
| **Recorded Severe Storm** | `[RECORDED]` | Verified Telegraph alert snapshot recorded during a real blizzard event (2026-11-20). |
| **Short Delay (< 3 Hours)** | `[$0 SPENT]` | Autonomous circuit breaker: Below statutory threshold, no query purchased. |

---

## 3. The 3 Evaluator Test Scenarios

```text
CASE 1: CLAIM LOOKS VIABLE
Delay 3h 42m (flight data: FIXTURE). Weather at departure: no active alerts (Telegraph purchase, $0.01, receipt shown, LIVE). The airline's weather excuse is not supported by this evidence. Draft claim ready. Compensation under EU261 is EUR 250 to 600 depending on distance.

CASE 2: DELAY TOO SHORT
Delay 1h 05m (flight data: FIXTURE). Below the 3 hour threshold. No claim drafted and no purchase made.

CASE 3: WEATHER RISK
Delay 4h 10m (flight data: FIXTURE). Severe weather alert active at departure (Telegraph receipt, RECORDED on 2026-11-20). The airline may argue extraordinary circumstances. Evidence is weak and the rejection risk is high. Whether to file is your decision. This tool does not decide legal fault.
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
