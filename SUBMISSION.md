# Telegraph Hackathon Season II · Official Submission Form

## 1. Project Information
- **Project Name:** SkyClaim & SolSettle
- **Core Positioning:** *“Autonomous Verification & Settlement Assurance powered by Telegraph Protocol. SkyClaim verifies transatlantic flight disruption telemetry and enforces operating carrier rules under UK261/EU261 with cryptographic settlement receipts. SolSettle operates as a pre-authorization compliance firewall for high-value Solana settlements, intercepting sanctioned beneficial owners and living RWA bank reserve discrepancies before execution. Dual testnet on Base Sepolia (`84532`) and Solana Devnet via Pay.sh.”*
- **Competition Tracks:** 
  - Track 03: Apps & Agents · Commercial Mission 15 (Consumer Automation)
  - Solana Institutional Priority Track (Use Case #1: Transaction Intelligence, Use Case #2: Living RWA Intelligence, Use Case #3: Telegraph × Pay.sh)
- **Repository Link:** `https://github.com/kellycryptos/SkyClaim`
- **Live Demo Link:** `http://localhost:3000`
- **Telegram Bot Simulator:** `npm run bot:sim` (or `@SkyClaimBot` when token configured)

---

## 2. The 6 Evaluator Test Scenarios

### Part A: Consumer Flight Disruption (Track 03 / Mission 15)
- **CASE 1: CLEAN DELAY UNDER UK261 (Hypothetical `BA178` JFK → LHR)**  
  Operating carrier: **British Airways** (UK carrier arriving in the UK). Arrival delay: 3h 42m at destination (flight data: `FIXTURE`). Weather at departure corridor: clear (`FIXTURE`). The airline's weather excuse is not supported by evidence. Statutory regime: **UK261**. Verdict: `ELIGIBLE_FOR_CLAIM` (Eligible compensation: £260 to £520, subject to Article 7(2)(c) 50% discount for 3h–4h arrival delays on flights > 3,500 km. Draft claim template ready).

- **CASE 2: NON-EU OPERATING METAL EXCLUSION (Hypothetical `DL401` JFK → CDG)**  
  Operating carrier: **Delta Air Lines** (non-EU metal ex-USA). Marketing carrier: Air France / Delta codeshare. Arrival delay: 3h 30m at destination (flight data: `FIXTURE`, exceeds the 3-hour statutory threshold). Under EU261 Art. 3(1)(b), flights departing third countries (USA) are only covered if operated by an EU Community carrier. Delta operating metal is excluded regardless of codeshare. Verdict: `INELIGIBLE` ($0 spent, telemetry bypassed).

- **CASE 3: EXTRAORDINARY WEATHER DEFENSE & CONTESTED WORKFLOW (Hypothetical `AF112` ORD → CDG)**  
  Operating carrier: **Air France** (EU carrier arriving in the EU). Arrival delay: 4h 10m at destination (flight data: `FIXTURE`). Severe blizzard alert active at ORD departure hub (`FIXTURE`). Statutory regime: **EU261**. Verdict: `FAIL_CLOSED_WEATHER` with warning badge (`CONTESTED WEATHER DEFENSE`). Statutory baseline: **€600 (Subject to Art. 5(3) defense)**. Equips passenger with a specialized Contested Claim Template requesting carrier substantiation under *Case C-549/07 Wallentin-Hermann*.

### Part B: Solana Institutional Settlement Assurance (Solana Priority Track)
- **CASE S1: REGULATED PRIME BROKER SETTLEMENT ($250,000 USDC)**  
  FalconX Custody → Galaxy Institutional Desk. Telegraph compliance miner `a1-compliance-validator` resolves active GLEIF LEI registration (`549300VLM128XJ391Z82`), 0 sanctions hits across OFAC/EU/UK registries. Verdict: `SETTLEMENT_AUTHORIZED` (Cleared on Solana, Pay.sh verified receipt).

- **CASE S2: INTERCEPTED SANCTIONED BENEFICIAL OWNER ($100,000 OTC Transfer)**  
  Treasury Desk → Volga Trading FZE. Telegraph compliance miner `TxLens-compliance` catches updated OFAC SDN designated beneficial owner added in latest watchlist update. Static on-chain whitelists were blind to this update. Verdict: `FAIL_CLOSED_SANCTIONS` (Circuit-breaker engaged, $100k funds preserved, emergency compliance dossier generated).

- **CASE S3: LIVING RWA RESERVE DISCREPANCY ($500,000 USDY Redemption)**  
  Ondo USDY (Solana Token-2022) → Institutional Redemption Vault. Telegraph Living Asset miner `a1-rwa-auditor` detects divergence: on-chain supply ($452.8M) vs off-chain bank reserves ($450.4M), revealing a $2.4M bank custodial lien pending audit clarification. Verdict: `FAIL_CLOSED_RESERVE_DISCREPANCY` (Redemption halted before institutional collateral commitment).

---

## 3. Short Commercial Summary (Season II Official 5 Questions)

### Question 1: Who is it for?
1. **Consumers & Corporate Travel Desks:** Passengers and corporate travel desks facing transatlantic delays on UK/EU carriers, eliminating spurious airline weather excuses.
2. **Institutional Desks & Solana Custodians:** Asset managers, custodians (Squads multisig, prime brokers), and RWA issuers on Solana needing pre-authorization compliance and living asset reserve verification before high-value settlements execute.

### Question 2: What does it improve?
1. **Evidentiary Ground-Truth:** Replaces ambiguous airline denials with cryptographically verifiable meteorological telemetry and operating metal validation.
2. **Settlement Assurance on Solana:** Eliminates the fatal blind spot of blockchain settlement: smart contracts verify on-chain balances but cannot see off-chain entity sanctions, bank reserve liens, or regulatory freeze orders.

### Question 3: What does it do today?
1. **Operating Carrier Filtering:** Distinguishes marketing codeshares from operating aircraft under Regulation (EC) No 261/2004 Art. 3(1)(b).
2. **Departure Weather & Disruption Telemetry:** Queries Telegraph miners with secondary NOAA/FAA METAR cross-checking.
3. **Institutional Pre-Flight Firewall:** Evaluates GLEIF LEI registrations, OFAC SDN lists, and RWA bank reserves.
4. **Dual-Rail Micropayments:** Settles gasless EIP-712 x402 on Base Sepolia (`84532`) and Solana Devnet/Mainnet via Pay.sh ($0.01 USDC/call).
5. **Verifiable Public Ledgers:** Features live completed on-chain purchases on BaseScan and SolScan alongside 6 labeled benchmark fixtures.

### Question 4: Why would someone adopt it?
Corporate travel departments gain instant, legally grounded flight claim compensation dossiers, while Solana institutional desks prevent catastrophic irreversible settlement errors and regulatory fines.

### Question 5: How can someone try it?
1. Run `npm install && npm test` (Executes all 6 deterministic test vectors with 100% pass rate).
2. Run `npm run purchase:live` to verify live Telegraph node x402 settlement.
3. Open `http://localhost:3000` to toggle between Consumer Flight Shield and Solana Institutional SISA.
4. Run `npm run bot:sim` to test the Telegram bot flow in terminal.

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
