<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/logo-horizontal-dark.png">
    <source media="(prefers-color-scheme: light)" srcset="public/logo-horizontal-light.png">
    <img alt="SkyClaim" src="public/logo-horizontal-dark.png" width="560">
  </picture>
</p>

# SkyClaim · Autonomous Dual-Engine Disruption & Settlement Verifier
### Telegraph Protocol Season II · Track 03: Apps & Agents (Mission 15) & Solana Priority Track (Use Cases 1 & 3)

> **Autonomous Dual-Engine Protocol Verifier powered by Telegraph Protocol.**
> **SkyClaim captures purchased weather evidence while the delay is happening, then holds it for the claim.**
> By querying decentralized Telegraph miners at the exact moment an airline claims "bad weather", SkyClaim creates immutable, cryptographically verifiable proof before weather records are lost or altered.
> 
> The protocol deploys specialized off-chain intelligence across two complementary commercial surfaces:
> 1. **Engine 1: Consumer Flight Shield (Mission 15)** — Verifies airline weather defenses at the exact moment of disruption, validates operating carrier metal under UK261/EU261 rules, and generates statutory claim dossiers with cryptographic receipts on **Base Sepolia (primary evidenced weather rail)** and **Solana Devnet (SVM x402 settlement rail)**.
> 2. **Engine 2: SolSettle / SISA (Solana Use Cases 1 & 3)** — An institutional settlement assurance firewall on **Solana** that pre-screens high-value transfers against live legal entity registries (**GLEIF Open API**), OFAC SDN watchlists, and Living RWA bank reserves using Solana SVM x402 micropayments.

---

## ⚡ The Dual-Engine Architecture Matrix

SkyClaim bridges consumer flight disruption automation and institutional Solana transaction intelligence under one unified protocol framework:

| Dimension | Engine 1: SkyClaim (Consumer) | Engine 2: SolSettle / SISA (Institutional) |
| :--- | :--- | :--- |
| **Primary Focus** | Consumer Flight Disruption Claims & Weather Defense Screening | High-Value Institutional Settlement Assurance & Compliance Firewall |
| **Competition Track** | **Track 03: Apps & Agents · Mission 15** (Consumer Automation) | **Solana Priority Track · Use Cases 1 & 3** (Settlement Assurance & Pay.sh) |
| **Settlement Rails** | **Dual-Rail Native**: **Base Sepolia (`84532`)** &amp; **Solana Devnet (`solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1`)** | **Solana Devnet / Mainnet** · SVM x402 Micropayments via **Pay.sh** |
| **Settlement Asset** | Circle USDC on Base (`0x036CbD...`) &amp; Circle USDC on Solana (`4zMMC9...`) | Circle USDC on Solana (SPL Token: `4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU`) |
| **Off-Chain Truth** | Multi-corridor METAR ground observations (`ttl-nws` & `aviationweather.gov`) | Live GLEIF LEI Registry (`api.gleif.org`) + OFAC SDN watchlists + Bank Reserve audits |
| **Surfaces** | Web Terminal (with Base &amp; Solana toggle) + Telegram Bot (`@SkyClaimprobot`) | Web Compliance Terminal (`SolanaInstitutionalView`) + Automated API |
| **Production Status** | **Live on-chain x402 Base receipts + Solana Devnet SVM x402 inference** | **Live GLEIF resolution + `@x402/svm` client + 3 deterministic fixtures** |
| **1-Click Test** | `npm run purchase:live` · `npm run purchase:consumer-solana` · `npm test:skyclaim` | `npm run purchase:solana` · `npm run test:solana` |

---

## 🏛️ Solana Priority Alignment: Use Cases 1 & 3

SolSettle directly implements the exact problem statements specified in the Telegraph Solana Hackathon Brief:

1. **Use Case 1: Institutional Transaction Intelligence & Pre-Settlement Assurance**
   - High-value transactions on Solana (prime brokerage transfers, OTC desks, custodian settlements) settle in 400ms, making post-facto compliance audits useless.
   - SolSettle acts as a **pre-authorization compliance firewall**: before a transfer or RWA redemption is committed, specialized Telegraph miners and live secondary registries independently verify that:
     - The recipient's Legal Entity Identifier (LEI) is active in the **Global Legal Entity Identifier Foundation (GLEIF)** open database (`api.gleif.org`).
     - Neither beneficial owners nor associated entities appear in updated **OFAC SDN, UK HMT, or EU sanctions lists**.
     - Off-chain bank reserves backing **Living Real-World Assets (RWAs)** have zero active liens or custodial shortfalls.
   - If any condition fails, SolSettle **fails closed**, engaging an institutional circuit-breaker before capital is exposed.

2. **Use Case 3: Verified Intelligence Economy (Telegraph × Pay.sh)**
   - Integrates the native Solana SVM x402 micropayment standard (`lib/solana-x402.ts`) using `@x402/fetch`, `@x402/svm`, and `@solana/kit`.
   - Handles `402 Payment Required` challenge-response flows on Solana with graceful **Zero-Config Sandbox Resilience** fallback.

---

## ⏱️ 90-Second Human Judge Quickstart (Zero-Config)

SkyClaim boots cleanly in a sterile container with **no `.env` file required**:

```bash
# 1. Install dependencies
npm install

# 2. Run the unified test suite covering BOTH engines (100% green)
npm test

# 3. Test Engine 1 (Consumer): Solana Devnet SVM x402 inference
npm run purchase:consumer-solana

# 4. Test Engine 1 (Consumer): Real on-chain x402 purchase settled on Base Sepolia
npm run purchase:live

# 5. Test Engine 2 (Institutional): Live GLEIF resolution & Solana settlement assurance
npm run purchase:solana

# 6. Test multi-surface Telegram mobile bot simulator
npm run bot:sim

# 7. Build optimized production bundle & boot
npm run build && npm start
```

### Review Surface 1: Web Interface ([http://localhost:3000](http://localhost:3000))
- **Flight Shield (Engine 1):** Click the **Base Sepolia** or **Solana Devnet** toggle to select your settlement rail. Click **BA178** (Eligible £520, clear weather verified), **DL401** (Ineligible, non-EU operating metal), or **AF112** (Contested blizzard defense).
- **Institutional Shield (Engine 2):** Click the **"🏛️ Institutional"** tab in the top navigation bar to access SolSettle. Review Cases S1 (Regulated Settlement), S2 (Sanctions Intercept), and S3 (RWA Reserve Discrepancy).
- **Public Disruption Ledger:** View completed on-chain receipts with verified transaction links on BaseScan and Solscan.

### Review Surface 2: Telegram Bot Simulator
```bash
# Instant zero-config terminal simulation
npm run bot:sim

# Or run live bot (requires TELEGRAM_BOT_TOKEN)
npm run bot
```

---

## 🏷️ Honest Data Boundaries & Badges

SkyClaim strictly enforces honest data boundaries across both engines. Every result displays exactly **one** badge, and no preset or simulated mode ever fabricates fake miner receipts or transaction hashes:

| Badge | Data Origin | Miner ID & Tx Links | Cost | Meaning & Handling |
| :--- | :--- | :--- | :--- | :--- |
| **`LIVE`** | Live node purchase (`/engine/v1/ask`) | **Displayed** (Real BaseScan / Solscan explorer links) | **$0.01 USDC** | Real on-chain x402 purchase settled via EIP-712 (Base) or SVM (Solana). |
| **`SIMULATED`** | Free-input query when no credentials configured | **None** (No fake hashes) | **$0.00** | Explicit notice: *"Simulated baseline corridor report for zero-config evaluation."* |
| **`FIXTURE`** | Deterministic acceptance benchmark vectors | **None** (No simulated receipts) | **$0.00** | Pre-configured test vectors for instant zero-config reviewer verification. |

### 🔍 Evidentiary Rail Roles & Fail-Closed Design

- **Base Sepolia (Primary Evidenced Rail):** Live Telegraph Protocol node miners (`TxLens` / `PREFLIGHT`) return verified METAR observations (e.g. `KJFK 240751Z 32016KT 10SM FEW100 VFR`) and corridor flight category data paid via EIP-712 gasless permits.
- **Solana Devnet (SVM x402 Settlement Rail):** High-speed SVM micropayments via `@x402/svm` settlement ($0.01 Devnet USDC to Telegraph receiver). *Evidentiary note: While the x402 payment settled on Solana Devnet, miner 9002's response served travel transit lock routing without specialized radar ground data.*
- **Fail-Closed Historical Limit:** Current live Telegraph Protocol weather miners (`ttl-nws`, `ttl-airsigmet`) index active, real-time weather radar. Historical archives cannot be retrieved from live miners. SkyClaim enforces a strict fail-closed evidentiary rule: any past-date flight disruption without pre-captured evidence is marked `INSUFFICIENT_EVIDENCE` (£0/€0 payout) rather than guessing or fabricating historical weather. SkyClaim's core value is capturing immutable, purchased weather proof *while the delay is happening*.
- **UK261 Statutory Precision:** For long-haul flights (>3,500 km), standard UK261 compensation is **£520**. If the carrier offers alternative routing and arrival delay is between 3 and 4 hours, statutory compensation is reduced by 50% under Article 7(2)(c) to **£260** (represented as the £260 – £520 statutory range).

---

## 🎯 Reviewer Acceptance Cases

Reviewers can verify all 6 benchmark cases in 1-click on the web UI or via `npm test`:

### Part A: Consumer Flight Disruption (Engine 1 · Track 03 / Mission 15)
1. **CASE 1: CLEAN DELAY UNDER UK261 (Hypothetical `BA178` JFK → LHR)**
   - Route & Operating Carrier: New York JFK → London LHR (5,550 km) · Operating metal: **British Airways** (UK carrier)
   - Arrival Delay: 3h 42m at destination (Flight data: `FIXTURE`, exceeds 3h statutory threshold)
   - Weather Telemetry: Clear departure corridor at JFK (`FIXTURE`, airline excuse debunked)
   - Statutory Verdict: **`ELIGIBLE_FOR_CLAIM`** (£260 – £520 statutory range, draft template ready)
   - Badge: **`FIXTURE`**

2. **CASE 2: NON-EU OPERATING METAL EXCLUSION (Hypothetical `DL401` JFK → CDG)**
   - Route & Carriers: New York JFK → Paris CDG (5,835 km) · Marketing: Air France / Delta · Operating metal: **Delta Air Lines**
   - Operating Metal Rule: Under EU261 Art. 3(1)(b), flights departing third countries (USA) are only covered if operated by an EU Community carrier. Delta operating metal is excluded regardless of codeshare.
   - Statutory Verdict: **`INELIGIBLE`** (€0 eligible compensation, $0 spent, telemetry bypassed)
   - Badge: **`FIXTURE`**

3. **CASE 3: EXTRAORDINARY WEATHER DEFENSE (Hypothetical `AF112` ORD → CDG)**
   - Route & Operating Carrier: Chicago ORD → Paris CDG (6,670 km) · Operating metal: **Air France** (EU carrier)
   - Arrival Delay: 4h 10m at destination · Severe blizzard ground-stop alert active at Chicago ORD departure hub (`FIXTURE`)
   - Statutory Verdict: **`FAIL_CLOSED_WEATHER`** (Warning badge: `CONTESTED WEATHER DEFENSE`)
   - Statutory Baseline & Contest Workflow: **€600 (Subject to Art. 5(3) defense)** — Generates a specialized Contested Claim Template under *Case C-549/07 Wallentin-Hermann*.
   - Badge: **`FIXTURE`**

### Part B: Institutional Settlement Assurance (Engine 2 · Solana Use Cases 1 & 3)
4. **CASE S1: Regulated Prime Broker Settlement ($250,000 USDC)**
   - Counterparty: Galaxy Digital Trading Ltd · LEI: `549300VLM128XJ391Z82`
   - Registry Audit: Live GLEIF resolution (`api.gleif.org`) confirms active `ISSUED` status. Sanctions scan clean.
   - Verdict: **`SETTLEMENT_AUTHORIZED`** · Cleared for high-value execution on Solana.
5. **CASE S2: Intercepted Sanctioned Beneficial Owner ($100,000 Transfer)**
   - Counterparty: Volga Trading FZE (OFAC SDN link detected via Telegraph compliance miners).
   - Verdict: **`FAIL_CLOSED_SANCTIONS`** · Circuit-breaker engaged before on-chain funds move.
6. **CASE S3: Living RWA Reserve Discrepancy ($500,000 USDY Redemption)**
   - Ondo USDY SPV reserve audit identifies off-chain custodial bank lien of $2.4M prior to redemption.
   - Verdict: **`FAIL_CLOSED_RESERVE_DISCREPANCY`** · Redemption halted to prevent unbacked loss.

---

## 🏆 Protocol Receipt Box & Sponsor Verification Matrix

SkyClaim operates against live Telegraph Protocol smart contracts, node rails, and legal registries:

| Protocol Component | Network / Environment | Identifier / Address | Verification Proof / Link |
| :--- | :--- | :--- | :--- |
| **Telegraph Diamond Contract** | Base Sepolia (`84532`) | `0x5a2324aA18613FAD4e44bDF0d6c73Ec1f6D87ff8` | [Basescan Explorer](https://sepolia.basescan.org/address/0x5a2324aA18613FAD4e44bDF0d6c73Ec1f6D87ff8) |
| **Circle USDC (x402 Gate)** | Base Sepolia (`84532`) | `0x036CbD53842c5426634e7929541eC2318f3dCF7e` | [Basescan Explorer](https://sepolia.basescan.org/token/0x036CbD53842c5426634e7929541eC2318f3dCF7e) |
| **Live Telegraph Node Engine** | HTTP Node Rail | `http://13.237.89.59:7044` | [Healthz Endpoint](http://13.237.89.59:7044/miner-dispatcher/healthz) · [Miners Index](http://13.237.89.59:7044/engine/v1/subnets) |
| **Live GLEIF Open API** | Global Entity Registry | `https://api.gleif.org/api/v1/lei-records` | Live API queried in `lib/solana-settlement.ts` & `scripts/verify-solana-purchase.ts` |
| **Solana SVM x402 Client** | Solana Devnet / Mainnet | `@x402/svm` + `@solana/kit` | Source: [`lib/solana-x402.ts`](lib/solana-x402.ts) (Exact SVM scheme client) |
| **Consumer Solana x402 Rail (Live 1)** | Solana Devnet (`solana:EtWTRABZaYq...`) | `5P4mbeGFaggKaFNoz1mbH9XWM9RJ8Yz7exKYg9oTrhi1hKp6VuLdXF3Dk2Eep1UAccyq6UMMx8DX6E84pCWRKyR5` | [Solscan Tx Link](https://solscan.io/tx/5P4mbeGFaggKaFNoz1mbH9XWM9RJ8Yz7exKYg9oTrhi1hKp6VuLdXF3Dk2Eep1UAccyq6UMMx8DX6E84pCWRKyR5?cluster=devnet) · Fee: 10001 lamports · Miner: TxLens ($0.01 USDC) |
| **Consumer Solana x402 Rail (Live 2)** | Solana Devnet (`solana:EtWTRABZaYq...`) | `wepS4cfTJaKvpJbC56iHzYjTrHSw53V3u4r2V2TVogYWB4HQ65NZx97Y9Vy1dN834kd937ERMwCRnoY8MTr5BhU` | [Solscan Tx Link](https://solscan.io/tx/wepS4cfTJaKvpJbC56iHzYjTrHSw53V3u4r2V2TVogYWB4HQ65NZx97Y9Vy1dN834kd937ERMwCRnoY8MTr5BhU?cluster=devnet) · Live SVM x402 settlement ($0.01 USDC) |
| **Institutional Solana Rail** | Solana Devnet (`solana:EtWTRABZaYq...`) | PayTo: `G53EbeTZSNsAn7bj6iMFUQnq3zpDdEbHhKkPRywo8bix` | GLEIF + OFAC assurance · 1-click test: `npm run purchase:solana` |
| **Live On-Chain Settlement (Today JFK)** | Base Sepolia (`84532`) | `0xae55641f71da3bdb358cf9609462436609e0df067e7ed381cf3ea9cc4a1f9494` | [Basescan Tx Link](https://sepolia.basescan.org/tx/0xae55641f71da3bdb358cf9609462436609e0df067e7ed381cf3ea9cc4a1f9494) · Signal: `0x0c25d35d...` ($0.01 USDC) |
| **Live On-Chain Settlement 1 (JFK)** | Base Sepolia (`84532`) | `0x84ab1cc501a8b125202e524ca4cae7dff02b7a112b95a9caf7ff3dda517b8145` | [Basescan Tx Link](https://sepolia.basescan.org/tx/0x84ab1cc501a8b125202e524ca4cae7dff02b7a112b95a9caf7ff3dda517b8145) · Signal: `0x3599e217...` ($0.01 USDC, Block 62041390) |
| **Live On-Chain Settlement 2 (ORD)** | Base Sepolia (`84532`) | `0x1af69d658b1475570501718972e5787f6d9d930b1600705c1aaee8368ccb2e18` | [Basescan Tx Link](https://sepolia.basescan.org/tx/0x1af69d658b1475570501718972e5787f6d9d930b1600705c1aaee8368ccb2e18) · Signal: `0xba23f2fd...` ($0.01 USDC) |
| **Live On-Chain Settlement 3 (JFK)** | Base Sepolia (`84532`) | `0xe7667435800dd7b8ff7aed2f3246a131e1fe98c95cf22f00bc455c1ebb830002` | [Basescan Tx Link](https://sepolia.basescan.org/tx/0xe7667435800dd7b8ff7aed2f3246a131e1fe98c95cf22f00bc455c1ebb830002) · Signal: `0x0e4caede...` ($0.01 USDC) |
| **Live On-Chain Settlement 4 (FAA)** | Base Sepolia (`84532`) | `0xca110ae911f87e7fce5705b98768bee1d43a18fdff308106e01dfdb21fc55e45` | [Basescan Tx Link](https://sepolia.basescan.org/tx/0xca110ae911f87e7fce5705b98768bee1d43a18fdff308106e01dfdb21fc55e45) · Signal: `0xc9733ebf...` ($0.01 USDC) |
| **Protocol Verification Probe (x402)** | Base Sepolia (`84532`) | `0xe08fd142ee4e3ad4a353e074615682c3b5c19c71b5d34a301ba81c9e6064d9db` | [Basescan Tx Link](https://sepolia.basescan.org/tx/0xe08fd142ee4e3ad4a353e074615682c3b5c19c71b5d34a301ba81c9e6064d9db) · Signal: `0xc65b056a...` ($0.01 USDC, Block 62567078) |
| **Secondary Weather Station Feed** | NOAA / FAA METAR | `aviationweather.gov/api/data/metar` | Ground station METAR feed cross-check against Telegraph telemetry |

---

## 🗺️ Focused Builder Roadmap

| Phase | Horizon | Focus | Key Deliverables |
| :--- | :--- | :--- | :--- |
| **Phase 1** | **Shipped & Live** | Dual-Engine Verification Architecture | Core flight shield (Mission 15) on Base Sepolia + SolSettle pre-settlement assurance on Solana. Web UI + Telegram Bot (`@SkyClaimprobot`). 6 deterministic test vectors (`npm test`). Live GLEIF resolution. |
| **Phase 2** | **Q1 2027** | Custom Telegraph Miners & Subnets | **`miner-flight-radar`**: Real-time ADS-B transponder telemetry miner. **`miner-solana-sanctions`**: Sub-minute OFAC/FATF graph entity matching miner. **`evaluator-flight-accuracy`**: Evaluator scoring carrier excuse accuracy. |
| **Phase 3** | **Q2 2027** | B2B Travel Integrations & Smart Contracts | **Corporate Travel API**: Direct Concur / Navan expense webhook integrations. **Automated Escrow Claim Vault**: Smart contract paying instant compensation advances upon Telegraph disruption consensus. |

---

## 📖 Technical Documentation

- **Walkthrough Tutorial:** [`TUTORIAL.md`](TUTORIAL.md) — Comprehensive technical walkthrough explaining statutory flight disruption rules, Telegraph intent routing, and x402 gasless EIP-712 challenge-response payment flows on Base Sepolia.
- **Protocol Updates Log:** [`UPDATES.md`](UPDATES.md) — Technical changelog documenting project milestones from initial architecture to live x402 node and Solana integration.
- **Public Growth Updates:** [`GROWTH_POSTS.md`](GROWTH_POSTS.md) — Official dispatches on 3 separate dates documenting problem, consensus engine, and launch.
- **Submission Overview:** [`SUBMISSION.md`](SUBMISSION.md) — Official hackathon submission summary and judge scoring matrix.
