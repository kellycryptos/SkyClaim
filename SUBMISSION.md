# Telegraph Hackathon Season II · Official Submission Form

## 1. Project Information
- **Project Name:** SkyClaim
- **Core Positioning:** *“SkyClaim checks the airline's most common excuse. When a transatlantic flight is delayed 3+ hours, it verifies weather alerts for the departure airport through Telegraph Protocol, validates the operating carrier metal under UK261 and EU261 rules, and generates statutory claim dossiers with cryptographic settlement receipts. Draft template only, not legal advice. Coverage: US departures to Europe on UK/EU operating carriers. Testnet on Base Sepolia.”*
- **Competition Track:** Track 03: Apps & Agents
- **Target Commercial Mission:** Mission 15: Consumer Automation
- **Repository Link:** `https://github.com/kellycryptos/SkyClaim`
- **Live Demo Link:** `http://localhost:3000`
- **Telegram Bot Simulator:** `npm run bot:sim` (or `@SkyClaimBot` when token configured)

---

## 2. The 3 Evaluator Test Scenarios

- **CASE 1: CLEAN DELAY UNDER UK261 (Hypothetical `BA178` JFK → LHR)**  
  Operating carrier: **British Airways** (UK carrier arriving in the UK). Arrival delay: 3h 42m at destination (flight data: `FIXTURE`). Weather at departure corridor: clear (`FIXTURE`). The airline's weather excuse is not supported by evidence. Statutory regime: **UK261** (The Air Passenger Rights and Air Travel Organisers' Licensing Regulations 2019). Verdict: `ELIGIBLE_FOR_CLAIM` (Eligible compensation under UK261 Article 7: £260 to £520, subject to Article 7(2)(c) 50% discount for 3h–4h arrival delays on flights > 3,500 km. Draft claim template ready).

- **CASE 2: NON-EU OPERATING METAL EXCLUSION (Hypothetical `DL401` JFK → CDG)**  
  Operating carrier: **Delta Air Lines** (non-EU metal ex-USA). Marketing carrier: Air France / Delta codeshare. Arrival delay: 3h 30m at destination (flight data: `FIXTURE`, exceeds the 3-hour statutory threshold). Under EU261 Art. 3(1)(b), flights departing third countries (USA) are only covered if operated by an EU Community carrier. Delta operating metal is excluded regardless of codeshare. Delay exceeds 3 hours, but claim is barred by operating metal. Verdict: `INELIGIBLE` ($0 spent, telemetry bypassed).

- **CASE 3: EXTRAORDINARY WEATHER DEFENSE & CONTESTED WORKFLOW (Hypothetical `AF112` ORD → CDG)**  
  Operating carrier: **Air France** (EU carrier arriving in the EU). Arrival delay: 4h 10m at destination (flight data: `FIXTURE`). Severe blizzard alert active at ORD departure hub (`FIXTURE`). Statutory regime: **EU261**. The airline will assert an extraordinary circumstances defense under Article 5(3). Verdict: `FAIL_CLOSED_WEATHER` with warning badge (`CONTESTED WEATHER DEFENSE`). Statutory baseline: **€600 (Subject to Art. 5(3) defense)**. SkyClaim equips the passenger with a specialized Contested Claim Template requesting carrier substantiation under *Case C-549/07 Wallentin-Hermann* that all reasonable measures were taken.

---

## 3. Short Commercial Summary (Season II Official 5 Questions)

### Question 1: Who is it for?
Passengers, corporate travel managers, and consumer advocates handling transatlantic flights from the US to Europe on UK/EU carriers. When a flight is delayed 3+ hours on arrival, passengers may be legally entitled to statutory compensation (£260–£520 under UK261, €300–€600 under EU261), but airlines routinely cite weather to reject claims.

### Question 2: What does it improve?
Automates evidentiary screening at the moment of delay. Airlines frequently assert extraordinary weather circumstances without providing flight-specific evidence. SkyClaim purchases departure corridor weather and disruption telemetry (`TRAVEL_TRANSIT_LOCK_GENERAL` and `TRAVEL_DISRUPTION_GENERAL`) through Telegraph Protocol for $0.01 USDC, cross-checks against NOAA/FAA ground station METARs, validates operating metal on codeshares, and prevents false denials.

### Question 3: What does it do today?
1. **Operating Carrier Filtering:** Distinguishes marketing codeshares from actual operating aircraft under Regulation (EC) No 261/2004 Art. 3(1)(b), preventing false claims on US metal (e.g. Delta).
2. **Departure Weather & Disruption Telemetry:** Evaluates departure airport corridors via Telegraph Protocol miners and cross-checks with `aviationweather.gov`.
3. **Contested Claim Template:** Changes weather fail-closed from an absolute dead-end into a structured inquiry template based on established jurisprudence (*Case C-549/07 Wallentin-Hermann*).
4. **On-Chain Settlement:** Executes gasless EIP-712 x402 micropayments on Base Sepolia (`84532`) with Circle USDC ($0.01 USDC/call, hard caps: $0.05/call, $5.00 daily).
5. **Verifiable Public Ledger:** Features completed on-chain purchases with verified BaseScan transaction hashes alongside labeled benchmark fixtures.

### Question 4: Why would someone adopt it?
Corporate travel departments and passengers gain instant, cryptographically verifiable proof of flight delays and departure meteorological conditions, converting ambiguous airline denials into substantiated statutory claims.

### Question 5: How can someone try it?
1. Run `npm install && npm test`.
2. Run `npm run purchase:live` to verify live Telegraph node x402 settlement on Base Sepolia.
3. Open `http://localhost:3000` to inspect the 3 deterministic presets or test custom corridors.
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
