/**
 * Source-of-truth for the 9 featured projects.
 * Mirrors the briefs in PORTFOLIO_PLAN/07-projects/<n>-<slug>.md.
 *
 * Phase 1 uses this directly. Phase 3 will move full content into MDX
 * under src/content/projects/ and load via lib/projects.ts loaders;
 * this file will continue to expose the typed registry.
 */

export type ProjectStatus = "shipped" | "in-progress" | "prototype";

export type ProjectImageMode = "cover" | "contain";

export type ProjectTechStack = {
  Frontend?: readonly string[];
  Backend?: readonly string[];
  Data?: readonly string[];
  AI?: readonly string[];
  Infra?: readonly string[];
  Other?: readonly string[];
};

export type ProjectUnderHoodEntry = {
  path: string;
  title: string;
  body: string;
};

export type ProjectMetric = {
  value: string;
  label: string;
};

export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  slug: string;
  order: number;
  title: string;
  tagline: string;
  year: number;
  status: ProjectStatus;
  hero: string;
  heroAlt: string;
  /** Top 3 stack chips shown on the home grid card. */
  stack: readonly [string, string, string];
  /** "cover" for full screenshots, "contain" for icon-style fallbacks. */
  imageMode?: ProjectImageMode;

  // --- Detail-page content ---
  /** ~40-60 word punchy summary that merges problem + what I built. */
  pitch: string;
  /** Optional 2-6 extra screenshot paths shown in the gallery. */
  gallery?: readonly string[];
  /** Paragraphs (2-4 sentences each, first-person past tense). */
  problem: readonly string[];
  /** Paragraphs (4-7 sentences total spread across 1-3 paragraphs). */
  approach: readonly string[];
  /** Tech stack groups; only populated groups are present. */
  techStack: ProjectTechStack;
  /** Exactly three "interesting under the hood" entries. */
  underHood: readonly [
    ProjectUnderHoodEntry,
    ProjectUnderHoodEntry,
    ProjectUnderHoodEntry,
  ];
  /** Concrete numeric/value-bearing metrics, 4-7 entries. */
  metrics: readonly ProjectMetric[];
  /** 1-2 sentences combining timeline + status from brief. */
  timeline: string;
  /** 1-2 sentences ("Solo." default). */
  role: string;
  /** First-person, punchy quote pulled verbatim from brief. */
  liftQuote: string;
  /** Any URLs from brief; if no public code, use the private placeholder. */
  links: readonly ProjectLink[];
};

export const projects = [
  // ---------------------------------------------------------------------------
  // 1. KeepItUp
  // ---------------------------------------------------------------------------
  {
    slug: "keepitup",
    order: 1,
    title: "KeepItUp",
    tagline: "Self-hosted AI agent that auto-fixes broken deployments.",
    year: 2026,
    status: "shipped",
    hero: "/captures/keepitup/home_desktop.png",
    heroAlt:
      "KeepItUp — Connect Services modal showing multi-provider AI configuration",
    stack: ["React 19", "Anthropic + OpenAI + Gemini", "Tree-sitter"],
    pitch:
      "Self-hosted AI on-call agent. Polls six deploy platforms every five minutes, parses crashes with tree-sitter across six languages, drafts a fix through OpenAI / Anthropic / Gemini, runs it past a confidence gate, and opens a PR — never pushes to main.",
    gallery: ["/captures/keepitup/home_mobile.png"],
    problem: [
      "Solo founders and small teams ship fast but lack 24/7 ops. A 3 AM Vercel build break or runtime crash either silently rots or wakes someone up at the worst possible time.",
      "I built KeepItUp because I wanted \"page on call\" to turn into \"review a PR after coffee\" — without handing the keys to a black-box SaaS, and without the agent ever pushing straight to main.",
    ],
    approach: [
      "I built a React 19 + Vite dashboard that talks to an Express backend polling Vercel, Render, Railway, Netlify, Fly, and Heroku APIs every 5 minutes. The backend pulls runtime logs from BetterStack and feeds errors into a multi-provider LLM client so OpenAI, Anthropic, and Gemini are interchangeable behind one type.",
      "I wrote a tree-sitter AST layer that parses the offending file across six languages (TS/JS/Go/Java/Python/Rust) so the model gets symbol-level context instead of a raw blob — fix prompts are materially better when the model sees the call graph. A confidence gate (>=85%, or >=70% if a build verifies) decides whether a fix becomes a PR. I rolled errors, security scans (Semgrep, Trivy, Gitleaks, npm audit, all run in Docker), and perf into a single weighted 0-100 health score.",
      "I also built a v2 agent runtime under `server/src/agent/v2` with explicit orchestrator/runtime/state/memory/tools subsystems — moving from one-shot prompts to a conversational tool-using agent.",
    ],
    techStack: {
      Frontend: [
        "React 19.2",
        "TypeScript 5.8",
        "Vite 6",
        "Tailwind 4",
        "lucide-react",
      ],
      Backend: [
        "Express 4",
        "TypeScript",
        "Node 18+",
        "ws (WebSocket)",
        "winston",
      ],
      Data: ["PostgreSQL 8 (pg)", "Redis (optional, in-memory fallback)"],
      AI: [
        "@anthropic-ai/sdk 0.78",
        "openai 6.25",
        "@google/genai 1.30",
        "tree-sitter (TS/JS/Go/Java/Python/Rust grammars)",
      ],
      Infra: [
        "Docker Compose",
        "nginx",
        "GitHub PAT (Octokit 20)",
        "Telegram Bot API",
        "BetterStack",
      ],
      Other: ["cron 3", "helmet", "express-rate-limit", "JWT"],
    },
    underHood: [
      {
        path: "server/src/services/contextEngine.ts",
        title: "tree-sitter AST walker",
        body: "Parses the offending file across 6 languages so the LLM gets symbol-level context instead of a raw blob. Fix prompts get materially better when the model sees the call graph, not just line numbers.",
      },
      {
        path: "server/src/llm/client.ts",
        title: "multi-provider LLM abstraction",
        body: "OpenAI, Anthropic, and Gemini sit behind one type, so swapping providers is a config change rather than a refactor.",
      },
      {
        path: "server/src/agent/v2/orchestrator.ts",
        title: "v2 agent runtime",
        body: "Explicit state machine with runtime, state, memory, and tools subsystems — moves the system from one-shot prompts to a real conversational tool-using agent.",
      },
    ],
    metrics: [
      { value: "~18,336", label: "LOC across 84 server TS files" },
      { value: "19", label: "backend test files (Jest)" },
      { value: "11", label: "REST route modules" },
      { value: "10", label: "Postgres tables in schema.sql" },
      {
        value: "6",
        label: "deploy platforms supported (Vercel, Render, Railway, Netlify, Fly, Heroku)",
      },
      { value: "6", label: "tree-sitter language grammars" },
      { value: "3 / 4", label: "LLM providers and security scanners" },
    ],
    timeline:
      "First commit ~2026-02-27, last commit ~2026-03-21, with file edits through ~2026-04-19 — about 6-8 weeks of active build. Shipped and self-hostable, with Docker Compose prod config, deployment guides, and full audit reports living in the repo.",
    role: "Solo — lead and sole author across backend, agent runtime, frontend, and infra.",
    liftQuote:
      "\"I wanted 'page on call' to turn into 'review a PR after coffee' — and the agent never, ever pushes to main.\"",
    links: [
      { label: "Code", href: "private — available on request" },
      { label: "License", href: "MIT" },
    ],
  },

  // ---------------------------------------------------------------------------
  // 2. Ëndërrat e Mia
  // ---------------------------------------------------------------------------
  {
    slug: "enderrat-e-mia",
    order: 2,
    title: "Ëndërrat e Mia",
    tagline: "AI bedtime stories in Albanian, illustrated and read aloud.",
    year: 2026,
    status: "in-progress",
    hero: "/captures/endrrat_e_mia/hero.png",
    heroAlt:
      "Ëndërrat e Mia — generated illustration from the story pipeline",
    stack: ["Expo + RN", "Claude Haiku + Flux", "RevenueCat"],
    pitch:
      "Albanian-language bedtime stories, generated, illustrated, and narrated. Expo app on a Mongoose backend. Claude Haiku writes, fal.ai Flux Schnell paints four matched illustrations, TTS narrates, RevenueCat + AdMob fund the free tier, and an in-house pipeline renders the launch ad creatives.",
    problem: [
      "Albanian-speaking families — in Albania, Kosovo, and the diaspora — have almost no native-language children's content. Disney+, audiobooks, and AI tools all default to English, so parents end up translating on the fly at bedtime.",
      "I built Ëndërrat e Mia because I wanted \"story time in your kid's language\" to be a one-tap action, not a parent's improv set.",
    ],
    approach: [
      "I built an Expo Router 6 mobile app driving an Express + Mongoose backend on MongoDB Atlas. Story text is generated by Claude Haiku, four matched illustrations come from fal.ai's Flux Schnell, narration is TTS, and finished stories land in Cloudflare R2. Auth is JWT plus Google and Apple OAuth.",
      "I shipped a hybrid monetization model — free tier, credit packs, and RevenueCat-managed subscriptions — with Google AdMob filling the free tier and a Transaction model acting as the credits ledger. NativeWind + Zustand keep the UI fast and warm, i18next handles SQ/EN, and a community layer with Upvote and Report models gives the feed real moderation.",
      "I also built an automated ad-creative pipeline: `videos/generateAdImages*.js` and `generateVideoFrames.js` produce TikTok ad frames programmatically, which is how I generated ~30 creatives for the launch push.",
    ],
    techStack: {
      Frontend: [
        "React Native 0.81.5",
        "Expo 54",
        "Expo Router 6",
        "React 19.1",
        "NativeWind 4",
        "Zustand 5",
        "react-i18next 16",
        "expo-notifications",
        "react-native-reanimated 4",
      ],
      Backend: [
        "Node 18+",
        "Express 4",
        "Mongoose 8 (MongoDB Atlas)",
        "node-cron 4",
      ],
      AI: [
        "@anthropic-ai/sdk 0.80 (Claude Haiku)",
        "openai 6.32",
        "fal.ai (Flux Schnell)",
      ],
      Infra: ["AWS SDK S3 client (Cloudflare R2)"],
      Other: [
        "JWT",
        "google-auth-library",
        "apple-signin-auth",
        "react-native-purchases (RevenueCat) 9.7",
        "react-native-google-mobile-ads 16",
        "helmet",
        "express-rate-limit",
        "express-validator",
      ],
    },
    underHood: [
      {
        path: "Story generation pipeline",
        title: "Claude Haiku + fal.ai Flux Schnell",
        body: "Orchestrates narrative generation and four matched illustrations per story, then composes them with TTS narration into a single playable artifact.",
      },
      {
        path: "Transaction model",
        title: "credits ledger + RevenueCat/AdMob hybrid",
        body: "Free users earn and spend credits, paid users go unlimited, ads backfill the free tier — all reconciled through one ledger.",
      },
      {
        path: "videos/generateAdImages*.js",
        title: "programmatic ad-creative pipeline",
        body: "Renders TikTok ad frames in code, which is how I produced ~30 launch creatives without a designer.",
      },
    ],
    metrics: [
      { value: "53", label: ".tsx files in the mobile app" },
      {
        value: "7",
        label:
          "Mongoose models (User, Profile, Story, Subscription, Transaction, Upvote, Report)",
      },
      {
        value: "7",
        label:
          "backend route modules (auth, community, credits, profile, story, notifications, index)",
      },
      {
        value: "6",
        label:
          "mobile route groups (auth, creation, onboarding, settings, story, tabs)",
      },
      { value: "~30", label: "ad creatives generated for marketing" },
    ],
    timeline:
      "First commit ~2026-02-07, latest activity ~2026-04-09 — about 9 weeks of active work. In-progress / pre-launch: app-store readiness audit, incremental launch plan, and ad-production package all live in the repo, and the ad-creative pipeline is already running.",
    role: "Solo — the target market is my native-language community, so it made sense to own the whole stack end to end.",
    liftQuote:
      "\"I wanted my kids to have bedtime stories in their mother tongue — so I built the whole pipeline, from Claude Haiku to Flux Schnell to the ad creatives that pay for it.\"",
    links: [
      { label: "Code", href: "private — available on request" },
      { label: "License", href: "proprietary" },
    ],
  },

  // ---------------------------------------------------------------------------
  // 3. GymApp
  // ---------------------------------------------------------------------------
  {
    slug: "gym-app",
    order: 3,
    title: "GymApp",
    tagline: "White-label gym OS — NFC entry, member app, multi-tenant admin.",
    year: 2025,
    status: "shipped",
    hero: "/captures/gymapp/dashboard-v2-home.png",
    heroAlt: "GymApp dashboard showing daily check-ins and member activity",
    stack: ["Express + Postgres", "Socket.io + Redis", "Expo + MUI"],
    pitch:
      "White-label gym OS for the Albanian market. Four deployables — admin web, member app, API, NFC scanner-bridge — sharing one branding record. Socket.io with a Redis adapter fans live occupancy across PM2 workers so every dashboard sees the same number.",
    gallery: [
      "/captures/gymapp/dashboard-v2-analytics.png",
      "/captures/gymapp/dashboard-v2-cards.png",
      "/captures/gymapp/dashboard-v2-members.png",
      "/captures/gymapp/check-workout.png",
      "/captures/gymapp/check-schedule.png",
      "/captures/gymapp/check-stats.png",
    ],
    problem: [
      "Albanian gyms typically run on paper logbooks and WhatsApp. Off-the-shelf SaaS like Mindbody is priced for US studios and isn't localized.",
      "Owners want NFC turnstile entry, daily check-in reports, and a branded member app — without writing it themselves. I built GymApp so a single platform could deliver all three, white-labeled per gym.",
    ],
    approach: [
      "I built a monorepo with four deployables: an Express + Sequelize + PostgreSQL backend, a React + MUI dashboard for receptionists and super-admins, a React Native (Expo) member app that white-labels per gym from the Gym record's branding, and a Node scanner-bridge service that reads a USB NFC reader via `node-hid` and posts taps to `/api/visits`.",
      "Socket.io with a Redis adapter pushes live occupancy to every client, so PM2 cluster workers share state cleanly. I shipped workout plans, diet plans, classes with enrollment, promotions, audit logs, and a notification fanout. For marketing, I built a Remotion-based demo-video pipeline that renders TikTok ads from the same React components used in the app — so ad creatives stay visually consistent with the product.",
      "Multi-tenancy is enforced by a `gymId` foreign key on every domain model plus middleware-enforced scope; super-admins can hop tenants.",
    ],
    techStack: {
      Frontend: [
        "React 18",
        "MUI 5 + x-data-grid + x-date-pickers",
        "react-router 6",
        "recharts",
        "socket.io-client",
        "react-csv",
        "react-dropzone",
        "React Native (Expo)",
        "Jest setup",
      ],
      Backend: [
        "Express 4",
        "Sequelize 6",
        "PostgreSQL (pg 8)",
        "Socket.io 4 + @socket.io/redis-adapter",
        "ioredis 5",
        "PM2 6",
        "node-cron 3",
        "helmet",
        "express-rate-limit",
        "multer",
        "JWT",
      ],
      Infra: ["Node 18+", "optional `node-hid` for HID NFC readers", "dotenv"],
      Other: ["Remotion-based demo video generator (`demo-videos/`)"],
    },
    underHood: [
      {
        path: "scanner-bridge/",
        title: "thin Node service for HID NFC readers",
        body: "Reads taps and POSTs to `/api/visits`, decoupling hardware from the API and letting a Raspberry Pi sit at the gate without coupling it to backend internals.",
      },
      {
        path: "Socket.io + Redis adapter",
        title: "clustered live occupancy",
        body: "PM2 workers all share occupancy state through Redis pub/sub so the dashboard is consistent across cluster members.",
      },
      {
        path: "demo-videos/src/",
        title: "Remotion ad pipeline",
        body: "Renders TikTok ads from the same React components used in the app (`TikTokAd*.mp4`), so ad creative and product UI never drift.",
      },
    ],
    metrics: [
      { value: "24", label: "route files in backend/src/routes/" },
      {
        value: "24",
        label:
          "Sequelize models (Gym, NFCCard, GymVisit, GymOccupancy, ClassEnrollment, WorkoutPlan, DietPlan, AuditLog, Promotion, Subscription, and more)",
      },
      { value: "91", label: "backend test files (Jest)" },
      { value: "23", label: "mobile screens (18 main + 5 auth)" },
      { value: "4", label: "deployable services in the monorepo" },
      { value: "5+", label: "Remotion demo/ad MP4s rendered" },
    ],
    timeline:
      "First commit ~2025-11-01, last commit ~2026-03-28 — about 5 months of active work. Shipped and operational, with multi-tenancy complete, production-readiness analysis, perf baselines, full QA checklists, and Remotion demo videos already rendered for ad campaigns.",
    role: "Solo across backend, web, mobile, scanner-bridge, and the Remotion ad pipeline.",
    liftQuote:
      "\"Four deployables, one branding record — every gym gets its own app at runtime, and a Pi at the gate just talks to `/api/visits`.\"",
    links: [
      { label: "Code", href: "private — available on request" },
      { label: "License", href: "MIT" },
    ],
  },

  // ---------------------------------------------------------------------------
  // 4. Pilates Studio
  // ---------------------------------------------------------------------------
  {
    slug: "pilates-studio",
    order: 4,
    title: "Pilates Studio",
    tagline: "Boutique studio platform — admin web, mobile app, API, 594 tests.",
    year: 2026,
    status: "shipped",
    hero: "/captures/pilates_studio/home_desktop.png",
    heroAlt: "PilatesGym admin sign-in screen",
    stack: ["pnpm monorepo", "Express + Prisma", "Turso + libSQL"],
    pitch:
      "Branded studio platform — admin web, mobile app, API, 594 tests. Same Prisma schema runs on better-sqlite3 in dev and Turso (libsql) in prod via adapters. Express ships as a Vercel function with zero rewrites. Resend for email, Sentry for errors, Playwright for E2E.",
    gallery: ["/captures/pilates_studio/home_mobile.png"],
    problem: [
      "Boutique fitness studios juggle scheduling, memberships, payments, and waitlists across three or four SaaS tools that don't talk to each other.",
      "I built pilates-studio to replace that stack with one branded platform the studio actually owns — same data model, same brand, one bill.",
    ],
    approach: [
      "I built a pnpm monorepo with explicit boundaries: `apps/admin` (React 19 + Vite 6 + TanStack Query + React Router), `apps/mobile` (Expo 53 + Expo Router on RN 0.79), `apps/api` (Express 5 + Prisma 6 + Zod 4, Sentry-instrumented), and `packages/shared` for the Prisma schema, i18n dictionaries, and types.",
      "The same SQLite schema runs on `better-sqlite3` locally and Turso (libsql) in production via Prisma's adapter pattern, so the API ships as a Vercel serverless function with zero code rewrites. Auth is bcryptjs + JWT; transactional email goes through Resend with a graceful no-op when keys are unset. I added an audit log model + middleware that records resource and actor for every admin write, and the booking flow has proper status transitions with auto-promotion from the waitlist on cancellation.",
      "The admin app has full Vitest unit coverage plus a Playwright E2E suite, and there's an `admin:bootstrap` script for first-run setup.",
    ],
    techStack: {
      Frontend: [
        "React 19",
        "Vite 6",
        "TanStack Query",
        "React Router",
        "Vitest 4",
        "Expo 53",
        "React Native 0.79",
        "Expo Router",
      ],
      Backend: [
        "Express 5",
        "Prisma 6",
        "Zod 4",
        "JWT",
        "bcryptjs 3",
        "Sentry",
        "pino",
        "Resend",
        "helmet",
        "express-rate-limit",
      ],
      Data: [
        "SQLite (better-sqlite3) dev/test",
        "Turso (libsql) prod",
        "Prisma adapters",
      ],
      Infra: [
        "Vercel (catch-all `api/[[...path]].ts`)",
        "Docker (`Dockerfile.api`, `Dockerfile.admin`)",
        "nginx",
        "EAS for mobile",
      ],
      Other: ["Playwright"],
    },
    underHood: [
      {
        path: "apps/api/src/db.ts",
        title: "Prisma adapter swap",
        body: "Same schema runs on `@prisma/adapter-better-sqlite3` in dev and `@prisma/adapter-libsql` against Turso in prod. Clean dev/prod parity without dual schemas.",
      },
      {
        path: "api/[[...path]].ts",
        title: "Express-as-Vercel-serverless",
        body: "A single catch-all route wraps the Express app, so the same codebase runs as a long-lived server locally and as serverless in prod.",
      },
      {
        path: "audit.ts middleware",
        title: "resource + actor logging",
        body: "Every admin write is recorded with the actor and resource touched, which is the difference between a studio platform and a hobby project.",
      },
    ],
    metrics: [
      {
        value: "594",
        label: "total tests (344 API + 150 admin + 65 mobile + 35 E2E)",
      },
      {
        value: "63",
        label: "test files (19 API + 33 admin + 11 mobile)",
      },
      { value: "21", label: "Prisma models" },
      {
        value: "11",
        label:
          "API route modules (admin, auth, bookings, classes, memberships, notifications, payments, reviews, schedule, users, waitlist)",
      },
      { value: "13", label: "admin pages" },
      { value: "~40", label: "production TS files in API src" },
    ],
    timeline:
      "First commit ~2026-04-22, last ~2026-04-23 — built fast in roughly 1-2 weeks of focused work. Shipped: deploy runbook, vercel.json, Dockerfiles, EAS build/submit configured, Sentry wired in.",
    role: "Solo across admin, mobile, API, shared package, infra, and tests.",
    liftQuote:
      "\"One Prisma schema, two runtimes — better-sqlite3 in dev, Turso in prod, and the API ships as a Vercel function with no rewrites.\"",
    links: [
      { label: "Code", href: "private — available on request" },
      { label: "Demo (admin)", href: "eva@pilatesgym.al / admin1234" },
      { label: "Demo (customer)", href: "ana@demo.al / demo1234" },
    ],
  },

  // ---------------------------------------------------------------------------
  // 5. CleanSlate
  // ---------------------------------------------------------------------------
  {
    slug: "cleanslate",
    order: 5,
    title: "CleanSlate",
    tagline: "$20/month operating system for cleaning businesses.",
    year: 2026,
    status: "shipped",
    hero: "/captures/cleanslate/home_desktop.png",
    heroAlt: "CleanSlate German marketing landing page with hero, pricing, FAQ",
    stack: ["Next.js 16", "Supabase + RLS", "Telnyx + LemonSqueezy"],
    pitch:
      "$20/month operating system for solo cleaners in Germany. Next.js 16 with strict architecture: thin routes, services own data, Supabase RLS, money in cents, phones in E.164. Telnyx + WhatsApp for SMS, four Vercel cron endpoints, full German marketing site at the edge.",
    gallery: ["/captures/cleanslate/home_mobile.png"],
    problem: [
      "Solo cleaners run their business on a phone notes app and a Google Calendar. They forget recurring jobs, miss client preferences, and chase invoices for weeks.",
      "Every existing CRM — Jobber, Housecall Pro — starts at $50-$100/month and is built for crews of ten. I built CleanSlate to be $20/month flat, sized for one-person operations, with the German market specifically in mind.",
    ],
    approach: [
      "I built it on Next.js 16 App Router with strict architectural rules: route files are thin dispatchers, services own all data ops, Supabase RLS enforces per-tenant isolation, all money is stored as cents, and all phones live in E.164. Auth is Supabase SSR; billing runs through LemonSqueezy webhooks; SMS and WhatsApp go through Telnyx and the WhatsApp Cloud API, with cron-driven trial reminders, recurring job auto-creation, overdue chasers, and pre-job reminders.",
      "The German marketing site (Datenschutz, Impressum, AGB, MDX-driven blog/ratgeber, and a cost calculator at /rechner) lives in a separate `(marketing)` route group from the authenticated `(app)`. I used shadcn/ui + Tailwind v4 for the design system and Vitest for the test layer.",
      "The discipline shows up everywhere: components never touch Supabase directly, `formatCents()` and phone validators are enforced project-wide, and the CLAUDE.md/AGENTS.md operating manual keeps me honest.",
    ],
    techStack: {
      Frontend: [
        "Next.js 16.1",
        "React 19.2",
        "TypeScript 5",
        "Tailwind 4",
        "shadcn/ui",
        "@base-ui/react",
        "Sonner",
        "react-day-picker",
        "lucide-react",
        "next-intl 4",
      ],
      Backend: [
        "Next.js Route Handlers",
        "@supabase/ssr 0.6",
        "supabase-js 2.49 (Postgres + RLS)",
      ],
      Data: ["Supabase Postgres (15 migrations)"],
      AI: ["Gemini API (@google/genai 1.49) for content"],
      Infra: [
        "LemonSqueezy 4 (billing)",
        "Telnyx (SMS)",
        "WhatsApp Cloud API",
        "Resend-style email service",
      ],
      Other: ["Zod 4", "date-fns 4", "MDX (blog/ratgeber)", "gray-matter"],
    },
    underHood: [
      {
        path: "services/",
        title: "service-layer architecture",
        body: "Components never touch Supabase directly; every data op goes through a service in `services/`. Makes RLS reasoning local and testing actually possible.",
      },
      {
        path: "4 Vercel cron endpoints",
        title: "trial / reminders / overdue / recurring",
        body: "Each cron is a separate route handler, so a stuck job in one channel can't block another. Recurring job auto-creation runs nightly; pre-job reminders fire 24h out.",
      },
      {
        path: "formatCents() everywhere",
        title: "money-as-cents + E.164 discipline",
        body: "Money is never floats and phones never come in raw — both are validated at the edge and the codebase trusts them everywhere downstream.",
      },
    ],
    metrics: [
      { value: "15", label: "Supabase migrations" },
      { value: "14", label: "test files (Vitest)" },
      {
        value: "11",
        label:
          "services (billing, clients, earnings, email, invoice-line-items, invoices, jobs, profiles, search, sms, whatsapp)",
      },
      { value: "4 / 3", label: "cron endpoints and webhook endpoints" },
      { value: "8", label: "authed route groups" },
      {
        value: "10",
        label: "routes in the German marketing site (incl. blog, ratgeber, rechner)",
      },
    ],
    timeline:
      "First commit ~2026-03-26, last ~2026-03-29, with iterative phases visible across the SOLO-DEV and FINAL docs. Shipped: vercel.json, Dockerfile, FINAL-DEPLOYMENT-REPORT, vitest config, full German marketing site deployed.",
    role: "Solo, with a strong CLAUDE.md/AGENTS.md operating manual that I follow strictly.",
    liftQuote:
      "\"Routes are thin, services own data, money is cents, phones are E.164 — discipline is the entire product.\"",
    links: [
      { label: "Code", href: "private — available on request" },
      { label: "Market", href: "Germany (per CleanSlate German Marketing Plan)" },
    ],
  },

  // ---------------------------------------------------------------------------
  // 6. Social Command Center
  // ---------------------------------------------------------------------------
  {
    slug: "social-command-center",
    order: 6,
    title: "Social Command Center",
    tagline: "AI content pipeline + auto-poster for managing many trade brands.",
    year: 2026,
    status: "in-progress",
    hero: "/captures/social_command_center/home_desktop.png",
    heroAlt: "Social Command Center dashboard with brand pipeline status",
    stack: ["Next.js 16", "BullMQ + Drizzle", "OpenAI + Postiz"],
    pitch:
      "Industrial content drip for a 7-brand operator. A weekly BullMQ cron walks every brand through a 6-stage pipeline; posts auto-schedule via the Postiz API once images land. Three Claude Code slash commands give a zero-API-cost generation path that bypasses OpenAI entirely.",
    gallery: ["/captures/social_command_center/home_mobile.png"],
    problem: [
      "A small agency or operator running 7+ trade brands — electricians, plumbers, lawn care, cleaning — needs a constant content drip on each. Manually planning, writing, and scheduling 30+ posts a week kills the founder.",
      "I built SCC to industrialize that drip end to end, so adding a brand is a filesystem operation and the worker handles the rest.",
    ],
    approach: [
      "Each brand is described in a JSON config plus a knowledge-base directory (brand DNA, customer ICP, voice). A weekly BullMQ cron fires Mondays at 6 AM and walks every brand through a 6-stage pipeline: Brand Discovery, Research, Strategy, Content Gen, Quality Gate, Post Creation.",
      "Posts land in Postgres via Drizzle ORM with status `awaiting_image`; the operator drag-drops images via the dashboard, which generates \"nano-banana\" prompts. When all images are filled, posts auto-schedule via the Postiz REST API.",
      "I also built a \"free path\": three Claude Code slash commands (`/analyze-brand`, `/generate-content-plan`, `/generate-content`) bypass the OpenAI pipeline entirely — Claude Code reads the KB directly and POSTs to `/api/import-content`, so the entire content plan can be generated at zero API cost.",
    ],
    techStack: {
      Frontend: [
        "Next.js 16.2",
        "React 19.2",
        "TypeScript 5",
        "Tailwind 4",
        "lucide-react",
        "Sonner",
      ],
      Backend: [
        "Next.js Route Handlers",
        "BullMQ 5",
        "ioredis 5",
        "Postgres (postgres 3, Drizzle ORM 0.45)",
      ],
      AI: [
        "openai 6.34 (legacy pipeline)",
        "Claude Code via slash commands (zero API cost path)",
      ],
      Infra: [
        "Postiz REST API",
        "Docker Compose",
        "dedicated worker process (`npm run worker`)",
      ],
      Other: ["jsonrepair", "yaml", "uuid", "Sharp", "Zod", "drizzle-kit"],
    },
    underHood: [
      {
        path: "src/pipeline/stages/",
        title: "BullMQ 6-stage cron pipeline",
        body: "Brand Discovery -> Research -> Strategy -> Content Gen -> Quality Gate -> Post Creation, with retry/backoff and a real quality gate before anything reaches the calendar.",
      },
      {
        path: "3 Claude Code slash commands",
        title: "zero-API-cost generation path",
        body: "`/analyze-brand`, `/generate-content-plan`, `/generate-content` read the KB and POST to `/api/import-content`, so the whole content plan can be generated without spending a cent on OpenAI.",
      },
      {
        path: "src/db/schema.ts",
        title: "image-upload state machine",
        body: "Posts wait in `awaiting_image`; once the operator fills all slots, they auto-schedule via Postiz. The state machine is the difference between \"AI-generated drafts\" and \"posts that actually go live.\"",
      },
    ],
    metrics: [
      {
        value: "7",
        label:
          "brand configs (buildbase, cleanslate, fixright, gymapp, lawnpilot, pipepro, sparkelectric)",
      },
      { value: "7", label: "Drizzle tables" },
      { value: "5", label: "pipeline stages under src/pipeline/stages" },
      {
        value: "4",
        label: "API route groups (brands, generate, import-content, posts, webhooks)",
      },
      { value: "3", label: "Claude Code slash commands" },
      { value: "Weekly", label: "cron cadence (Monday 6 AM)" },
    ],
    timeline:
      "First and last commits both 2026-04-12 — initial commit followed by continued work via file mtimes. In-progress / operational, with Docker Compose configured, the worker process running, brand configs populated, and content already generated for `gymapp` and `cleanslate`.",
    role: "Solo — internal/agency tooling.",
    liftQuote:
      "\"Adding a brand is a filesystem operation — the BullMQ cron, the quality gate, and the Postiz auto-scheduler do everything else.\"",
    links: [{ label: "Code", href: "private — available on request" }],
  },

  // ---------------------------------------------------------------------------
  // 7. jiang-clips
  // ---------------------------------------------------------------------------
  {
    slug: "jiang-clips",
    order: 7,
    title: "jiang-clips",
    tagline: "Bun pipeline that turns YouTube videos into TikTok shorts.",
    year: 2026,
    status: "shipped",
    hero: "/captures/jiang_clips_web/home_desktop.png",
    heroAlt:
      "jiang-clips Reel Farmer dashboard with 4-stage pipeline and review queue",
    stack: ["Bun + TS", "Whisper + Gemini", "Remotion + Puppeteer"],
    pitch:
      "Bun pipeline that turns YouTube into TikTok. yt-dlp downloads, Whisper transcribes, Gemini picks the clips, Remotion renders 1080×1920, stealth puppeteer uploads across multiple authenticated accounts. Resumable from any step. Companion Next.js dashboard reads the SQLite run database.",
    gallery: ["/captures/jiang_clips_web/home_mobile.png"],
    problem: [
      "Shorts and TikTok creators need 5-10 vertical clips a day from long-form sources, but manual editing eats hours. Existing tools — Opus Clip, Vizard — are SaaS at $30+/month, don't handle slideshows, and don't support multi-account uploading.",
      "I built jiang-clips as a self-hosted one-button pipeline that runs across multiple Albanian-themed accounts I operate.",
    ],
    approach: [
      "I built a Bun + TypeScript CLI that orchestrates a 7-step pipeline: download (yt-dlp), transcribe (Whisper, configurable model size), identify the best clips (Gemini with the transcript), generate captions and metadata, render vertical 1080x1920 video with Remotion, build slideshows from Pinterest-sourced images via canvas, and upload to TikTok using puppeteer-extra + stealth across multiple authenticated accounts.",
      "Resume/state is persistent — kill the process and `bun run resume <run-id>` picks up where it stopped. I also built a separate Next.js 16 web dashboard (`web/` on port 3005) that reads the SQLite run database for status and queue management.",
      "Trend and content scouts auto-discover what to clip rather than waiting for the operator to paste URLs.",
    ],
    techStack: {
      Frontend: [
        "Next.js 16.2",
        "React 19.2",
        "@tanstack/react-query 5",
        "Tailwind 4",
      ],
      Backend: [
        "Bun",
        "TypeScript 5.9",
        "FFmpeg (system dep)",
        "better-sqlite3 12",
      ],
      AI: ["@google/genai 1.0 (Gemini)", "Whisper (local model)"],
      Infra: [
        "remotion 4.0.436",
        "@remotion/bundler/cli/renderer",
        "@napi-rs/canvas",
        "@andresaya/edge-tts",
        "puppeteer 24",
        "puppeteer-extra-stealth",
      ],
      Other: ["commander 13", "prompts 2", "chalk 5", "Zod 3"],
    },
    underHood: [
      {
        path: "bun run resume <run-id>",
        title: "resumable run state",
        body: "Every step persists to disk so a kill at any stage recovers cleanly. Long pipelines are inevitable; resumability is what makes them usable.",
      },
      {
        path: "slideshow-composer.ts",
        title: "Remotion + canvas for vertical slideshows",
        body: "Same React-for-video renderer powers both the captioned clips and the Pinterest-sourced slideshows, so the visual language stays consistent.",
      },
      {
        path: "account-manager.ts + tiktok-disclosures.ts",
        title: "multi-account stealth uploader",
        body: "Cookie/session management, stealth puppeteer, and TikTok's compliance-flag dance all live behind one upload call.",
      },
    ],
    metrics: [
      { value: "~12,725", label: "LOC of TypeScript across src/" },
      {
        value: "16",
        label:
          "modules (account-manager, caption-generator, clip-identifier, content-scout, downloader, image-sourcer, pinterest-sourcer, slideshow-composer, tiktok-disclosures, tiktok-uploader, transcriber, trend-scout, tts, video-processor, content-history, metadata-generator)",
      },
      { value: "9", label: "test files" },
      { value: "5", label: "CLI commands (pipeline, batch, resume, status, clean)" },
      { value: "3005", label: "companion Next.js dashboard port" },
      {
        value: "3",
        label: "brand logos shipped (hahaland.al, menosfera, shume_kurioz)",
      },
    ],
    timeline:
      "First commit ~2026-03-18, last ~2026-03-26 — about 1-2 weeks of initial build, with continued runs after. Shipped/operational: `output/` directory has rendered slideshows and `accounts.json` is populated with live sessions.",
    role: "Solo — `urls.txt` and `accounts.json` reflect a personal media operation feeding multiple Albanian-themed TikTok accounts.",
    liftQuote:
      "\"yt-dlp -> Whisper -> Gemini -> Remotion -> stealth puppeteer — one command, multiple accounts, resume-from-anywhere.\"",
    links: [{ label: "Code", href: "private — available on request" }],
  },

  // ---------------------------------------------------------------------------
  // 8. Bohesh
  // ---------------------------------------------------------------------------
  {
    slug: "bohesh",
    order: 8,
    title: "Bohesh",
    tagline: "Tirana's social pulse — find or start hangouts on a live map.",
    year: 2026,
    status: "in-progress",
    hero: "/captures/bohesh/icon.png",
    heroAlt: "Bohesh app icon",
    stack: ["Expo + RN 0.83", "Supabase + Realtime", "react-native-maps"],
    imageMode: "contain",
    pitch:
      "Tirana's social pulse — a live map of who's hanging out where, tonight. Expo + Supabase Realtime + react-native-maps. Vibe-checks let any hangout get live-rated mid-event. MMKV for hot-path caching, OTP auth, deep-link invites, persistent crews for repeat plans.",
    problem: [
      "Tirana's social life happens in WhatsApp groups and Instagram DMs. New residents, students, and visitors can't see what's happening tonight; locals lose track of their own crews.",
      "I built bohesh as a discovery layer for organic, in-person plans — not a Meetup.com clone, not a dating app, just \"what's happening near me right now and can I join?\"",
    ],
    approach: [
      "I built an Expo Router 5 app on RN 0.83 backed by Supabase (Postgres + RLS + storage + realtime). Auth is OTP-based; the home tab is a live map of pinned hangouts; users can join, RSVP, post stories with 24h expiry, and run \"vibe checks\" mid-event so a hangout can be live-rated. Crews are persistent groups for repeat plans.",
      "I used react-native-maps for the map, react-native-mmkv for hot-path caching (auth state, draft hangouts) instead of AsyncStorage, and Reanimated 4 + worklets for the gesture work. The architecture is strict per CLAUDE.md: components don't touch Supabase, services own data ops, Zod validates everything, Zustand owns auth/UI state.",
      "I split the hangout data layer into three services — `hangout-crud`, `hangout-queries`, `hangout-actions` — for clear read/write/action boundaries. Push goes through expo-notifications, and a deep-link service handles invite flows.",
    ],
    techStack: {
      Frontend: [
        "React Native 0.83.2",
        "Expo 55",
        "Expo Router 5",
        "React 19.2",
        "TypeScript 5.9",
        "react-native-maps 1.27",
        "react-native-reanimated 4.2",
        "react-native-worklets 0.7",
        "react-native-mmkv 4.3",
        "expo-haptics",
        "expo-blur",
        "expo-camera",
        "expo-location",
      ],
      Data: ["@supabase/supabase-js 2.99", "expo-secure-store"],
      Other: [
        "Zustand 5",
        "Zod 4",
        "Jest 30",
        "ts-jest",
        "@testing-library/react-native 13",
        "lucide-react-native",
        "base64-arraybuffer (image upload)",
        "date-fns 4",
      ],
    },
    underHood: [
      {
        path: "services/hangout-{crud,queries,actions}.ts",
        title: "split data layer",
        body: "Clean read/write/action boundaries instead of one bloated service, which makes RLS reasoning local and testing actually targeted.",
      },
      {
        path: "Vibe Checks",
        title: "first-class entities",
        body: "A hangout can be live-rated mid-event — a tiny social mechanic that turns \"are we still here\" into a real signal for everyone deciding whether to show up.",
      },
      {
        path: "MMKV",
        title: "hot-path caching for auth + draft hangouts",
        body: "Synchronous, encrypted, and fast; AsyncStorage was the wrong tool for the home-tab cold-start path.",
      },
    ],
    metrics: [
      { value: "12", label: "Supabase migrations" },
      {
        value: "17",
        label:
          "services (account, auth, badges, chat, crews, deep-links, friends, hangout-actions, hangout-crud, hangout-queries, hangouts, inquiries, notifications, profiles, reports, stories, vibe-checks)",
      },
      {
        value: "5",
        label:
          "main tab routes (index/map, explore, create, activity, profile) plus dynamic routes",
      },
      { value: "5", label: "test files" },
      { value: "Full", label: "PRD / Architecture / Implementation docs in repo" },
    ],
    timeline:
      "First and last commits both 2026-03-24 — bulk-imported then iterated, with continued work visible in mtimes. In-progress: EAS configured, deployment guides present, final-state docs in repo, but no released build link yet.",
    role: "Solo across mobile, services, Supabase schema, and docs.",
    liftQuote:
      "\"Not a Meetup clone, not a dating app — just a live map of what's actually happening in Tirana tonight, and whether your crew is already there.\"",
    links: [
      { label: "Code", href: "private — available on request" },
      { label: "License", href: "proprietary" },
    ],
  },

  // ---------------------------------------------------------------------------
  // 9. Kërçishta Garage
  // ---------------------------------------------------------------------------
  {
    slug: "kercishta-garage",
    order: 9,
    title: "Kërçishta Garage",
    tagline: "Auto-shop landing page with a private CRM behind /admin.",
    year: 2026,
    status: "shipped",
    hero: "/captures/kercishta_garage/home_desktop.png",
    heroAlt: "Kërçishta Garage hero with Three.js Hyperspeed animation",
    stack: ["React 19 + Vite", "Three.js + Framer", "MongoDB Atlas"],
    pitch:
      "One-day Vercel build for a neighborhood garage: public landing with a Three.js Hyperspeed hero, hidden /admin CRM behind a password gate, leads + service records in MongoDB Atlas. Bilingual EN/SQ inline. Real revenue/cost charts so the owner finally knows whether the shop is profitable.",
    gallery: ["/captures/kercishta_garage/home_mobile.png"],
    problem: [
      "A neighborhood garage needed two things: a real web presence so people could find them and book in, and a dirt-simple way to log every job and see if the shop was profitable — without paying for a SaaS CRM.",
      "I built Kërçishta Garage to deliver both in one Vercel deploy, in about a day and a half.",
    ],
    approach: [
      "I built a Vite + React 19 single-page site with framer-motion animations and a Three.js Hyperspeed hero for visual punch. The contact form posts a Lead to MongoDB Atlas through Vercel-hosted API routes (`/api/leads`, `/api/records`).",
      "The admin dashboard is intentionally unlinked: navigate to `/admin`, enter the password, get a Bearer token in sessionStorage, and unlock CRUD over leads and service records plus revenue/cost charts. An Express server lives alongside the api/ functions for local dev. Albanian and English translations are inline in a single translations file driving every string.",
      "Backend-side, I added helmet, JWT, bcrypt, and a rate limiter. The whole thing is deliberately small — single App.tsx houses the entire app state because the scope didn't justify more.",
    ],
    techStack: {
      Frontend: [
        "React 19.2",
        "Vite 6",
        "TypeScript 5.8",
        "Tailwind 3",
        "framer-motion 12",
        "three 0.167",
        "postprocessing 6",
        "lucide-react",
      ],
      Backend: [
        "Express 4 (local dev)",
        "Vercel serverless functions (prod)",
        "MongoDB 7 driver",
        "JWT",
        "bcryptjs",
        "helmet",
        "express-rate-limit",
        "express-validator",
        "winston",
        "morgan",
        "cookie-parser",
      ],
      Infra: ["Vercel (`vercel.json`)", "Render (`render.yaml`)"],
      Other: [
        "Bearer token derived from `ADMIN_PASSWORD` env var, stored in sessionStorage",
      ],
    },
    underHood: [
      {
        path: "/admin",
        title: "hidden, password-gated, sessionStorage token",
        body: "Not in nav, no public link, just a known URL plus a password. Dead-simple security model that's exactly right for a one-person garage.",
      },
      {
        path: "components/HyperSpeedPresets.js",
        title: "Three.js hero",
        body: "Hyperspeed preset config gives a 1-day build a real visual hook without bringing in a 3D pipeline.",
      },
      {
        path: "App.tsx",
        title: "single file — types, api object, render tree",
        body: "Pragmatic for the scope; splitting it would have been gold-plating.",
      },
    ],
    metrics: [
      { value: "3", label: "API routes (auth, leads, records) + lib helpers" },
      { value: "2", label: "MongoDB collections (leads, records)" },
      { value: "3", label: "lead statuses (new, contacted, resolved)" },
      { value: "EN/SQ", label: "inline bilingual translations (Albanian primary)" },
      { value: "1-2", label: "days from first commit to shipped" },
    ],
    timeline:
      "First commit ~2026-01-20, last commit ~2026-01-21 — built in roughly 1-2 days and bootstrapped from a Google AI Studio template. Shipped: vercel.json, render.yaml, `dist/` build present, deployment guides in repo.",
    role: "Solo — frontend, backend, three.js hero, admin, and bilingual content.",
    liftQuote:
      "\"One day, one Vercel deploy — public site out front, password-gated CRM behind /admin, and the garage owner finally knows whether the shop is profitable.\"",
    links: [
      { label: "Code", href: "private — available on request" },
      { label: "Source", href: "Google AI Studio template (referenced in README)" },
    ],
  },
] as const satisfies readonly Project[];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return projects.map((p) => p.slug);
}
