import { Bot, InlineKeyboard } from "grammy";
import {
  verifyFlightDisruption,
  SKYCLAIM_PRESETS,
  SKYCLAIM_CONFIG,
  SKYCLAIM_PUBLIC_LEDGER,
} from "./skyclaim-consensus";
import { SkyClaimResult } from "./skyclaim-types";

export function getPresetKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .text("1️⃣ Case 1: Clean Delay (BA178)", "claim:BA178")
    .row()
    .text("2️⃣ Case 2: Minor Delay (DL401)", "claim:DL401")
    .row()
    .text("3️⃣ Case 3: Weather Risk (AF112)", "claim:AF112");
}

export async function callClaimApi(
  flightNumber: string,
  flightDate: string = "2026-11-22"
): Promise<SkyClaimResult> {
  return verifyFlightDisruption(flightNumber, flightDate, true);
}

export async function handleClaimExecution(
  ctx: any,
  flightNumber: string,
  flightDate: string = "2026-11-22"
) {
  // 1. Acknowledge immediately to avoid Telegram webhook timeout during x402 settlement
  try {
    await ctx.reply(
      `🔍 *Evaluating ${flightNumber}...*\n_Querying Telegraph Protocol node & verifying dual-corridor weather telemetry on Base Sepolia..._`,
      { parse_mode: "Markdown" }
    );
  } catch (e) {
    console.warn("Telegram pre-acknowledgment warning:", e);
  }

  const res = await callClaimApi(flightNumber, flightDate);

  const msg = `
*${res.caseTitle}*

${res.caseCopy}

*Flight Telemetry [${res.flight.tag}]:*
• Carrier: ${res.flight.carrier} (${res.flight.flightNumber})
• Route: ${res.flight.origin} → ${res.flight.destination} (${res.flight.distanceKm} km)
• Arrival Delay: +${Math.floor(res.flight.arrivalDelayMinutes / 60)}h ${res.flight.arrivalDelayMinutes % 60}m (at destination)

*Weather Screening [${res.badge}]:*
• Airport: ${res.weather.departureAirport}
• Status: ${res.weather.stormDetails}
• Authority: ${res.weather.sourceAuthority}
• Cost: $${res.totalCostUsd.toFixed(2)} USDC
${res.badge === "LIVE" && res.receipt ? `• Verified On-Chain Proof: [Receipt Link](${res.receipt.basescanUrl})` : `• Notice: ${res.badgeNote}`}
`;

  await ctx.reply(msg, { parse_mode: "Markdown", disable_web_page_preview: true });

  if (res.verdict === "ELIGIBLE_FOR_CLAIM" && res.draftClaimLetter) {
    await ctx.reply(
      `📄 *Generated Statutory Claim Letter (EU261 Article 7):*\n\`\`\`text\n${res.draftClaimLetter}\n\`\`\``,
      { parse_mode: "Markdown" }
    );
  }
}

let cachedBot: Bot | null = null;

export function configureBot(bot: Bot) {
  bot.command("start", async (ctx) => {
    const welcome = `
✈️ *SkyClaim · Autonomous Flight Disruption Shield*
_Powered by Telegraph Protocol x402 Micropayments (Base Sepolia)_

*What SkyClaim does:*
SkyClaim checks the airline's most common excuse. When a flight is delayed 3+ hours, it buys live weather alerts for the departure airport through Telegraph. If a severe alert is active, it flags the claim as high risk. Otherwise it drafts an EU261/UK261 claim with the receipt attached.

*Commands:*
• \`/claim <flight>\` — Evaluate any transatlantic flight (e.g. \`/claim BA178\`)
• \`/demo\` — Run the 3 acceptance scenarios in sequence
• \`/receipts\` — View Base Sepolia contract and verified signal proofs
• \`/ledger\` — View public testnet activity

*Select a 1-click preset scenario below:*
`;
    await ctx.reply(welcome, { parse_mode: "Markdown", reply_markup: getPresetKeyboard() });
  });

  bot.command("ledger", async (ctx) => {
    let ledgerText = `
📊 *SkyClaim · Public Disruption Verification Activity*
• Network: Base Sepolia (Chain ID 84532)
• Settlement Token: Circle USDC (\`${SKYCLAIM_CONFIG.usdcAddress.slice(0, 10)}...\`)
• Verified Cases:
`;
    for (const item of SKYCLAIM_PUBLIC_LEDGER) {
      ledgerText += `\n• *${item.flightNumber}* (${item.route}): ${item.verdict.replace(/_/g, " ")} · [Badge: ${item.badge}] · ${item.compensationRange}`;
    }
    await ctx.reply(ledgerText, { parse_mode: "Markdown", link_preview_options: { is_disabled: true } });
  });

  bot.command("demo", async (ctx) => {
    await ctx.reply("Running 3 Reviewer Evaluation Scenarios against Telegraph Weather Engine...");
    for (const p of SKYCLAIM_PRESETS) {
      await handleClaimExecution(ctx, p.flightNumber, p.flightDate);
    }
  });

  bot.command("receipts", async (ctx) => {
    const text = `
🏆 *Telegraph Protocol · On-Chain Evidence Matrix*
• *Network:* Base Sepolia (Chain ID 84532)
• *Diamond Contract:* \`${SKYCLAIM_CONFIG.diamondAddress}\`
• *Circle USDC (x402 Gate):* \`${SKYCLAIM_CONFIG.usdcAddress}\`
• *Live Node Engine:* \`${SKYCLAIM_CONFIG.nodeUrl}\`
• *Supported Intent:* \`TRAVEL_TRANSIT_LOCK_GENERAL\` (ttl-nws 106005, ttl-airsigmet 106004)
• *Safety Guards:* $0.05 per-request cap · $5.00 daily spend limit · 15 req/min
`;
    await ctx.reply(text, { parse_mode: "Markdown", link_preview_options: { is_disabled: true } });
  });

  bot.command("claim", async (ctx) => {
    const text = ctx.message?.text || "";
    const parts = text.split(/\s+/).slice(1);
    const flightNumber = parts[0] || "BA178";
    const flightDate = parts[1] || "2026-11-22";
    await handleClaimExecution(ctx, flightNumber, flightDate);
  });

  bot.on("callback_query:data", async (ctx) => {
    const data = ctx.callbackQuery.data;
    if (data.startsWith("claim:")) {
      const flight = data.split(":")[1];
      await ctx.answerCallbackQuery({ text: `Analyzing ${flight}...` });
      await handleClaimExecution(ctx, flight, "2026-11-22");
    }
  });

  return bot;
}

export function getTelegramBot(): Bot | null {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  if (!token) return null;

  if (!cachedBot) {
    cachedBot = new Bot(token);
    configureBot(cachedBot);
  }

  return cachedBot;
}
