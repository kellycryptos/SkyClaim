import { NextRequest, NextResponse } from "next/server";
import { webhookCallback } from "grammy";
import { getTelegramBot } from "@/lib/telegram-bot";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  // 1. Verify webhook secret token if configured
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET?.trim();
  if (secret) {
    const receivedSecret = req.headers.get("x-telegram-bot-api-secret-token");
    if (receivedSecret !== secret) {
      console.warn("Unauthorized Telegram webhook call: secret token mismatch");
      return new NextResponse("Unauthorized", { status: 401 });
    }
  }

  // 2. Retrieve configured bot
  const bot = getTelegramBot();
  if (!bot) {
    return NextResponse.json(
      { status: "disabled", message: "TELEGRAM_BOT_TOKEN not configured" },
      { status: 200 }
    );
  }

  try {
    // 3. Delegate to grammY std/http webhook handler
    return await webhookCallback(bot, "std/http")(req);
  } catch (err: any) {
    console.error("Telegram webhook handler error:", err?.message || err);
    return NextResponse.json({ ok: false, error: "Internal handler error" }, { status: 500 });
  }
}

export async function GET() {
  const isConfigured = Boolean(process.env.TELEGRAM_BOT_TOKEN?.trim());
  const hasSecret = Boolean(process.env.TELEGRAM_WEBHOOK_SECRET?.trim());

  return NextResponse.json({
    service: "SkyClaim Telegram Webhook Handler",
    configured: isConfigured,
    secretProtected: hasSecret,
    mode: "webhook",
    status: isConfigured ? "ready" : "unconfigured",
  });
}
