"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2 } from "lucide-react";

type Status = "idle" | "submitting" | "success" | "error";

const topics = ["Hiring / role", "Project / collaboration", "Other"] as const;

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      topic: String(data.get("topic") ?? ""),
      message: String(data.get("message") ?? ""),
      company: String(data.get("company") ?? ""),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? `Request failed (${res.status})`);
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        role="status"
        aria-live="polite"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.2, 0.6, 0.2, 1] }}
        className="relative overflow-hidden rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)]/60 p-10 backdrop-blur"
      >
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at top, rgba(34,211,238,0.3), transparent 60%)",
          }}
        />
        <CheckCircle2 className="size-10 text-[var(--color-accent)]" />
        <p className="mt-4 font-serif text-3xl text-[var(--color-fg)]">
          Message received.
        </p>
        <p className="mt-3 text-base text-[var(--color-fg-muted)]">
          I&rsquo;ll respond within 48h. For anything urgent, email directly:{" "}
          <a
            href="mailto:jurgenhalili1142@gmail.com"
            className="text-[var(--color-accent)] underline decoration-dotted underline-offset-4"
          >
            jurgenhalili1142@gmail.com
          </a>
          .
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <Field label="Name" name="name" type="text" required autoComplete="name" />
      <Field label="Email" name="email" type="email" required autoComplete="email" />

      <div>
        <label
          htmlFor="topic"
          className="block font-mono text-xs uppercase tracking-wider text-[var(--color-fg-subtle)]"
        >
          What&rsquo;s this about?
        </label>
        <select
          id="topic"
          name="topic"
          required
          defaultValue=""
          className="mt-2 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/60 px-4 py-3 font-sans text-base text-[var(--color-fg)] backdrop-blur transition-all focus:border-[var(--color-accent)] focus:shadow-[0_0_0_3px_rgba(34,211,238,0.15)] focus:outline-none"
        >
          <option value="" disabled>
            Pick one
          </option>
          {topics.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="message"
          className="block font-mono text-xs uppercase tracking-wider text-[var(--color-fg-subtle)]"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="What are you building? What's the role? Anything I should know."
          className="mt-2 w-full resize-y rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/60 px-4 py-3 font-sans text-base text-[var(--color-fg)] backdrop-blur transition-all placeholder:text-[var(--color-fg-subtle)] focus:border-[var(--color-accent)] focus:shadow-[0_0_0_3px_rgba(34,211,238,0.15)] focus:outline-none"
        />
      </div>

      {/* Honeypot — visually + a11y hidden */}
      <div className="sr-only" aria-hidden="true">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {errorMessage ? (
        <p
          role="alert"
          className="font-mono text-xs text-[var(--color-danger)]"
        >
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        aria-busy={status === "submitting"}
        className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-6 py-3 font-mono text-sm uppercase tracking-wider text-[var(--color-bg)] shadow-[0_0_24px_rgba(34,211,238,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_44px_rgba(34,211,238,0.55)] disabled:cursor-progress disabled:opacity-60"
      >
        <span
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(110deg, rgba(34,211,238,1) 0%, rgba(167,139,250,1) 45%, rgba(244,114,182,1) 100%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 3s linear infinite",
          }}
        />
        <span className="relative z-10 flex items-center gap-2">
          {status === "submitting" ? "Sending…" : "Send message"}
          <Send className="size-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type,
  required,
  autoComplete,
}: {
  label: string;
  name: string;
  type: string;
  required?: boolean;
  autoComplete?: string;
}) {
  const id = `field-${name}`;
  return (
    <div>
      <label
        htmlFor={id}
        className="block font-mono text-xs uppercase tracking-wider text-[var(--color-fg-subtle)]"
      >
        {label}
        {required ? null : <span className="ml-1 normal-case">(optional)</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="mt-2 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/60 px-4 py-3 font-sans text-base text-[var(--color-fg)] backdrop-blur transition-all focus:border-[var(--color-accent)] focus:shadow-[0_0_0_3px_rgba(34,211,238,0.15)] focus:outline-none"
      />
    </div>
  );
}
