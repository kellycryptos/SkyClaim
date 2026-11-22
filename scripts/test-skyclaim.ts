const assert = require("assert");

async function runTests() {
  console.log("=== SKYCLAIM: ZERO-ENV SANDBOX CI/CD TEST SUITE ===");

  const { verifyFlightDisruption, SKYCLAIM_PRESETS, SKYCLAIM_CONFIG } = await import("../lib/skyclaim-consensus");
  const { checkRateLimit, checkAndRecordBudget } = await import("../lib/budget-guard");

  // 1. Verify 3 Presets
  console.log("[1/5] Validating 3 Reviewer Acceptance Presets...");
  assert.strictEqual(SKYCLAIM_PRESETS.length, 3, "Must have exactly 3 presets");
  console.log("  ✓ 3 presets loaded (BA178, DL401, AF112)");

  // 2. Scenario 1: Clean Delay (Hypothetical BA178 JFK -> LHR)
  console.log("[2/5] Testing Scenario 1: Clean Delay (Hypothetical BA178 JFK -> LHR)...");
  const res1 = await verifyFlightDisruption("BA178", "2026-11-20", true);
  assert.strictEqual(res1.verdict, "ELIGIBLE_FOR_CLAIM", "BA178 must be ELIGIBLE_FOR_CLAIM");
  assert.strictEqual(res1.badge, "FIXTURE", "Preset must carry FIXTURE badge");
  assert(res1.eligibleCompensationRange.includes("€300"), "Compensation must note €300 - €600 Art 7(2) range");
  assert.strictEqual(res1.flight.arrivalDelayMinutes, 222, "Arrival delay must be 222 min (3h 42m)");
  assert.strictEqual(res1.receipt, undefined, "Preset must not have invented on-chain receipt");
  assert.strictEqual(res1.weather.hasSevereStormAlert, false, "Weather must be clear");
  assert(res1.draftClaimLetter.includes("BA178"), "Claim letter must contain flight number");
  console.log(`  ✓ BA178 passed: ${res1.verdict} (${res1.eligibleCompensationRange}) [${res1.badge}]`);

  // 3. Scenario 2: Minor Delay (Hypothetical DL401 JFK -> CDG)
  console.log("[3/5] Testing Scenario 2: Minor Delay (Hypothetical DL401 JFK -> CDG)...");
  const res2 = await verifyFlightDisruption("DL401", "2026-11-21", true);
  assert.strictEqual(res2.verdict, "INELIGIBLE", "DL401 must be INELIGIBLE");
  assert.strictEqual(res2.badge, "FIXTURE", "Preset must carry FIXTURE badge");
  assert.strictEqual(res2.flight.arrivalDelayMinutes, 65, "Arrival delay must be 65 min (1h 05m)");
  assert.strictEqual(res2.totalCostUsd, 0, "Cost must be $0.00");
  assert.strictEqual(res2.receipt, undefined, "Preset must not have invented on-chain receipt");
  console.log(`  ✓ DL401 passed: ${res2.verdict} (Arrival delay < 3h, $0 spent) [${res2.badge}]`);

  // 4. Scenario 3: Delay with Weather Risk (Hypothetical AF112 ORD -> CDG)
  console.log("[4/5] Testing Scenario 3: Weather Risk / Blizzard (Hypothetical AF112 ORD -> CDG)...");
  const res3 = await verifyFlightDisruption("AF112", "2026-11-19", true);
  assert.strictEqual(res3.verdict, "FAIL_CLOSED_WEATHER", "AF112 must trigger FAIL_CLOSED_WEATHER");
  assert.strictEqual(res3.badge, "FIXTURE", "Preset must carry FIXTURE badge");
  assert.strictEqual(res3.weather.hasSevereStormAlert, true, "Severe storm alert must be detected");
  assert.strictEqual(res3.receipt, undefined, "Preset must not have invented on-chain receipt");
  console.log(`  ✓ AF112 passed: ${res3.verdict} (Blizzard ground stop detected, fails closed) [${res3.badge}]`);

  // 5. Test Safety Guards: Rate Limiter & Budget Caps
  console.log("[5/5] Testing Anti-Drain Safety Guards (Rate Limiter & Budget Caps)...");
  const overBudgetTest = checkAndRecordBudget(0.10);
  assert.strictEqual(overBudgetTest.allowed, false, "Must reject request exceeding $0.05 per-request cap");
  assert(overBudgetTest.reason.includes("exceeds per-request budget cap"));

  const testIp = "192.168.1.100";
  for (let i = 0; i < 15; i++) {
    const rl = checkRateLimit(testIp);
    assert.strictEqual(rl.allowed, true, `Request ${i + 1} should be allowed`);
  }
  const blockedRl = checkRateLimit(testIp);
  assert.strictEqual(blockedRl.allowed, false, "16th request must be rate-limited");
  assert(blockedRl.reason.includes("Rate limit"));
  console.log("  ✓ Budget guards passed: $0.05 per-request cap & 15 req/min rate limit verified");

  console.log("\n=== ALL SKYCLAIM ACCEPTANCE TESTS PASSED DETERMINISTICALLY (100% GREEN) ===");
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
