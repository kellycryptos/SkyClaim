import { NextRequest, NextResponse } from "next/server";
import { verifyFlightDisruption } from "@/lib/skyclaim-consensus";
import { checkRateLimitDistributed } from "@/lib/budget-guard";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting by client IP (Distributed via Upstash Redis or In-Memory fallback)
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const rateLimit = await checkRateLimitDistributed(clientIp);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: rateLimit.reason || "Rate limit exceeded. Please wait before submitting another query.",
          resetSeconds: rateLimit.resetSeconds,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.resetSeconds),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    // 2. Validate request input
    const body = await req.json().catch(() => ({}));
    let { flightNumber, flightDate = "2026-11-20", forceDemo = false, network = "base" } = body;

    if (!flightNumber || typeof flightNumber !== "string") {
      return NextResponse.json(
        { error: "Invalid flight number. Example format: BA178, DL401, AF112." },
        { status: 400 }
      );
    }

    flightNumber = flightNumber.trim().toUpperCase();

    // Validate flight or airport format:
    // 1. Standard flight code: 2-3 alphanumeric carrier code followed by 1-4 digits (e.g. BA178, DL401, AF112)
    // 2. Airport IATA/ICAO code: 3-4 letters (e.g. JFK, ORD, BOS, KJFK, KORD, KBOS)
    // 3. Special test vector: DISCREPANCY
    const isFlightNumber = /^[A-Z0-9]{2,3}\s?[0-9]{1,4}[A-Z]?$/.test(flightNumber);
    const isAirportCode = /^[A-Z]{3,4}$/.test(flightNumber);
    const isSpecialTest = flightNumber === "DISCREPANCY";
    if (!isFlightNumber && !isAirportCode && !isSpecialTest) {
      return NextResponse.json(
        { error: "Invalid flight number or airport code. Examples: BA178, DL401, AF112, or US departure hubs JFK, ORD, BOS, KEWR." },
        { status: 400 }
      );
    }

    // 3. Execute dual-miner consensus with budget caps and rate limit remaining count
    const result = await verifyFlightDisruption(
      flightNumber,
      flightDate,
      Boolean(forceDemo),
      rateLimit.remaining,
      false,
      network === "solana" ? "solana" : "base"
    );

    return NextResponse.json(result, {
      status: 200,
      headers: {
        "X-RateLimit-Remaining": String(rateLimit.remaining),
      },
    });
  } catch (error: any) {
    const isBudgetError = error?.message?.includes("budget cap") || error?.message?.includes("Daily spend limit");
    const correlationId = `err_${Date.now()}`;
    console.error(`[${correlationId}] Claim API verification failed:`, error?.message);

    return NextResponse.json(
      {
        error: error?.message || "Flight disruption verification failed.",
        correlationId,
      },
      { status: isBudgetError ? 429 : 500 }
    );
  }
}
