const assert = require("assert");

async function runTests() {
  console.log("=== SKYCLAIM: ZERO-ENV SANDBOX CI/CD TEST SUITE ===");

  // Dynamically import compiled modules
  const { verifyFlightDisruption, SKYCLAIM_PRESETS, SKYCLAIM_CONFIG } = await import("../lib/skyclaim-consensus");
  const { checkRateLimit, checkAndRecordBudget } = await import("../lib/budget-guard");

  // 1. Verify 3 Presets
  console.log("[1/5] Validating 3 Reviewer Acceptance Presets...");
  assert.strictEqual(SKYCLAIM_PRESETS.length, 3, "Must have exactly 3 presets");
  console.log("  ✓ 3 presets loaded (BA178, DL401, AF112)");

  // 2. Scenario 1: CASE 1: CLAIM LOOKS VIABLE (BA178)
  console.log("[2/5] Testing Scenario 1: Delayed Flight (BA178 JFK -> LHR)...");
  const res1 = await verifyFlightDisruption("BA178", "2026-11-22");
  assert.strictEqual(res1.verdict, "CLAIM_LOOKS_VIABLE", "BA178 must be CLAIM_LOOKS_VIABLE");
  assert.strictEqual(res1.compensationAmountEur, 600, "Compensation must be €600");
  assert.strictEqual(res1.totalCostUsd, 0.01, "Total cost must be $0.01");
  assert.strictEqual(res1.flight.tag, "FIXTURE", "Flight data must be tagged FIXTURE");
  assert.strictEqual(res1.weather.tag, "LIVE", "Weather must be tagged LIVE");
  assert.strictEqual(res1.weather.hasSevereStormAlert, false, "Must have no severe storm alerts");
  assert(res1.receipt !== undefined, "Must have a Telegraph receipt attached");
  assert(res1.receipt.signalHash.startsWith("0x19f108d99"), "Must link to verified signal hash");
  assert(res1.draftClaimLetter.includes("BA178"), "Claim letter must contain flight number");
  console.log(`  ✓ BA178 passed: ${res1.verdict} (€${res1.compensationAmountEur} statutory claim ready) [Flight: ${res1.flight.tag} | Weather: ${res1.weather.tag}]`);

  // 3. Scenario 2: CASE 2: DELAY TOO SHORT (DL401)
  console.log("[3/5] Testing Scenario 2: Minor Delay Flight (DL401 JFK -> CDG)...");
  const res2 = await verifyFlightDisruption("DL401", "2026-11-22");
  assert.strictEqual(res2.verdict, "DELAY_TOO_SHORT", "DL401 must be DELAY_TOO_SHORT");
  assert.strictEqual(res2.compensationAmountEur, 0, "Compensation must be €0");
  assert.strictEqual(res2.totalCostUsd, 0.00, "Must spend $0.00 when below threshold");
  assert.strictEqual(res2.receipt, undefined, "No purchase should be made");
  assert.strictEqual(res2.flight.tag, "FIXTURE", "Flight data must be tagged FIXTURE");
  console.log(`  ✓ DL401 passed: ${res2.verdict} (Flight delay +1h 05m, below statutory threshold) [Flight: ${res2.flight.tag}]`);

  // 4. Scenario 3: CASE 3: WEATHER RISK (AF112)
  console.log("[4/5] Testing Scenario 3: Severe Weather Conflict (AF112 ORD -> CDG)...");
  const res3 = await verifyFlightDisruption("AF112", "2026-11-22");
  assert.strictEqual(res3.verdict, "WEATHER_RISK", "AF112 must trigger WEATHER_RISK");
  assert.strictEqual(res3.flight.tag, "FIXTURE", "Flight data must be tagged FIXTURE");
  assert.strictEqual(res3.weather.tag, "RECORDED", "Weather data must be explicitly tagged RECORDED");
  assert.strictEqual(res3.weather.recordedDate, "2026-11-20", "Must specify original recorded date");
  assert.strictEqual(res3.weather.hasSevereStormAlert, true, "Severe storm alert must be detected");
  assert(res3.receipt !== undefined, "Must include recorded receipt proof");
  console.log(`  ✓ AF112 passed: ${res3.verdict} (Blizzard ground stop active, claim flagged high risk) [Flight: ${res3.flight.tag} | Weather: ${res3.weather.tag}]`);

  // 5. Test Safety Guards: Rate Limiter & Budget Caps
  console.log("[5/5] Testing Anti-Drain Safety Guards (Rate Limiter & Budget Caps)...");
  // Test per-request cap ($0.05 limit)
  const overBudgetTest = checkAndRecordBudget(0.10);
  assert.strictEqual(overBudgetTest.allowed, false, "Must reject request exceeding $0.05 per-request cap");
  assert(overBudgetTest.reason.includes("exceeds per-request budget cap"));

  // Test rate limiting (15 req/min limit)
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
