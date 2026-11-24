# ✈️ SkyClaim · Autonomous Flight Disruption Evidence Tool
### Telegraph Hackathon Season II · Track 03: Apps & Agents · Mission 15: Consumer Automation

> **Submission Summary:** SkyClaim checks the airline's most common excuse at the exact moment of delay. When a transatlantic flight is delayed 3+ hours on arrival, SkyClaim verifies departure and arrival corridor meteorology via Telegraph Protocol, validates operating carrier metal under EU261/UK261 rules (CJEU Case C-502/18), and generates instant statutory claim dossiers with cryptographic settlement receipts. Tested on Base Sepolia.

- **Repository:** https://github.com/kellycryptos/SkyClaim
- **Live Hosted Web Terminal:** http://localhost:3000 (or deployed endpoint)
- **Telegram Bot:** `@SkyClaimprobot` (or run local simulator `npm run bot:sim`)
- **Competition Track:** Track 03: Apps & Agents
- **Target Commercial Mission:** Mission 15: Consumer Automation
- **Settlement Layer:** Base Sepolia (Chain ID: 84532) · Circle USDC x402 Micropayments ($0.01 USDC/call)

---

## ⚡ The 90-Second Evaluator Quickstart (Zero-Config)

SkyClaim boots cleanly in a sterile container with **no `.env` file present**:

```bash
# 1. Clone & install
git clone https://github.com/kellycryptos/SkyClaim.git
cd SkyClaim
npm install

# 2. Run deterministic test suite (8/8 passing, 0 gas needed)
npm test

# 3. Verify real on-chain x402 micropayment on Base Sepolia
npm run purchase:live

# 4. Run interactive Telegram bot terminal simulator
npm run bot:sim

# 5. Boot Web UI on port 3000
npm run build && npm start
```

---

## 🎯 3 Deterministic Reviewer Acceptance Cases

Every scenario is reproducible in 1 click on the Web UI or via `npm run bot:sim`:

| Scenario | Route & Operating Metal | Delay | Weather Telemetry | Verdict & Legal Basis | Statutory Compensation | Cost |
| :--- | :--- | :---: | :--- | :--- | :---: | :---: |
| **Case 1: Clean Delay** (`BA178`) | JFK → LHR · **British Airways** (UK/EU) | 3h 42m | Clear corridors at JFK & LHR (`FIXTURE`) | **`ELIGIBLE_FOR_CLAIM`**<br>Airline weather excuse unsupported. Draft claim ready. | **€300 – €600**<br>(Art. 7(2)(c) 50% rule) | $0.00 (`FIXTURE`) |
| **Case 2: Non-EU Metal** (`DL401`) | JFK → CDG · **Delta Air Lines** (Codeshare) | 1h 05m | Corridors checked | **`INELIGIBLE`**<br>Excluded under Art. 3(1)(b) & CJEU Case C-502/18 (*České aerolinie*). | **€0**<br>(Non-EU metal ex-USA) | **$0 spent**<br>(Telemetry bypassed) |
| **Case 3: Blizzard Alert** (`AF112`) | ORD → CDG · **Air France** (EU Metal) | 4h 10m | Severe blizzard at ORD (`FIXTURE`) | **`FAIL_CLOSED_WEATHER`**<br>Airline holds Art. 5(3) defense. Generates *Wallentin-Hermann* contested notice. | **€300 – €600**<br>(Contested Art. 5(3)) | $0.00 (`FIXTURE`) |

---

## 🏆 Protocol Receipt Box & On-Chain Settlement Proof

SkyClaim operates against live Telegraph Protocol smart contracts and decentralized nodes:

| Protocol Component | Network | Address / Identifier | Verifiable Explorer Link |
| :--- | :---: | :--- | :--- |
| **Telegraph Diamond Contract** | Base Sepolia | `0x5a2324aA18613FAD4e44bDF0d6c73Ec1f6D87ff8` | [Basescan Explorer](https://sepolia.basescan.org/address/0x5a2324aA18613FAD4e44bDF0d6c73Ec1f6D87ff8) |
| **Circle USDC (x402 Gate)** | Base Sepolia | `0x036CbD53842c5426634e7929541eC2318f3dCF7e` | [Basescan Explorer](https://sepolia.basescan.org/token/0x036CbD53842c5426634e7929541eC2318f3dCF7e) |
| **Live Node Engine** | HTTP Rail | `http://13.237.89.59:7044` | [Healthz Check](http://13.237.89.59:7044/miner-dispatcher/healthz) |
| **Live Verified x402 Purchase** | Base Sepolia | Tx: `0xe08fd142ee4e3ad4a353e074615682c3b5c19c71b5d34a301ba81c9e6064d9db` | [Basescan Tx Link](https://sepolia.basescan.org/tx/0xe08fd142ee4e3ad4a353e074615682c3b5c19c71b5d34a301ba81c9e6064d9db) |
| **Live Corridor Run 1 (JFK)** | Base Sepolia | Tx: `0x3599e21750665fe443e0db847d383ff0ae0045c5ded530b63f34e2e256d7dbe9` | [Basescan Tx Link](https://sepolia.basescan.org/tx/0x3599e21750665fe443e0db847d383ff0ae0045c5ded530b63f34e2e256d7dbe9) |
| **Live Corridor Run 2 (ORD)** | Base Sepolia | Tx: `0xba23f2fdc54173f0a5f2ce08b22e9efb1b4f46060be3361028d4f3774104c444` | [Basescan Tx Link](https://sepolia.basescan.org/tx/0xba23f2fdc54173f0a5f2ce08b22e9efb1b4f46060be3361028d4f3774104c444) |

- **Cost Charged:** $0.01 USDC per verified check.
- **Spending Guardrails:** Hard per-call cap: **$0.05 USDC** · Daily spending ceiling: **$5.00 USDC** (`lib/budget-guard.ts`).

---

## 📈 Organic Growth, Education & Independent Testers (20 Growth Points)

SkyClaim fully complies with Section 06 & Section 08 of the Telegraph Hackathon Season II Rules:

1. **Useful Education (5 pts):**
   - [`TUTORIAL.md`](https://github.com/kellycryptos/SkyClaim/blob/main/TUTORIAL.md) — Comprehensive technical tutorial detailing EU261 legal basis, gasless EIP-712 x402 payment challenge handling, and dual-miner consensus.
2. **Ease of Adoption (5 pts):**
   - Zero-barrier setup, offline fallback fixtures, and terminal bot simulator (`npm run bot:sim`).
3. **Organic Distribution (5 pts):**
   - [`GROWTH_POSTS.md`](https://github.com/kellycryptos/SkyClaim/blob/main/GROWTH_POSTS.md) — Three original progress updates published on separate dates (Nov 14, Nov 20, Nov 23) tagging `@Telegraphprotoc` with contest disclosure.
4. **Independent Community Activation & Tester Reports (5 pts):**
   - [`INDEPENDENT_TESTERS.md`](https://github.com/kellycryptos/SkyClaim/blob/main/INDEPENDENT_TESTERS.md) — Dossier recording reproduction runs, critiques, and remediations from 3 independent specialists:
     - `@alex-nodes` (Node Operator): Tested live x402 settlement; prompted financial budget guardrails.
     - `@elena-dev` (Full-Stack Dev): Tested zero-config container mode; prompted Render dependency fix (`25d6649`).
     - `@marcus-lex` (Aviation Legal Tech): Tested operating metal edge cases; verified Article 7(2)(c) 50% discount clarification.

---

## 💬 Short Commercial Summary (Season II 5 Questions)

1. **Who is it for?** Transatlantic passengers and corporate travel management desks facing airline delay rejections.
2. **What does it improve?** Eliminates false airline weather excuses at delay time by purchasing cryptographic dual-hub meteorological telemetry for $0.01 USDC.
3. **What does it do today?** Filters non-EU metal ex-USA ($0 spent), queries dual Telegraph miners (`TRAVEL_TRANSIT_LOCK` + `STORM_ALERT`), settles over gasless x402 on Base Sepolia, and outputs substantiated claim packs.
4. **Why would someone adopt it?** Converts 3-to-6 month manual airline disputes into instant statutory claim packages backed by verified on-chain receipts.
5. **How can someone try it?** Clone the repo and run `npm test && npm run bot:sim`, or open `http://localhost:3000`.
