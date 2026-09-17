import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";
import { verifyRoundToken } from "./round-token";

export const dynamic = "force-dynamic";

// The whole board is shown, capped only so a runaway table cannot blow up the page
const MAX_ROWS = 500;
const MAX_NAME_LENGTH = 20;
// A perfect 30s round is ~72 (every dev bonked, every gift grabbed); lucky gift
// rolls push that to the mid 80s. Anything above this was not played.
const MAX_SCORE = 90;
// Must match GAME_SECONDS in the game page. Tokens younger than this are rejected;
// the slack covers timer drift between client and server.
const ROUND_MS = 30_000;
const ROUND_SLACK_MS = 1_500;
// A token that old was not this round
const TOKEN_MAX_AGE_MS = 10 * 60_000;

export type LeaderboardEntry = {
  name: string;
  score: number;
  createdAt: string;
};

function db() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return neon(url);
}

export async function GET() {
  try {
    const sql = db();
    const rows = await sql`
      SELECT name, score, created_at
      FROM whack_a_dev_scores
      ORDER BY score DESC, created_at ASC
      LIMIT ${MAX_ROWS}
    `;
    const entries: LeaderboardEntry[] = rows.map((r) => ({
      name: r.name as string,
      score: r.score as number,
      createdAt: (r.created_at as Date).toISOString(),
    }));
    return NextResponse.json(entries, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("leaderboard GET failed", err);
    return NextResponse.json({ error: "Leaderboard unavailable" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let body: { name?: unknown; score?: unknown; token?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim().slice(0, MAX_NAME_LENGTH) : "";
  const score = typeof body.score === "number" ? Math.floor(body.score) : NaN;

  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
  if (!Number.isFinite(score) || score < 0 || score > MAX_SCORE) {
    return NextResponse.json({ error: "Invalid score" }, { status: 400 });
  }

  const round = verifyRoundToken(body.token);
  if (!round) return NextResponse.json({ error: "Nice try. Play a round first." }, { status: 403 });
  const age = Date.now() - round.startedAt;
  if (age < ROUND_MS - ROUND_SLACK_MS) {
    return NextResponse.json({ error: "Nice try. The round is not over yet." }, { status: 403 });
  }
  if (age > TOKEN_MAX_AGE_MS) {
    return NextResponse.json({ error: "That round has expired. Play again!" }, { status: 403 });
  }

  try {
    const sql = db();
    // round_nonce is UNIQUE, so replaying a token fails here
    const inserted = await sql`
      INSERT INTO whack_a_dev_scores (name, score, round_nonce)
      VALUES (${name}, ${score}, ${round.nonce})
      ON CONFLICT (round_nonce) DO NOTHING
      RETURNING id
    `;
    if (inserted.length === 0) {
      return NextResponse.json({ error: "Nice try. That round was already saved." }, { status: 409 });
    }
    const [{ rank }] = await sql`
      SELECT count(*) + 1 AS rank FROM whack_a_dev_scores WHERE score > ${score}
    `;
    return NextResponse.json({ ok: true, rank: Number(rank) });
  } catch (err) {
    console.error("leaderboard POST failed", err);
    return NextResponse.json({ error: "Could not save score" }, { status: 500 });
  }
}
