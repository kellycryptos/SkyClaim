# Telegraph Hackathon Season II · Official Submission Form

## 1. Project Information
- **Project Name:** SkyClaim
- **Competition Track:** Track 03: Apps & Agents
- **Target Commercial Mission:** Mission 15: Consumer Automation
- **Repository Link:** (Your GitHub Repo URL)
- **Live Demo Link:** `http://localhost:3000` (or hosted Vercel deployment)
- **Telegram Bot Handle:** `@SkyClaimBot` (or run locally via `npm run bot:sim`)
- **GitHub Username (that starred bounties repo):** `[Your GitHub Username]`

---

## 2. Short Commercial Summary (Season II Official 5 Questions)

### Question 1: Who is it for?
Airline passengers, corporate travel managers, and business travel desks who suffer flight delays and cancellations. Under EU261 and UK261 regulations, passengers on long-haul delays (>3 hours) are legally entitled to €600 (£520) cash compensation, but over 85% of eligible travelers never claim due to cumbersome airline portals and frequent airline denials.

### Question 2: What does it improve?
Replaces 45-day claims agencies (who take 35-50% cuts) with an **autonomous 20-second verification loop costing $0.02 USDC**. By buying flight transit telemetry and meteorological hazard screening in parallel, SkyClaim proves the delay and disproves the airline's standard Article 5(3) "extraordinary weather circumstances" defense before filing.

### Question 3: What does it do today?
1. Accepts flight number and date via Telegram or Web.
2. Dispatches 2 parallel x402 purchases on Base Sepolia (`TRAVEL_TRANSIT_LOCK_GENERAL` and `STORM_ALERT_GENERAL`).
3. Evaluates consensus across 3 explicit outcomes:
   - **Approved:** Delay $\ge$ 180 min and clear weather $\to$ generates EU261/UK261 claim pack with transaction receipts.
   - **Ineligible:** Delay $<$ 180 min $\to$ clean on-time schedule rejection.
   - **Fail-Closed Conflict:** Delay $\ge$ 180 min with severe storm alerts $\to$ halts automated filing, flags airline's weather defense, and outputs appeal dossier.
4. Settles micro-payments via Circle USDC on Base Sepolia with cryptographic receipts.

### Question 4: Why would someone adopt it?
Passengers recover hundreds in rightful statutory refunds instantly with zero commissions, while corporate desks automate disruption recovery across entire travel itineraries with cryptographic proof.

### Question 5: How can someone try it?
1. Clone the repo and run `npm install && npm test && npm run build && npm start`.
2. Open `http://localhost:3000` to test the 3 one-click reviewer presets (BA178, DL401, AF112).
3. Run `npm run bot:sim` to test the full Telegram bot flow in terminal.

---

## 3. Protocol Evidence & Transaction Accounting
- **Telegraph Diamond Contract (Base Sepolia):** `0x5a2324aA18613FAD4e44bDF0d6c73Ec1f6D87ff8`
- **Circle USDC x402 Gate:** `0x036CbD53842c5426634e7929541eC2318f3dCF7e`
- **Live Telegraph Node:** `http://13.237.89.59:7044` (2,189 miners indexed)
- **Miner 1 (Transit):** `ttl-nws` (`m-106005`) for `TRAVEL_TRANSIT_LOCK_GENERAL` ($0.01)
- **Miner 2 (Weather):** `SkyWire MET Norway` (`m-79335`) for `STORM_ALERT_GENERAL` ($0.01)
- **Total Unit Cost:** $0.02 USDC per verified disruption check.

---

## 4. Judging Demo Walkthrough Script (2–3 Minutes)
1. **0:00 - 0:30**: Problem Hook — Airlines owe passengers €600 for 3h+ delays under EU261, but claim processes are manual and airlines contest them with weather excuses.
2. **0:30 - 1:15**: 1-Click Approved Case (`BA178`) — Bot buys 2 Telegraph miner queries, confirms +3h 35m delay, confirms zero weather alerts, and generates the €600 claim pack with BaseScan receipts.
3. **1:15 - 1:45**: 1-Click On-Time Case (`DL401`) — Flight arrived +14m, bot rejects claim cleanly, saving user time and money.
4. **1:45 - 2:30**: 1-Click Conflict Case (`AF112`) — Flight delayed 4h, but weather miner detects severe blizzard at ORD. Bot fails-closed, preventing a rejected claim and producing an appeal dossier.
5. **2:30 - 3:00**: The Receipt Box — Show on-chain Diamond contract, Base Sepolia explorer permalinks, and zero-config sandbox pass.
