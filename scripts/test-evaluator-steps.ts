import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import { verifyFlightDisruption } from "../lib/skyclaim-consensus";

async function main() {
  console.log("=".repeat(80));
  console.log("  SKYCLAIM EVALUATOR VERIFICATION: STEPS 2 & 3");
  console.log("=".repeat(80));

  // STEP 2: US Airport Today (JFK, 2026-11-23) - Live x402 purchase on Base Sepolia
  console.log("\n>>> RUNNING STEP 2: US Airport Today (JFK Departure, 2026-11-23)...");
  console.log("    Executing live x402 path against Telegraph node (no fixtures/mocks)...");

  const t0 = Date.now();
  const step2Res = await verifyFlightDisruption("JFK", "2026-11-23", false, 15, true);
  const latencyStep2 = Date.now() - t0;

  console.log(`\n  [Step 2 Result]:`);
  console.log(`  Flight:                  ${step2Res.flight.carrier} (${step2Res.flight.flightNumber})`);
  console.log(`  Route:                   ${step2Res.flight.origin} → ${step2Res.flight.destination}`);
  console.log(`  Date:                    ${step2Res.flight.flightDate}`);
  console.log(`  Data Badge:              ${step2Res.badge}`);
  console.log(`  Verdict:                 ${step2Res.verdict}`);
  console.log(`  Recommendation:          ${step2Res.recommendation}`);
  console.log(`  Entitlement:             ${step2Res.eligibleCompensationRange}`);
  console.log(`  Departure Weather:       ${step2Res.weather.departureWeather}`);
  console.log(`  Arrival Weather:         ${step2Res.weather.arrivalWeather}`);
  if (step2Res.receipt) {
    console.log(`  Telegraph Miner:         ${step2Res.receipt.minerName} (ID: ${step2Res.receipt.minerId})`);
    console.log(`  Cost Charged:            $${step2Res.receipt.costUsd} USDC`);
    console.log(`  On-Chain Tx Hash:        ${step2Res.receipt.txHash}`);
    console.log(`  BaseScan Explorer URL:   ${step2Res.receipt.basescanUrl}`);
  }
  console.log(`  Latency:                 ${latencyStep2}ms`);

  // STEP 3: LHR Flight with a Past Date (LHR, 2026-11-20)
  console.log("\n" + "-".repeat(80));
  console.log(">>> RUNNING STEP 3: LHR Flight with a Past Date (LHR, 2026-11-20)...");
  console.log("    Testing failure modes: Non-US departure & historical date...");

  const t1 = Date.now();
  const step3Res = await verifyFlightDisruption("LHR", "2026-11-20", false, 15, false);
  const latencyStep3 = Date.now() - t1;

  console.log(`\n  [Step 3 Result]:`);
  console.log(`  Flight:                  ${step3Res.flight.carrier} (${step3Res.flight.flightNumber})`);
  console.log(`  Route:                   ${step3Res.flight.origin} → ${step3Res.flight.destination}`);
  console.log(`  Date:                    ${step3Res.flight.flightDate}`);
  console.log(`  Data Badge:              ${step3Res.badge}`);
  console.log(`  Verdict:                 ${step3Res.verdict}`);
  console.log(`  Recommendation:          ${step3Res.recommendation}`);
  console.log(`  Entitlement:             ${step3Res.eligibleCompensationRange}`);
  console.log(`  Verdict Rationale:       ${step3Res.verdictRationale}`);
  console.log(`  Latency:                 ${latencyStep3}ms`);

  console.log("\n" + "=".repeat(80));
  console.log("  EVALUATION SUMMARY:");
  console.log(`  Step 2 Live Badge:       ${step2Res.badge} (Verdict: ${step2Res.verdict})`);
  console.log(`  Step 3 Fail-Closed:      ${step3Res.verdict} (Entitlement: ${step3Res.eligibleCompensationRange})`);
  console.log("=".repeat(80) + "\n");
}

main().catch(console.error);
