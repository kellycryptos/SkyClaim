# Telegraph Hackathon Season II · Official Submission Form

## 1. Project Information
- **Project Name:** SkyClaim
- **Core Positioning:** *“SkyClaim checks the airline's most common excuse. When a flight is delayed 3+ hours, it verifies weather alerts for the departure airport through Telegraph. If a severe alert is active, it flags the claim as high risk. Otherwise it drafts an EU261/UK261 claim. Draft only, not legal advice. Coverage: US departures to Europe on EU/UK carriers. Testnet only.”*
- **Competition Track:** Track 03: Apps & Agents
- **Target Commercial Mission:** Mission 15: Consumer Automation
- **Repository Link:** `https://github.com/kellycryptos/SkyClaim`
- **Live Demo Link:** `http://localhost:3000`
- **Telegram Bot Handle:** `@SkyClaimBot` (or run locally via `npm run bot:sim`)

---

## 2. The 3 Evaluator Test Scenarios

- **CASE 1: CLEAN DELAY (Hypothetical `BA178` JFK → LHR)**  
  Arrival delay: 3h 42m at destination (flight data: `FIXTURE`). Weather at departure: no active severe storm alerts (`FIXTURE`). The airline's weather excuse is not supported by this evidence. Verdict: `ELIGIBLE_FOR_CLAIM` (Eligible compensation to be checked under EU261 Article 7: €300 to €600, subject to Article 7(2)(c) 50% discount for 3h–4h arrival delays on flights > 3,500 km. Draft claim ready).
- **CASE 2: MINOR DELAY (Hypothetical `DL401` JFK → CDG)**  
  Arrival delay: 1h 05m at destination (flight data: `FIXTURE`). Below the 3-hour statutory threshold. Verdict: `INELIGIBLE` ($0 spent, no purchase made).
- **CASE 3: DELAY WITH WEATHER RISK (Hypothetical `AF112` ORD → CDG)**  
  Arrival delay: 4h 10m at destination (flight data: `FIXTURE`). Severe blizzard alert active at departure (`FIXTURE`). The airline holds an extraordinary circumstances defense under Article 5(3). Verdict: `FAIL_CLOSED_WEATHER` (fails closed to prevent doomed dispute).

---

## 3. Short Commercial Summary (Season II Official 5 Questions)

### Question 1: Who is it for?
Passengers, travel agents, and corporate travel desks managing transatlantic flights on EU/UK carriers departing US airports. When a flight is delayed 3+ hours on arrival, passengers may be legally entitled to €250–€600 in compensation under EU261/UK261, but airlines routinely deny claims citing weather.

### Question 2: What does it improve?
Automates verification at the moment of delay. Instead of passengers spending weeks disputing an airline's generic weather excuse, SkyClaim purchases timestamped departure weather intelligence through Telegraph for $0.01 USDC, establishing whether weather alerts were actually active.

### Question 3: What does it do today?
1. Evaluates arrival delay duration against the 3-hour statutory threshold (CJEU *Sturgeon v Condor* standard).
2. If arrival delay $\ge$ 3 hours, purchases live weather alert intelligence for the US departure airport via Telegraph (`TRAVEL_TRANSIT_LOCK_GENERAL`).
3. Evaluates 3 explicit outcomes:
   - Case 1 (Clean Delay): Weather clear $\to$ `ELIGIBLE_FOR_CLAIM` (€300–€600 eligible compensation to be checked under Article 7(2)).
   - Case 2 (Minor Delay): Arrival delay $< 3$h $\to$ `INELIGIBLE` ($0 spent, no claim drafted).
   - Case 3 (Weather Risk): Severe weather alert active $\to$ `FAIL_CLOSED_WEATHER`.
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
- **Supported Intent:** `TRAVEL_TRANSIT_LOCK_GENERAL` (`ttl-nws` 106005, `ttl-airsigmet` 106004)
- **Unit Cost:** $0.01 USDC per verified departure weather check.
