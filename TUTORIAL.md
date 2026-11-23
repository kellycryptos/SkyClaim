# SkyClaim · Technical Tutorial & Architecture Guide
## Building an Autonomous Flight Disruption Shield with x402 Micropayments on Base Sepolia

> **Educational Goal:** This comprehensive tutorial teaches developers and systems architects how to build autonomous consumer agents that verify airline disruption claims, adjudicate meteorological excuses via decentralized oracle miners, and settle payments gaslessly using HTTP 402 (`x402`) and EIP-712 on Base Sepolia.

---

## 1. The Commercial Problem: Mission 15 (Consumer Automation)

Under European Regulation (EC) No 261/2004 and the UK Air Passenger Rights framework:
- When a transatlantic flight is delayed $\ge 3$ hours on arrival at its destination, passengers are entitled to **€300, €400, or €600** in statutory cash compensation.
- **The Airline Excuse:** Under Article 5(3), airlines are legally exempt from compensation if the delay was caused by *"extraordinary circumstances which could not have been avoided even if all reasonable measures had been taken"*. In practice, airlines routinely reject claims by asserting bad weather or air traffic control, knowing individual passengers have no access to historical meteorological data for departure and arrival flight corridors.

### Why Traditional Bots Fail: The Single-Source Flaw
Most consumer claim tools scrape a flight number and file immediately if the flight was late. If the airline responds citing a ground stop or blizzard, the passenger or corporate travel desk spends 3 to 6 months in a futile regulatory complaint.

**SkyClaim** introduces **Consensus Before Action**:
1. It validates the **operating carrier metal** first (under CJEU Case C-502/18). Flights departing the USA on non-EU carriers (e.g. Delta) are excluded by law—SkyClaim skips these with **$0 spent**.
2. It purchases dual-hub meteorological observations via **Telegraph Protocol** (`TRAVEL_TRANSIT_LOCK_GENERAL` and `STORM_ALERT_GENERAL`) for $0.01 USDC.
3. If weather was clear, it drafts an undeniable claim package citing statutory delay grounds.
4. If weather alerts were active, it issues a **Contested Claim Notice** under CJEU Case C-549/07 (*Wallentin-Hermann*), shifting the burden of proof to the carrier.

---

## 2. Architecture & Data Flow Diagram

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                             PASSENGER / DESK                                │
│                     (Web UI / Telegram Bot / Terminal)                      │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
                   ┌───────────────────────────────────────┐
                   │  1. Check Operating Metal Eligibility │
                   │       (CJEU Case C-502/18 Metal)      │
                   └───────────────────┬───────────────────┘
                         Is EU/UK?     │
                        ┌──────────────┴──────────────┐
                     No │                             │ Yes
                        ▼                             ▼
             ┌─────────────────────┐    ┌───────────────────────────────────┐
             │ Ineligible ex-USA   │    │ 2. Check Arrival Delay >= 3 Hours │
             │   ($0 spent)        │    └─────────────────┬─────────────────┘
             └─────────────────────┘            Is >= 3h? │
                                           ┌──────────────┴──────────────┐
                                        No │                             │ Yes
                                           ▼                             ▼
                                ┌─────────────────────┐    ┌───────────────────────────────┐
                                │ Ineligible (< 3h)   │    │ 3. Telegraph x402 Micropayment│
                                │   ($0 spent)        │    │    ($0.01 USDC on Base Sepolia│
                                └─────────────────────┘    └──────────────┬────────────────┘
                                                                          │
                                                                          ▼
                                                       ┌───────────────────────────────────┐
                                                       │ 4. Takar Dual-Miner Consensus     │
                                                       │    - Departure Hub Transit Lock   │
                                                       │    - Arrival Hub Storm Telemetry  │
                                                       │    - NOAA / METAR Station Feed    │
                                                       └──────────────────┬────────────────┘
                                                                          │
                                         ┌────────────────────────────────┴────────────────────────────────┐
                                         │ Weather Clean                                                   │ Weather Severe
                                         ▼                                                                 ▼
                         ┌───────────────────────────────┐                                 ┌───────────────────────────────┐
                         │      ELIGIBLE_FOR_CLAIM       │                                 │      FAIL_CLOSED_WEATHER      │
                         │    €300 – €600 Claim Pack     │                                 │    Contested Claim Notice     │
                         │    (Airline excuse closed)    │                                 │   (Wallentin-Hermann basis)   │
                         └───────────────────────────────┘                                 └───────────────────────────────┘
```

---

## 3. The x402 Micropayment Protocol on Base Sepolia

Instead of requiring expensive API subscriptions or complex wallet top-ups with volatile gas tokens (ETH), Telegraph Protocol operates an HTTP 402 challenge-response flow using Circle USDC and gasless EIP-712 authorizations:

### Step 1: Initial Query to Telegraph Node
The agent issues a standard HTTP `POST` request to the Telegraph node:
```typescript
const response = await fetch(`${TELEGRAPH_NODE_URL}/engine/v1/ask`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    intent: "TRAVEL_TRANSIT_LOCK_GENERAL",
    params: { route_or_flight: "JFK" }
  })
});
```

### Step 2: Handling the HTTP 402 Challenge
If the node requires payment, it responds with status code `402 Payment Required` and a challenge payload containing payment parameters:
```json
{
  "challenge": {
    "network": "Base Sepolia (84532)",
    "token": "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    "recipient": "0x5a2324aA18613FAD4e44bDF0d6c73Ec1f6D87ff8",
    "amount": "10000",
    "validUntil": 1732560000
  }
}
```

### Step 3: Gasless EIP-712 Signing (EIP-3009)
The agent signs a `TransferWithAuthorization` typed data structure using its funded Base Sepolia test wallet. **Zero ETH is consumed** because the relayer/facilitator pays the on-chain gas:
```typescript
const domain = {
  name: "USD Coin",
  version: "2",
  chainId: 84532,
  verifyingContract: "0x036CbD53842c5426634e7929541eC2318f3dCF7e"
};

const types = {
  TransferWithAuthorization: [
    { name: "from", type: "address" },
    { name: "to", type: "address" },
    { name: "value", type: "uint256" },
    { name: "validAfter", type: "uint256" },
    { name: "validBefore", type: "uint256" },
    { name: "nonce", type: "bytes32" }
  ]
};

const signature = await wallet.signTypedData(domain, types, value);
```

### Step 4: Settlement and Response Delivery
The agent retries the request with the `PAYMENT-SIGNATURE` header:
```typescript
const paidResponse = await fetch(`${TELEGRAPH_NODE_URL}/engine/v1/ask`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "PAYMENT-SIGNATURE": signature
  },
  body: JSON.stringify({
    intent: "TRAVEL_TRANSIT_LOCK_GENERAL",
    params: { route_or_flight: "JFK" }
  })
});
```
The node verifies the signature, submits it to the Base Sepolia Diamond contract, and delivers the cryptographic weather telemetry and miner receipt hash!

---

## 4. Hard Budget Guardrails (`lib/budget-guard.ts`)

To prevent autonomous agent runaway costs, SkyClaim enforces programmatic financial guardrails:
- **Per-Call Hard Cap:** Maximum **$0.05 USDC** per single intelligence check.
- **Daily Cumulative Cap:** Maximum **$5.00 USDC** across all checks in a 24-hour window.
- **Automatic Circuit Breaker:** If budget limits are approached or network keys are absent, SkyClaim automatically falls back to deterministic fixture mode with clear logging, preventing wallet depletion.

---

## 5. Honest Data Boundaries: The 3 Badges

| Badge | Data Origin | Transaction & Miner Proof | On-Chain Cost | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **`[LIVE]`** | Live Telegraph node purchase (`/engine/v1/ask`) | Real Base Sepolia tx hashes (Basescan permalinks) | **$0.01 USDC** | Production-ready queries with real settlement on Base Sepolia. |
| **`[FIXTURE]`** | Deterministic acceptance test vectors (Cases 1, 2, 3) | Labeled benchmark fixture | **$0.00** | Instant reviewer reproduction with zero wallet friction. |
| **`[SIMULATED]`** | Free-input query when credentials are missing | Explicit notice: *"Simulated corridor baseline"* | **$0.00** | Zero-config sandbox resilience. Never invents fake hashes. |

---

## 6. How to Reproduce & Verify

### Step 1: Clone and Run Test Suite
```bash
git clone https://github.com/kellycryptos/SkyClaim.git
cd SkyClaim
npm install
npm test
```

### Step 2: Run the Live Base Sepolia Purchase Verifier
```bash
# Connects to live node (http://13.237.89.59:7044) and verifies on-chain x402 payment
npm run purchase:live
```

### Step 3: Run the Terminal Evaluator Simulator
```bash
# Interactive terminal runner to evaluate all 3 deterministic cases in 90 seconds
npm run bot:sim
```

### Step 4: Run the Web UI
```bash
npm run build
npm start
# Open http://localhost:3000 in your browser
```

---

## 7. Limitations & Production Roadmap

1. **Testnet Scope:** Currently operates on Base Sepolia (`84532`) using Circle testnet USDC. Mainnet migration requires pointing to the Base Mainnet Telegraph Diamond.
2. **Geographic Coverage:** Current statutory engine is tailored to ex-US departures bound for the European Union or United Kingdom on EU/UK operating metal under EU261 / UK261. Intra-European flights and ex-Canada flights can be enabled by updating airport metadata.
3. **Airline Direct Filing:** Current engine outputs verified statutory claim dossiers (PDF/JSON). Next phase includes direct airline API submission adapters.
