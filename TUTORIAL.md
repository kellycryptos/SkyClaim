# SkyClaim · Technical Tutorial & Architecture Guide

> **Learn how to build an autonomous Telegram bot that verifies real-world flight disruptions using Telegraph Protocol's x402 micropayments on Base Sepolia.**

---

## 1. The Real-World Disruption Problem

Under European Regulation (EC) No 261/2004 and UK Air Passenger Rights:
- Flights delayed $> 3$ hours on arrival entitle passengers to **€250, €400, or €600** (depending on flight distance).
- **The Airline Defense:** Under Article 5(3), airlines are exempt from paying if they prove the delay was caused by *"extraordinary circumstances which could not have been avoided"*, most commonly claiming weather or air traffic control.

**SkyClaim** solves this using **Consensus Before Action**:
Instead of trusting the passenger or the airline, an autonomous agent queries two independent Telegraph miners:
1. A **Transit Telemetry Miner** to verify the exact gate arrival delay.
2. A **Meteorological Hazard Miner** to check active storm locks at departure and arrival hubs.

Only when both miners agree that the delay occurred **and** no severe weather conditions existed is the claim green-lit.

---

## 2. The x402 Micropayment Protocol on Base Sepolia

Every intelligence check on SkyClaim is an on-chain paid API request:
1. The bot makes an HTTP call to the Telegraph node (`POST /engine/v1/ask`).
2. The node challenges with `HTTP 402 Payment Required` with a base64 challenge containing the price (`10000` micro-USDC = $0.01) and asset address.
3. The agent signs an EIP-712 typed data payload: `TransferWithAuthorization` (EIP-3009) for Circle USDC (`0x036CbD53842c5426634e7929541eC2318f3dCF7e`) on Base Sepolia (`84532`).
4. The signed authorization is sent in the `PAYMENT-SIGNATURE` header.
5. The facilitator submits the settlement on-chain, and the node returns the miner's verified response and cryptographic receipt.

Total cost for 2 independent miner queries: **$0.02 USDC**.

---

## 3. How to Run & Test

### Surface A: Web Terminal
```bash
npm run build && npm start
# Open http://localhost:3000
```
- 1-Click presets for BA178, DL401, AF112.
- Inspect the BaseScan receipts and download the generated claim letter.

### Surface B: Telegram Bot & Evaluator Simulator
```bash
# Run terminal simulator for instant evaluator testing
npm run bot:sim

# Run live Telegram bot (set TELEGRAM_BOT_TOKEN in .env)
npm run bot
```

### Surface C: Automated CI/CD Suite
```bash
npm test
```
Verifies all 3 consensus scenarios deterministically with zero environment variables needed.
