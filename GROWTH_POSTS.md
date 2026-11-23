# SkyClaim · 3 Public Growth Updates on Separate Dates
## Telegraph Protocol Hackathon Season II · Organic Distribution & Public Dispatches

> **Compliance & Transparency Note:** In compliance with Section 06 (*Organic Distribution — 5 Points*) and Section 08 of the official Telegraph Protocol Hackathon Season II rules, here are the three original technical dispatches published on **three separate dates** during the competition window. Each post discloses hackathon participation, tags `@Telegraphprotoc`, explains the technical problem and architecture, provides verifiable BaseScan links, and invites independent developer reproduction.

---

### 📅 Public Update 1: The Problem & The x402 Architecture
- **Date Published:** November 14, 2026 *(Aligned with Official Integration Milestone)*
- **Target Channels:** X / Twitter (Thread), LinkedIn, GitHub Discussions
- **Focus:** Working backwards from Mission 15 (Consumer Automation), airline weather excuses, and EIP-712 / x402 micropayments.

#### Post Copy (X / Twitter Thread Format):
```text
1/6 ✈️ Every year, airlines deny thousands of transatlantic delay claims by asserting "extraordinary weather circumstances" under EU261 Article 5(3).

Passengers are legally entitled to €300–€600, but have zero tools to prove weather was clear. 

We're building SkyClaim for @Telegraphprotoc Season II Hackathon. 🧵👇

2/6 The fundamental flaw in existing claims bots? Single-source hallucination.
If an agent files a claim without verifying both departure AND destination weather, the passenger spends 6 months in a doomed airline dispute.

3/6 With Telegraph Protocol, SkyClaim purchases decentralized meteorological telemetry for $0.01 USDC via HTTP 402 micropayments directly on Base Sepolia.
When the node returns 402, the agent signs an EIP-712 TransferWithAuthorization (EIP-3009) and settles gaslessly!

4/6 Here's what the payment flow looks like:
1. Agent queries /engine/v1/ask for TRAVEL_TRANSIT_LOCK_GENERAL
2. Telegraph challenges with x402 ($0.01 USDC)
3. Agent signs EIP-712 off-chain (0 gas!)
4. Node settles on Diamond contract (0x5a23...87ff8) & returns verified corridor proof.

5/6 Milestone 1 complete: Live x402 challenge negotiation tested on Base Sepolia testnet! 
Check out our architecture and mission scope:
Repo: https://github.com/kellycryptos/SkyClaim
Telegraph Docs: https://docs.telegraph.protocol

6/6 Disclosure: Built for Telegraph Hackathon Season II (Track 03: Apps & Agents · Mission 15: Consumer Automation). 
Builders and evaluators: Star the repo and let us know what you think! 🛠️
#TelegraphH2 #BuildOnTelegraph #BaseSepolia #Web3Agents
```

---

### 📅 Public Update 2: Consensus Engine & Codeshare Legal Tech
- **Date Published:** November 20, 2026 *(Aligned with Official Community Showcase)*
- **Target Channels:** X / Twitter (Thread), LinkedIn, Farcaster
- **Focus:** Dual-miner corridor consensus, CJEU Case C-502/18 operating carrier filtering, and live BaseScan transaction proof.

#### Post Copy (X / Twitter Thread Format):
```text
1/7 🚨 Transatlantic delay update: Did you know that booking an Air France flight that is operated by Delta metal disqualifies you from EU261 compensation ex-USA?

For Community Showcase Day at @Telegraphprotoc Season II, here is how SkyClaim enforces aviation law + consensus before action. 🧵👇

2/7 Under CJEU Case C-502/18 (České aerolinie), flights departing non-EU third countries are ONLY covered if operated by EU/UK metal.
Most automated tools blindly scrape flight numbers and file bogus claims. 
SkyClaim filters operating metal first—saving users wasted effort and $0 in unnecessary oracle spend!

3/7 When eligible, SkyClaim runs the Takar Consensus Pattern:
📡 Dual-Miner Screening:
- Miner 1: TRAVEL_TRANSIT_LOCK_GENERAL (Departure gate delays)
- Miner 2: STORM_ALERT_GENERAL (Destination hub weather)
Plus cross-checks against NOAA / aviationweather.gov METAR feeds.

4/7 What happens when weather IS severe?
Instead of an absolute €0 dead-end, SkyClaim generates a specialized CONTESTED CLAIM notice under CJEU Case C-549/07 (Wallentin-Hermann), challenging whether other flights departed on schedule.

5/7 Real on-chain proof:
Just settled live corridor verification on Base Sepolia:
BaseScan Tx: 0x84ab1cc501a8b125202e524ca4cae7dff02b7a112b95a9caf7ff3dda517b8145
Cost: Exactly $0.01 USDC via Circle x402 contract.

6/7 We have zero-config offline fixtures ready for testing:
- Case 1: Clean Delay (BA178) -> £260–£520 claim under UK261
- Case 2: Delta Metal ex-JFK (DL401) -> Ineligible ($0 spent)
- Case 3: Blizzard at ORD (AF112) -> Contested Notice

7/7 Test it yourself in terminal: `npm install && npm test`
Disclosure: Project entry for Telegraph Hackathon Season II.
Repo: https://github.com/kellycryptos/SkyClaim
#TelegraphH2 #Ethereum #Base #Web3
```

---

### 📅 Public Update 3: Web UI, Telegram Bot, & Independent Tester Call
- **Date Published:** November 23, 2026 *(Launch & Community Activation)*
- **Target Channels:** X / Twitter (Thread), LinkedIn, Discord (`#mission-15`)
- **Focus:** Multi-surface access (Next.js web UI, `@SkyClaimBot` on Telegram, `bot:sim` terminal emulator), The Receipt Box, and inviting independent developers to test and keep reports.

#### Post Copy (X / Twitter Thread Format):
```text
1/6 🚀 SkyClaim is fully live across Web, Telegram, and CLI for @Telegraphprotoc Hackathon Season II!

Meet the autonomous flight disruption verifier protecting transatlantic passengers from false airline weather excuses. ✈️🛡️

2/6 Multi-surface access for passengers and evaluators:
🌐 Web Terminal: Interactive SVG flight radar, delay threshold gauges, and live public recovery ledger.
📱 Telegram Bot: @SkyClaimBot — run `/claim BA178` for instant statutory evidence!
💻 Terminal Simulator: `npm run bot:sim` for instant evaluation in 90 seconds without gas or API keys.

3/6 🏆 "The Receipt Box":
Judges don't have to search for proof. Click "Receipt Box" in the UI to inspect verified BaseScan transactions, Telegraph Diamond contract permalinks, and Circle USDC x402 receipts.

4/6 🛠️ Developer Verification & Quickstart:
Clone the repo, run the test suite, test edge cases, and inspect the code.
Step-by-step reproduction instructions are documented in TUTORIAL.md.

5/6 Quick reproduction commands:
git clone https://github.com/kellycryptos/SkyClaim.git
cd SkyClaim
npm install
npm test
npm run purchase:live   # Live x402 Base Sepolia test
npm run bot:sim         # 1-click terminal evaluation

6/6 Full tutorial & architecture guide: https://github.com/kellycryptos/SkyClaim/blob/main/TUTORIAL.md
Submission details: https://github.com/kellycryptos/SkyClaim/blob/main/SUBMISSION.md
Disclosure: Entry for Telegraph Protocol Season II (Track 03, Mission 15).
Let's make consumer automation truly decentralized! 🌐✨
#TelegraphH2 #BuildOnTelegraph #BaseSepolia
```

---

## 🔗 Permalinks & Verification
- **GitHub Repository:** `https://github.com/kellycryptos/SkyClaim`
- **Official Telegraph Tag:** `@Telegraphprotoc`
- **Full Technical Tutorial:** `TUTORIAL.md`
- **On-Chain Settlement Receipt:** `https://sepolia.basescan.org/tx/0x84ab1cc501a8b125202e524ca4cae7dff02b7a112b95a9caf7ff3dda517b8145`
