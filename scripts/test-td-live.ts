import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import { ethers } from "ethers";
import { decodeChallenge, signPayment } from "../lib/x402";

async function main() {
  console.log("=== Testing TRAVEL_DISRUPTION_GENERAL on Live Node ===");
  const nodeUrl = "http://13.237.89.59:7044";
  const intent = "TRAVEL_DISRUPTION_GENERAL";
  const params = { route_or_flight: "JFK" };

  console.log(`Sending ask for intent: ${intent}, params:`, params);
  const initialRes = await fetch(`${nodeUrl}/engine/v1/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ intent, params }),
  });

  console.log(`Initial response status: ${initialRes.status}`);
  if (initialRes.status !== 402) {
    const text = await initialRes.text();
    console.log("Unexpected response body:", text);
    return;
  }

  const challengeHeader =
    initialRes.headers.get("payment-required") ||
    initialRes.headers.get("payment-challenge");

  if (!challengeHeader) {
    console.error("No challenge header returned");
    return;
  }

  const challenge = decodeChallenge(challengeHeader);
  console.log("Challenge structure:", JSON.stringify(challenge, null, 2));

  const privateKey = process.env.AGENT_PRIVATE_KEY;
  if (!privateKey) {
    console.log("No AGENT_PRIVATE_KEY in .env, cannot execute signed payment");
    return;
  }

  const wallet = new ethers.Wallet(privateKey);
  console.log(`Payer wallet: ${wallet.address}`);

  const paymentSignature = await signPayment(challenge, wallet, 84532);
  console.log("Payment signature generated, sending paid request...");

  const paidRes = await fetch(`${nodeUrl}/engine/v1/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "payment-signature": paymentSignature.header,
    },
    body: JSON.stringify({ intent, params }),
  });

  console.log(`Paid response status: ${paidRes.status}`);
  const paidJson = await paidRes.json();
  console.log("=== Paid Response Data ===");
  console.log(JSON.stringify(paidJson, null, 2));
}

main().catch(console.error);
