import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

async function main() {
  const nodeUrl = "http://13.237.89.59:7044";
  const intent = "TRAVEL_DISRUPTION_GENERAL";
  const params = { route_or_flight: "JFK" };

  const initialRes = await fetch(`${nodeUrl}/engine/v1/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ intent, params }),
  });

  console.log(`Initial response status: ${initialRes.status}`);
  console.log("Headers:");
  initialRes.headers.forEach((val, key) => {
    console.log(`  ${key}: ${val}`);
  });
  const text = await initialRes.text();
  console.log("Body:", text);
}

main().catch(console.error);
