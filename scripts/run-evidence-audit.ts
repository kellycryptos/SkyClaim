import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import { ethers } from "ethers";
import { SKYCLAIM_CONFIG, verifyFlightDisruption, queryLiveTelegraphWeather } from "../lib/skyclaim-consensus";
import { createSolanaPaymentFetch } from "../lib/solana-x402";

async function test1A_BaseJFK() {
  console.log("\n===========================================================================");
  console.log("  [TEST 1A] LIVE PURCHASE ON BASE AGAINST JFK (TODAY)");
  console.log("===========================================================================");
  const today = new Date().toISOString().split("T")[0]; // 2026-11-24
  console.log(`Running query: JFK | Date: ${today} | Rail: Base Sepolia`);
  
  try {
    const res = await verifyFlightDisruption("JFK", today, false, 15, true, "base");
    console.log("Verdict:               ", res.verdict);
    console.log("Badge:                 ", res.badge);
    console.log("Recommendation Text:   ", res.recommendationText);
    console.log("Statutory Compensation:", res.eligibleCompensationRange);
    console.log("Departure Weather:     ", res.weather.departureWeather);
    console.log("Severe Alert Active:   ", res.weather.hasSevereStormAlert);
    console.log("Receipt Settled:       ", res.receipt ? res.receipt.settled : false);
    console.log("Receipt Cost USD:      ", res.receipt ? res.receipt.costUsd : 0);
    console.log("Miner Name:            ", res.receipt ? res.receipt.minerName : "none");
    console.log("Miner ID:              ", res.receipt ? res.receipt.minerId : "none");
    console.log("Tx Hash:               ", res.receipt ? res.receipt.txHash : "none");
    console.log("Signal Hash:           ", res.receipt ? res.receipt.signalHash : "none");
    console.log("Basescan Link:         ", res.receipt ? res.receipt.basescanUrl : "none");
  } catch (err: any) {
    console.error("Test 1A error:", err.message);
  }
}

async function test1B_PastDateLHR() {
  console.log("\n===========================================================================");
  console.log("  [TEST 1B] QUERY FOR LHR WITH PAST DATE (2026-11-15)");
  console.log("===========================================================================");
  const pastDate = "2026-11-15";
  console.log(`Running query: LHR | Date: ${pastDate} | Rail: Base Sepolia`);

  try {
    const res = await verifyFlightDisruption("LHR", pastDate, false, 15, true, "base");
    console.log("Verdict:               ", res.verdict);
    console.log("Badge:                 ", res.badge);
    console.log("Recommendation Text:   ", res.recommendationText);
    console.log("Statutory Compensation:", res.eligibleCompensationRange);
    console.log("Verdict Rationale:     ", res.verdictRationale);
    console.log("Receipt Exists:        ", Boolean(res.receipt));
    console.log("Cost USD:              ", res.totalCostUsd);
  } catch (err: any) {
    console.error("Test 1B error:", err.message);
  }
}

async function test1C_Miner9002FullJson() {
  console.log("\n===========================================================================");
  console.log("  [TEST 1C] FULL RAW JSON FROM MINER 9002 (TxLens ON DEVNODE)");
  console.log("===========================================================================");
  try {
    const paymentFetch = await createSolanaPaymentFetch();
    const askUrl = "https://devnode.telegraphprotocol.com/engine/v1/ask";
    const reqBody = {
      intent: "TRAVEL_TRANSIT_LOCK_GENERAL",
      params: { booking: "JFK-LHR" },
    };
    console.log(`Querying ${askUrl} with intent: TRAVEL_TRANSIT_LOCK_GENERAL`);

    const res = await paymentFetch(askUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqBody),
    });

    console.log(`HTTP Status: ${res.status} ${res.statusText}`);
    const json = await res.json();
    console.log("\n--- EXACT RAW JSON FROM TELEGRAPH NODE ---");
    console.log(JSON.stringify(json, null, 2));
    console.log("------------------------------------------");

    const paymentResponseHdr = res.headers.get("payment-response");
    if (paymentResponseHdr) {
      console.log("\nPayment-Response Header (Base64 decoded):");
      try {
        console.log(Buffer.from(paymentResponseHdr, "base64").toString("utf-8"));
      } catch {
        console.log(paymentResponseHdr);
      }
    }
  } catch (err: any) {
    console.error("Test 1C error:", err.message);
  }
}

async function test2_ExplorerCheck() {
  console.log("\n===========================================================================");
  console.log("  [STEP 2] ON-CHAIN EXPLORER / RPC CHECKS");
  console.log("===========================================================================");

  // 1. Check Base hash 0x84ab1cc5...
  const baseHash = "0x84ab1cc501a8b125202e524ca4cae7dff02b7a112b95a9caf7ff3dda517b8145";
  console.log(`Checking Base Sepolia hash: ${baseHash}`);
  try {
    const provider = new ethers.JsonRpcProvider("https://sepolia.base.org");
    const tx = await provider.getTransaction(baseHash);
    const receipt = await provider.getTransactionReceipt(baseHash);
    if (tx && receipt) {
      console.log(`  ✓ Base Tx Found! Block: ${receipt.blockNumber}, Status: ${receipt.status === 1 ? 'SUCCESS' : 'FAILED'}`);
      console.log(`    From: ${tx.from} -> To: ${tx.to}`);
      for (const log of receipt.logs) {
        // USDC Transfer event topic: 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef
        if (log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef') {
          const from = ethers.getAddress('0x' + log.topics[1].slice(26));
          const to = ethers.getAddress('0x' + log.topics[2].slice(26));
          const amount = Number(BigInt(log.data)) / 1e6;
          console.log(`    USDC Transfer: ${amount} USDC from ${from} to ${to}`);
        }
      }
    } else if (tx) {
      console.log(`  ✓ Base Tx Found in mempool! (Pending receipt)`);
    } else {
      console.log(`  ✕ Base Tx NOT FOUND on Base Sepolia RPC (Transaction was not broadcast or mined on-chain).`);
    }
  } catch (e: any) {
    console.log(`  ⚠ Base RPC check error: ${e.message}`);
  }

  // 2. Check live Base hash 0xe08fd142... (Research probe)
  const baseHash2 = "0xe08fd142ee4e3ad4a353e074615682c3b5c19c71b5d34a301ba81c9e6064d9db";
  console.log(`\nChecking Base Sepolia research probe hash: ${baseHash2}`);
  try {
    const provider = new ethers.JsonRpcProvider("https://sepolia.base.org");
    const tx2 = await provider.getTransaction(baseHash2);
    const receipt2 = await provider.getTransactionReceipt(baseHash2);
    if (tx2 && receipt2) {
      console.log(`  ✓ Base Research Probe Tx Found! Block: ${receipt2.blockNumber}, Status: ${receipt2.status === 1 ? 'SUCCESS' : 'FAILED'}`);
      console.log(`    From: ${tx2.from} -> To: ${tx2.to}`);
      for (const log of receipt2.logs) {
        if (log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef') {
          const from = ethers.getAddress('0x' + log.topics[1].slice(26));
          const to = ethers.getAddress('0x' + log.topics[2].slice(26));
          const amount = Number(BigInt(log.data)) / 1e6;
          console.log(`    USDC Transfer: ${amount} USDC from ${from} to ${to}`);
        }
      }
    } else {
      console.log(`  ℹ Status on Base Sepolia: tx=${Boolean(tx2)}, receipt=${Boolean(receipt2)}`);
    }
  } catch (e: any) {
    console.log(`  ⚠ Base RPC check error: ${e.message}`);
  }

  // 3. Check Solana Devnet signature 5P4mbeGF...
  const solSig = "5P4mbeGFaggKaFNoz1mbH9XWM9RJ8Yz7exKYg9oTrhi1hKp6VuLdXF3Dk2Eep1UAccyq6UMMx8DX6E84pCWRKyR5";
  console.log(`\nChecking Solana Devnet signature: ${solSig}`);
  try {
    const solRes = await fetch("https://api.devnet.solana.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getTransaction",
        params: [solSig, { encoding: "jsonParsed", maxSupportedTransactionVersion: 0 }]
      })
    });
    const solData = await solRes.json();
    if (solData.result) {
      console.log(`  ✓ Solana Tx Found on Devnet! Slot: ${solData.result.slot}, Error: ${solData.result.meta?.err || 'None (Success)'}`);
      console.log(`  ✓ Fee Paid: ${solData.result.meta?.fee} lamports`);
      const postTokenBalances = solData.result.meta?.postTokenBalances || [];
      const preTokenBalances = solData.result.meta?.preTokenBalances || [];
      console.log(`  ✓ Token Balances changed: ${preTokenBalances.length} pre, ${postTokenBalances.length} post`);
    } else {
      console.log(`  ℹ Solana Devnet response:`, solData.result ?? solData.error ?? 'Pending or not indexed');
    }
  } catch (e: any) {
    console.log(`  ⚠ Solana RPC check error: ${e.message}`);
  }
}

async function main() {
  await test1A_BaseJFK();
  await test1B_PastDateLHR();
  await test1C_Miner9002FullJson();
  await test2_ExplorerCheck();
  console.log("\n===========================================================================");
  console.log("  EVIDENCE AUDIT RUN COMPLETE");
  console.log("===========================================================================\n");
}

main().catch(console.error);
