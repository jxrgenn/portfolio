import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit } from "@/lib/ratelimit";

const ContactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  topic: z.enum(["Hiring / role", "Project / collaboration", "Other"]),
  message: z.string().trim().min(10).max(8000),
  // honeypot — humans should leave this empty; we accept anything here
  // and silently 202 if filled, to avoid leaking the trap to bots.
  company: z.string().optional(),
});

const CONTACT_TO = process.env.CONTACT_TO ?? "jurgenhalili1142@gmail.com";
const FROM = process.env.CONTACT_FROM ?? "no-reply@jurgenhalili.dev";

export async function POST(request: Request) {
  // Rate limit by IP — 5/min per the architecture spec.
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const rl = checkRateLimit({ ip, windowMs: 60_000, max: 5 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests. Try again in a minute." },
      {
        status: 429,
        headers: { "Retry-After": Math.ceil(rl.retryAfterMs / 1000).toString() },
      },
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = ContactSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed.", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  // Honeypot caught — return success to avoid leaking the trap.
  if (parsed.data.company && parsed.data.company.length > 0) {
    return NextResponse.json({ ok: true }, { status: 202 });
  }

  const { name, email, topic, message } = parsed.data;
  const subject = `[portfolio] ${topic} — ${name}`;
  const body = [
    `From: ${name} <${email}>`,
    `Topic: ${topic}`,
    `IP: ${ip}`,
    "",
    message,
  ].join("\n");

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    // Dev / not-yet-configured fallback. Logs the message; user gets a
    // success response so the form UI works during local development.
    console.log("[contact] RESEND_API_KEY not set; logging instead.\n" + body);
    return NextResponse.json({ ok: true, mode: "logged" }, { status: 202 });
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM,
      to: CONTACT_TO,
      replyTo: email,
      subject,
      text: body,
    });
    if (error) {
      console.error("[contact] resend error", error);
      return NextResponse.json(
        { error: "Could not send. Try emailing me directly." },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("[contact] unexpected error", err);
    return NextResponse.json(
      { error: "Could not send. Try emailing me directly." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, mode: "sent" }, { status: 202 });
}
