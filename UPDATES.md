# Telegraph Hackathon Season II · Builder Updates

Documenting technical progress, consensus design, and testnet verification for **SkyClaim** (Track 03: Apps & Agents · Mission 15: Consumer Automation).

---

### Update 1: Working Backwards from Mission 15 (Consumer Automation)
**Date:** November 12, 2026  
**Focus:** Commercial Demand Architecture & Intent Discovery

- **The Problem:** Mission 15 calls for *"an agent that buys a verified disruption report and files the refund claim with the receipt attached"*. Passenger flight delays trigger statutory rights (€250–€600 under EU261 / UK261), but airlines reject claims claiming "extraordinary weather circumstances".
- **The Telegraph Fit:** Querying a single miner leaves the agent vulnerable to single-source error. By querying two independent miners (`TRAVEL_TRANSIT_LOCK` and `STORM_ALERT`), the agent proves the delay and pre-emptively disproves the weather defense.
- **Milestone Reached:** Formulated the **Consensus Before Action** rule: Claim is only filed if delay $\ge$ 180 min **and** weather miners report zero storm locks.

---

### Update 2: x402 Micropayments & Base Sepolia Diamond Settlement
**Date:** November 18, 2026  
**Focus:** Node Communication & Gasless EIP-712 Authorizations

- **Technical Implementation:** Connected to the live testnet node (`http://13.237.89.59:7044`) and the Base Sepolia Diamond (`0x5a2324aA18613FAD4e44bDF0d6c73Ec1f6D87ff8`).
- **x402 Flow:** Implemented client-side challenge parsing. When `/engine/v1/ask` returns `402`, the agent signs an EIP-712 `TransferWithAuthorization` using Circle USDC (`0x036CbD53842c5426634e7929541eC2318f3dCF7e`), and retries with the `PAYMENT-SIGNATURE` header.
- **Key Insight:** Gasless EIP-3009 transfers eliminate gas management friction for autonomous consumer agents.

---

### Update 3: Telegram Bot, Multi-Surface Access, & Zero-Config Resilience
**Date:** November 22, 2026  
**Focus:** Production Polish, Evaluator Simulator, & The 90-Second Rule

- **Telegram Bot (Grammy):** Implemented `/start`, `/claim`, `/receipts`, `/demo` with 1-click inline keyboard buttons.
- **Evaluator Simulator:** Added `npm run bot:sim` so reviewers without a Telegram bot token can test the exact conversation flow and receipts directly from the terminal.
- **Web Terminal:** Built the Next.js web application (`http://localhost:3000`) for visual 1-click review.
- **Zero-Config Sandbox Resilience:** Verified that the entire repository clones, builds, and runs cleanly with zero `.env` files present.
