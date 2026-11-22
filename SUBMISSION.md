# Telegraph Hackathon Season II · Official Submission Form

## 1. Project Information
- **Project Name:** Telegraph Sentinel
- **Competition Track:** Track 03: Apps & Agents
- **Target Commercial Missions:** 
  - Mission 01: Exchange (Autonomous Listings Desk)
  - Mission 14: Web3 Native & DeFi (Smart Contract & Threat Sentinel)
- **Repository Link:** (Your GitHub Repo URL)
- **Live Demo Link:** `http://localhost:3000` (or hosted Vercel deployment)
- **GitHub Username (that starred bounties repo):** `[Your GitHub Username]`

---

## 2. Short Commercial Summary (Season II Official 5 Questions)

### Question 1: Who is it for?
Centralized exchanges (CEXs), DEX launchpads, liquidity venues, and institutional crypto funds that evaluate dozens of token listing applications each week and need immediate, trustworthy risk due diligence.

### Question 2: What does it improve?
Replaces $5,000+ manual audits and days of fragmented manual checks with an autonomous 90-second machine-to-machine evaluation pipeline costing only **$0.05 USDC total** across 5 parallel Telegraph intelligence subnets.

### Question 3: What does it do today?
Accepts any EVM token address or symbol, dispatches 5 parallel x402 queries (`SMART_CONTRACT_AUDIT`, `SANCTIONS_SCREENING_MATCH`, `ONCHAIN_METRIC_VERIFY`, `SOCIAL_BOT_DETECTION`, `SECURITY_REVIEW`), gathers competitive miner receipts on Base Sepolia, calculates a weighted Risk Index (0-100), and exports a signed listing risk memo with an exact cost line.

### Question 4: Why would someone adopt it?
Listing committees achieve instant 90-second listing turnarounds with mathematically verifiable chain of custody, preventing costly honeypot listings, sanctions compliance violations, or drainer exploits.

### Question 5: How can someone try it?
Clone the repository and run `npm install && npm run build && npm start`. The application features zero-config sandbox resilience with 3 interactive 1-click judge presets (Uniswap V3 Bluechip, PEPE Drainer, Tornado Cash Sanctioned Vault) and a 1-click test wallet simulation.

---

## 3. Protocol Evidence & Transaction Accounting
- **Telegraph Diamond Contract (Base Sepolia):** `0x5a2324aA18613FAD4e44bDF0d6c73Ec1f6D87ff8`
- **Circle USDC x402 Gate:** `0x036CbD53842c5426634e7929541eC2318f3dCF7e`
- **Telegraph Testnet Node:** `http://13.237.89.59:7044` (2,189 active miners indexed)
- **Settlement:** Gasless EIP-712 `TransferWithAuthorization` micro-payments ($0.01 per intent query).

---

## 4. Judging Demo Script (2-5 minutes walkthrough)
1. **0:00 - 0:45**: Introduction to the problem — exchanges face hours of diligence per token.
2. **0:45 - 1:30**: 1-Click Bluechip Preset (UNI) — show parallel query dispatch, 5 settled x402 receipts, $0.05 cost line, and APPROVED listing verdict.
3. **1:30 - 2:30**: 1-Click Honeypot / Drainer Preset — demonstrate detection of hidden proxy backdoors, 99% creator tax, and automatic REJECTED verdict.
4. **2:30 - 3:00**: Click "The Receipt Box" — show live Base Sepolia Diamond contract, Circle USDC EIP-3009 transfers, and exportable signed risk memo.
