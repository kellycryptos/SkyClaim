<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/logo-horizontal-dark.png">
    <source media="(prefers-color-scheme: light)" srcset="public/logo-horizontal-light.png">
    <img alt="SkyClaim" src="public/logo-horizontal-dark.png" width="560">
  </picture>
</p>

# SkyClaim · Autonomous Flight Disruption Verifier (Telegraph Protocol Season II)

> **SkyClaim checks the airline's most common excuses before they can stall your claim.** When a transatlantic flight is delayed 3+ hours, SkyClaim verifies departure airport meteorological conditions and operational disruption telemetry via Telegraph Protocol, validates the operating carrier metal under UK261 and EU261 rules, and generates statutory claim dossiers with cryptographic settlement receipts. Draft template only, not legal advice. Testnet on Base Sepolia.

---

## ⚡ Positioning & Purpose

- **Supported Scope:** Same-day US departures to Europe on UK and EU operating carriers (e.g. British Airways, Virgin Atlantic, Air France, Lufthansa departing JFK, ORD, BOS).
- **Operating Metal Enforcement:** Ex-US departures under EU261 Regulation (EC) 261/2004 Art. 3(1)(b) only apply if the **operating air carrier** is an EU Community carrier (and under UK261 SI 2019/278, if operated by a UK carrier). A transatlantic codeshare marketed by Air France or British Airways but flown on US metal (e.g. Delta or American Airlines) is excluded. SkyClaim checks operating metal before spending protocol budget to prevent false claims.
- **Departure Weather & Operational Disruption Telemetry:** Transatlantic delays frequently cite weather excuses. SkyClaim purchases departure corridor telemetry (`TRAVEL_TRANSIT_LOCK_GENERAL` and `TRAVEL_DISRUPTION_GENERAL`) via live Telegraph miners and runs a secondary station cross-check against NOAA/FAA METAR feeds (`aviationweather.gov`).
- **Contested Claim Template:** When an airline asserts weather under Article 5(3), SkyClaim flags the claim as **`FAIL_CLOSED_WEATHER`** with a contested template rather than a false positive or an absolute €0 dead-end. Under established CJEU case law (*Case C-549/07 Wallentin-Hermann*), an extraordinary circumstances defense under Article 5(3) requires the carrier to prove that the circumstances could not have been avoided even if all reasonable measures had been taken.
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

1. **CASE 1: CLEAN DELAY UNDER UK261 (Hypothetical `BA178` JFK → LHR)**
   - Route & Operating Carrier: New York JFK → London LHR (5,550 km) · Operating metal: **British Airways** (UK carrier arriving in the UK)
   - Arrival Delay: 3h 42m at destination (Flight data: `FIXTURE`)
   - Weather Telemetry: Clear departure corridor at JFK (`FIXTURE`)
   - Statutory Regime: **UK261** (The Air Passenger Rights and Air Travel Organisers' Licensing Regulations 2019)
   - Statutory Verdict: **`ELIGIBLE_FOR_CLAIM`**
   - Statutory Compensation to be Checked: **£260 – £520** (Flight distance > 3,500 km. Under UK261 Article 7(2)(c), if arrival delay is between 3 and 4 hours, statutory compensation of £520 is discounted by 50% to £260. Draft claim template ready).
   - Badge: **`FIXTURE`** (Zero-cost test vector)

2. **CASE 2: NON-EU OPERATING METAL EXCLUSION (Hypothetical `DL401` JFK → CDG)**
   - Route & Carriers: New York JFK → Paris CDG (5,835 km) · Marketing: Air France / Delta · Operating metal: **Delta Air Lines**
   - Arrival Delay: 3h 30m at destination (Flight data: `FIXTURE`, exceeds the 3-hour statutory threshold)
   - Operating Metal Rule: Under EU261 Art. 3(1)(b), flights departing third countries (USA) are only covered if operated by an EU Community carrier. Delta operating metal is excluded regardless of codeshare.
   - Statutory Verdict: **`INELIGIBLE`** (€0 eligible compensation, $0 spent, telemetry bypassed)
   - Badge: **`FIXTURE`**

3. **CASE 3: EXTRAORDINARY WEATHER CIRCUMSTANCES DEFENSE (Hypothetical `AF112` ORD → CDG)**
   - Route & Operating Carrier: Chicago ORD → Paris CDG (6,670 km) · Operating metal: **Air France** (EU carrier arriving in the EU)
   - Arrival Delay: 4h 10m at destination (Flight data: `FIXTURE`, delay exceeds 4 hours)
   - Weather at Departure: Severe blizzard ground-stop alert active at Chicago ORD departure hub (`FIXTURE`)
   - Statutory Regime: **EU261** (Regulation (EC) No 261/2004)
   - Statutory Verdict: **`FAIL_CLOSED_WEATHER`** (Warning badge: `CONTESTED WEATHER DEFENSE`)
   - Statutory Baseline & Contest Workflow: **€600 (Subject to Art. 5(3) defense)** — Generates a specialized Contested Claim Template requesting carrier substantiation under *Case C-549/07 Wallentin-Hermann* that the disruption could not have been avoided even if all reasonable measures had been taken.
   - Badge: **`FIXTURE`**

---

## 🏆 Protocol Receipt Box & Sponsor Verification Matrix

SkyClaim operates against live Telegraph Protocol smart contracts and decentralized nodes on Base Sepolia. Every on-chain transaction hash below has been confirmed on Base Sepolia RPC and BaseScan:

| Protocol Component | Network / Environment | Identifier / Address | Verification Link |
| :--- | :--- | :--- | :--- |
| **Telegraph Diamond Contract** | Base Sepolia (`84532`) | `0x5a2324aA18613FAD4e44bDF0d6c73Ec1f6D87ff8` | [Basescan Explorer](https://sepolia.basescan.org/address/0x5a2324aA18613FAD4e44bDF0d6c73Ec1f6D87ff8) |
| **Circle USDC (x402 Gate)** | Base Sepolia (`84532`) | `0x036CbD53842c5426634e7929541eC2318f3dCF7e` | [Basescan Explorer](https://sepolia.basescan.org/token/0x036CbD53842c5426634e7929541eC2318f3dCF7e) |
| **Live Node Engine** | HTTP Node Rail | `http://13.237.89.59:7044` | [Healthz Endpoint](http://13.237.89.59:7044/miner-dispatcher/healthz) · [Miners Index](http://13.237.89.59:7044/engine/v1/subnets) |
| **Live On-Chain Settlement 1 (JFK Corridor)** | Base Sepolia (`84532`) | Tx: `0x84ab1cc501a8b125202e524ca4cae7dff02b7a112b95a9caf7ff3dda517b8145` | [Basescan Tx Link](https://sepolia.basescan.org/tx/0x84ab1cc501a8b125202e524ca4cae7dff02b7a112b95a9caf7ff3dda517b8145) · Signal: `0x3599e217...` · Miner: `a1-preflight` (`20260828`) · Intent: `TRAVEL_TRANSIT_LOCK_GENERAL` ($0.01 USDC) |
| **Live On-Chain Settlement 2 (ORD Corridor)** | Base Sepolia (`84532`) | Tx: `0x1af69d658b1475570501718972e5787f6d9d930b1600705c1aaee8368ccb2e18` | [Basescan Tx Link](https://sepolia.basescan.org/tx/0x1af69d658b1475570501718972e5787f6d9d930b1600705c1aaee8368ccb2e18) · Signal: `0xba23f2fd...` · Miner: `a1-preflight` (`20260828`) · Intent: `TRAVEL_TRANSIT_LOCK_GENERAL` ($0.01 USDC) |
| **Live On-Chain Settlement 3 (JFK Corridor)** | Base Sepolia (`84532`) | Tx: `0xe7667435800dd7b8ff7aed2f3246a131e1fe98c95cf22f00bc455c1ebb830002` | [Basescan Tx Link](https://sepolia.basescan.org/tx/0xe7667435800dd7b8ff7aed2f3246a131e1fe98c95cf22f00bc455c1ebb830002) · Signal: `0x0e4caede...` · Miner: `a1-preflight` (`20260828`) · Intent: `TRAVEL_TRANSIT_LOCK_GENERAL` ($0.01 USDC) |
| **Live On-Chain Settlement 4 (FAA Operational Status)** | Base Sepolia (`84532`) | Tx: `0xca110ae911f87e7fce5705b98768bee1d43a18fdff308106e01dfdb21fc55e45` | [Basescan Tx Link](https://sepolia.basescan.org/tx/0xca110ae911f87e7fce5705b98768bee1d43a18fdff308106e01dfdb21fc55e45) · Signal: `0xc9733ebf...` · Miner: `TxLens` (`9002`) · Intent: `TRAVEL_DISRUPTION_GENERAL` ($0.01 USDC) |
| **Protocol Verification Probe (Live x402 Settlement)** | Base Sepolia (`84532`) | Tx: `0xe08fd142ee4e3ad4a353e074615682c3b5c19c71b5d34a301ba81c9e6064d9db` | [Basescan Tx Link](https://sepolia.basescan.org/tx/0xe08fd142ee4e3ad4a353e074615682c3b5c19c71b5d34a301ba81c9e6064d9db) · Signal: `0xc65b056a...` ($0.01 USDC, Block 62567078) · Protocol research probe verifying live gasless EIP-712 challenge execution on Telegraph node rail |
| **Secondary Station Cross-Check** | FAA / NOAA METAR | `aviationweather.gov/api/data/metar` | Ground station METAR feed cross-check against Telegraph telemetry |

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
- Click **BA178** to verify Case 1 (`ELIGIBLE_FOR_CLAIM`, British Airways UK carrier, £260–£520 statutory entitlement under UK261).
- Click **DL401** to verify Case 2 (`INELIGIBLE`, Delta non-EU operating carrier excluded under Art. 3(1)(b) despite 3h 30m delay).
- Click **AF112** to verify Case 3 (`FAIL_CLOSED_WEATHER`, warning badge shown, contested claim template generated under Art. 5(3)).
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

1. **Operating Carrier Standard:** Under Regulation (EC) No 261/2004 Article 3(1)(b), flights departing third countries (USA) are only covered if operated by an EU Community carrier (and under UK261 SI 2019/278, if operated by a UK carrier). Codeshares marketed by EU/UK airlines do not qualify if flown on US metal.
2. **Statutory Delay Standard:** Under Court of Justice jurisprudence (*Joined Cases C-402/07 & C-432/07 Sturgeon v Condor*), statutory delay rights are evaluated on **arrival delay at final destination**, not departure delay. For long-haul flights (> 3,500 km) with arrival delays between 3 and 4 hours, Article 7(2)(c) permits carriers to discount statutory compensation by 50% (£260 under UK261, €300 under EU261).
3. **Contested Claims:** Under *Case C-549/07 Wallentin-Hermann*, an airline asserting an extraordinary circumstances defense under Article 5(3) must prove that the delay could not have been avoided even if all reasonable measures had been taken. SkyClaim marks these claims as contested rather than dead, providing structured challenge templates for passenger or corporate travel review.
4. **Draft Template Only:** SkyClaim produces structured statutory claim templates and telemetry packages. It does not provide formal legal counsel or automated litigation representation.

---

## 📖 Technical Documentation

- **Walkthrough Tutorial:** [`TUTORIAL.md`](file:///c:/Users/HP/Downloads/telegraph%20101/TUTORIAL.md) — Comprehensive technical walkthrough explaining statutory flight disruption rules, Telegraph intent routing, and x402 gasless EIP-712 challenge-response payment flows on Base Sepolia.
- **Protocol Updates Log:** [`UPDATES.md`](file:///c:/Users/HP/Downloads/telegraph%20101/UPDATES.md) — Technical changelog documenting project milestones from initial architecture to live x402 node integration.
