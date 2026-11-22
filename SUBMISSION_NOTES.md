# Telegraph Hackathon Season II · Official Entry Dossier & Form Notes
> **Project:** SkyClaim · Autonomous Flight Disruption Evidence Tool  
> **Track:** Track 03 — Apps & Agents  
> **Mission:** Mission 15 — Consumer Automation  
> **Status:** Submission-Ready (Pre-filled notes to copy-paste into the official form when it opens)

---

## 1. Contact & Participant Information
- **Full Name / Team Contact:** kellycryptos
- **Participating As:** Individual / Independent Builder
- **GitHub Username:** `kellycryptos`
  - *Repo Star Verification:* Starred `github.com/telegraphprotocol/bounties` (Required)
- **Discord Username:** `kellycryptos`
- **X / Twitter Handle:** `@kellycryptos`
- **EVM Payout Wallet Address (Base Sepolia / Mainnet):** `0x742d35Cc6634C0532925a3b844Bc454e4438f44e`
- **Competition Track:** Track 03: Apps & Agents
- **Target Commercial Mission:** Mission 15: Consumer Automation
- **Project Name:** SkyClaim
- **Primary Repository Link:** https://github.com/kellycryptos/SkyClaim
- **Live Deployment / Reviewer Access Link:** `http://localhost:3000` (or public preview)
- **Telegram Bot Simulator:** `npm run bot:sim` (or `@SkyClaimBot`)

---

## 2. Short Public Summary & Five Commercial Questions

### One-Sentence Positioning Hook:
> *“SkyClaim checks the airline's most common excuse. When a flight is delayed 3+ hours, it verifies weather alerts for the departure airport through Telegraph Protocol. If a severe alert is active, it flags the claim as high risk; otherwise, it drafts an EU261/UK261 claim with the receipt attached. Draft only, not legal advice. Coverage: US departures to Europe on EU/UK carriers. Testnet only.”*

### Question 1: Who is it for?
Passengers, corporate travel desks, and claims managers dealing with transatlantic flights on EU/UK carriers departing US airports. Under Regulation (EC) No 261/2004, delays exceeding 3 hours entitle passengers to €250–€600 statutory compensation, but airlines routinely reject claims citing "extraordinary weather circumstances".

### Question 2: What does it improve?
Eliminates bureaucratic delays and false rejections. Instead of passengers blindly disputing an airline's weather defense weeks later, SkyClaim purchases timestamped departure weather intelligence through Telegraph for $0.01 USDC at the moment of disruption, establishing whether severe storm alerts actually existed.

### Question 3: What does it do today?
1. Evaluates arrival delay duration against the 3-hour statutory threshold (CJEU *Sturgeon v Condor* standard).
2. If arrival delay $\ge$ 3 hours, purchases live weather alert intelligence for the US departure airport via Telegraph (`TRAVEL_TRANSIT_LOCK_GENERAL`).
3. Adjudicates 3 explicit outcomes:
   - **Case 1 (Clean Delay):** Arrival delay $\ge$ 3h + Weather clear $\to$ `ELIGIBLE_FOR_CLAIM` (€300–€600 eligible compensation to be checked under Article 7(2)).
   - **Case 2 (Minor Delay):** Arrival delay $< 3$h $\to$ `INELIGIBLE` ($0 spent, no purchase made).
   - **Case 3 (Weather Risk):** Arrival delay $\ge$ 3h + Severe weather alert active $\to$ `FAIL_CLOSED_WEATHER`.
4. Settles x402 micro-payments on Base Sepolia (`84532`) in Circle USDC.

### Question 4: Why would someone adopt it?
Corporate travel management desks save hundreds of hours of doomed dispute labor by failing closed on valid weather defenses, while securing timestamped cryptographic evidence packs that force airlines to settle viable claims immediately.

### Question 5: How can someone try it?
1. Clone the repository and run:
   ```bash
   git clone https://github.com/kellycryptos/SkyClaim.git
   cd SkyClaim
   npm install && npm test && npm run build && npm start
   ```
2. Open `http://localhost:3000` to run the 3 labeled evaluator presets (`BA178`, `DL401`, `AF112`) or query any US airport.
3. Test terminal simulator: `npm run bot:sim`.

---

## 3. Demo Video Specification (2 to 5 Minutes)
- **Video Link:** `[VIDEO_URL_PLACEHOLDER]` *(To be recorded: 2–5 min)*
- **Video Script Outline:**
  - `0:00 - 0:20`: **The Problem:** €600 EU261 claims rejected by airlines claiming "weather" when skies were clear.
  - `0:20 - 1:15`: **Live Web Terminal Demo:**
    - Click **Preset 1 (BA178):** 3h 42m clean delay, weather clear, `APPROVED_FOR_CLAIM` with draft claim generated.
    - Click **Preset 2 (DL401):** 1h 05m delay, below 3h threshold, `INELIGIBLE` ($0 spent).
    - Click **Preset 3 (AF112):** 4h 10m delay, blizzard ground-stop active, `FAIL_CLOSED_WEATHER`.
  - `1:15 - 1:45`: **Terminal Telegram Bot Simulator:** Run `npm run bot:sim`, demonstrate conversational flow and transparent data badges.
  - `1:45 - 2:30`: **Telegraph Integration & Receipt Box:** Show the live node interaction (`http://13.237.89.59:7044`), Base Sepolia Diamond (`0x5a2324...`), and live verified x402 challenge flow.
  - `2:30 - 3:00`: **Summary:** Real demand, x402 micropayments, zero-env resilience.

---

## 4. Run Instructions & Technical Specifications
- **Prerequisites:** Node.js 18+, npm 9+ (Zero `.env` file required; runs in clean container).
- **Setup & Start:**
  ```bash
  npm install
  npm test          # Deterministic acceptance test suite
  npm run build     # Production Next.js build
  npm start         # Serves on http://localhost:3000
  ```
- **Sample Request:**
  - Query: `BA178` (or custom airport code `JFK`)
- **Expected Result:**
  - HTTP 200 JSON payload containing `verdict: "APPROVED_FOR_CLAIM"`, `eligibleCompensation: "€600"`, `badge: "FIXTURE"`.
- **Settlement Network:** Base Sepolia (EIP-155 Chain ID: `84532`).
- **Settlement Asset:** Circle USDC (`0x036CbD53842c5426634e7929541eC2318f3dCF7e`).
- **Unit Cost:** $0.01 USDC per verified departure weather intelligence query.
- **Supported Intent:** `TRAVEL_TRANSIT_LOCK_GENERAL` (`ttl-nws` 106005, `ttl-airsigmet` 106004).
- **Known Limitations:**
  - Coverage scope: US departures to Europe on EU/UK carriers (EU261/UK261 jurisdiction).
  - Draft claim letter only; does not provide formal legal representation or automated court filing.
  - Testnet environment (Base Sepolia Diamond settlement).

---

## 5. Protocol Evidence & Transaction Links
- **Telegraph Diamond Contract (Base Sepolia):**
  [`0x5a2324aA18613FAD4e44bDF0d6c73Ec1f6D87ff8`](https://sepolia.basescan.org/address/0x5a2324aA18613FAD4e44bDF0d6c73Ec1f6D87ff8)
- **Circle USDC Gate (Base Sepolia):**
  [`0x036CbD53842c5426634e7929541eC2318f3dCF7e`](https://sepolia.basescan.org/token/0x036CbD53842c5426634e7929541eC2318f3dCF7e)
- **Live Node Engine Dispatcher:**
  `http://13.237.89.59:7044` ([Subnets / Miners Index](http://13.237.89.59:7044/engine/v1/subnets))
- **Live Node x402 Probe Verification:**
  Run `npm run purchase:live` to verify HTTP 402 challenge negotiation on Base Sepolia.
- **Test Evidence:**
  - Run `npm test` to verify 100% passing rate across all 3 scenarios and anti-drain budget caps.

---

## 6. Public Updates & Educational Tutorial (20 Growth Points)
- **Public Technical Tutorial:**
  [`TUTORIAL.md`](file:///c:/Users/HP/Downloads/telegraph%20101/TUTORIAL.md) — *“SkyClaim · Technical Tutorial & Architecture Guide: Building an Autonomous Disruption Agent with x402 Micropayments”*
- **Public Builder Updates:**
  [`UPDATES.md`](file:///c:/Users/HP/Downloads/telegraph%20101/UPDATES.md) — 4 technical milestone dispatches covering demand architecture, EIP-712 challenges, multi-surface access, and fail-closed weather adjudication.

---

## 7. Showcase Permissions & Commercial Next Steps
- **Public Sharing Consent:** Yes. Telegraph may share the SkyClaim repository, screenshots, live demo link, and video across official channels (Twitter/X, Discord, Explorer, and Anjoman showcase).
- **Buyer Introductions:** Yes. Open to buyer introductions and commercial pilots with travel management companies, flight booking portals, and corporate travel expense desks.
