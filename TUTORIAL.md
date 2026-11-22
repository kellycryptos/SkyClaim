# Telegraph Sentinel · Developer Tutorial & Technical Guide

> **Learn how to build an autonomous machine-to-machine AI agent that buys intelligence over the x402 protocol with Base Sepolia settlement.**

---

## 1. What is Telegraph Protocol?

In traditional software, querying machine learning models requires centralized API keys, monthly subscriptions, and credit cards.

**Telegraph Protocol** changes this by treating machine intelligence as an on-chain graded commodity:
1. **Intents**: Standardized tasks (e.g. `SMART_CONTRACT_AUDIT`, `SANCTIONS_SCREENING_MATCH`).
2. **Miners**: Competing models, APIs, and algorithms that supply intelligence.
3. **Evaluators**: Measurement frameworks that score and rank miners by real accuracy and latency.
4. **x402 Micropayments**: HTTP-native payments where an API returns `402 Payment Required`, the client signs an EIP-712 payment authorization, and the response is delivered in under 1 second.

---

## 2. Anatomy of the Autonomous Due Diligence Loop

When a token is evaluated for exchange listing, **Telegraph Sentinel** executes this 4-step sequence:

```
[Agent Input: 0x1f984...]
          │
          ▼
1. Dispatch 5 Parallel HTTP Queries
   ├── POST /engine/v1/ask {"intent": "SMART_CONTRACT_AUDIT"}
   ├── POST /engine/v1/ask {"intent": "SANCTIONS_SCREENING_MATCH"}
   ├── POST /engine/v1/ask {"intent": "ONCHAIN_METRIC_VERIFY"}
   ├── POST /engine/v1/ask {"intent": "SOCIAL_BOT_DETECTION"}
   └── POST /engine/v1/ask {"intent": "SECURITY_REVIEW"}
          │
          ▼
2. Handle HTTP 402 Challenge & Sign EIP-712 Auth
   - Payer signs TransferWithAuthorization for $0.01 Circle USDC on Base Sepolia
   - Retries request with PAYMENT-SIGNATURE header
          │
          ▼
3. Autonomous Routing & Execution
   - Telegraph routes each query to the highest-ranked miner for that intent
   - Node facilitator settles payment against Base Sepolia Diamond contract
          │
          ▼
4. Synthesis & Signed Risk Memo
   - Collects 5 cryptographic receipts (hashes, ranks, confidence scores)
   - Computes weighted Risk Index (0-100)
   - Emits definitive listing verdict: APPROVED / CONDITIONAL / REJECTED
```

---

## 3. How to Use the Multi-Surface Interfaces

### Surface A: Web Terminal
```bash
npm run build && npm start
# Open http://localhost:3000
```
- Select 1-click presets for immediate demonstration.
- Click "The Receipt Box" in top navigation to inspect on-chain contract permalinks.

### Surface B: Autonomous Agent CLI
```bash
# Evaluate Uniswap V3 (Bluechip)
npm run agent -- 0x1f9840a85d5af5bf1d1762f925bdaddc4201f984 UNI

# Evaluate Malicious Drainer (Failure Case)
npm run agent -- 0xdead78a48b598fa20f6be8dc07386820ff5690b2 PEPE-DRAIN
```

### Surface C: Track 02 Evaluator Benchmark Harness
```bash
# Benchmark competing miners on ground-truth intent vectors
npm run benchmark
```

---

## 4. Key Contracts & Permalinks (Base Sepolia Chain ID 84532)

- **Telegraph Diamond:** `0x5a2324aA18613FAD4e44bDF0d6c73Ec1f6D87ff8`
- **Circle USDC:** `0x036CbD53842c5426634e7929541eC2318f3dCF7e`
- **Node Engine:** `http://13.237.89.59:7044`
