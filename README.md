# SkyClaim · Autonomous Flight Disruption Verifier (Telegraph Protocol Season II)

> **SkyClaim checks the airline's most common excuses before they can stall your claim.** When a transatlantic flight is delayed 3+ hours, SkyClaim verifies dual-hub meteorological conditions (departure and arrival corridors) via Telegraph Protocol, validates the operating carrier metal under EU261/UK261 rules, and generates instant statutory claim dossiers with cryptographic settlement receipts. Draft only, not legal advice. Testnet on Base Sepolia.

---

## ⚡ Positioning & Purpose

- **Supported Scope:** Same-day US departures to Europe on EU and UK operating carriers (e.g. British Airways, Air France, Virgin Atlantic, Lufthansa departing JFK, ORD, BOS).
- **Operating Metal Enforcement:** Ex-US departures under EU261 Regulation (EC) 261/2004 Art. 3(1)(b) & CJEU Case C-502/18 (*CS and Others v České aerolinie*) only apply if the **operating carrier** is an EU/UK airline. A transatlantic codeshare marketed by Air France but flown on Delta metal is strictly excluded. SkyClaim separates marketing codeshares from operating metal to prevent false positives.
- **Dual-Hub Weather Telemetry:** Transatlantic delays routinely stem from either departure weather or destination congestion. SkyClaim purchases corridor intelligence covering both hubs and runs a secondary station cross-check (`aviationweather.gov` / NOAA station feeds).
- **Contested Claim Workflow:** When an airline asserts weather under Article 5(3), SkyClaim flags the claim with a warning badge as **`CONTESTED CLAIM`** (€300–€600 eligible range) rather than a dead €0. Under CJEU Case C-549/07 (*Wallentin-Hermann v Alitalia*), weather alerts do not excuse an airline if other flights operated or reasonable measures were omitted.
- **Settlement Network:** Settles gasless EIP-712 / x402 micro-payments on **Base Sepolia (Chain ID: 84532)** in Circle USDC ($0.01 USDC / check, capped at $0.05 / call, $5.00 daily spend).

---

## 🏷️ The Data Badge Table

SkyClaim strictly enforces honest data boundaries. Every result displays exactly **one** badge, and no preset or simulated mode ever invents fake miner receipts or placeholder transaction hashes:

| Badge | Data Origin | Miner ID & Tx Links | On-Chain Cost | Meaning & Handling |
| :--- | :--- | :--- | :--- | :--- |
| **`LIVE`** | Live Telegraph node purchase (`/engine/v1/ask`) | **Displayed** (Real Base Sepolia transaction hashes) | **$0.01 USDC** (Base Sepolia) | Real on-chain x402 purchase settled via EIP-712 with Circle USDC on Base Sepolia. Linked directly to Basescan. |
| **`SIMULATED`** | Free-input query when no credentials configured | **None** (No placeholder hashes) | **$0.00** | Explicitly displays simulated notice: *"Simulated baseline corridor report for zero-config evaluation."* |
| **`FIXTURE`** | Deterministic acceptance test vectors (Cases 1, 2 & 3) | **None** (No fake receipts) | **$0.00** | Pre-configured flight & weather data for instant zero-config reviewer testing without wallet drain. |

---

## 🎯 The 3 Reviewer Acceptance Cases

Reviewers can verify all 3 deterministic cases in 1-click on the web UI or terminal simulator:

1. **CASE 1: CLEAN DELAY (Hypothetical `BA178` JFK → LHR)**
   - Route & Operating Carrier: New York JFK → London LHR (5,550 km) · Operating metal: **British Airways** (UK/EU carrier)
   - Arrival Delay: 3h 42m at destination (Flight data: `FIXTURE`)
   - Weather Telemetry: Clear departure corridor at JFK and normal arrivals at LHR (`FIXTURE`)
   - Statutory Verdict: **`ELIGIBLE_FOR_CLAIM`**
   - Statutory Compensation to be Checked: **€300 – €600** (Flight distance > 3,500 km. Under EU261 Article 7(2)(c), if arrival delay is between 3 and 4 hours, statutory compensation of €600 may be discounted by 50% to €300. Draft claim ready).
   - Badge: **`FIXTURE`** (Zero-cost test vector)

2. **CASE 2: MINOR DELAY & NON-EU OPERATING METAL (Hypothetical `DL401` JFK → CDG)**
   - Route & Carriers: New York JFK → Paris CDG (5,835 km) · Marketing: Air France / Delta · Operating metal: **Delta Air Lines**
   - Arrival Delay: 1h 05m at destination (Flight data: `FIXTURE`)
   - Operating Metal Rule: Under EU261 Art. 3(1)(b) & CJEU Case C-502/18, flights departing third countries are only covered if operated by EU/UK metal. Delta operating metal is excluded regardless of codeshare.
   - Statutory Verdict: **`INELIGIBLE`** (€0 eligible compensation, $0 spent, telemetry bypassed)
   - Badge: **`FIXTURE`**

3. **CASE 3: DELAY WITH WEATHER RISK (Hypothetical `AF112` ORD → CDG)**
   - Route & Operating Carrier: Chicago ORD → Paris CDG (6,670 km) · Operating metal: **Air France** (EU carrier)
   - Arrival Delay: 4h 10m at destination (Flight data: `FIXTURE`)
   - Weather at Departure: Severe blizzard ground-stop alert active at ORD hub (`FIXTURE`)
   - Statutory Verdict: **`FAIL_CLOSED_WEATHER`** (Warning badge: `CONTESTED WEATHER DEFENSE`)
   - Compensation Range: **€300 – €600 (Contested Art. 5(3))** — Generates a specialized Contested Claim Notice challenging whether other carriers operated from ORD or whether reasonable measures were omitted (*Wallentin-Hermann* standard).
   - Badge: **`FIXTURE`**

---

## 🏆 Protocol Receipt Box & Sponsor Verification Matrix

SkyClaim operates against live Telegraph Protocol smart contracts and decentralized nodes on Base Sepolia:

| Protocol Component | Network / Environment | Identifier / Address | Verification Link |
| :--- | :--- | :--- | :--- |
| **Telegraph Diamond Contract** | Base Sepolia (`84532`) | `0x5a2324aA18613FAD4e44bDF0d6c73Ec1f6D87ff8` | [Basescan Explorer](https://sepolia.basescan.org/address/0x5a2324aA18613FAD4e44bDF0d6c73Ec1f6D87ff8) |
| **Circle USDC (x402 Gate)** | Base Sepolia (`84532`) | `0x036CbD53842c5426634e7929541eC2318f3dCF7e` | [Basescan Explorer](https://sepolia.basescan.org/token/0x036CbD53842c5426634e7929541eC2318f3dCF7e) |
| **Live Node Engine** | HTTP Node Rail | `http://13.237.89.59:7044` | [Healthz Endpoint](http://13.237.89.59:7044/miner-dispatcher/healthz) · [Miners Index](http://13.237.89.59:7044/engine/v1/subnets) |
| **Live On-Chain Run 1 (JFK Corridor)** | Base Sepolia (`84532`) | Tx: `0x3599e21750665fe443e0db847d383ff0ae0045c5ded530b63f34e2e256d7dbe9` | [Basescan Tx Link](https://sepolia.basescan.org/tx/0x3599e21750665fe443e0db847d383ff0ae0045c5ded530b63f34e2e256d7dbe9) · Miner: PREFLIGHT (`20260828`) |
| **Live On-Chain Run 2 (ORD Corridor)** | Base Sepolia (`84532`) | Tx: `0xba23f2fdc54173f0a5f2ce08b22e9efb1b4f46060be3361028d4f3774104c444` | [Basescan Tx Link](https://sepolia.basescan.org/tx/0xba23f2fdc54173f0a5f2ce08b22e9efb1b4f46060be3361028d4f3774104c444) · Miner: PREFLIGHT (`20260828`) |
| **Live On-Chain Run 3 (JFK Corridor)** | Base Sepolia (`84532`) | Tx: `0x0e4caede1b9c7d7f5b5117e11f1c5d149c73cace14062bc04f419c44172771bb` | [Basescan Tx Link](https://sepolia.basescan.org/tx/0x0e4caede1b9c7d7f5b5117e11f1c5d149c73cace14062bc04f419c44172771bb) · Miner: PREFLIGHT (`20260828`) |
| **Verified Live x402 Purchase** | Base Sepolia (`84532`) | Tx: `0xe08fd142ee4e3ad4a353e074615682c3b5c19c71b5d34a301ba81c9e6064d9db` | [Basescan Tx Link](https://sepolia.basescan.org/tx/0xe08fd142ee4e3ad4a353e074615682c3b5c19c71b5d34a301ba81c9e6064d9db) · Signal: `0xc65b056a...` ($0.01 USDC) |
| **Active Supply Miner (PREFLIGHT)** | `TRAVEL_TRANSIT_LOCK_GENERAL` | Miner `PREFLIGHT Infrastructure Signals` (`20260828`) | Real-time METAR & Transit Lock Telemetry ($0.01 USDC) |
| **Secondary Station Cross-Check** | FAA / NOAA METAR | `aviationweather.gov/api/data/metar` | Dual-corridor validation preventing single-source oracle risk |

---

## ⏱️ 90-Second Human Judge Quickstart

SkyClaim implements strict **Zero-Config Sandbox Resilience**. It clones, tests, builds, and runs cleanly with **no `.env` file required**:

```bash
# 1. Install dependencies
npm install

# 2. Run deterministic acceptance test suite (100% green)
npm test

# 3. Verify real live Telegraph node x402 purchase on Base Sepolia
npm run purchase:live

# 4. Build optimized production bundle
npm run build

# 5. Boot Web Interface on port 3000
npm start
```

### Review Surface A: Web Terminal
Open **[http://localhost:3000](http://localhost:3000)**:
- Click **BA178** to verify Case 1 (`ELIGIBLE_FOR_CLAIM`, British Airways UK/EU operating metal, €300–€600 eligible compensation range under Art. 7(2)).
- Click **DL401** to verify Case 2 (`INELIGIBLE`, Delta non-EU operating metal excluded under Art. 3(1)(b) & delay < 3h).
- Click **AF112** to verify Case 3 (`FAIL_CLOSED_WEATHER`, warning badge shown, contested claim draft generated under Art. 5(3)).
- Scroll to the **Public Disruption Verification Activity Table** to view real completed Telegraph purchases with clickable BaseScan links.

### Review Surface B: Telegram Bot & Terminal Simulator
```bash
# Run terminal simulator for instant evaluator testing
npm run bot:sim

# Or run live on Telegram (set TELEGRAM_BOT_TOKEN in .env)
npm run bot
```

---

## ⚠️ Scope & Legal Boundaries

1. **Operating Carrier Standard:** EU261 jurisdiction on flights departing third countries (USA) strictly requires an EU/UK operating carrier (*CJEU Case C-502/18*). Codeshares marketed by EU airlines do not qualify if flown on US metal.
2. **Statutory Delay Standard:** Under CJEU case law (*Sturgeon v Condor*), EU261 compensation is strictly evaluated on **arrival delay at final destination**, not departure delay. For flights > 3,500 km with arrival delays between 3 and 4 hours, Article 7(2)(c) permits carriers to discount statutory compensation by 50% (€300 vs €600).
3. **Contested Claims:** Active weather does not provide airlines an automatic pass if other flights operated on schedule. SkyClaim marks these claims as contested rather than dead, equipping passengers with evidence dossiers.
4. **Draft Only:** SkyClaim produces structured statutory claim drafts and evidence packages. It does not provide formal legal counsel or automated litigation filing.
