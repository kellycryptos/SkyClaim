# Telegraph Hackathon Season II · Official Submission Form

## 1. Project Information
- **Project Name:** SkyClaim
- **Core Positioning:** *“SkyClaim checks the airline's most common excuse. When a flight is delayed 3+ hours, it buys live weather alerts for the departure airport through Telegraph. If a severe alert is active, it flags the claim as high risk. Otherwise it drafts an EU261/UK261 claim with the receipt attached. Draft only, not legal advice. Coverage: US departures to Europe on EU/UK carriers. Testnet only.”*
- **Competition Track:** Track 03: Apps & Agents
- **Target Commercial Mission:** Mission 15: Consumer Automation
- **Repository Link:** `https://github.com/kellycryptos/SkyClaim`
- **Live Demo Link:** `http://localhost:3000`
- **Telegram Bot Handle:** `@SkyClaimBot` (or run locally via `npm run bot:sim`)

---

## 2. The 3 Evaluator Test Scenarios

- **CASE 1: CLAIM LOOKS VIABLE**  
  Delay 3h 42m (flight data: `FIXTURE`). Weather at departure: no active alerts (Telegraph purchase, $0.01, receipt shown, `LIVE`). The airline's weather excuse is not supported by this evidence. Draft claim ready. Compensation under EU261 is EUR 250 to 600 depending on distance.
- **CASE 2: DELAY TOO SHORT**  
  Delay 1h 05m (flight data: `FIXTURE`). Below the 3 hour threshold. No claim drafted and no purchase made.
- **CASE 3: WEATHER RISK**  
  Delay 4h 10m (flight data: `FIXTURE`). Severe weather alert active at departure (Telegraph receipt, `RECORDED` on 2026-11-20). The airline may argue extraordinary circumstances. Evidence is weak and the rejection risk is high. Whether to file is your decision. This tool does not decide legal fault.

---

## 3. Short Commercial Summary (Season II Official 5 Questions)

### Question 1: Who is it for?
Passengers, travel agents, and corporate travel desks managing transatlantic flights on EU/UK carriers departing US airports. When a flight is delayed 3+ hours, passengers are legally entitled to €250–€600 in compensation under EU261/UK261, but airlines routinely deny claims citing weather.

### Question 2: What does it improve?
Automates verification at the moment of delay. Instead of passengers spending weeks disputing an airline's generic weather excuse, SkyClaim purchases timestamped departure weather intelligence through Telegraph for $0.01 USDC, establishing whether weather alerts were actually active.

### Question 3: What does it do today?
1. Detects flight delay duration.
2. If delay $\ge$ 3 hours, purchases live weather alert intelligence for the US departure airport via Telegraph (`STORM_ALERT_GENERAL`).
3. Evaluates 3 explicit outcomes:
   - Case 1 (Viable): Weather clear $\to$ Drafts EU261 claim with on-chain receipt.
   - Case 2 (Ineligible): Delay $< 3$h $\to$ No purchase made, no claim drafted.
   - Case 3 (Weather Risk): Severe weather alert active $\to$ Flags high rejection risk.
4. Settles x402 micro-payments on Base Sepolia (`84532`) with Circle USDC.

### Question 4: Why would someone adopt it?
Corporate travel desks and consumers gain timestamped, immutable proof of departure weather conditions, avoiding doomed claims when weather defense is strong and providing instant evidence packs when claims are viable.

### Question 5: How can someone try it?
1. Clone the repo and run `npm install && npm test && npm run build && npm start`.
2. Open `http://localhost:3000` to test the 3 labeled presets or query any US airport.
3. Run `npm run bot:sim` to test the full Telegram bot flow in terminal.

---

## 4. Protocol Evidence & Transaction Accounting
- **Telegraph Diamond Contract (Base Sepolia):** `0x5a2324aA18613FAD4e44bDF0d6c73Ec1f6D87ff8`
- **Circle USDC x402 Gate:** `0x036CbD53842c5426634e7929541eC2318f3dCF7e`
- **Live Node Engine:** `http://13.237.89.59:7044`
- **Live Signal Receipt:** `0x19f108d99be48cfa2a65c0e080c3085815fe0e890429632a3d4209b0a75bead2` (`STORM_ALERT_GENERAL` via PREFLIGHT Infrastructure Signals)
- **Unit Cost:** $0.01 USDC per verified departure weather check.
