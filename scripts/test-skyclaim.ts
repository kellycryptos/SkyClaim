const assert = require("assert");

async function runTests() {
  console.log("=== SKYCLAIM: ZERO-ENV SANDBOX CI/CD TEST SUITE ===");

  // Dynamically import compiled or transpiled modules
  const { verifyFlightDisruption, SKYCLAIM_PRESETS, SKYCLAIM_CONFIG } = await import("../lib/skyclaim-consensus");

  // 1. Verify 3 Presets
  console.log("[1/4] Validating 3 Reviewer Acceptance Presets...");
  assert.strictEqual(SKYCLAIM_PRESETS.length, 3, "Must have exactly 3 presets");
  console.log("  ✓ 3 presets loaded (BA178, DL401, AF112)");

  // 2. Scenario 1: Delayed BA178
  console.log("[2/4] Testing Scenario 1: Delayed Flight (BA178 LHR -> JFK)...");
  const res1 = await verifyFlightDisruption("BA178", "2026-11-20", true);
  assert.strictEqual(res1.verdict, "APPROVED_FOR_CLAIM", "BA178 must be APPROVED_FOR_CLAIM");
  assert.strictEqual(res1.compensationAmountEur, 600, "Compensation must be €600");
  assert.strictEqual(res1.accounting.queriesFired, 2, "Must fire 2 x402 queries");
  assert.strictEqual(res1.totalCostUsd, 0.02, "Total cost must be $0.02");
  assert.strictEqual(res1.consensus.rule1DelayMet, true, "Delay >= 180m must be met");
  assert.strictEqual(res1.consensus.rule2WeatherClear, true, "Weather must be clear");
  assert(res1.draftClaimLetter.includes("BA178"), "Claim letter must contain flight number");
  console.log(`  ✓ BA178 passed: ${res1.verdict} (€${res1.compensationAmountEur} statutory claim approved)`);

  // 3. Scenario 2: On-Time DL401
  console.log("[3/4] Testing Scenario 2: On-Time Flight (DL401 JFK -> LAX)...");
  const res2 = await verifyFlightDisruption("DL401", "2026-11-21", true);
  assert.strictEqual(res2.verdict, "INELIGIBLE_ON_TIME", "DL401 must be INELIGIBLE_ON_TIME");
  assert.strictEqual(res2.compensationAmountEur, 0, "Compensation must be €0");
  assert.strictEqual(res2.consensus.rule1DelayMet, false, "Delay must be < 180m");
  console.log(`  ✓ DL401 passed: ${res2.verdict} (Flight arrived +14m, below statutory threshold)`);

  // 4. Scenario 3: Weather Conflict AF112
  console.log("[4/4] Testing Scenario 3: Divergence / Storm Conflict (AF112 CDG -> ORD)...");
  const res3 = await verifyFlightDisruption("AF112", "2026-11-19", true);
  assert.strictEqual(res3.verdict, "FAIL_CLOSED_WEATHER_CONFLICT", "AF112 must trigger FAIL_CLOSED_WEATHER_CONFLICT");
  assert.strictEqual(res3.consensus.rule3FailClosedTriggered, true, "Fail-closed rule must trigger");
  assert.strictEqual(res3.weather.hasSevereStormAlert, true, "Severe storm alert must be detected");
  console.log(`  ✓ AF112 passed: ${res3.verdict} (Extraordinary circumstances detected, claim held)`);

  console.log("\n=== ALL SKYCLAIM ACCEPTANCE TESTS PASSED DETERMINISTICALLY (100% GREEN) ===");
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
