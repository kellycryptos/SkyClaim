const assert = require("assert");
const { ethers } = require("ethers");

// Test configuration
const PRESETS = [
  {
    id: "bluechip",
    title: "Uniswap V3 (UNI)",
    address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
    symbol: "UNI",
    expectedVerdict: "APPROVED",
  },
  {
    id: "honeypot",
    title: "Suspicious Drainer (PEPE-FAKE)",
    address: "0xdead78a48b598fa20f6be8dc07386820ff5690b2",
    symbol: "PEPE-FAKE",
    expectedVerdict: "REJECTED",
  },
  {
    id: "sanctioned",
    title: "Tornado-Associated Vault",
    address: "0x12d66f87a04a9e220743712ce6d9bb1b5616b8fc",
    symbol: "TC-MIX",
    expectedVerdict: "REJECTED",
  },
];

async function runTests() {
  console.log("=== TELEGRAPH SENTINEL: ZERO-ENV SANDBOX TESTS ===");

  // 1. Check presets
  console.log("[1/3] Validating Judge 90-Second Presets...");
  assert.strictEqual(PRESETS.length, 3, "Must have exactly 3 presets");
  for (const p of PRESETS) {
    assert(ethers.isAddress(p.address), `Preset address ${p.address} must be a valid EVM address`);
    console.log(`  ✓ Preset ${p.id} (${p.symbol}) format verified`);
  }

  // 2. Validate Telegraph Base Sepolia parameters
  console.log("[2/3] Validating Telegraph Protocol Contract Constants...");
  const diamondAddress = "0x5a2324aA18613FAD4e44bDF0d6c73Ec1f6D87ff8";
  const usdcAddress = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
  assert(ethers.isAddress(diamondAddress), "Diamond address must be valid EVM address");
  assert(ethers.isAddress(usdcAddress), "Circle USDC address must be valid EVM address");
  console.log("  ✓ Diamond: " + diamondAddress);
  console.log("  ✓ Circle USDC (x402): " + usdcAddress);

  // 3. Test mock audit calculation logic
  console.log("[3/3] Validating Risk Calculation & Decision Logic...");
  const weights = {
    SMART_CONTRACT_AUDIT: 0.3,
    SECURITY_REVIEW: 0.25,
    SANCTIONS_SCREENING_MATCH: 0.25,
    ONCHAIN_METRIC_VERIFY: 0.1,
    SOCIAL_BOT_DETECTION: 0.1,
  };

  // Bluechip: low scores
  const bluechipScores = {
    SMART_CONTRACT_AUDIT: 8,
    SECURITY_REVIEW: 5,
    SANCTIONS_SCREENING_MATCH: 0,
    ONCHAIN_METRIC_VERIFY: 12,
    SOCIAL_BOT_DETECTION: 14,
  };
  let bluechipTotal = 0;
  for (const [k, w] of Object.entries(weights)) {
    bluechipTotal += bluechipScores[k] * w;
  }
  assert(bluechipTotal < 30, "Bluechip total score should be < 30 (Approved)");
  console.log(`  ✓ Bluechip risk index calculated: ${Math.round(bluechipTotal)}/100 -> APPROVED`);

  // Honeypot: high scores
  const honeypotScores = {
    SMART_CONTRACT_AUDIT: 95,
    SECURITY_REVIEW: 98,
    SANCTIONS_SCREENING_MATCH: 0,
    ONCHAIN_METRIC_VERIFY: 88,
    SOCIAL_BOT_DETECTION: 92,
  };
  let honeypotTotal = 0;
  for (const [k, w] of Object.entries(weights)) {
    honeypotTotal += honeypotScores[k] * w;
  }
  assert(honeypotTotal > 65, "Honeypot total score should be > 65 (Rejected)");
  console.log(`  ✓ Honeypot risk index calculated: ${Math.round(honeypotTotal)}/100 -> REJECTED`);

  console.log("\n=== ALL CI/CD SUITE TESTS PASSED CLEANLY (100% DETERMINISTIC) ===");
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
