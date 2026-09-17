import { NextResponse } from "next/server";
import { issueRoundToken } from "../round-token";

export const dynamic = "force-dynamic";

// Called when a round starts. The token comes back with the score.
export async function POST() {
  try {
    return NextResponse.json({ token: issueRoundToken() }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("round token failed", err);
    return NextResponse.json({ error: "Could not start round" }, { status: 500 });
  }
}
