# Telegraph Hackathon Season II · Official Submission Form

## 1. Project Information
- **Project Name:** SkyClaim
- **Core Positioning:** *“SkyClaim only files a claim when two independent Telegraph miners agree the delay is eligible and weather does not give the airline a free pass. Otherwise it fails closed and tells you not to bother.”*
- **Competition Track:** Track 03: Apps & Agents
- **Target Commercial Mission:** Mission 15: Consumer Automation
- **Repository Link:** (Your GitHub Repo URL)
- **Live Demo Link:** `http://localhost:3000` (or hosted Vercel deployment)
- **Telegram Bot Handle:** `@SkyClaimBot` (or run locally via `npm run bot:sim`)
- **GitHub Username (that starred bounties repo):** `[Your GitHub Username]`

---

## 2. The 60-Second Differentiator: SkyClaim vs. Receipts Desk

| Feature Dimension | Generic Tools (e.g. Receipts Desk) | SkyClaim (Dual-Miner Consensus) |
| :--- | :--- | :--- |
| **Intelligence Architecture** | Single-source check against official data | **Two-Miner Consensus** (`TRAVEL_TRANSIT_LOCK` + `STORM_ALERT`) |
| **Adjudication Behavior** | Blindly drafts claims on any delay | **Fail-Closed Weather Defense**: Halts if weather gives airline an Article 5(3) free pass |
| **Regulatory Engine** | Vague US DOT focus (discretionary vouchers) | **EU261 / UK261 Precision**: Statutory cash (€250–€600) with strict carrier liability |
| **Recommendation Clarity** | Always says "File Claim" (even doomed ones) | **Explicit Recommendations**: `GREENLIGHT TO FILE` vs. `DO NOT FILE — High Rejection Risk` |
| **User Interfaces** | Web-only or bot-only | **Telegram-First + 1-Click Judge Presets + Web Terminal Mirror** |
| **Public Transparency** | Black-box private queries | **Public Claim Board**: Live recovery ledger with on-chain BaseScan receipts |
| **Unit Economics** | Unverified API costs | **$0.02 USDC settled per consensus check** via gasless EIP-712 on Base Sepolia |

---

## 3. Short Commercial Summary (Season II Official 5 Questions)

### Question 1: Who is it for?
Airline passengers, corporate travel managers, and business travel desks who suffer flight delays and cancellations. Under EU261 and UK261 regulations, passengers on long-haul delays (>3 hours) are legally entitled to **€600 (£520)** cash compensation, but over 85% of eligible travelers never claim due to cumbersome airline portals and frequent airline denials under Article 5(3) "weather circumstances".

### Question 2: What does it improve?
Replaces 45-day claims agencies (who take 35-50% cuts) with an **autonomous 20-second verification loop costing $0.02 USDC**. By buying flight transit telemetry and meteorological hazard screening in parallel, SkyClaim proves the delay and pre-emptively disproves the airline's standard Article 5(3) "extraordinary weather circumstances" defense before filing.

### Question 3: What does it do today?
1. Accepts flight number and date via Telegram or Web UI.
2. Dispatches 2 parallel x402 purchases on Base Sepolia (`TRAVEL_TRANSIT_LOCK_GENERAL` and `STORM_ALERT_GENERAL`).
3. Evaluates consensus across 3 explicit outcomes:
   - **Scenario 1 (BA178):** Delay $\ge$ 180 min and clear weather $\to$ **`✅ GREENLIGHT TO FILE`** (€600 claim pack + 2 receipts).
   - **Scenario 2 (DL401):** Delay $<$ 180 min $\to$ **`⏹️ DO NOT FILE — INELIGIBLE`** (saved $0.02 and bureaucracy).
   - **Scenario 3 (AF112 - Hero):** Delay $\ge$ 180 min with severe storm alerts $\to$ **`⛔ DO NOT FILE — HIGH REJECTION RISK`** (fails-closed, preventing doomed claim while generating dispute dossier).
4. Settles micro-payments via Circle USDC on Base Sepolia with cryptographic receipts.
5. Publishes anonymized disruption data to the **Public Claim Board / Recovery Ledger**.

### Question 4: Why would someone adopt it?
Passengers recover hundreds in rightful statutory refunds instantly with zero commissions, while corporate desks automate disruption recovery across entire travel itineraries with cryptographic proof and protect themselves from filing doomed claims.

### Question 5: How can someone try it?
1. Clone the repo and run `npm install && npm test && npm run build && npm start`.
2. Open `http://localhost:3000` to test the 3 one-click reviewer presets and view the Public Claim Board.
3. Run `npm run bot:sim` to test the full Telegram bot flow in terminal.

---

## 4. Protocol Evidence & Transaction Accounting
- **Telegraph Diamond Contract (Base Sepolia):** `0x5a2324aA18613FAD4e44bDF0d6c73Ec1f6D87ff8`
- **Circle USDC x402 Gate:** `0x036CbD53842c5426634e7929541eC2318f3dCF7e`
- **Live Telegraph Node:** `http://13.237.89.59:7044` (2,189 miners indexed)
- **Miner 1 (Transit):** `ttl-nws` (`m-106005`) for `TRAVEL_TRANSIT_LOCK_GENERAL` ($0.01)
- **Miner 2 (Weather):** `SkyWire MET Norway` (`m-79335`) for `STORM_ALERT_GENERAL` ($0.01)
- **Total Unit Cost:** $0.02 USDC per verified disruption check.

---

## 5. Judging Demo Walkthrough Script (2–3 Minutes)
1. **0:00 - 0:25**: **Problem & Positioning Hook** — *"SkyClaim only files a claim when two independent Telegraph miners agree the delay is eligible and weather does not give the airline a free pass. Otherwise it fails closed and tells you not to bother."*
2. **0:25 - 1:15**: **The Hero Conflict Case (`AF112`)** — Flight delayed 4h, but weather miner detects severe blizzard at ORD. Bot triggers fail-closed consensus: `⛔ DO NOT FILE — HIGH REJECTION RISK`. Show how single-source bots fail here while SkyClaim protects the user.
3. **1:15 - 1:55**: **1-Click Approved Case (`BA178`)** — Dual miners agree: +3h 35m delay and clear skies. SkyClaim issues `✅ GREENLIGHT TO FILE`, generating the €600 claim pack with BaseScan receipts.
4. **1:55 - 2:20**: **1-Click On-Time Case (`DL401`)** — Flight arrived +14m. Bot halts with `⏹️ DO NOT FILE — INELIGIBLE`, saving time and fees.
5. **2:20 - 2:45**: **Public Claim Board** — Showcase live recovery ledger with €14,450 approved and on-chain BaseScan receipts.
6. **2:45 - 3:00**: **The Receipt Box** — Show Base Sepolia Diamond contract, Circle USDC x402 settlement, and zero-config sandbox pass.
