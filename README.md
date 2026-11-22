# Telegraph Sentinel · Autonomous Token Listing & DeFi Risk Desk

> **Telegraph Hackathon Season II Official Entry**  
> **Track:** Track 03 — Apps & Agents  
> **Missions:** Mission 01 (Exchange Due Diligence Desk) & Mission 14 (Web3 Native & DeFi Security Sentinel)  
> **Payment & Settlement Layer:** x402 Protocol · Circle USDC on Base Sepolia (Chain ID: 84532)

---

## 🏆 The Receipt Box & Sponsor Verification Matrix

| Protocol Component | Network / Environment | Identifier / Address | Verification Link |
| :--- | :--- | :--- | :--- |
| **Telegraph Diamond Contract** | Base Sepolia (`84532`) | `0x5a2324aA18613FAD4e44bDF0d6c73Ec1f6D87ff8` | [Basescan Explorer](https://sepolia.basescan.org/address/0x5a2324aA18613FAD4e44bDF0d6c73Ec1f6D87ff8) |
| **Circle USDC (x402 Gate)** | Base Sepolia (`84532`) | `0x036CbD53842c5426634e7929541eC2318f3dCF7e` | [Basescan Explorer](https://sepolia.basescan.org/token/0x036CbD53842c5426634e7929541eC2318f3dCF7e) |
| **Live Node & Miner Engine** | HTTP / WebSocket | `http://13.237.89.59:7044` | [Node Healthz Endpoint](http://13.237.89.59:7044/miner-dispatcher/healthz) |
| **Active Testnet Miners** | Telegraph Subnet Index | 2,189 Miners Live | [Engine Subnets](http://13.237.89.59:7044/engine/v1/subnets) |
| **5 Parallel x402 Intents** | Telegraph Intents Pipeline | `lib/telegraph.ts#L43-L125` | [Source Permalink](lib/telegraph.ts) |

---

## ⏱️ 90-Second Human Judge Quickstart

This repository implements strict **Zero-Config Sandbox Resilience**. It compiles, tests, and boots with **zero environment configuration** or `.env` files required.

```bash
# 1. Install dependencies
npm install

# 2. Run deterministic test suite (100% automated pass)
npm test

# 3. Build optimized production bundle
npm run build

# 4. Boot server on port 3000
npm start
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser:
1. Click **Preset 1 (Uniswap V3)** to view an immediate clean approval.
2. Click **Preset 2 (PEPE Stealth Drainer)** to trigger malicious bytecode & honeypot rejection.
3. Click **Preset 3 (Tornado Cash Pool)** to witness an automatic OFAC sanctions block.
4. Click **"The Receipt Box"** in the top navigation to inspect on-chain contract and payment proofs.

---

## 📋 The 5 Commercial Summary Questions (Season II Rules §8)

### 01. Who is it for?
**Centralized Exchanges (CEXs), DEX aggregators, launchpads, and institutional compliance desks.** Listing committees receive hundreds of token listing applications each month and spend dozens of manual hours cross-referencing audits, sanctions lists, holder distribution, and smart contract bytecode.

### 02. What does it improve?
Replaces manual, error-prone, $5,000+ static security audits and fragmented explorer checks with an **autonomous 90-second machine-to-machine evaluation pipeline**. It buys verified intelligence from specialized, competitive Telegraph miners in parallel for just **$0.05 USDC total**, producing a mathematically signed, immutable listing risk memo.

### 03. What does it do today?
1. Accepts any token contract address or symbol.
2. Dispatches 5 parallel queries across key Telegraph intents:
   - `SMART_CONTRACT_AUDIT`: Static bytecode vulnerabilities and proxy backdoors.
   - `SANCTIONS_SCREENING_MATCH`: OFAC, EU, UN, and mixer association screening.
   - `ONCHAIN_METRIC_VERIFY`: Holder concentration, liquidity lock, and wash trading detection.
   - `SOCIAL_BOT_DETECTION`: Sybil manipulation and inorganic community hype analysis.
   - `SECURITY_REVIEW`: Drainer payloads and signature authorization exploit detection.
3. Normalizes miner responses into a unified **Risk Index (0-100)** and issues an actionable verdict (`APPROVED`, `CONDITIONAL`, or `REJECTED`).
4. Generates cryptographic receipts for every query with verifiable transaction hashes on Base Sepolia.

### 04. Why would someone adopt it?
It eliminates human bottleneck delays while establishing an audited, tamper-evident chain of custody. Exchanges and DeFi protocols cut diligence costs by >98% and avoid listing catastrophic drainers or sanctioned assets.

### 05. How can someone try it?
1. Clone this repository and run `npm run build && npm start`.
2. Use the built-in 1-click presets or paste any custom token contract address.
3. Use the 1-click **Simulate Funded Wallet** to test x402 spending without needing personal gas or real crypto.

---

## 🏗️ Architecture

```
                               ┌─────────────────────────────────┐
                               │       TELEGRAPH SENTINEL        │
                               │    Autonomous Listings Desk     │
                               └────────────────┬────────────────┘
                                                │
                        Parallel Dispatched x402 Queries ($0.01 each)
        ┌───────────────────┬───────────────────┼───────────────────┬───────────────────┐
        ▼                   ▼                   ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│SMART_CONTRACT│    │  SANCTIONS   │    │ONCHAIN_METRIC│    │  SOCIAL_BOT  │    │   SECURITY   │
│    AUDIT     │    │  SCREENING   │    │    VERIFY    │    │  DETECTION   │    │    REVIEW    │
└───────┬──────┘    └───────┬──────┘    └───────┬──────┘    └───────┬──────┘    └───────┬──────┘
        │                   │                   │                   │                   │
        └───────────────────┴───────────────────┼───────────────────┴───────────────────┘
                                                │
                                    Telegraph Protocol Engine
                                      (Node: 13.237.89.59)
                                                │
                                ┌───────────────┴───────────────┐
                                │   Base Sepolia Settlement     │
                                │   Diamond: 0x5a23...7ff8      │
                                │   Circle USDC: 0x036C...dCF7e │
                                └───────────────┬───────────────┘
                                                │
                                 Signed Executive Risk Memo
                                  Verdict: APPROVED / REJECTED
                                 Total Cost Line: $0.05 USDC
```

---

## 🛡️ Fair Play & Repository Verification

- [x] **Starred the Telegraph Bounties repository**: Required by Season II Rule §5 (`github.com/telegraphprotocol/bounties`).
- [x] **Deterministic Sandbox Mode**: Zero crashes in sterile environments without `.env`.
- [x] **Sanitized Server API**: Zero credential leakage or exposed internal traces.
- [x] **Verified On-Chain Permalinks**: Every receipt links directly to Base Sepolia testnet explorer records.
