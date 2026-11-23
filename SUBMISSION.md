# Telegraph Hackathon Season II · Official Submission Form

## 1. Project Information
- **Project Name:** SkyClaim
- **Core Positioning:** *“SkyClaim checks the airline's most common excuse. When a transatlantic flight is delayed 3+ hours, it verifies weather alerts for both departure and arrival airports through Telegraph Protocol, validates the operating carrier metal under EU261/UK261 rules, and generates instant statutory claim dossiers with cryptographic settlement receipts. Draft only, not legal advice. Coverage: US departures to Europe on EU/UK operating carriers. Testnet on Base Sepolia.”*
- **Competition Track:** Track 03: Apps & Agents
- **Target Commercial Mission:** Mission 15: Consumer Automation
- **Repository Link:** `https://github.com/kellycryptos/SkyClaim`
- **Live Demo Link:** `http://localhost:3000`
- **Telegram Bot Handle:** `@SkyClaimBot` (or run locally via `npm run bot:sim`)

---

## 2. The 3 Evaluator Test Scenarios

- **CASE 1: CLEAN DELAY (Hypothetical `BA178` JFK → LHR)**  
  Operating carrier: **British Airways** (UK/EU Community metal). Arrival delay: 3h 42m at destination (flight data: `FIXTURE`). Weather at departure and arrival: clean corridors (`FIXTURE`). The airline's weather excuse is not supported by evidence. Verdict: `ELIGIBLE_FOR_CLAIM` (Eligible compensation to be checked under EU261 Article 7: €300 to €600, subject to Article 7(2)(c) 50% discount for 3h–4h arrival delays on flights > 3,500 km. Draft claim ready).

- **CASE 2: MINOR DELAY & NON-EU OPERATING METAL (Hypothetical `DL401` JFK → CDG)**  
  Operating carrier: **Delta Air Lines** (non-EU metal ex-USA). Marketing carrier: Air France / Delta codeshare. Arrival delay: 1h 05m at destination (flight data: `FIXTURE`). Under EU261 Art. 3(1)(b) & CJEU Case C-502/18, flights departing third countries are only covered if operated by EU/UK metal. Delta operating metal is excluded regardless of codeshare. Delay is also below 3h. Verdict: `INELIGIBLE` ($0 spent, telemetry bypassed).

- **CASE 3: DELAY WITH WEATHER RISK & CONTESTED WORKFLOW (Hypothetical `AF112` ORD → CDG)**  
  Operating carrier: **Air France** (EU carrier). Arrival delay: 4h 10m at destination (flight data: `FIXTURE`). Severe blizzard alert active at ORD departure hub (`FIXTURE`). The airline will assert an extraordinary circumstances defense under Article 5(3). Verdict: `FAIL_CLOSED_WEATHER` with warning badge (`CONTESTED WEATHER DEFENSE`). Compensation range: **€300 – €600 (Contested Art. 5(3))**. SkyClaim equips the passenger with a specialized Contested Claim Notice challenging whether other carriers departed on time (*Wallentin-Hermann* standard).

---

## 3. Short Commercial Summary (Season II Official 5 Questions)

### Question 1: Who is it for?
Passengers, corporate travel managers, and consumer advocates handling transatlantic flights from the US to Europe on EU/UK carriers. When a flight is delayed 3+ hours on arrival, passengers may be legally entitled to €300–€600 in compensation under EU261/UK261, but airlines routinely deny claims citing weather.

### Question 2: What does it improve?
Automates verification at the moment of delay. Airlines exaggerate weather delays, cite distant weather, or obscure whether other flights departed. SkyClaim purchases dual-hub weather telemetry (departure & arrival) through Telegraph Protocol for $0.01 USDC, cross-checks against ground station METARs, validates operating metal on codeshares, and prevents false denials.

### Question 3: What does it do today?
1. **Operating Carrier Filtering:** Distinguishes marketing codeshares from actual operating aircraft under CJEU Case C-502/18, preventing false claims on US metal (e.g. Delta).
2. **Dual-Hub Weather Telemetry:** Evaluates both departure and arrival corridors via Telegraph Protocol (`TRAVEL_TRANSIT_LOCK_GENERAL`) and cross-checks with `aviationweather.gov`.
3. **Contested Claim Generation:** Changes weather fail-closed from an absolute €0 dead-end to a contested claim dossier under CJEU Case C-549/07 (*Wallentin-Hermann*).
4. **On-Chain Settlement:** Executes gasless EIP-712 x402 micropayments on Base Sepolia (`84532`) with Circle USDC ($0.01 USDC/call, hard caps: $0.05/call, $5.00 daily).
5. **Verifiable Public Ledger:** Features real completed on-chain purchases with verified BaseScan transaction hashes alongside labeled benchmark fixtures.

### Question 4: Why would someone adopt it?
Corporate travel departments and passengers gain instant, cryptographically verifiable proof of flight delays and dual-hub meteorological conditions, converting ambiguous airline denials into substantiated statutory claims.

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
- **Live On-Chain Settlement 1:** [Basescan Tx 0x3599e2...](https://sepolia.basescan.org/tx/0x3599e21750665fe443e0db847d383ff0ae0045c5ded530b63f34e2e256d7dbe9) · Miner: PREFLIGHT (`20260828`)
- **Live On-Chain Settlement 2:** [Basescan Tx 0xba23f2...](https://sepolia.basescan.org/tx/0xba23f2fdc54173f0a5f2ce08b22e9efb1b4f46060be3361028d4f3774104c444) · Miner: PREFLIGHT (`20260828`)
- **Live On-Chain Settlement 3:** [Basescan Tx 0x0e4cae...](https://sepolia.basescan.org/tx/0x0e4caede1b9c7d7f5b5117e11f1c5d149c73cace14062bc04f419c44172771bb) · Miner: PREFLIGHT (`20260828`)
- **Verified Live x402 Purchase:** [Basescan Tx 0xe08fd1...](https://sepolia.basescan.org/tx/0xe08fd142ee4e3ad4a353e074615682c3b5c19c71b5d34a301ba81c9e6064d9db) · Signal: `0xc65b056a...` ($0.01 USDC, Miner: 742101)
- **Cost Charged:** $0.01 USDC per verified check on Base Sepolia.
