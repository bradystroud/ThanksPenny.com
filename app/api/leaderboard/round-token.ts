import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * A round token proves a round was started through the API before a score is
 * submitted. It is an HMAC-signed {startedAt, nonce} pair. The nonce is stored
 * with the score, so one token can only ever produce one leaderboard row.
 */
export type RoundToken = { startedAt: number; nonce: string };

function secret(): string {
  const s = process.env.LEADERBOARD_SECRET;
  if (!s) throw new Error("LEADERBOARD_SECRET is not set");
  return s;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function issueRoundToken(): string {
  const payload = Buffer.from(
    JSON.stringify({ startedAt: Date.now(), nonce: randomBytes(12).toString("base64url") })
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifyRoundToken(token: unknown): RoundToken | null {
  if (typeof token !== "string") return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (typeof parsed.startedAt !== "number" || typeof parsed.nonce !== "string") return null;
    return { startedAt: parsed.startedAt, nonce: parsed.nonce };
  } catch {
    return null;
  }
}
