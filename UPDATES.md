# Telegraph Hackathon Season II · Builder Updates

Documenting progress, technical milestones, and lessons learned building **Telegraph Sentinel** for Season II (Track 03: Apps & Agents · Missions 01 & 14).

---

### Update 1: Working backwards from the Exchange Listing Desk
**Date:** November 12, 2026  
**Focus:** Commercial Demand Architecture & Intent Discovery

- **The Problem:** We analyzed the 15 commercial missions in Season II and zeroed in on Mission 01 (Exchange) and Mission 14 (Web3 DeFi). Centralized exchanges and launchpads evaluate 50+ token listing applications weekly. Doing manual security reviews, sanctions lookups, and liquidity audits takes 4-8 hours per token and costs $5,000+.
- **The Telegraph Fit:** Telegraph allows an agent to fire parallel paid requests to specialized miners across 5 key intents: `SMART_CONTRACT_AUDIT`, `SANCTIONS_SCREENING_MATCH`, `ONCHAIN_METRIC_VERIFY`, `SOCIAL_BOT_DETECTION`, and `SECURITY_REVIEW`.
- **Milestone Reached:** Mapped out the autonomous loop architecture: an agent dispatches 5 requests, collects cryptographic receipts, and produces a single signed Listing Risk Memo with a $0.05 USDC cost line.

---

### Update 2: x402 Micropayments & Base Sepolia Integration
**Date:** November 18, 2026  
**Focus:** Node Communication & EIP-712 Payment Settlement

- **Technical Implementation:** Connected our pipeline to the live Telegraph testnet node (`http://13.237.89.59:7044`) and the Base Sepolia Diamond contract (`0x5a2324aA18613FAD4e44bDF0d6c73Ec1f6D87ff8`).
- **x402 Flow:** Implemented the client-side HTTP 402 challenge handler. When querying `/engine/v1/ask`, the server challenges with `Payment-Required`. The agent signs an EIP-712 `TransferWithAuthorization` using Circle USDC (`0x036CbD53842c5426634e7929541eC2318f3dCF7e`), and retries with the `PAYMENT-SIGNATURE` header.
- **Key Lesson:** Gasless EIP-3009 transfers enable agents to execute micro-payments without managing Base Sepolia ETH gas buffers. The PayAI facilitator submits the transaction on-chain.

---

### Update 3: Terminal UI, Evaluator Benchmark, & Zero-Config Resilience
**Date:** November 22, 2026  
**Focus:** Production Polish, Evaluator Harness, & The 90-Second Judge Rule

- **Radical Simplicity UI:** Built the Web Terminal with Linear/Apple Notes design aesthetics. Eliminated all unnecessary helper clutter.
- **The 90-Second Rule:** Added 3 interactive presets (Uniswap V3, Malicious Drainer, Tornado Cash Sanctions) and a 1-click simulated wallet so evaluators can test the entire pipeline in under 90 seconds without configuring RPCs or wallets.
- **Multi-Surface Access:** Created the standalone CLI Agent (`npm run agent`) and the Track 02 Evaluator Benchmark harness (`npm run benchmark`) testing miner quality across 8 ground-truth vectors.
- **Zero-Config Resilience:** Audited the repository to guarantee clean boots and deterministic test passes with zero `.env` files present.
