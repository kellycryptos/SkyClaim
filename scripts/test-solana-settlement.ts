import assert from "assert";

async function runSolanaTests() {
  console.log("=== SOLANA INSTITUTIONAL SETTLEMENT ASSURANCE (SISA) TEST SUITE ===");

  const {
    verifySolanaSettlement,
    SOLANA_SETTLEMENT_PRESETS,
    INITIAL_SOLANA_LEDGER,
  } = await import("../lib/solana-settlement");

  // 1. Verify 3 Reviewer Presets
  console.log("[1/5] Validating 3 Reviewer Acceptance Presets (Cases S1, S2, S3)...");
  assert.strictEqual(SOLANA_SETTLEMENT_PRESETS.length, 3, "Must have exactly 3 Solana presets");
  console.log("  ✓ 3 presets loaded (SETTLE-USD-250K, SETTLE-SANCTION-100K, SETTLE-RWA-500K)");

  // 2. Scenario S1: Clean Regulated Settlement ($250k USDC)
  console.log("[2/5] Testing Case S1: Regulated Prime Broker Settlement ($250k USDC)...");
  const res1 = await verifySolanaSettlement("SETTLE-USD-250K", true);
  assert.strictEqual(res1.verdict, "SETTLEMENT_AUTHORIZED", "S1 must be SETTLEMENT_AUTHORIZED");
  assert.strictEqual(res1.badge, "FIXTURE", "Must carry FIXTURE badge");
  assert.strictEqual(res1.transferAmountUsd, 250000, "Amount must be $250,000");
  assert.strictEqual(res1.counterparty.sanctionsStatus, "CLEAN", "Sanctions must be CLEAN");
  assert.strictEqual(res1.circuitBreakerEngaged, false, "Circuit breaker must not engage");
  assert(res1.telegraphReceipts.length > 0, "Must have Telegraph telemetry receipts");
  assert.strictEqual(res1.payShSupported, true, "Must support Pay.sh settlement");
  console.log(`  ✓ Case S1 passed: ${res1.verdict} ($${res1.transferAmountUsd.toLocaleString()} ${res1.tokenSymbol}) [${res1.badge}]`);

  // 3. Scenario S2: Sanctioned Beneficial Owner Interception ($100k Transfer)
  console.log("[3/5] Testing Case S2: Intercepted Sanctioned Entity ($100k Transfer)...");
  const res2 = await verifySolanaSettlement("SETTLE-SANCTION-100K", true);
  assert.strictEqual(res2.verdict, "FAIL_CLOSED_SANCTIONS", "S2 must trigger FAIL_CLOSED_SANCTIONS");
  assert.strictEqual(res2.badge, "FIXTURE", "Must carry FIXTURE badge");
  assert.strictEqual(res2.counterparty.sanctionsStatus, "BLOCKED", "Counterparty must be BLOCKED");
  assert.strictEqual(res2.circuitBreakerEngaged, true, "Circuit breaker must be engaged");
  assert(res2.settlementDossier.includes("CIRCUIT BREAKER"), "Dossier must document halt");
  console.log(`  ✓ Case S2 passed: ${res2.verdict} (Beneficial owner flagged in updated OFAC SDN list) [${res2.badge}]`);

  // 4. Scenario S3: Living RWA Reserve Discrepancy ($500k USDY Redemption)
  console.log("[4/5] Testing Case S3: Living RWA Off-Chain Reserve Discrepancy ($500k USDY)...");
  const res3 = await verifySolanaSettlement("SETTLE-RWA-500K", true);
  assert.strictEqual(res3.verdict, "FAIL_CLOSED_RESERVE_DISCREPANCY", "S3 must trigger FAIL_CLOSED_RESERVE_DISCREPANCY");
  assert.strictEqual(res3.badge, "FIXTURE", "Must carry FIXTURE badge");
  assert(res3.rwaProfile !== undefined, "Must include RWA asset profile");
  assert.strictEqual(res3.rwaProfile?.attestationStatus, "DISCREPANCY_FLAGGED", "Attestation status must be DISCREPANCY_FLAGGED");
  assert.strictEqual(res3.circuitBreakerEngaged, true, "Circuit breaker must engage on reserve gap");
  assert(res3.settlementDossier.includes("FAIL_CLOSED_RESERVE_DISCREPANCY"), "Dossier must detail bank lien");
  console.log(`  ✓ Case S3 passed: ${res3.verdict} (Off-chain $2.4M bank lien caught prior to redemption) [${res3.badge}]`);

  // 5. Scenario S4: Honest Data Boundaries for Free-Input Queries
  console.log("[5/5] Testing Free-Input Simulation & Honest Data Boundaries...");
  const simRes = await verifySolanaSettlement("CUSTOM-QUERY", false, {
    amountUsd: 75000,
    counterpartyName: "Standard OTC Desk",
    tokenSymbol: "USDC",
  });
  assert.strictEqual(simRes.badge, "SIMULATED", "Free input query must carry SIMULATED badge");
  assert.strictEqual(simRes.telegraphReceipts[0].signature, undefined, "Simulated queries must never invent fake signatures");
  assert.strictEqual(simRes.totalCostUsd, 0, "Simulated evaluation cost must be $0.00");
  console.log(`  ✓ Free-input simulation passed: ${simRes.verdict} [${simRes.badge}]`);

  console.log("\n=== ALL SOLANA INSTITUTIONAL ACCEPTANCE TESTS PASSED (100% GREEN) ===\n");
}

runSolanaTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
