import { NextRequest, NextResponse } from "next/server";
import { executeListingAudit } from "@/lib/telegraph";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    let { tokenAddress, symbolHint = "TOKEN", forceDemo = false } = body;

    if (!tokenAddress || typeof tokenAddress !== "string") {
      return NextResponse.json(
        { error: "Invalid input: tokenAddress is required as a string." },
        { status: 400 }
      );
    }

    tokenAddress = tokenAddress.trim();

    // Validate Ethereum address format
    const isAddress = /^0x[a-fA-F0-9]{40}$/.test(tokenAddress);
    if (!isAddress && tokenAddress.length < 3) {
      return NextResponse.json(
        { error: "Invalid target: Must be a valid 0x EVM contract address or symbol." },
        { status: 400 }
      );
    }

    // Execute the parallel 5-intent Telegraph intelligence audit
    const memo = await executeListingAudit(tokenAddress, symbolHint, Boolean(forceDemo));

    return NextResponse.json(memo, { status: 200 });
  } catch (error: any) {
    const correlationId = `err_${Date.now()}`;
    console.error(`[${correlationId}] Audit execution failed:`, error?.message);

    // Error Sanitization: Never leak internal traces to client
    return NextResponse.json(
      {
        error: "Due diligence analysis failed. Please verify the target address and retry.",
        correlationId,
      },
      { status: 500 }
    );
  }
}
