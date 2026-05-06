// Simple in-memory token-bucket per IP. Vercel's serverless instance is
// single-process per region; this is fine at portfolio-site scale and
// avoids a Redis dependency in v1. See 02-architecture.md § 8.

type Bucket = { tokens: number; updatedAt: number };

const buckets = new Map<string, Bucket>();

export function checkRateLimit({
  ip,
  windowMs,
  max,
}: {
  ip: string;
  windowMs: number;
  max: number;
}): { ok: true } | { ok: false; retryAfterMs: number } {
  const now = Date.now();
  const refillRate = max / windowMs; // tokens per ms
  const existing = buckets.get(ip);
  let bucket: Bucket;

  if (!existing) {
    bucket = { tokens: max - 1, updatedAt: now };
    buckets.set(ip, bucket);
    return { ok: true };
  }

  const elapsed = now - existing.updatedAt;
  const refilled = Math.min(max, existing.tokens + elapsed * refillRate);
  if (refilled < 1) {
    const retryAfterMs = Math.ceil((1 - refilled) / refillRate);
    existing.tokens = refilled;
    existing.updatedAt = now;
    return { ok: false, retryAfterMs };
  }
  existing.tokens = refilled - 1;
  existing.updatedAt = now;
  return { ok: true };
}
