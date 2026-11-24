# Telegraph Hackathon Season II · Official Submission Form

## 1. Project Information
- **Project Name:** SkyClaim
- **Core Positioning:** *“SkyClaim checks the airline's most common excuse. When a transatlantic flight is delayed 3+ hours, it verifies weather alerts for the departure airport through Telegraph Protocol, validates operating carrier metal under UK261 and EU261 rules, and generates statutory claim dossiers with cryptographic settlement receipts. Operates across multiple surfaces via Web Dashboard and Telegram Bot (@SkyClaimprobot), with an enterprise pre-settlement compliance assurance engine (SolSettle) for high-value transfers. Gasless settlement on Base Sepolia (`84532`).”*
- **Competition Track:** Track 03: Apps & Agents
- **Target Commercial Mission:** Mission 15: Consumer Automation
- **Repository Link:** `https://github.com/kellycryptos/SkyClaim`
- **GitHub Username Starring Bounties Repo:** `kellycryptos` (starred `telegraphprotocol/bounties`)
- **Live Demo Link:** `http://localhost:3000` (Production: `https://skyclaimpro.vercel.app`)
- **Telegram Bot Access:** `@SkyClaimprobot` · Instant Terminal Simulator: `npm run bot:sim`

---

## 2. Evaluator Test Scenarios

### Part A: Core Consumer Flight Disruption (Track 03 / Mission 15)
- **CASE 1: CLEAN DELAY UNDER UK261 (Hypothetical `BA178` JFK → LHR)**  
  Operating carrier: **British Airways** (UK carrier arriving in the UK). Arrival delay: 3h 42m at destination (flight data: `FIXTURE`). Weather at departure corridor: clear (`FIXTURE`). The airline's weather excuse is not supported by evidence. Statutory regime: **UK261**. Verdict: `ELIGIBLE_FOR_CLAIM` (Eligible compensation: £260 to £520, subject to Article 7(2)(c) 50% discount for 3h–4h arrival delays on flights > 3,500 km. Draft claim template ready).

- **CASE 2: NON-EU OPERATING METAL EXCLUSION (Hypothetical `DL401` JFK → CDG)**  
  Operating carrier: **Delta Air Lines** (non-EU metal ex-USA). Marketing carrier: Air France / Delta codeshare. Arrival delay: 3h 30m at destination (flight data: `FIXTURE`, exceeds the 3-hour statutory threshold). Under EU261 Art. 3(1)(b), flights departing third countries (USA) are only covered if operated by an EU Community carrier. Delta operating metal is excluded regardless of codeshare. Verdict: `INELIGIBLE` ($0 spent, telemetry bypassed).

- **CASE 3: EXTRAORDINARY WEATHER DEFENSE & CONTESTED WORKFLOW (Hypothetical `AF112` ORD → CDG)**  
  Operating carrier: **Air France** (EU carrier arriving in the EU). Arrival delay: 4h 10m at destination (flight data: `FIXTURE`). Severe blizzard alert active at ORD departure hub (`FIXTURE`). Statutory regime: **EU261**. Verdict: `FAIL_CLOSED_WEATHER` with warning badge (`CONTESTED WEATHER DEFENSE`). Statutory baseline: **€600 (Subject to Art. 5(3) defense)**. Equips passenger with a specialized Contested Claim Template requesting carrier substantiation under *Case C-549/07 Wallentin-Hermann*.

### Part B: Multi-Surface Telegram Bot Evaluator Flow
- **EVALUATOR ZERO-CONFIG SIMULATOR (`npm run bot:sim`):**  
  Evaluators can verify the complete conversational workflow without configuring Telegram API keys. Interactive terminal simulator allows 1-click execution of BA178, DL401, AF112, statutory rights lookups, and real-time corridor telemetry formatting. Live bot runs at `@SkyClaimprobot`.

### Part C: Enterprise Feature: Pre-Settlement Assurance (SolSettle)
- **CASE S1: REGULATED PRIME BROKER SETTLEMENT ($250,000 USDC)**  
  FalconX Custody → Galaxy Institutional Desk. Live GLEIF Open API resolves active LEI registration (`549300VLM128XJ391Z82`), 0 sanctions hits across registries. Verdict: `SETTLEMENT_AUTHORIZED`.
- **CASE S2: INTERCEPTED SANCTIONED BENEFICIAL OWNER ($100,000 OTC Transfer)**  
  Treasury Desk → Volga Trading FZE. Flags OFAC SDN designated beneficial owner added in recent watchlist updates. Verdict: `FAIL_CLOSED_SANCTIONS` (Circuit-breaker engaged, $100k preserved).
- **CASE S3: LIVING RWA RESERVE DISCREPANCY ($500,000 USDY Redemption)**  
  Ondo USDY → Institutional Redemption Vault. Detects on-chain supply ($452.8M) vs off-chain bank reserves ($450.4M), revealing a $2.4M bank lien pending clarification. Verdict: `FAIL_CLOSED_RESERVE_DISCREPANCY`.

---

## 3. Short Commercial Summary (Season II Official 5 Questions)

### Question 1: Who is it for?
1. **Air Passengers & Corporate Travel Desks:** Travelers facing transatlantic delays on UK/EU carriers, eliminating spurious airline weather excuses with statutory proof.
2. **Mobile Users:** Frequent fliers accessing instant claim audits directly on Telegram via `@SkyClaimprobot`.
3. **Enterprise Desks (Feature):** Asset managers and corporate treasuries requiring pre-authorization entity verification (LEI) before high-value settlements execute.

### Question 2: What does it improve?
1. **Evidentiary Ground-Truth:** Replaces ambiguous airline denials with cryptographically verifiable meteorological telemetry and operating metal validation.
2. **Multi-Surface Accessibility:** Bridges Web3 protocol intelligence to ordinary consumers via web dashboard and native Telegram chat.
3. **Zero-Gas Consumer Experience:** Settles machine-to-machine micropayments gaslessly using EIP-712 x402 on Base Sepolia.

### Question 3: What does it do today?
1. **Operating Carrier Filtering:** Distinguishes marketing codeshares from operating aircraft under Regulation (EC) No 261/2004 Art. 3(1)(b).
2. **Departure Weather & Disruption Telemetry:** Queries Telegraph miners with secondary NOAA/FAA METAR cross-checking.
3. **Multi-Surface Interface:** Full web application plus interactive Telegram bot (`@SkyClaimprobot` / `npm run bot:sim`).
4. **Gasless On-Chain Settlement:** Executes EIP-712 x402 micropayments on Base Sepolia (`84532`) with Circle USDC ($0.01 USDC/call).
5. **Enterprise Compliance Feature:** Live GLEIF LEI lookup (`api.gleif.org`) and settlement assurance architecture.
6. **Verifiable Public Ledger:** Features live completed on-chain purchases on BaseScan alongside labeled benchmark fixtures.

### Question 4: Why would someone adopt it?
Passengers and corporate travel departments gain instant, legally grounded flight claim compensation dossiers (£260–£520 under UK261, €300–€600 under EU261) right from their phone or browser, preventing airlines from quietly pocketing billions in unclaimed statutory compensation.

### Question 5: How can someone try it?
1. Run `npm install && npm test` (Executes deterministic test vectors with 100% pass rate).
2. Run `npm run bot:sim` to test the Telegram bot flow in terminal.
3. Run `npm run purchase:live` to verify live Telegraph node x402 settlement.
4. Open `http://localhost:3000` to inspect the Web Terminal.

---

## 4. Protocol Evidence & Transaction Accounting
- **Telegraph Diamond Contract (Base Sepolia):** `0x5a2324aA18613FAD4e44bDF0d6c73Ec1f6D87ff8`
- **Circle USDC x402 Gate:** `0x036CbD53842c5426634e7929541eC2318f3dCF7e`
- **Live Node Engine:** `http://13.237.89.59:7044`
- **Live On-Chain Settlement 1:** [Basescan Tx 0x84ab1c...](https://sepolia.basescan.org/tx/0x84ab1cc501a8b125202e524ca4cae7dff02b7a112b95a9caf7ff3dda517b8145) · Signal: `0x3599e217...` · Miner: `a1-preflight` (`20260828`) · Intent: `TRAVEL_TRANSIT_LOCK_GENERAL` ($0.01 USDC)
- **Live On-Chain Settlement 2:** [Basescan Tx 0x1af69d...](https://sepolia.basescan.org/tx/0x1af69d658b1475570501718972e5787f6d9d930b1600705c1aaee8368ccb2e18) · Signal: `0xba23f2fd...` · Miner: `a1-preflight` (`20260828`) · Intent: `TRAVEL_TRANSIT_LOCK_GENERAL` ($0.01 USDC)
- **Live On-Chain Settlement 3:** [Basescan Tx 0xe76674...](https://sepolia.basescan.org/tx/0xe7667435800dd7b8ff7aed2f3246a131e1fe98c95cf22f00bc455c1ebb830002) · Signal: `0x0e4caede...` · Miner: `a1-preflight` (`20260828`) · Intent: `TRAVEL_TRANSIT_LOCK_GENERAL` ($0.01 USDC)
- **Live On-Chain Settlement 4 (FAA Disruption):** [Basescan Tx 0xca110a...](https://sepolia.basescan.org/tx/0xca110ae911f87e7fce5705b98768bee1d43a18fdff308106e01dfdb21fc55e45) · Signal: `0xc9733ebf...` · Miner: `TxLens` (`9002`) · Intent: `TRAVEL_DISRUPTION_GENERAL` ($0.01 USDC)
- **Protocol Verification Probe (Live x402 Settlement):** [Basescan Tx 0xe08fd1...](https://sepolia.basescan.org/tx/0xe08fd142ee4e3ad4a353e074615682c3b5c19c71b5d34a301ba81c9e6064d9db) · Signal: `0xc65b056a...` ($0.01 USDC, Block 62567078) · Protocol research probe validating live gasless EIP-712 challenge execution on Telegraph node rail
- **Live Secondary Cross-Check:** [aviationweather.gov METAR](https://aviationweather.gov/api/data/metar) · Live FAA/NOAA ground station feeds
- **Live Entity Resolution (Enterprise Feature):** [api.gleif.org](https://api.gleif.org) · Live Global Legal Entity Identifier Foundation registry
- **Cost Charged:** $0.01 USDC per verified check on Base Sepolia.

---

## 5. Technical Documentation & Tutorials

1. **Technical Tutorial & Architecture Walkthrough:**
   - Detailed walkthrough: [`TUTORIAL.md`](file:///c:/Users/HP/Downloads/telegraph%20101/TUTORIAL.md)
   - Covers statutory flight compensation rules (UK261 vs EU261), operating carrier metal verification, x402 gasless EIP-712 challenge negotiation on Base Sepolia, and honest data boundaries.

2. **Zero-Config Ease of Adoption:**
   - 1-click zero-barrier reproduction: `npm install && npm test && npm run bot:sim`.
   - Sterile container resilience (runs without `.env` using deterministic labeled fixtures).
   - Financial guardrails ($0.05/call hard cap, $5.00 daily cap) and cost transparency.

---

## 6. Showcase Permissions & Commercial Next Steps
- **Public Sharing Consent:** Yes. Telegraph may share the SkyClaim repository, screenshots, live demo link, and tutorial across official channels (Twitter/X, Discord, Explorer, and Anjoman showcase).
- **Buyer Introductions:** Yes. Open to buyer introductions and commercial pilots with travel management companies, flight booking portals, and corporate travel expense desks.
