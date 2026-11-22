import { NextRequest, NextResponse } from "next/server";
import { verifyFlightDisruption } from "@/lib/skyclaim-consensus";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    let { flightNumber, flightDate = "2026-11-20", forceDemo = false } = body;

    if (!flightNumber || typeof flightNumber !== "string") {
      return NextResponse.json(
        { error: "Invalid flight number. Example format: BA178 or DL401." },
        { status: 400 }
      );
    }

    flightNumber = flightNumber.trim().toUpperCase();

    // Validate flight format: 2-3 alphanumeric carrier code followed by 1-4 digits
    const isValidFlight = /^[A-Z0-9]{2,3}\s?[0-9]{1,4}[A-Z]?$/.test(flightNumber);
    if (!isValidFlight) {
      return NextResponse.json(
        { error: "Invalid flight number format. Please provide a standard IATA/ICAO flight code (e.g. BA178, DL401, AF112)." },
        { status: 400 }
      );
    }

    const result = await verifyFlightDisruption(flightNumber, flightDate, Boolean(forceDemo));
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    const correlationId = `err_${Date.now()}`;
    console.error(`[${correlationId}] Disruption verification failed:`, error?.message);

    return NextResponse.json(
      {
        error: "Flight disruption verification failed. Please check the flight number and date.",
        correlationId,
      },
      { status: 500 }
    );
  }
}
