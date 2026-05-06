"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const CREAM = "#f5f1ea";
const PAPER = "#efe6d6";
const INK = "#1a1815";
const MUTED = "#6b5d4a";
const FAINT = "#a89882";
const RED = "#c11626";
const STAMP = "#0a0908";

/* -------------------------------------------------------------------------- */
/*  Cursor — small red dot with spring follow.                                */
/* -------------------------------------------------------------------------- */

function RedCursor() {
  const [coords, setCoords] = useState({ x: -100, y: -100 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => setCoords({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[60] hidden md:block"
      animate={{ x: coords.x - 6, y: coords.y - 6 }}
      transition={{ type: "spring", damping: 28, stiffness: 320, mass: 0.4 }}
    >
      <div
        className="size-3 rounded-full mix-blend-multiply"
        style={{ background: RED, boxShadow: `0 0 18px ${RED}55` }}
      />
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Paper grain — full-bleed subtle noise texture.                            */
/* -------------------------------------------------------------------------- */

function PaperGrain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 opacity-[0.06] mix-blend-multiply"
      style={{
        backgroundImage:
          "radial-gradient(rgba(0,0,0,0.7) 1px, transparent 1px), radial-gradient(rgba(0,0,0,0.4) 1px, transparent 1px)",
        backgroundSize: "3px 3px, 5px 5px",
        backgroundPosition: "0 0, 1px 2px",
      }}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*  Letterhead — top masthead row with centered title and side meta.          */
/* -------------------------------------------------------------------------- */

function Letterhead() {
  return (
    <div className="relative">
      <div className="border-b" style={{ borderColor: INK, borderBottomWidth: 2 }} />
      <div className="grid grid-cols-3 items-baseline px-6 py-4 md:px-10 lg:px-16">
        <p
          className="font-serif italic"
          style={{ color: INK, fontSize: 14, letterSpacing: "0.01em" }}
        >
          Dispatch № 01
        </p>
        <p
          className="text-center font-serif tracking-[0.32em]"
          style={{ color: INK, fontSize: 13 }}
        >
          TIRANA
        </p>
        <p
          className="text-right font-serif italic"
          style={{ color: INK, fontSize: 14 }}
        >
          April 2026
        </p>
      </div>
      <div className="border-b" style={{ borderColor: INK, borderBottomWidth: 1 }} />
      <div
        className="border-b"
        style={{ borderColor: INK, borderBottomWidth: 1, marginTop: 2 }}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Hero — editorial masthead, headline, body, big serif "9".                 */
/* -------------------------------------------------------------------------- */

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const numberScale = useSpring(useTransform(scrollYProgress, [0, 1], [1, 1.4]), {
    stiffness: 80,
    damping: 30,
  });
  const numberRotate = useTransform(scrollYProgress, [0, 1], [-2, 4]);

  return (
    <section ref={ref} className="relative pb-32" style={{ background: CREAM }}>
      <Letterhead />

      <div className="relative grid grid-cols-12 gap-6 px-6 pt-20 md:px-10 md:pt-28 lg:px-16">
        {/* Left rail — kicker */}
        <div className="col-span-12 md:col-span-2">
          <p
            className="font-serif italic"
            style={{ color: MUTED, fontSize: 14, lineHeight: 1.4 }}
          >
            № 01 — Field notes
            <br />
            from a young
            <br />
            Albanian engineer.
          </p>
          <div
            className="mt-4 h-px"
            style={{ background: INK, width: "60%" }}
          />
        </div>

        {/* Headline column */}
        <div className="col-span-12 md:col-span-7">
          <h1
            className="font-serif"
            style={{
              color: INK,
              fontSize: "clamp(3.2rem, 8.5vw, 8rem)",
              lineHeight: 0.92,
              letterSpacing: "-0.025em",
              fontWeight: 500,
            }}
          >
            <span style={{ fontStyle: "italic" }}>I ship</span>
            <br />
            production
            <br />
            <span style={{ color: RED }}>solo</span>.
          </h1>

          <div className="mt-12 max-w-xl">
            <p
              className="font-serif"
              style={{
                color: INK,
                fontSize: "clamp(1.05rem, 1.4vw, 1.25rem)",
                lineHeight: 1.55,
              }}
            >
              <span
                className="float-left mr-3 -mt-2 font-serif"
                style={{
                  color: RED,
                  fontSize: "5rem",
                  lineHeight: 0.85,
                  fontWeight: 600,
                }}
              >
                T
              </span>
              wenty-two. Tirana. Freelancing since April 2024. Nine
              production projects in two years — every one of them mine, end
              to end. AI-driven full-stack on one track, Microsoft Dynamics
              365 / Business Central / NAV migrations on the other.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <a
              href="#cases"
              className="group inline-flex items-baseline gap-2"
              style={{
                color: INK,
                borderBottom: `2px solid ${INK}`,
                paddingBottom: 4,
              }}
            >
              <span className="font-serif" style={{ fontSize: 16 }}>
                Read the case files
              </span>
              <span
                className="transition-transform group-hover:translate-x-1"
                style={{ color: RED }}
              >
                →
              </span>
            </a>
            <a
              href="mailto:jurgenhalili1142@gmail.com"
              className="font-serif italic"
              style={{
                color: MUTED,
                fontSize: 16,
                textDecoration: "underline",
                textDecorationStyle: "dotted",
                textUnderlineOffset: 5,
              }}
            >
              jurgenhalili1142@gmail.com
            </a>
          </div>
        </div>

        {/* Right rail — massive 9 */}
        <div className="col-span-12 md:col-span-3">
          <motion.div
            style={{
              scale: numberScale,
              rotate: numberRotate,
              transformOrigin: "top right",
            }}
            className="relative flex items-start justify-end"
          >
            <span
              className="font-serif"
              style={{
                color: INK,
                fontSize: "clamp(10rem, 22vw, 22rem)",
                lineHeight: 0.78,
                fontWeight: 500,
                letterSpacing: "-0.04em",
              }}
            >
              9
            </span>
            <span
              className="absolute -bottom-2 left-0 font-serif italic"
              style={{ color: MUTED, fontSize: 13 }}
            >
              projects, shipped
            </span>
          </motion.div>
        </div>
      </div>

      {/* Bottom hairline + footnote */}
      <div className="mt-32 px-6 md:px-10 lg:px-16">
        <div className="h-px" style={{ background: INK, opacity: 0.4 }} />
        <div className="mt-3 flex items-baseline justify-between">
          <p
            className="font-serif italic"
            style={{ color: MUTED, fontSize: 12 }}
          >
            Continue ↓
          </p>
          <p
            className="font-serif italic"
            style={{ color: MUTED, fontSize: 12 }}
          >
            page 02 — spotlight: GymApp
          </p>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Spotlight — scroll-pinned device duo, annotations swap as you scroll.     */
/* -------------------------------------------------------------------------- */

function Spotlight() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Three annotations tied to scroll segments.
  const a1Opacity = useTransform(scrollYProgress, [0.0, 0.18, 0.32, 0.4], [0, 1, 1, 0]);
  const a2Opacity = useTransform(scrollYProgress, [0.35, 0.5, 0.62, 0.7], [0, 1, 1, 0]);
  const a3Opacity = useTransform(scrollYProgress, [0.65, 0.78, 0.9, 1.0], [0, 1, 1, 0.6]);

  return (
    <section
      ref={ref}
      className="relative"
      style={{ background: PAPER, height: "260vh" }}
    >
      <div className="sticky top-0 flex h-screen flex-col">
        {/* Section masthead */}
        <div
          className="grid grid-cols-12 items-baseline border-b px-6 py-4 md:px-10 lg:px-16"
          style={{ borderColor: INK, borderBottomWidth: 2 }}
        >
          <div className="col-span-3">
            <p
              className="font-serif italic"
              style={{ color: MUTED, fontSize: 14 }}
            >
              Spotlight — Case 03
            </p>
          </div>
          <div className="col-span-6 text-center">
            <p
              className="font-serif"
              style={{ color: INK, fontSize: 18, letterSpacing: "0.02em" }}
            >
              GymApp
            </p>
          </div>
          <div className="col-span-3 text-right">
            <p
              className="font-serif italic"
              style={{ color: MUTED, fontSize: 14 }}
            >
              shipped — 2025
            </p>
          </div>
        </div>

        {/* Pinned device + annotations */}
        <div className="relative flex flex-1 items-center px-6 md:px-10 lg:px-16">
          <div className="grid w-full grid-cols-12 items-center gap-8">
            {/* Annotations column */}
            <div className="relative col-span-12 h-[60vh] md:col-span-5">
              <Annotation
                opacity={a1Opacity}
                num="01"
                title="Four deployables, one branding record"
                body="Express + Postgres API, React + MUI receptionist dashboard, Expo member app that white-labels per gym at runtime, and a node-hid scanner-bridge service for the NFC turnstile."
              />
              <Annotation
                opacity={a2Opacity}
                num="02"
                title="Live occupancy across PM2 workers"
                body="Socket.io with a Redis adapter — every cluster member sees the same number on the dashboard the instant a member taps in."
              />
              <Annotation
                opacity={a3Opacity}
                num="03"
                title="Ad pipeline shares the product code"
                body="Remotion renders TikTok ads from the same React components used in the app. Marketing creative and product UI never drift."
              />
            </div>

            {/* Device column */}
            <div className="relative col-span-12 md:col-span-7">
              <DeviceFrame />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Annotation({
  num,
  title,
  body,
  opacity,
}: {
  num: string;
  title: string;
  body: string;
  opacity: ReturnType<typeof useTransform<number, number>>;
}) {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col justify-center"
      style={{ opacity }}
    >
      <p
        className="font-serif italic"
        style={{ color: RED, fontSize: 14, marginBottom: 8 }}
      >
        Note {num}
      </p>
      <h3
        className="font-serif"
        style={{
          color: INK,
          fontSize: "clamp(1.6rem, 2.6vw, 2.4rem)",
          lineHeight: 1.05,
          letterSpacing: "-0.015em",
        }}
      >
        {title}
      </h3>
      <p
        className="mt-5 font-serif"
        style={{
          color: MUTED,
          fontSize: 16,
          lineHeight: 1.55,
          maxWidth: "32rem",
        }}
      >
        {body}
      </p>
      <div
        className="mt-6 h-[2px] w-12"
        style={{ background: RED }}
      />
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Real CSS-rendered iPhone frame + browser frame side-by-side.              */
/* -------------------------------------------------------------------------- */

function DeviceFrame() {
  return (
    <div className="relative grid grid-cols-12 items-end gap-3">
      {/* Browser */}
      <div
        className="col-span-9 overflow-hidden rounded-lg shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)]"
        style={{ background: "#0b0f15", border: `1px solid ${INK}30` }}
      >
        <div
          className="flex items-center gap-2 px-3 py-2"
          style={{ background: "#0a0d12", borderBottom: "1px solid #ffffff10" }}
        >
          <span className="size-2.5 rounded-full" style={{ background: "#fb7185" }} />
          <span className="size-2.5 rounded-full" style={{ background: "#fbbf24" }} />
          <span className="size-2.5 rounded-full" style={{ background: "#34d399" }} />
          <div
            className="ml-3 flex h-5 max-w-xs flex-1 items-center justify-center rounded font-serif italic"
            style={{ background: "#ffffff08", color: "#ffffff80", fontSize: 11 }}
          >
            gymapp.al/admin
          </div>
        </div>
        <div className="relative aspect-[16/10] w-full">
          <Image
            src="/captures/gymapp/dashboard-v2-home.png"
            alt="GymApp admin dashboard"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover object-top"
            priority
          />
        </div>
      </div>

      {/* Phone — real CSS frame, aspect 9:19, ~340px wide */}
      <div className="col-span-3 -ml-4 self-center">
        <PhoneFrame
          screenSrc="/captures/gymapp/check-workout.png"
          screenAlt="GymApp Expo member app"
        />
      </div>
    </div>
  );
}

function PhoneFrame({
  screenSrc,
  screenAlt,
}: {
  screenSrc: string;
  screenAlt: string;
}) {
  return (
    <div
      className="relative mx-auto w-full"
      style={{
        maxWidth: 240,
        aspectRatio: "9 / 19",
        background: "#0a0908",
        borderRadius: 38,
        border: "2px solid #1a1815",
        padding: 8,
        boxShadow:
          "0 30px 60px -10px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.05)",
      }}
    >
      {/* Side button accents */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: 80,
          right: -3,
          width: 3,
          height: 60,
          background: "#1a1815",
          borderRadius: 2,
        }}
      />
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: 110,
          left: -3,
          width: 3,
          height: 36,
          background: "#1a1815",
          borderRadius: 2,
        }}
      />
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: 156,
          left: -3,
          width: 3,
          height: 60,
          background: "#1a1815",
          borderRadius: 2,
        }}
      />

      {/* Inner screen */}
      <div
        className="relative h-full w-full overflow-hidden"
        style={{ borderRadius: 30, background: "#000" }}
      >
        <Image
          src={screenSrc}
          alt={screenAlt}
          fill
          sizes="240px"
          className="object-cover object-top"
        />
        {/* Dynamic island */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 8,
            left: "50%",
            transform: "translateX(-50%)",
            width: 78,
            height: 22,
            background: "#000",
            borderRadius: 999,
            boxShadow: "0 0 0 1px rgba(255,255,255,0.04)",
          }}
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Case file — letterpress number + stamp + ink-underline hover.             */
/* -------------------------------------------------------------------------- */

function CaseFile({
  number,
  title,
  tagline,
  status,
  metrics,
}: {
  number: string;
  title: string;
  tagline: string;
  status: "shipped" | "in-progress" | "prototype";
  metrics: { value: string; label: string }[];
}) {
  const [hovered, setHovered] = useState(false);
  const stampLabel = status === "shipped" ? "SHIPPED" : status === "in-progress" ? "IN PROGRESS" : "PROTOTYPE";
  const stampRotate = status === "shipped" ? -8 : status === "in-progress" ? 6 : -3;

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative grid grid-cols-12 items-start gap-6 border-t py-12 md:py-16"
      style={{ borderColor: INK, borderTopWidth: 2 }}
    >
      {/* Letterpress number */}
      <div className="col-span-3 md:col-span-2">
        <p
          className="font-serif italic"
          style={{ color: MUTED, fontSize: 13, marginBottom: 4 }}
        >
          Case
        </p>
        <p
          className="font-serif"
          style={{
            color: INK,
            fontSize: "clamp(3.5rem, 7vw, 6rem)",
            lineHeight: 0.85,
            letterSpacing: "-0.04em",
            fontWeight: 500,
          }}
        >
          {number}
        </p>
      </div>

      {/* Title + body */}
      <div className="col-span-9 md:col-span-7">
        <h3
          className="relative inline-block font-serif"
          style={{
            color: INK,
            fontSize: "clamp(2rem, 3.4vw, 3rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.015em",
            fontWeight: 500,
          }}
        >
          {title}
          {/* Ink underline */}
          <motion.span
            aria-hidden
            initial={false}
            animate={{ scaleX: hovered ? 1 : 0 }}
            transition={{ duration: 0.45, ease: [0.2, 0.6, 0.2, 1] }}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: -6,
              height: 4,
              background: RED,
              transformOrigin: "left center",
              borderRadius: 1,
            }}
          />
        </h3>
        <p
          className="mt-5 font-serif"
          style={{
            color: MUTED,
            fontSize: "clamp(1.05rem, 1.3vw, 1.2rem)",
            lineHeight: 1.5,
            maxWidth: "36rem",
          }}
        >
          {tagline}
        </p>

        {/* Metric ledger */}
        <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-4 md:grid-cols-3">
          {metrics.map((m) => (
            <div key={m.label} className="flex flex-col">
              <dt
                className="font-serif italic"
                style={{ color: MUTED, fontSize: 12 }}
              >
                {m.label}
              </dt>
              <dd
                className="font-serif"
                style={{
                  color: INK,
                  fontSize: "clamp(1.5rem, 2vw, 2rem)",
                  lineHeight: 1.05,
                  fontWeight: 500,
                }}
              >
                {m.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Stamp */}
      <div className="col-span-12 flex justify-end md:col-span-3">
        <div
          className="relative"
          style={{
            transform: `rotate(${stampRotate}deg)`,
            border: `2px solid ${RED}`,
            color: RED,
            padding: "8px 14px",
            fontFamily: "var(--font-fraunces), serif",
            fontWeight: 600,
            letterSpacing: "0.18em",
            fontSize: 12,
            opacity: 0.85,
          }}
        >
          {stampLabel}
          <span
            aria-hidden
            style={{
              position: "absolute",
              top: -3,
              left: -3,
              right: -3,
              bottom: -3,
              border: `1px solid ${RED}`,
              opacity: 0.3,
            }}
          />
        </div>
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page — three sample sections of the proposed direction.                   */
/* -------------------------------------------------------------------------- */

export default function Preview() {
  return (
    <div
      className="relative min-h-screen"
      style={{ background: CREAM, color: INK }}
    >
      <PaperGrain />
      <RedCursor />

      <div className="relative z-10">
        <Hero />
        <Spotlight />

        <section
          id="cases"
          className="relative px-6 py-24 md:px-10 md:py-32 lg:px-16"
          style={{ background: CREAM }}
        >
          <div
            className="mb-10 flex items-baseline justify-between border-b pb-3"
            style={{ borderColor: INK, borderBottomWidth: 2 }}
          >
            <h2
              className="font-serif"
              style={{
                color: INK,
                fontSize: "clamp(2.4rem, 5vw, 4.5rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.025em",
                fontWeight: 500,
              }}
            >
              <span style={{ fontStyle: "italic" }}>The</span> case files
            </h2>
            <p
              className="font-serif italic"
              style={{ color: MUTED, fontSize: 14 }}
            >
              nine entries · 2024 → 2026
            </p>
          </div>

          <CaseFile
            number="01"
            title="KeepItUp"
            tagline="Self-hosted AI on-call agent. Six deploy platforms, six tree-sitter grammars, three LLM providers behind one type. Confidence gate before any PR — never pushes to main."
            status="shipped"
            metrics={[
              { value: "~18.3K", label: "lines" },
              { value: "6", label: "platforms" },
              { value: "3 + 4", label: "LLMs · scanners" },
            ]}
          />
          <CaseFile
            number="03"
            title="GymApp"
            tagline="White-label gym OS. NFC turnstile entry through a node-hid scanner-bridge, live occupancy via Socket.io clustered through Redis, branded member app per gym."
            status="shipped"
            metrics={[
              { value: "24", label: "models" },
              { value: "91", label: "tests" },
              { value: "4", label: "deployables" },
            ]}
          />
          <CaseFile
            number="06"
            title="Social Command Center"
            tagline="Industrial content drip for a 7-brand operator. BullMQ cron walks every brand through six pipeline stages. Three Claude Code slash commands give a zero-API-cost path."
            status="in-progress"
            metrics={[
              { value: "7", label: "brands" },
              { value: "6", label: "stages" },
              { value: "Mon 6am", label: "cadence" },
            ]}
          />

          <div
            className="mt-16 border-t pt-6"
            style={{ borderColor: INK, borderTopWidth: 2 }}
          >
            <p
              className="text-center font-serif italic"
              style={{ color: MUTED, fontSize: 14 }}
            >
              — fin (preview, not the full site) —
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
