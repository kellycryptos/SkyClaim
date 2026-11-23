#!/usr/bin/env tsx

/**
 * SkyClaim · Telegram Webhook Registration Utility
 * 
 * Sets, checks, or removes Telegram webhook for the live Vercel deployment.
 * Usage:
 *   npx tsx scripts/set-telegram-webhook.ts https://your-deployment.vercel.app
 *   npx tsx scripts/set-telegram-webhook.ts --info
 *   npx tsx scripts/set-telegram-webhook.ts --delete
 */

import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import { Bot } from "grammy";

const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
const secretToken = process.env.TELEGRAM_WEBHOOK_SECRET?.trim();

if (!token) {
  console.error("❌ ERROR: TELEGRAM_BOT_TOKEN is not configured in .env or environment.");
  console.error("Please add TELEGRAM_BOT_TOKEN to your environment before running this script.");
  process.exit(1);
}

const bot = new Bot(token);

async function main() {
  const arg = process.argv[2];

  if (!arg || arg === "--help") {
    console.log(`
✈️ SkyClaim Telegram Webhook Registration
Usage:
  npx tsx scripts/set-telegram-webhook.ts <DEPLOYED_URL>
  npx tsx scripts/set-telegram-webhook.ts --info
  npx tsx scripts/set-telegram-webhook.ts --delete

Example:
  npx tsx scripts/set-telegram-webhook.ts https://skyclaim.vercel.app
`);
    process.exit(0);
  }

  if (arg === "--info") {
    console.log("🔍 Fetching current Telegram Webhook info...");
    const info = await bot.api.getWebhookInfo();
    console.log(JSON.stringify(info, null, 2));
    return;
  }

  if (arg === "--delete") {
    console.log("🗑️ Deleting Telegram Webhook...");
    await bot.api.deleteWebhook({ drop_pending_updates: true });
    console.log("✓ Webhook successfully deleted. Polling mode can now be used safely.");
    return;
  }

  let baseUrl = arg.trim();
  if (baseUrl.endsWith("/")) baseUrl = baseUrl.slice(0, -1);
  if (!baseUrl.startsWith("https://")) {
    console.warn("⚠️ Warning: Telegram requires HTTPS for webhook endpoints!");
  }

  const webhookUrl = `${baseUrl}/api/telegram/webhook`;
  console.log(`🌐 Registering webhook endpoint: ${webhookUrl}`);
  if (secretToken) {
    console.log(`🔒 Secret token authentication: ENABLED`);
  } else {
    console.log(`⚠️ Note: TELEGRAM_WEBHOOK_SECRET not set. Webhook will register without secret token header.`);
  }

  await bot.api.setWebhook(webhookUrl, {
    secret_token: secretToken || undefined,
    drop_pending_updates: true,
  });

  console.log("✅ Webhook registered successfully!");
  console.log("Telegram will now deliver updates to your Next.js serverless route on Vercel.");
  
  const info = await bot.api.getWebhookInfo();
  console.log("\nCurrent Webhook Status:");
  console.log(`• URL:                  ${info.url}`);
  console.log(`• Custom Certificate:   ${info.has_custom_certificate}`);
  console.log(`• Pending Update Count: ${info.pending_update_count}`);
  if (info.last_error_message) {
    console.log(`• Last Error:           ${info.last_error_message}`);
  }
}

main().catch((err) => {
  console.error("❌ Webhook operation failed:", err.message || err);
  process.exit(1);
});
