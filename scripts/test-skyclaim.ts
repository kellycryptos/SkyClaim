import assert from "assert";

async function runTests() {
  console.log("=== SKYCLAIM: ZERO-ENV SANDBOX CI/CD TEST SUITE ===");

  const {
    verifyFlightDisruption,
    SKYCLAIM_PRESETS,
    SKYCLAIM_CONFIG,
    INITIAL_LEDGER,
    resolveCarrierInfo,
  } = await import("../lib/skyclaim-consensus");
  const { checkRateLimit, checkAndRecordBudget } = await import("../lib/budget-guard");

  // 1. Verify 3 Presets
  console.log("[1/6] Validating 3 Reviewer Acceptance Presets...");
  assert.strictEqual(SKYCLAIM_PRESETS.length, 3, "Must have exactly 3 presets");
  console.log("  ✓ 3 presets loaded (BA178, DL401, AF112)");

  // 2. Scenario 1: Clean Delay (Hypothetical BA178 JFK -> LHR)
  console.log("[2/6] Testing Scenario 1: Clean Delay (Hypothetical BA178 JFK -> LHR)...");
  const res1 = await verifyFlightDisruption("BA178", "2026-11-22", true);
  assert.strictEqual(res1.verdict, "ELIGIBLE_FOR_CLAIM", "BA178 must be ELIGIBLE_FOR_CLAIM");
  assert.strictEqual(res1.badge, "FIXTURE", "Preset must carry FIXTURE badge");
  assert(res1.eligibleCompensationRange.includes("€300") || res1.eligibleCompensationRange.includes("£260"), "Compensation must note statutory range");
  assert(res1.statutoryRegulation === "EU261" || res1.statutoryRegulation === "UK261", "Statutory regulation must be EU261 or UK261");
  assert.strictEqual(res1.flight.arrivalDelayMinutes, 222, "Arrival delay must be 222 min (3h 42m)");
  assert.strictEqual(res1.flight.operatingCarrier, "British Airways", "Operating carrier must be British Airways");
  assert.strictEqual(res1.flight.isOperatingCarrierEUUK, true, "Operating carrier must be EU/UK");
  assert.strictEqual(res1.weather.departureAirport, "JFK", "Departure airport must be JFK");
  assert.strictEqual(res1.weather.arrivalAirport, "LHR", "Arrival airport must be LHR");
  assert.strictEqual(res1.weather.bothCorridorsClear, true, "Both corridors must be clear");
  assert.strictEqual(res1.weather.hasSevereStormAlert, false, "Weather must be clear");
  assert(res1.draftClaimLetter.includes("BA178"), "Claim letter must contain flight number");
  console.log(`  ✓ BA178 passed: ${res1.verdict} (${res1.eligibleCompensationRange}) [${res1.badge}]`);

  // 3. Scenario 2: Non-EU Operating Carrier Check (Hypothetical DL401 JFK -> CDG)
  console.log("[3/6] Testing Scenario 2: Operating Metal Check (DL401 JFK -> CDG)...");
  const res2 = await verifyFlightDisruption("DL401", "2026-11-22", true);
  assert.strictEqual(res2.verdict, "INELIGIBLE", "DL401 must be INELIGIBLE");
  assert.strictEqual(res2.badge, "FIXTURE", "Preset must carry FIXTURE badge");
  assert.strictEqual(res2.flight.operatingCarrier, "Delta Air Lines", "Operating carrier must be Delta Air Lines");
  assert.strictEqual(res2.flight.isOperatingCarrierEUUK, false, "Delta must be recognized as non-EU metal");
  assert(
    res2.flight.operatingCarrierExclusionReason?.includes("not covered by EU261"),
    "Must explain non-EU operating metal exclusion under Art. 3(1)(b)"
  );
  assert.strictEqual(res2.flight.arrivalDelayMinutes, 210, "Arrival delay must be 210 min (3h 30m)");
  assert.strictEqual(res2.totalCostUsd, 0, "Cost must be $0.00");
  assert(res2.draftClaimLetter.includes("non-EU carrier"), "Assessment must explain non-EU carrier exclusion");
  console.log(`  ✓ DL401 passed: ${res2.verdict} (Operating carrier: Delta not EU metal ex-USA under Art. 3(1)(b)) [${res2.badge}]`);

  // 4. Scenario 3: Delay with Weather Risk (Hypothetical AF112 ORD -> CDG)
  console.log("[4/6] Testing Scenario 3: Weather Defense / Contested Claim (AF112 ORD -> CDG)...");
  const res3 = await verifyFlightDisruption("AF112", "2026-11-22", true);
  assert.strictEqual(res3.verdict, "FAIL_CLOSED_WEATHER", "AF112 must trigger FAIL_CLOSED_WEATHER");
  assert.strictEqual(res3.badge, "FIXTURE", "Preset must carry FIXTURE badge");
  assert.strictEqual(res3.flight.operatingCarrier, "Air France", "Operating carrier must be Air France");
  assert.strictEqual(res3.statutoryRegulation, "EU261", "Statutory regulation must be EU261");
  assert.strictEqual(res3.weather.hasSevereDepartureAlert, true, "Departure blizzard alert must be flagged");
  assert.strictEqual(res3.weather.bothCorridorsClear, false, "Corridor must not be marked clear");
  assert(
    res3.eligibleCompensationRange.includes("€600"),
    "Compensation must show statutory baseline €600 with Art. 5(3) condition"
  );
  assert(
    res3.draftClaimLetter.includes("CONTESTED CLAIM TEMPLATE"),
    "Draft claim letter must be a specialized contested claim template under Art. 5(3)"
  );
  console.log(`  ✓ AF112 passed: ${res3.verdict} (${res3.eligibleCompensationRange}) [${res3.badge}]`);

  // 5. Test Public Ledger: Live Base Sepolia Receipts vs Fixtures
  console.log("[5/6] Validating Public Disruption Ledger & Live Base Sepolia Receipts...");
  assert(INITIAL_LEDGER.length >= 4, "Ledger must have multiple entries");
  const liveRows = INITIAL_LEDGER.filter((r) => r.badge === "LIVE");
  const fixtureRows = INITIAL_LEDGER.filter((r) => r.badge === "FIXTURE");
  assert(liveRows.length >= 2, "Ledger must contain at least 2 real live Telegraph runs");
  assert(fixtureRows.length >= 2, "Ledger must preserve benchmark fixture rows labeled as FIXTURE");

  for (const liveRow of liveRows) {
    assert(
      liveRow.txHash && (liveRow.txHash.startsWith("0x") || liveRow.network === "solana" || liveRow.txHash.length >= 32),
      "Live row must have valid txHash"
    );
    assert(
      liveRow.basescanUrl && (liveRow.basescanUrl.includes("basescan.org") || liveRow.basescanUrl.includes("solscan.io")),
      "Live row must link to valid explorer (BaseScan or SolScan)"
    );
    assert(liveRow.minerName && liveRow.minerName.length > 0, "Live row must name verified miner");
    assert.strictEqual(liveRow.costUsd, 0.01, "Live row must reflect $0.01 USDC x402 cost");
  }
  console.log(`  ✓ Public Ledger verified: ${liveRows.length} live on-chain receipts + ${fixtureRows.length} benchmark fixtures`);

  // 6. Test Multi-Source Consensus & Discrepancy Handling
  console.log("[6/8] Testing Multi-Source Consensus & Discrepancy Handling...");
  const resDiscrepancy = await verifyFlightDisruption("DISCREPANCY", "2026-11-22", true);
  assert.strictEqual(
    resDiscrepancy.verdict,
    "INSUFFICIENT_EVIDENCE",
    "Discrepancy between Telegraph and NWS must return INSUFFICIENT_EVIDENCE"
  );
  assert.strictEqual(
    resDiscrepancy.recommendation,
    "INSUFFICIENT_DATA",
    "Recommendation must be INSUFFICIENT_DATA"
  );
  assert(
    resDiscrepancy.draftClaimLetter.includes("Telemetry Discrepancy Notice"),
    "Draft claim letter must be a Telemetry Discrepancy Notice"
  );
  console.log(`  ✓ Discrepancy handling passed: ${resDiscrepancy.verdict} (${resDiscrepancy.recommendation})`);

  // 7. Test Miner Abstention & Inconclusive Telemetry Rule (Silence != Clear Weather)
  console.log("[7/8] Testing Miner Abstention & Inconclusive Telemetry Rule (Silence != Clear Weather)...");
  const resAbstain = await verifyFlightDisruption("ABSTAIN", "2026-11-22", true);
  assert.strictEqual(
    resAbstain.verdict,
    "INSUFFICIENT_EVIDENCE",
    "Miner abstention or inconclusive evidence must strictly return INSUFFICIENT_EVIDENCE"
  );
  assert.strictEqual(
    resAbstain.recommendation,
    "INSUFFICIENT_DATA",
    "Recommendation must be INSUFFICIENT_DATA"
  );
  assert.strictEqual(
    resAbstain.eligibleCompensationRange,
    "€0 (Under Review · Insufficient Evidence)",
    "Compensation must remain €0 under review when miner abstains"
  );
  assert(
    resAbstain.verdictRationale.includes("abstained or returned an inconclusive verdict"),
    "Rationale must explicitly explain abstention handling"
  );
  console.log(`  ✓ Miner abstention rule verified: ${resAbstain.verdict} (${resAbstain.eligibleCompensationRange})`);

  // 8. Test Safety Guards: Rate Limiter & Budget Caps
  console.log("[8/9] Testing Anti-Drain Safety Guards (Rate Limiter & Budget Caps)...");
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

  // 9. Test Non-US Departure & Historical Date Fail-Closed Rules
  console.log("[9/9] Testing Non-US Departure & Historical Date Fail-Closed Rules...");
  const resPast = await verifyFlightDisruption("LHR", "2026-11-20", true);
  assert.strictEqual(
    resPast.verdict,
    "INSUFFICIENT_EVIDENCE",
    "Non-US departure with past date must fail closed to INSUFFICIENT_EVIDENCE"
  );
  assert.strictEqual(
    resPast.eligibleCompensationRange,
    "€0 (Under Review · Insufficient Historical Telemetry)",
    "Compensation must be €0 under review"
  );
  assert(
    resPast.verdictRationale.includes("in the past"),
    "Rationale must note that historical weather cannot be verified on live miners"
  );
  console.log(`  ✓ Historical non-US fail-closed verified: ${resPast.verdict} (${resPast.eligibleCompensationRange})`);

  console.log("\n=== ALL SKYCLAIM ACCEPTANCE TESTS PASSED DETERMINISTICALLY (100% GREEN) ===");
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
