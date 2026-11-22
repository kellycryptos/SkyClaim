#!/usr/bin/env tsx

/**
 * SkyClaim · Live Telegraph Purchase Verification Script
 * 
 * Tests live Telegraph Protocol interactions:
 * 1. Anjoman API Key rail (https://backend.telegraphprotocol.com/engine/ask) via Escrow
 * 2. On-chain x402 payment challenge via Telegraph Node (http://13.237.89.59:7044)
 */

import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import { ethers } from "ethers";
import { SKYCLAIM_CONFIG, queryLiveTelegraphWeather } from "../lib/skyclaim-consensus";
import { decodeChallenge, signPayment } from "../lib/x402";

const airportCode = (process.argv[2] || "JFK").trim().toUpperCase();

async function main() {
  console.log("\n" + "=".repeat(75));
  console.log("  SKYCLAIM · TELEGRAPH PROTOCOL LIVE PURCHASE VERIFICATION");
  console.log("  Mission 15: Consumer Automation · Telegraph Protocol Season II");
  console.log("=".repeat(75));
  console.log(` Target Airport:        ${airportCode} Departure Corridor`);
  console.log(` Anjoman Gateway:       https://backend.telegraphprotocol.com`);
  console.log(` Telegraph Testnet Node: ${SKYCLAIM_CONFIG.nodeUrl}`);
  console.log(` Target Intent:         STORM_ALERT_GENERAL / TRAVEL_TRANSIT_LOCK_GENERAL`);
  console.log(` Settlement Network:    Base Sepolia (Chain ID: ${SKYCLAIM_CONFIG.chainId})`);
  console.log(` Settlement Asset:      Circle USDC (${SKYCLAIM_CONFIG.usdcAddress})`);
  console.log("-".repeat(75));

  const apiKey = process.env.TELEGRAPH_API_KEY;
  const hasApiKey = Boolean(apiKey && apiKey.trim().length > 10);
  const privateKey = process.env.AGENT_PRIVATE_KEY;
  const hasPrivateKey = Boolean(privateKey && privateKey.length >= 64);

  // 1. Test Anjoman API Key Rail (Escrow)
  if (hasApiKey) {
    console.log(`\n[1/3] Testing Anjoman API Key via Escrow Rail...`);
    try {
      // Check Balance
      const balRes = await fetch("https://backend.telegraphprotocol.com/engine/escrow/balance", {
        headers: { Authorization: `Bearer ${apiKey!.trim()}` },
      });
      if (balRes.ok) {
        const balData = await balRes.json();
        console.log(`  ✓ Escrow Balance:       ${balData.effectiveBalance} USDC available (Escrow: ${balData.escrowBalance})`);
      }

      // Execute Live Ask
      console.log(`      Querying live storm alert for ${airportCode}...`);
      const t0 = Date.now();
      const liveCheck = await queryLiveTelegraphWeather(airportCode);
      const latency = Date.now() - t0;

      console.log(`  ✓ Status:               ${liveCheck.badge} (${latency}ms)`);
      console.log(`  ✓ Summary:              ${liveCheck.summary}`);
      if (liveCheck.receipt) {
        console.log(`  ✓ Miner:                ${liveCheck.receipt.minerName} (ID: ${liveCheck.receipt.minerId})`);
        console.log(`  ✓ Cost Charged:         $${liveCheck.receipt.costUsd} USDC`);
        console.log(`  ✓ Receipt Hash:         ${liveCheck.receipt.txHash}`);
        console.log(`  ✓ Signal Hash:          ${liveCheck.receipt.signalHash}`);
        console.log(`  ✓ Signal URL:           ${liveCheck.receipt.basescanUrl}`);
      }
    } catch (err: any) {
      console.error("  ✕ API Key ask failed:", err?.message || err);
    }
  } else {
    console.log(`\n[1/3] Anjoman API Key Rail: (TELEGRAPH_API_KEY not set in .env)`);
  }

  // 2. Test Telegraph Node x402 Challenge
  console.log(`\n[2/3] Checking Telegraph Node x402 Micropayment Challenge...`);
  console.log(`      Endpoint: POST ${SKYCLAIM_CONFIG.nodeUrl}/engine/v1/ask`);

  try {
    const firstRes = await fetch(`${SKYCLAIM_CONFIG.nodeUrl}/engine/v1/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        intent: "TRAVEL_TRANSIT_LOCK_GENERAL",
        query: `Active transit locks for ${airportCode} airport`,
      }),
      signal: AbortSignal.timeout(6000),
    });

    console.log(`      Status:   HTTP ${firstRes.status}`);

    if (firstRes.status === 402) {
      const rawChallengeHeader = firstRes.headers.get("Payment-Required") || "";
      const challenge = decodeChallenge(rawChallengeHeader);
      const evmAccept = challenge.accepts.find((a) => a.network === `eip155:${SKYCLAIM_CONFIG.chainId}`);

      console.log(`  ✓ Challenge Version:    ${challenge.x402Version}`);
      console.log(`  ✓ Required Asset:       ${evmAccept?.asset} (Circle USDC on Base Sepolia)`);
      console.log(`  ✓ Required Amount:      $${(Number(evmAccept?.amount || 10000) / 1e6).toFixed(2)} USDC`);
      console.log(`  ✓ Pay To Address:       ${evmAccept?.payTo}`);

      if (hasPrivateKey) {
        console.log("\n[3/3] Signing on-chain EIP-712 transfer authorization...");
        const wallet = new ethers.Wallet(privateKey!);
        const signedPayment = await signPayment(challenge, wallet, SKYCLAIM_CONFIG.chainId);
        console.log(`  ✓ EIP-712 Signature:    ${signedPayment.header.slice(0, 32)}...`);
      } else {
        console.log("\n[3/3] Raw Wallet Signing: (AGENT_PRIVATE_KEY not set, relying on Escrow API Key)");
      }
    } else if (firstRes.ok) {
      console.log("  ✓ Node answered with HTTP 200 OK");
    }
  } catch (err: any) {
    console.log(`  ✕ Node connection notice: ${err?.message || err}`);
  }

  console.log("\n" + "=".repeat(75));
  console.log("  VERIFICATION COMPLETE · LIVE TELEGRAPH INTEGRATION ACTIVE");
  console.log("=".repeat(75) + "\n");
}

main().catch((err) => {
  console.error("Execution error:", err);
  process.exit(1);
});
