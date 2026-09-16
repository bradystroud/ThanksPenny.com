import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const TOP_N = 10;
const MAX_NAME_LENGTH = 20;
// Rounds are 30s with at most ~2 pops/sec, so anything above this is not a real score
const MAX_SCORE = 300;

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
      LIMIT ${TOP_N}
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
  let body: { name?: unknown; score?: unknown };
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

  try {
    const sql = db();
    await sql`INSERT INTO whack_a_dev_scores (name, score) VALUES (${name}, ${score})`;
    const [{ rank }] = await sql`
      SELECT count(*) + 1 AS rank FROM whack_a_dev_scores WHERE score > ${score}
    `;
    return NextResponse.json({ ok: true, rank: Number(rank) });
  } catch (err) {
    console.error("leaderboard POST failed", err);
    return NextResponse.json({ error: "Could not save score" }, { status: 500 });
  }
}
