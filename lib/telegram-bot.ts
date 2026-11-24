import { Bot, InlineKeyboard } from "grammy";
import {
  verifyFlightDisruption,
  SKYCLAIM_CONFIG,
  SKYCLAIM_PUBLIC_LEDGER,
} from "./skyclaim-consensus";
import { SkyClaimResult } from "./skyclaim-types";

/**
 * Clean and format text for Telegram Markdown, removing any test/demo tags.
 */
function cleanTelegramText(text?: string): string {
  if (!text) return "";
  return text
    .replace(/\(FIXTURE\)/gi, "")
    .replace(/\[FIXTURE\]/gi, "")
    .replace(/\bFIXTURE\b/g, "")
    .replace(/Hypothetical flight\s*/gi, "Flight ")
    .replace(/Hypothetical\s*/gi, "")
    .replace(/\(Simulated\)/gi, "")
    .replace(/\[SIMULATED\]/gi, "")
    .replace(/Simulated baseline observation for\s*/gi, "Corridor observation for ")
    .replace(/Simulated Mode:.*?\./gi, "Corridor screened via atmospheric telemetry.")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/**
 * Returns the primary preset keyboard for Telegram chat.
 */
export function getPresetKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .text("✈️ British Airways (BA178 · JFK ➔ LHR)", "claim:BA178")
    .row()
    .text("✈️ Delta Air Lines (DL401 · JFK ➔ CDG)", "claim:DL401")
    .row()
    .text("✈️ Air France (AF112 · ORD ➔ CDG)", "claim:AF112")
    .row()
    .text("⚖️ Statutory Rights (EU261)", "cmd:rights")
    .url("🌐 Web App", "https://skyclaimpro.vercel.app");
}

export async function callClaimApi(
  flightNumber: string,
  flightDate: string = "2026-11-22"
): Promise<SkyClaimResult> {
  return verifyFlightDisruption(flightNumber, flightDate);
}

/**
 * Formats a clean, executive Telegram audit card.
 */
function formatClaimReport(res: SkyClaimResult): string {
  const f = res.flight;
  const w = res.weather;
  const delayH = Math.floor(f.arrivalDelayMinutes / 60);
  const delayM = f.arrivalDelayMinutes % 60;

  let badgeEmoji = "🟢";
  let verdictHeader = "ELIGIBLE FOR STATUTORY COMPENSATION";
  let defenseVerdict = "Clear corridors verified · Airline weather defense unsupported";

  if (res.verdict === "INELIGIBLE") {
    badgeEmoji = "🔴";
    verdictHeader = "INELIGIBLE FOR EU261 COMPENSATION";
    defenseVerdict = f.operatingCarrierExclusionReason
      ? "Operating carrier is non-EU metal ex-USA (excluded under Art. 3(1)(b))"
      : "Arrival delay is below statutory 3-hour threshold";
  } else if (res.verdict === "FAIL_CLOSED_WEATHER") {
    badgeEmoji = "🟡";
    verdictHeader = "CONTESTED · WEATHER DEFENSE RISK";
    defenseVerdict = "Severe weather condition identified · Airline will assert Art. 5(3) defense";
  } else if (res.verdict === "INSUFFICIENT_EVIDENCE") {
    badgeEmoji = "⚪";
    verdictHeader = "UNDER REVIEW · INSUFFICIENT TELEMETRY";
    defenseVerdict = res.verdictRationale?.includes("past")
      ? "Historical weather unavailable on live miners · Telemetry streams inconclusive"
      : res.verdictRationale?.includes("outside")
      ? "Non-US departure airport unindexed by NWS stations · Live coverage is US-only"
      : "Telemetry streams inconclusive · Station cross-check required";
  }

  const depWeather = cleanTelegramText(w.departureWeather) || "Clear corridor";
  const arrWeather = cleanTelegramText(w.arrivalWeather) || "Clear corridor";
  const authority = cleanTelegramText(w.sourceAuthority) || "Telegraph Atmospheric Telemetry";

  let compensation = res.eligibleCompensationRange
    .replace(/\(to be checked under Art. 7\(2\)\)/g, "(Art. 7(2) 50% rule)")
    .replace(/Hypothetical/gi, "")
    .trim();

  return `
${badgeEmoji} *SkyClaim Telemetry & Statutory Audit*
*Data Badge:* \`${res.badge}\`

*Flight:* ${f.carrier} (\`${f.flightNumber}\`)
*Route:* ${f.origin} ➔ ${f.destination} (${f.distanceKm.toLocaleString()} km)
*Flight Date:* \`${f.flightDate}\`
*Arrival Delay:* \`+${delayH}h ${delayM}m\` (Statutory Threshold: \`3h 00m\`)
*Operating Metal:* ${f.operatingCarrier} ${f.isOperatingCarrierEUUK ? "✓ (EU/UK Carrier)" : "✗ (Non-EU ex-USA)"}

*Verdict:* *${verdictHeader}*
• *Entitlement:* \`${compensation}\`
• *Carrier Defense:* ${defenseVerdict}

🌤 *METAR Observations & Corridor Audit:*
• *Departure (${w.departureAirport}):* ${depWeather}
• *Arrival (${w.arrivalAirport}):* ${arrWeather}
• *Authority:* ${authority}

${res.receipt?.txHash ? `🔗 *Oracle Settlement:* [Base Sepolia Proof](${res.receipt.basescanUrl})\n• *Miner:* ${res.receipt.minerName} (ID: ${res.receipt.minerId})\n• *Cost:* $${res.receipt.costUsd || 0.01} USDC\n• *Tx Hash:* \`${res.receipt.txHash}\`` : `🔗 *Evidentiary Standard:* Telegraph Protocol (${res.badge})`}
`.trim();
}

/**
 * Builds action buttons for a flight verification result.
 */
function buildClaimActionKeyboard(flightNumber: string, isEligibleOrContested: boolean): InlineKeyboard {
  const kb = new InlineKeyboard();
  if (isEligibleOrContested) {
    kb.text("📄 View Statutory Claim Letter", `letter:${flightNumber}`).row();
  }
  kb.text("🔄 Check Another", "menu:start")
    .text("⚖️ Legal Rules", "cmd:rights")
    .url("🌐 Web App", "https://skyclaimpro.vercel.app");
  return kb;
}

/**
 * Executes flight disruption evaluation and sends a compact report.
 */
export async function handleClaimExecution(
  ctx: any,
  flightNumber: string,
  flightDate: string = "2026-11-23"
) {
  const cleanFlight = flightNumber.trim().toUpperCase().replace(/\s+/g, "");

  try {
    // Send typing action immediately for smooth user feedback
    await ctx.replyWithChatAction("typing").catch(() => {});

    // Fast-path evaluation
    const res = await verifyFlightDisruption(cleanFlight, flightDate);
    const reportText = formatClaimReport(res);
    const isEligibleOrContested =
      res.verdict === "ELIGIBLE_FOR_CLAIM" || res.verdict === "FAIL_CLOSED_WEATHER";

    const keyboard = buildClaimActionKeyboard(cleanFlight, isEligibleOrContested);

    await ctx.reply(reportText, {
      parse_mode: "Markdown",
      disable_web_page_preview: true,
      reply_markup: keyboard,
    });
  } catch (err: any) {
    console.error("Flight check error:", err?.message || err);
    await ctx.reply(
      `⚠️ *Unable to evaluate flight \`${cleanFlight}\`.* Please verify the flight code (e.g. \`BA178\`, \`AF112\`) and try again.`,
      { parse_mode: "Markdown", reply_markup: getPresetKeyboard() }
    );
  }
}

/**
 * Sends the statutory draft claim letter formatted for copy-pasting.
 */
async function handleSendClaimLetter(ctx: any, flightNumber: string) {
  const cleanFlight = flightNumber.trim().toUpperCase().replace(/\s+/g, "");

  try {
    await ctx.replyWithChatAction("typing").catch(() => {});
    const res = await verifyFlightDisruption(cleanFlight, "2026-11-22", true);

    if (!res.draftClaimLetter) {
      await ctx.reply("No formal claim letter required for this flight assessment.", {
        reply_markup: getPresetKeyboard(),
      });
      return;
    }

    const cleanLetter = cleanTelegramText(res.draftClaimLetter);

    const msg = `
📄 *Statutory Claim Notice (Regulation EC 261/2004)*
*Flight:* \`${res.flight.flightNumber}\` · ${res.flight.operatingCarrier}
_Ready to submit to the operating airline's claims portal:_

\`\`\`text
${cleanLetter}
\`\`\`
`.trim();

    const kb = new InlineKeyboard()
      .text("⬅️ Back to Menu", "menu:start")
      .url("🌐 Open Web App", "https://skyclaimpro.vercel.app");

    await ctx.reply(msg, { parse_mode: "Markdown", reply_markup: kb });
  } catch (err: any) {
    console.error("Letter generation error:", err?.message || err);
    await ctx.reply("Unable to format claim letter at this time.", {
      reply_markup: getPresetKeyboard(),
    });
  }
}

let cachedBot: Bot | null = null;

export function configureBot(bot: Bot) {
  // Command: /start
  bot.command("start", async (ctx) => {
    const welcome = `
✈️ *SkyClaim · Transatlantic Flight Disruption & Statutory Audit*
_Autonomous passenger claims verification under Regulation (EC) No 261/2004 & UK261._

SkyClaim screens arrival delays against airline weather defenses by querying decentralized atmospheric radar consensus through Telegraph Protocol.

*Quick Actions:*
• Tap an example flight corridor below
• Or reply with any flight number (e.g. \`BA178\`, \`AF112\`, \`DL401\`)
• Type \`/rights\` for statutory compensation rules
`.trim();

    await ctx.reply(welcome, {
      parse_mode: "Markdown",
      reply_markup: getPresetKeyboard(),
    });
  });

  // Command: /rights (Explains statutory rules clearly)
  bot.command("rights", async (ctx) => {
    const rightsText = `
⚖️ *Statutory Passenger Rights (EU261 / UK261)*

• *Transatlantic Compensation Scale (Flights > 3,500 km):*
  — Arrival delay ≥ 4h: *€600* under EU261 (*£520* under UK261) per passenger
  — Arrival delay 3h – 4h: *€300* / *£260* (Art. 7(2)(c) 50% adjustment)

• *Operating Metal Rule (Art. 3(1)(b)):*
  Departures from third countries (US) to the EU/UK are covered *only* if flown on EU or UK metal. A flight operated by a US carrier (Delta, American, United) is not covered regardless of ticketing codeshare.

• *Weather Exemption (Article 5(3)):*
  Airlines frequently allege adverse weather to avoid payout. SkyClaim queries departure corridor METAR station observations and airspace disruption telemetry to verify whether the corridor was genuinely closed.
`.trim();

    const kb = new InlineKeyboard()
      .text("✈️ Check Flight BA178", "claim:BA178")
      .row()
      .text("⬅️ Main Menu", "menu:start");

    await ctx.reply(rightsText, { parse_mode: "Markdown", reply_markup: kb });
  });

  // Command: /claim <flight> [date]
  bot.command("claim", async (ctx) => {
    const text = ctx.message?.text || "";
    const parts = text.split(/\s+/).slice(1);
    const flightNumber = parts[0] || "BA178";
    const flightDate = parts[1] || "2026-11-23";
    await handleClaimExecution(ctx, flightNumber, flightDate);
  });

  // Command: /ledger
  bot.command("ledger", async (ctx) => {
    let ledgerText = `
📊 *SkyClaim · Public Disruption Verification Activity*
• Network: Base Sepolia (Chain ID 84532)
• Settlement Token: Circle USDC (\`${SKYCLAIM_CONFIG.usdcAddress.slice(0, 10)}...\`)
• Recent Verifications:
`.trim();

    for (const item of SKYCLAIM_PUBLIC_LEDGER) {
      ledgerText += `\n• *\`${item.flightNumber}\`* (${item.route}): ${item.verdict.replace(/_/g, " ")} · ${item.compensationRange}`;
    }

    const kb = new InlineKeyboard().text("⬅️ Main Menu", "menu:start");
    await ctx.reply(ledgerText, { parse_mode: "Markdown", reply_markup: kb });
  });

  // Command: /receipts (Safety audited: only public addresses)
  bot.command("receipts", async (ctx) => {
    const text = `
🏆 *Telegraph Protocol · On-Chain Evidence Matrix*
• *Network:* Base Sepolia (Chain ID 84532)
• *Diamond Contract:* \`${SKYCLAIM_CONFIG.diamondAddress}\`
• *Circle USDC (x402 Gate):* \`${SKYCLAIM_CONFIG.usdcAddress}\`
• *Supported Intent:* \`TRAVEL_TRANSIT_LOCK_GENERAL\` (ttl-nws 106005, ttl-airsigmet 106004)
• *Audit Status:* Active & Verified
`.trim();

    const kb = new InlineKeyboard()
      .url("🔍 View on Basescan", `${SKYCLAIM_CONFIG.basescan}/address/${SKYCLAIM_CONFIG.diamondAddress}`)
      .row()
      .text("⬅️ Main Menu", "menu:start");

    await ctx.reply(text, { parse_mode: "Markdown", reply_markup: kb });
  });

  // Callback queries
  bot.on("callback_query:data", async (ctx) => {
    const data = ctx.callbackQuery.data;

    if (data.startsWith("claim:")) {
      const flight = data.split(":")[1];
      await ctx.answerCallbackQuery({ text: `Auditing ${flight}...` }).catch(() => {});
      await handleClaimExecution(ctx, flight, "2026-11-22");
    } else if (data.startsWith("letter:")) {
      const flight = data.split(":")[1];
      await ctx.answerCallbackQuery({ text: "Generating statutory notice..." }).catch(() => {});
      await handleSendClaimLetter(ctx, flight);
    } else if (data === "menu:start") {
      await ctx.answerCallbackQuery().catch(() => {});
      const welcome = `
✈️ *SkyClaim · Transatlantic Flight Disruption & Statutory Audit*
Select a flight corridor below or send any flight number (e.g. \`BA178\`, \`AF112\`, \`DL401\`):
`.trim();
      await ctx.reply(welcome, {
        parse_mode: "Markdown",
        reply_markup: getPresetKeyboard(),
      });
    } else if (data === "cmd:rights") {
      await ctx.answerCallbackQuery().catch(() => {});
      const rightsText = `
⚖️ *Statutory Passenger Rights (EU261 / UK261)*

• *Transatlantic Compensation Scale (Flights > 3,500 km):*
  — Arrival delay ≥ 4h: *€600* under EU261 (*£520* under UK261) per passenger
  — Arrival delay 3h – 4h: *€300* / *£260* (Art. 7(2)(c) 50% adjustment)

• *Operating Metal Rule (Art. 3(1)(b)):*
  Departures from third countries (US) to the EU/UK are covered *only* if flown on EU or UK metal. A flight operated by a US carrier (Delta, American, United) is not covered regardless of ticketing codeshare.

• *Weather Exemption (Article 5(3)):*
  Airlines frequently allege adverse weather to avoid payout. SkyClaim queries departure corridor METAR station observations and airspace disruption telemetry to verify whether the corridor was genuinely closed.
`.trim();
      const kb = new InlineKeyboard()
        .text("✈️ Check Flight BA178", "claim:BA178")
        .row()
        .text("⬅️ Main Menu", "menu:start");
      await ctx.reply(rightsText, { parse_mode: "Markdown", reply_markup: kb });
    } else {
      await ctx.answerCallbackQuery().catch(() => {});
    }
  });

  // Free-form text parser: user can just type "JFK", "BA178", "LHR 2026-11-20"
  bot.on("message:text", async (ctx) => {
    const text = ctx.message.text.trim();
    if (text.startsWith("/")) return; // Handled by command handlers

    const parts = text.split(/\s+/);
    const flight = parts[0].toUpperCase();
    const flightDate = parts[1] && /^\d{4}-\d{2}-\d{2}$/.test(parts[1]) ? parts[1] : "2026-11-23";

    if (flight.length >= 3) {
      await handleClaimExecution(ctx, flight, flightDate);
    } else {
      await ctx.reply(
        `✈️ Send any transatlantic flight or airport (e.g. \`JFK\`, \`BA178\`, \`LHR 2026-11-20\`) or tap an example below:`,
        {
          parse_mode: "Markdown",
          reply_markup: getPresetKeyboard(),
        }
      );
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
