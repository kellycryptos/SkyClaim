# SkyClaim · Same-Day Flight Disruption Evidence Tool (Testnet)

> **SkyClaim checks the airline's most common excuse.** When a flight is delayed 3+ hours, it verifies weather alerts for the departure airport through Telegraph Protocol. If a severe alert is active, it flags the claim as high risk (airline holds an Article 5(3) extraordinary circumstances defense). Otherwise, it drafts an EU261/UK261 statutory claim. Draft only, not legal advice. Coverage: US departures to Europe on EU/UK carriers. Testnet only.

---

## ⚡ Positioning & Purpose

- **Supported Scope:** Same-day US departures to Europe on EU/UK carriers (e.g. British Airways, Air France, Lufthansa departing JFK, ORD, BOS). US domestic flights have no statutory compensation regime under US DOT rules and are outside this scope.
- **Timing:** SkyClaim triggers at the moment a 3+ hour delay is detected, verifying departure weather before transient conditions clear.
- **Protocol Layer:** Settles x402 micro-payments on **Base Sepolia (Chain ID: 84532)** with Circle USDC.
- **Target Intent:** `TRAVEL_TRANSIT_LOCK_GENERAL` (served by live miners `ttl-nws` 106005 and `ttl-airsigmet` 106004).

---

## 🏷️ The Data Badge Table

SkyClaim strictly enforces honest data boundaries. Every result displays exactly **one** badge, and no preset or simulated mode ever invents fake miner receipts or placeholder transaction hashes:

| Badge | Data Origin | Miner ID & Tx Links | On-Chain Cost | Meaning & Handling |
| :--- | :--- | :--- | :--- | :--- |
| **`LIVE`** | Live Telegraph node purchase (`/engine/v1/ask`) | **Displayed** (Real values returned by network) | **$0.01 USDC** (Base Sepolia) | Real x402 purchase executed with active `AGENT_PRIVATE_KEY` and test USDC. |
| **`SIMULATED`** | Free-input query when no private key is present | **None** (No placeholder hashes) | **$0.00** | Explicitly displays simulated notice: *"No AGENT_PRIVATE_KEY configured; operating in zero-cost simulated mode."* |
| **`FIXTURE`** | Deterministic acceptance test vectors (Cases 1, 2 & 3) | **None** (No fake receipts) | **$0.00** | Pre-configured flight & weather data for instant zero-config reviewer testing without wallet drain. |

---

## 🎯 The 3 Reviewer Acceptance Cases

Reviewers can verify all 3 deterministic cases in 1-click on the web UI or terminal simulator. All 3 preset flights are marked as **Hypothetical Flights** with deterministic test vectors:

1. **CASE 1: CLEAN DELAY (Hypothetical `BA178` JFK → LHR)**
   - Route & Distance: New York JFK → London Heathrow LHR (5,550 km)
   - Arrival Delay: 3h 42m at destination (Flight data: `FIXTURE`)
   - Weather at Departure: Clear, no active severe storm alerts (`FIXTURE`)
   - Statutory Verdict: **`ELIGIBLE_FOR_CLAIM`**
   - Statutory Compensation to be Checked: **€300 – €600** (Flight distance > 3,500 km. Under EU261 Article 7(2)(c), if arrival delay is between 3 and 4 hours, statutory compensation of €600 may be discounted by 50% to €300. Draft claim ready for carrier review).
   - Badge: **`FIXTURE`** (No on-chain transaction executed for preset)

2. **CASE 2: MINOR DELAY (Hypothetical `DL401` JFK → CDG)**
   - Route & Distance: New York JFK → Paris CDG (5,835 km)
   - Arrival Delay: 1h 05m at destination (Flight data: `FIXTURE`)
   - Weather Screening: Query bypassed — arrival delay is below 3-hour statutory threshold
   - Statutory Verdict: **`INELIGIBLE`** (€0 eligible compensation, $0 spent)
   - Badge: **`FIXTURE`**

3. **CASE 3: DELAY WITH WEATHER RISK (Hypothetical `AF112` ORD → CDG)**
   - Route & Distance: Chicago ORD → Paris CDG (6,670 km)
   - Arrival Delay: 4h 10m at destination (Flight data: `FIXTURE`)
   - Weather at Departure: Severe blizzard ground-stop alert active (`FIXTURE`)
   - Statutory Verdict: **`FAIL_CLOSED_WEATHER`** (Airline holds valid Article 5(3) extraordinary circumstances defense; fails closed to prevent doomed dispute)
   - Badge: **`FIXTURE`**

In addition, reviewers can use the **Free-Input Mode** to query any US departure airport (e.g. `JFK`, `ORD`, `BOS`, `SFO`).

---

## ⏱️ 90-Second Human Judge Quickstart

SkyClaim implements strict **Zero-Config Sandbox Resilience**. It clones, tests, builds, and runs cleanly with **no `.env` file present**:

```bash
# 1. Install dependencies
npm install

# 2. Run deterministic acceptance test suite (100% green)
npm test

# 3. Verify real live Telegraph node x402 challenge end-to-end
npm run purchase:live

# 4. Build optimized production bundle
npm run build

# 5. Boot Web Interface on port 3000
npm start
```

### Review Surface A: Web Terminal
Open **[http://localhost:3000](http://localhost:3000)**:
- Click **BA178** to verify Case 1 (`ELIGIBLE_FOR_CLAIM`, €300–€600 eligible compensation range to be checked under Art. 7(2)).
- Click **DL401** to verify Case 2 (`INELIGIBLE`, below 3h statutory arrival threshold).
- Click **AF112** to verify Case 3 (`FAIL_CLOSED_WEATHER`, blizzard ground stop).
- Enter any US airport code into the search box to test the free-input path.

### Review Surface B: Telegram Bot & Terminal Simulator
```bash
# Run terminal simulator for instant evaluator testing
npm run bot:sim

# Or run live on Telegram (set TELEGRAM_BOT_TOKEN in .env)
npm run bot
```

---

## 🏆 Protocol Receipt Box & Sponsor Verification Matrix

| Protocol Component | Network / Environment | Identifier / Address | Verification Link |
| :--- | :--- | :--- | :--- |
| **Telegraph Diamond Contract** | Base Sepolia (`84532`) | `0x5a2324aA18613FAD4e44bDF0d6c73Ec1f6D87ff8` | [Basescan Explorer](https://sepolia.basescan.org/address/0x5a2324aA18613FAD4e44bDF0d6c73Ec1f6D87ff8) |
| **Circle USDC (x402 Gate)** | Base Sepolia (`84532`) | `0x036CbD53842c5426634e7929541eC2318f3dCF7e` | [Basescan Explorer](https://sepolia.basescan.org/token/0x036CbD53842c5426634e7929541eC2318f3dCF7e) |
| **Live Node Engine** | HTTP Engine | `http://13.237.89.59:7044` | [Healthz Endpoint](http://13.237.89.59:7044/miner-dispatcher/healthz) · [Miners Index](http://13.237.89.59:7044/engine/v1/subnets) |
| **Active Supply Miner (NWS)** | `TRAVEL_TRANSIT_LOCK_GENERAL` | Miner `ttl-nws` (`106005`, Rank #1) | Node Dispatcher Route |
| **Active Supply Miner (AIRSIGMET)** | `TRAVEL_TRANSIT_LOCK_GENERAL` | Miner `ttl-airsigmet` (`106004`, Rank #2) | Node Dispatcher Route |

---

## ⚠️ Known Limitations

1. **Live Purchase Status:** Live end-to-end x402 payment challenge interception has been verified against the live Telegraph node (`TRAVEL_TRANSIT_LOCK_GENERAL` on Base Sepolia, returning HTTP 402 with required Circle USDC amount `10000` / $0.01). However, because no funded private key (`AGENT_PRIVATE_KEY`) is stored in the public repository, paid transactions are not submitted on-chain during zero-env runs ($0.00 charged).
2. **Statutory Compensation Basis:** Under CJEU case law (*Sturgeon v Condor*), EU261 compensation is strictly evaluated on **arrival delay at final destination**, not departure delay. For flights > 3,500 km with arrival delays between 3 and 4 hours, Article 7(2)(c) permits carriers to discount statutory compensation by 50% (€300 vs €600). SkyClaim presents compensation as **eligible compensation to be checked**, never as approved.
3. **Jurisdiction & Route Scope:** Only applies to flights departing US airports destined for Europe operated by EU or UK carriers. Does not cover US domestic flights (no statutory compensation rules) or non-EU carriers departing the US.
4. **Draft Claim Only:** SkyClaim generates structured statutory claim drafts and evidence dossiers. It does not provide formal legal counsel or automated small-claims court filing.
5. **Testnet Settlement:** Operates on Base Sepolia (`84532`) using testnet Circle USDC and the Telegraph Diamond contract.
6. **Preset Fixtures:** Preset cases are deterministic test fixtures and do not make outbound on-chain purchases during automated reviews to eliminate wallet-drain risks.
