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

export type ProjectShot = {
  src: string;
  alt?: string;
  /**
   * Bento footprint on a 4-col grid:
   *  square 1×1 · wide 2×1 · tall 1×2 · big 2×2 · xwide 4×1.
   * @deprecated Used by the legacy BentoShots component; ProjectGallery ignores this.
   */
  span?: "square" | "wide" | "tall" | "big" | "xwide";
  /**
   * Override device classification. If absent, ProjectGallery infers from
   * the image aspect ratio at build time (portrait → mobile, otherwise desktop).
   */
  device?: "desktop" | "mobile";
  /** Short editorial caption rendered beneath the framed shot. */
  caption?: string;
  /** Optional URL shown in the BrowserFrame chrome. */
  url?: string;
  /** "contain" for logos / icon-style art. Default "cover". */
  fit?: "cover" | "contain";
  /** Background color behind the image (handy for logos). */
  bg?: string;
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
  /**
   * 5-6 sentence editorial paragraph in first person — captures the cool
   * engineering insight, what's special about the codebase, and why I love it.
   * Rendered with the drop-cap on the case-study page.
   */
  essay: string;
  /** Optional 2-6 extra screenshot paths shown in the gallery. */
  gallery?: readonly string[];
  /**
   * Bento gallery — varied aspect ratios with span hints. If present,
   * supersedes `gallery` on the deep-dive page. Mix square / wide / tall /
   * big / xwide to get visual variety.
   */
  shots?: readonly ProjectShot[];
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
    hero: "/captures/keepitup/dashboard.png",
    heroAlt:
      "KeepItUp dashboard — connected deploy platforms, live health score, recent activity",
    stack: ["React 19", "Anthropic + OpenAI + Gemini", "Tree-sitter"],
    pitch:
      "Self-hosted AI on-call agent. Polls six deploy platforms every five minutes, parses crashes with tree-sitter across six languages, drafts a fix through OpenAI / Anthropic / Gemini, runs it past a confidence gate, and opens a PR — never pushes to main.",
    essay:
      "KeepItUp is an autonomous SRE agent that watches six deploy platforms 24/7 and tries to turn “page on call” into “review a PR after coffee.” The brain is a two-layer reasoning system: a tree-sitter AST walker indexes the offending file across six languages and feeds the model a 50-500 line context slice instead of the whole repo, and a separate Reviewer agent gates every proposed fix behind a confidence threshold. Fixes auto-PR only at ≥85% confidence, or ≥70% if a build verification passes — because verification is a stronger signal than a raw score. Three providers (Anthropic, OpenAI, Gemini) sit behind a single LLM client with budget gates and cost telemetry, so swapping providers is a config change. The agent never pushes to main; it opens PRs, runs Semgrep + Trivy + Gitleaks scans in Docker, and rolls everything into a weighted 0-100 health score per repo. I built it because I wanted oncall to be a thing I review with coffee, not a thing that wakes me up.",
    shots: [
      { src: "/captures/keepitup/hub.png", alt: "Project hub — services connected", caption: "Project hub — six platforms connected, live health score per repo.", url: "keepitup.local/dashboard" },
      { src: "/captures/keepitup/code.png", alt: "Code view — fix proposed inline", caption: "Tree-sitter AST view — proposed fix annotated against the call graph.", url: "keepitup.local/projects/api/fixes" },
      { src: "/captures/keepitup/planner.png", alt: "Agent planner timeline", caption: "v2 agent planner — orchestrator, runtime, state, memory laid out as a timeline.", url: "keepitup.local/agent/plan" },
    ],
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
    shots: [
      { src: "/captures/endrrat_e_mia/app/mobile_01.png", alt: "Ëndërrat e Mia — home / library", caption: "Home — the family's library of generated stories, sorted by recency." },
      { src: "/captures/endrrat_e_mia/app/mobile_02.png", alt: "Ëndërrat e Mia — story creation flow start", caption: "Create — pick a child, a theme, and let the pipeline run." },
      { src: "/captures/endrrat_e_mia/app/mobile_03.png", alt: "Ëndërrat e Mia — settings", caption: "Settings — language preference, credit balance, parental controls." },
      { src: "/captures/endrrat_e_mia/app/mobile_04.png", alt: "Ëndërrat e Mia — profile / account", caption: "Profile — account, subscription tier, transaction history (the single Transaction ledger)." },
      { src: "/captures/endrrat_e_mia/app/mobile_05.png", alt: "Ëndërrat e Mia — credits balance", caption: "Credits — free credits from ads, paid packs, and RevenueCat subscription credits all unified." },
      { src: "/captures/endrrat_e_mia/app/mobile_06.png", alt: "Ëndërrat e Mia — story cover with watercolor illustration", caption: "Story cover — Flux Schnell watercolor matched to the child + theme." },
      { src: "/captures/endrrat_e_mia/app/mobile_07.png", alt: "Ëndërrat e Mia — creation flow continuation", caption: "Creation — character setup carries through to all four illustrations." },
      { src: "/captures/endrrat_e_mia/app/mobile_08.png", alt: "Ëndërrat e Mia — story player page with illustration", caption: "Story player — Claude Haiku narrative in Albanian over a Flux Schnell scene, ElevenLabs TTS narrates." },
      { src: "/captures/endrrat_e_mia/app/mobile_09.png", alt: "Ëndërrat e Mia — community / feed", caption: "Community — shared stories with upvotes and reports for real moderation." },
      { src: "/captures/endrrat_e_mia/app/mobile_10.png", alt: "Ëndërrat e Mia — story full-page illustration", caption: "Full-page illustration — children's-book watercolor styling, the same styling powers the launch ad creatives." },
      { src: "/captures/endrrat_e_mia/app/mobile_11.png", alt: "Ëndërrat e Mia — story closing page", caption: "Closing — every story renders atomically: you never get text without matched art and audio." },
    ],
    pitch:
      "Albanian-language bedtime stories, generated, illustrated, and narrated. Expo app on a Mongoose backend. Claude Haiku writes, fal.ai Flux Schnell paints four matched illustrations, TTS narrates, RevenueCat + AdMob fund the free tier, and an in-house pipeline renders the launch ad creatives.",
    essay:
      "Ëndërrat e Mia is an AI bedtime-story app for Albanian-speaking families — a market that essentially has zero native-language children's content, so parents end up translating Disney+ at bedtime. Each story is a three-step pipeline rendered atomically: Claude Haiku writes the narrative in Albanian, fal.ai's Flux Schnell paints four matched watercolor illustrations from the same character setup, and TTS narrates the whole thing — you never get orphaned text with missing audio. The most quietly proud move is the single Transaction ledger: free credits earned from ads, RevenueCat subscription credits, AdMob rewards, and one-off purchases all write to the same table, so balance, churn, and fraud queries are naturally unified instead of requiring three accounting systems. There's also a self-built programmatic ad-creative pipeline in `videos/generateAdImages*.js` — five scripts that render TikTok ad frames using the same children's-book watercolor styling as the in-app illustrations, so brand consistency is baked in. I shipped roughly thirty creatives for the launch this way, without a designer. I built it because my native-language community deserves bedtime stories that don't come from Google Translate.",
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
    year: 2026,
    status: "shipped",
    hero: "/captures/gymapp_new/web_dashboard.png",
    heroAlt: "GymApp admin dashboard — daily check-ins, occupancy live count, recent activity",
    stack: ["Express + Postgres", "Socket.io + Redis", "Expo + MUI"],
    pitch:
      "White-label gym OS for the Albanian market. Four deployables — admin web, member app, API, NFC scanner-bridge — sharing one branding record. Socket.io with a Redis adapter fans live occupancy across PM2 workers so every dashboard sees the same number.",
    essay:
      "GymApp is a white-label gym OS for the Albanian market — four independently deployable products that share one database and one branding record. The admin web, the member app, the API, and the NFC scanner-bridge all live in one monorepo; every Gym row stores its own primary color, logo, and bundle identifier, and at runtime the React Native member app reads `GymConfigContext` and *becomes* that gym's branded app. Live occupancy fans out across PM2 cluster workers via Socket.io with a Redis pub/sub adapter, so a tap at the turnstile reaches every dashboard, every member phone, every scanner — without polling. The scanner-bridge itself is a tiny `node-hid` service that reads card UIDs off a USB NFC reader and POSTs to `/api/visits`, decoupling hardware from the API entirely so a Raspberry Pi at the gate doesn't know any backend internals. Multi-tenancy is enforced by a `gymId` foreign key on every domain model plus middleware-scoped queries; super-admins can hop tenants. I also built a Remotion ad pipeline that renders TikTok creatives from the same React components used in the app — so the ad creative and the product UI literally cannot drift.",
    shots: [
      { src: "/captures/gymapp_new/web_analytics.png", alt: "Analytics — revenue, attendance, churn", caption: "Analytics — revenue, attendance, and churn at a glance.", url: "fitzone.al/admin/analytics" },
      { src: "/captures/gymapp_new/web_classes.png", alt: "Class scheduling and templates", caption: "Class scheduler — recurring slots, capacity, instructor lookup.", url: "fitzone.al/admin/classes" },
      { src: "/captures/gymapp_new/web_subscriptions.png", alt: "Membership and subscription management", caption: "Subscriptions — tiered plans, renewals, dunning, lapse alerts.", url: "fitzone.al/admin/subscriptions" },
      { src: "/captures/gymapp_new/web_check_in_monitor.png", alt: "Live check-in monitor for the front desk", caption: "Live check-in monitor — Socket.io stream, every NFC tap visible.", url: "fitzone.al/admin/checkins" },
      { src: "/captures/gymapp_new/web_global_search.png", alt: "Global search across members + classes + cards", caption: "Global search — members, NFC cards, classes, all keystroke-filtered.", url: "fitzone.al/admin/search" },
      { src: "/captures/gymapp_new/web_announcements.png", alt: "Per-gym announcements broadcast to the member app", caption: "Announcements — broadcast to all member apps for that gym.", url: "fitzone.al/admin/announcements" },
      { src: "/captures/gymapp_new/app/mobile_01.png", alt: "Member app — FitnessHub home dashboard", caption: "Member app home — branded per gym from the Gym record (this one's white-labeled as FitnessHub). Day streak, workouts, average minutes, and live At-The-Gym-Now occupancy via Socket.io." },
      { src: "/captures/gymapp_new/app/mobile_02.png", alt: "Member app — class schedule with day chips", caption: "Class schedule — Strength, HIIT, Yoga slots with capacity, duration, and instructor. Tap to book." },
      { src: "/captures/gymapp_new/app/mobile_03.png", alt: "Member app — monthly workout calendar with completion dots", caption: "Workouts calendar — completed (green), missed (orange), tracked vs untracked visits (blue) per day. Driven by the chosen split template." },
      { src: "/captures/gymapp_new/app/mobile_04.png", alt: "Member app — activity history list with track buttons", caption: "Activity history — every visit and workout in one list, with Track CTAs for any untracked gym visit." },
      { src: "/captures/gymapp_new/app/mobile_05.png", alt: "Member app — class detail modal for Yoga Flow", caption: "Class detail — date, duration, capacity, instructor, description. Single-tap booking against the live capacity counter." },
      { src: "/captures/gymapp_new/app/mobile_06.png", alt: "Member app — customize workout plan, push day exercises", caption: "Plan customizer — pick a split (Push/Pull/Legs shown), drag exercises in, set reps/rest. Then it drops into the calendar above." },
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
    hero: "/captures/pilates_studio/Calendar.png",
    heroAlt: "PilatesGym admin — weekly class calendar with bookings and instructors",
    stack: ["pnpm monorepo", "Express + Prisma", "Turso + libSQL"],
    pitch:
      "Branded studio platform — admin web, mobile app, API, 594 tests. Same Prisma schema runs on better-sqlite3 in dev and Turso (libsql) in prod via adapters. Express ships as a Vercel function with zero rewrites. Resend for email, Sentry for errors, Playwright for E2E.",
    essay:
      "Pilates Studio is a four-deployable platform for one boutique studio — the same Prisma schema runs on `better-sqlite3` in dev and Turso (libsql) in prod, swapped through the adapter pattern with zero code changes. Express ships as a Vercel serverless catch-all (`api/[[...path]].ts`), so the same code runs as a long-lived server locally and as edge functions in production. An audit middleware records every admin write — actor, resource, IP, user-agent — but never blocks the real operation if the audit insert fails, because losing a booking to a slow audit table is not an acceptable failure mode. 21 Prisma models, 594 tests across API + admin + mobile + Playwright E2E, transactional email through Resend with a graceful no-op when keys are missing. The booking flow has proper status transitions with auto-promotion from the waitlist on cancellation, so admins don't manually re-shuffle attendance. I built it because boutique studios get nickel-and-dimed by SaaS, and I wanted to prove a single solo dev could ship the same shape with discipline.",
    shots: [
      { src: "/captures/pilates_studio/Analytics.png", alt: "Studio analytics — bookings, revenue, attendance", caption: "Analytics — bookings, revenue, attendance trends.", url: "pilatesgym.al/admin/analytics" },
      { src: "/captures/pilates_studio/Classes.png", alt: "Class catalog and templates", caption: "Class catalog — recurring templates and waitlist auto-promotion.", url: "pilatesgym.al/admin/classes" },
      { src: "/captures/pilates_studio/Subscriptions.png", alt: "Membership & subscription management", caption: "Memberships — tiered plans, renewals, dunning.", url: "pilatesgym.al/admin/memberships" },
      { src: "/captures/pilates_studio/clients.png", alt: "Client roster with health flags", caption: "Client roster — health flags surfaced on hover.", url: "pilatesgym.al/admin/clients" },
      { src: "/captures/pilates_studio/Equipment.png", alt: "Studio equipment inventory", caption: "Equipment inventory — usage logged per class.", url: "pilatesgym.al/admin/equipment" },
    ],
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
    hero: "/captures/cleanslate/landing_page.png",
    heroAlt: "CleanSlate German marketing landing page — hero, problem, features",
    stack: ["Next.js 16", "Supabase + RLS", "Telnyx + LemonSqueezy"],
    pitch:
      "$20/month operating system for solo cleaners in Germany. Next.js 16 with strict architecture: thin routes, services own data, Supabase RLS, money in cents, phones in E.164. Telnyx + WhatsApp for SMS, four Vercel cron endpoints, full German marketing site at the edge.",
    essay:
      "CleanSlate is a €20-flat operating system for solo cleaners in Germany — a discipline product disguised as a SaaS. Every architectural rule is enforced with no exceptions: route files dispatch to services, services own all data ops, components never touch Supabase, money is always cents, phones always E.164, RLS scopes every query to the user. The subscription expiry path is a pure RLS policy — when the trial runs out, no UI code runs; the database simply stops accepting INSERTs and the read-only state is automatic. Four Vercel cron endpoints handle trial reminders, overdue invoices, recurring job generation, and pre-job SMS, so the operator never logs in to do admin. Eleven services own the domain (billing, clients, earnings, invoices, jobs, profiles, search, SMS, WhatsApp, email, line items), and the full German marketing site — Datenschutz, Impressum, AGB, MDX-driven blog and ratgeber, a `/rechner` cost calculator — sits in a separate `(marketing)` route group from the authenticated `(app)`. I built it because the discipline *is* the product — you can't accidentally introduce a bug when components physically can't touch the database.",
    shots: [
      { src: "/captures/cleanslate/its_annoying.png", alt: "Landing problem section — 'Das nervt dich jeden Tag'", caption: "Problem section — 3 editorial pain quotes with their CleanSlate counter.", url: "cleanslate.app" },
      { src: "/captures/cleanslate/functions.png", alt: "Landing features grid", caption: "Features — 6 things, no enterprise bloat.", url: "cleanslate.app#features" },
      { src: "/captures/cleanslate/comparison.png", alt: "Landing comparison table", caption: "Mehr Funktionen. Weniger Kosten. — vs. CleanManager + ToolTime.", url: "cleanslate.app" },
      { src: "/captures/cleanslate/faq.png", alt: "Landing FAQ accordion", caption: "FAQ — sticky title, accordion right.", url: "cleanslate.app" },
      { src: "/captures/cleanslate/sign_in.png", alt: "Sign-in screen", caption: "Sign in — Supabase SSR, gated app behind /login.", url: "cleanslate.app/login" },
      { src: "/captures/cleanslate/web_dashboard.png", alt: "App dashboard with today's jobs", caption: "Dashboard — today's jobs, gate codes, pet info, one tap to start.", url: "cleanslate.app/dashboard" },
      { src: "/captures/cleanslate/Schedule.png", alt: "Schedule view", caption: "Schedule — recurring jobs auto-generated by the nightly cron.", url: "cleanslate.app/schedule" },
      { src: "/captures/cleanslate/web_client.png", alt: "Client detail view", caption: "Client detail — every cleaning preference and access code in one place.", url: "cleanslate.app/clients/uuid" },
      { src: "/captures/cleanslate/web_invoices.png", alt: "Invoices list", caption: "Invoices — German Pflichtangaben, status flow draft → sent → paid.", url: "cleanslate.app/invoices" },
      { src: "/captures/cleanslate/web_earnings.png", alt: "Earnings overview", caption: "Earnings — weekly + monthly chart from completed jobs, not invoices.", url: "cleanslate.app/earnings" },
      { src: "/captures/cleanslate/finish_up.png", alt: "Job completion flow", caption: "Finish up — completion notes, checklist, next-visit notes, auto-invoice.", url: "cleanslate.app/jobs/uuid/finish" },
      { src: "/captures/cleanslate/mobile_landing_page.png", alt: "CleanSlate landing page on mobile", caption: "Landing on mobile — hero, problem, features stack cleanly under 400px." },
    ],
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
    tagline: "Industrial Instagram content for any brand — autonomous, multi-tenant.",
    year: 2026,
    status: "in-progress",
    hero: "/captures/social_command_center/dashboard.png",
    heroAlt: "Social Command Center dashboard — 7-brand pipeline status, BullMQ queue, content planner",
    stack: ["Next.js 16", "BullMQ + Drizzle", "OpenAI + Postiz"],
    pitch:
      "Autonomous Instagram content factory for any brand. Drop a brand config + knowledge base, and a weekly BullMQ cron walks every brand through a 6-stage pipeline; posts auto-schedule via the Postiz API once images land. Three Claude Code slash commands give a zero-API-cost generation path that bypasses OpenAI entirely.",
    essay:
      "Social Command Center is an autonomous Instagram content factory for trade brands — adding a brand is a filesystem operation, not a code change. Each brand drops a JSON config plus a knowledge-base directory (brand DNA, customer ICP, voice), and a weekly BullMQ cron fires Mondays at 6 AM and walks every brand through a six-stage pipeline: Brand Discovery → Research → Strategy → Content Gen → Quality Gate → Post Creation, with retry/backoff and a real quality gate before anything reaches the calendar. Posts wait in `awaiting_image` until images are dragged into the dashboard, then auto-schedule via the Postiz REST API — a state machine, not a vibe. The cool unlock is the zero-API-cost path: three Claude Code slash commands (`/analyze-brand`, `/generate-content-plan`, `/generate-content`) read the knowledge base directly from disk and POST to `/api/import-content`, so I can generate twelve weeks of content for all seven brands without touching the OpenAI bill. I built it because seven brands times thirty posts a month is not a thing a human should be doing manually — and turning content generation into a deterministic, version-controlled pipeline made the agency-of-one model actually viable.",
    shots: [
      { src: "/captures/social_command_center/Calendar.png", alt: "Multi-brand content calendar", caption: "Multi-brand content calendar — Postiz auto-schedules once images land.", url: "scc.local/calendar" },
      { src: "/captures/social_command_center/home_desktop.png", alt: "Operator dashboard — brand list and weekly pipeline state", caption: "Home — every brand's pipeline state at a glance, with the next batch queued.", url: "scc.local" },
      { src: "/captures/social_command_center/home_mobile.png", alt: "Operator dashboard on mobile — brand list and weekly pipeline state", caption: "Home — same dashboard on mobile, for approving on the go." },
    ],
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
  // 7. Reel Farmer
  // ---------------------------------------------------------------------------
  {
    slug: "reel-farmer",
    order: 7,
    title: "Reel Farmer",
    tagline: "Self-hosted YouTube → TikTok pipeline. One command, multi-account.",
    year: 2026,
    status: "shipped",
    hero: "/captures/reel_farmer/dashboard.png",
    heroAlt:
      "Reel Farmer dashboard with 4-stage pipeline and review queue",
    stack: ["Bun + TS", "Whisper + Gemini", "Remotion + Puppeteer"],
    pitch:
      "Bun pipeline that turns YouTube into TikTok. yt-dlp downloads, Whisper transcribes, Gemini picks the clips, Remotion renders 1080×1920, stealth puppeteer uploads across multiple authenticated accounts. Resumable from any step. Companion Next.js dashboard reads the SQLite run database.",
    essay:
      "Reel Farmer is a self-hosted Bun pipeline that turns YouTube into TikTok shorts across multiple authenticated accounts — yt-dlp downloads, Whisper transcribes (configurable model size), Gemini picks the clips with the transcript in context, Remotion renders 1080×1920, stealth puppeteer uploads. Every stage writes to a deterministic `data/runs/<run-id>/` tree and stamps a SQLite checkpoint database, so `bun run resume <run-id>` skips finished work and picks up exactly where the last crash hit — long pipelines are inevitable, resumability is what makes them usable. The slideshow composer uses the same Remotion render pipeline as the captioned clips, so Pinterest-sourced slideshows and YouTube clips share a visual language. The multi-account uploader lives behind a single `account-manager.ts` API — cookie/session management, stealth puppeteer, and TikTok's compliance-flag dance all hidden behind one upload call. Trend and content scouts auto-discover what to clip rather than waiting for the operator to paste URLs. A separate Next.js dashboard reads the SQLite run database for status and queue management. I built it because I run a small media operation across multiple Albanian-themed accounts and a $30/month SaaS that doesn't do slideshows wasn't going to cut it.",
    shots: [
      { src: "/captures/reel_farmer/schedule.png", alt: "Posting schedule across brands", caption: "Posting schedule — multi-account drip across the week.", url: "reelfarmer.local/schedule" },
      { src: "/captures/reel_farmer/jobs.png", alt: "Active pipeline jobs queue", caption: "Active pipeline jobs — resumable from any of 7 stages.", url: "reelfarmer.local/jobs" },
      { src: "/captures/reel_farmer/accounts.png", alt: "Multi-account TikTok session manager", caption: "Account manager — stealth sessions per Albanian-themed brand.", url: "reelfarmer.local/accounts" },
      { src: "/captures/reel_farmer/generate1.png", alt: "Clip generation — Gemini picks", caption: "Gemini clip-picker — transcript scored, top moments surfaced.", url: "reelfarmer.local/runs/123" },
      { src: "/captures/reel_farmer/generate2.png", alt: "Generated clip preview", caption: "Rendered preview — Remotion vertical 1080×1920 with captions burned in.", url: "reelfarmer.local/runs/123/clip" },
    ],
    problem: [
      "Shorts and TikTok creators need 5-10 vertical clips a day from long-form sources, but manual editing eats hours. Existing tools — Opus Clip, Vizard — are SaaS at $30+/month, don't handle slideshows, and don't support multi-account uploading.",
      "I built Reel Farmer as a self-hosted one-button pipeline that runs across multiple Albanian-themed accounts I operate.",
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
    shots: [
      {
        src: "/captures/bohesh/mockup_welcome.jpg",
        alt: "Bohesh welcome screen — design mockup",
        caption: "Welcome — minimal, photo-led entry. Design mockup; in-progress build.",
      },
      {
        src: "/captures/bohesh/mockup_home_map.jpg",
        alt: "Live map of pinned hangouts — design mockup",
        caption: "Home — live map of pinned hangouts, split with the feed. Design mockup.",
      },
      {
        src: "/captures/bohesh/mockup_onboarding.jpg",
        alt: "Onboarding flow — design mockup",
        caption: "Onboarding — name, hometown, vibe preferences. Design mockup.",
      },
      {
        src: "/captures/bohesh/mockup_create_hangout.jpg",
        alt: "Create hangout sheet — design mockup",
        caption: "Create — pin a hangout in seconds: where, when, vibe, who's invited. Design mockup.",
      },
      {
        src: "/captures/bohesh/mockup_hangout_detail.jpg",
        alt: "Hangout detail with vibe checks — design mockup",
        caption: "Detail — RSVPs, photos, live vibe checks once the hangout starts. Design mockup.",
      },
      {
        src: "/captures/bohesh/mockup_activity.jpg",
        alt: "Activity feed — design mockup",
        caption: "Activity — vibe checks, RSVPs, and crew nudges from the people you trust. Design mockup.",
      },
      {
        src: "/captures/bohesh/mockup_profile.jpg",
        alt: "Profile + reputation — design mockup",
        caption: "Profile — vibe-check-earned trust, hangouts hosted, crews. Design mockup.",
      },
    ],
    pitch:
      "Tirana's social pulse — a live map of who's hanging out where, tonight. Expo + Supabase Realtime + react-native-maps. Vibe-checks let any hangout get live-rated mid-event. MMKV for hot-path caching, OTP auth, deep-link invites, persistent crews for repeat plans.",
    essay:
      "Bohesh is a live social-pulse map of Tirana — a discovery layer for organic, in-person plans, not a Meetup clone and not a dating app. The thing I'm most proud of is Vibe Checks as a first-class entity: a hangout can be live-rated mid-event, and the `submit_vibe_check` RPC enforces attendance proof and a 48-hour rating window before counting. Earn fifteen vibe checks from ten unique people and `profiles.is_trusted` flips automatically — reputation is built from shared experiences, not follower counts, so trust actually means something. The data layer is split into three services (`hangout-crud`, `hangout-queries`, `hangout-actions`) so reads, writes, and orchestrated business logic each have a clean boundary, which makes RLS reasoning local and testing actually targeted. MMKV replaces AsyncStorage on the cold-start hot path — synchronous and encrypted — so auth state and draft hangouts don't add async hops to first-launch time. I built it because Tirana's social life lives in WhatsApp groups and Instagram DMs, and visitors and new residents have no way in.",
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
  // 9. Websites — three small brand sites
  // ---------------------------------------------------------------------------
  {
    slug: "websites",
    order: 9,
    title: "Websites",
    tagline: "Three brand sites — Three.js hero, MongoDB CRM, fitness coaching.",
    year: 2026,
    status: "shipped",
    hero: "/captures/websites/kercishta_landing_page.png",
    heroAlt: "Kërçishta Garage landing — Three.js Hyperspeed hero",
    stack: ["React + Vite", "Three.js + Framer", "MongoDB Atlas"],
    pitch:
      "Three live brand sites, all solo. Kërçishta Garage — Three.js Hyperspeed hero plus a hidden /admin CRM (MongoDB, JWT, bilingual EN/SQ) so the garage owner finally knows whether the shop is profitable. Klodi Trainer — a personal-trainer site with a fitness quiz and transformation gallery. jxsoft.al — fast, restrained marketing site for a small software studio.",
    essay:
      "Three small brand sites, all solo, sharing one Vite + Vercel pipeline. Kërçishta Garage is the most ambitious — a Three.js Hyperspeed hero that gives a one-day build a real visual hook, plus a hidden /admin CRM gated by a password and a Bearer token in `sessionStorage`: not in nav, no public link, just a known URL plus a passphrase. The whole full-stack app — public site, contact form, admin CRM, MongoDB integration — fits in one `App.tsx`, deliberate scope discipline because splitting it would have been gold-plating for a one-and-a-half-day build. Klodi Trainer is a coaching funnel built around a multi-step fitness quiz — quiz state lives in URL params so partial answers survive a refresh, and no backend gets touched until the final submit. jxsoft.al is the boring-on-purpose brochure site for my own software studio — fast load, clean type, no animation theater, because credibility matters more than wow-factor for a studio site. I love that all three live behind one boring pipeline and only diverge where the brand actually earned the divergence.",
    shots: [
      { src: "/captures/websites/kercishta_landing_page.png", alt: "Kërçishta Garage landing — Three.js Hyperspeed hero", caption: "Kërçishta Garage — landing with Three.js Hyperspeed hero.", url: "kercishta-garage.com" },
      { src: "/captures/websites/kercishta_Services.png", alt: "Kërçishta Garage — services list", caption: "Kërçishta — services and pricing.", url: "kercishta-garage.com/services" },
      { src: "/captures/websites/kercishta_booking.png", alt: "Kërçishta Garage — booking flow", caption: "Kërçishta — bilingual EN/SQ booking flow.", url: "kercishta-garage.com/booking" },
      { src: "/captures/websites/kercishta_rates.png", alt: "Kërçishta Garage — service rates", caption: "Kërçishta — labour rates and parts.", url: "kercishta-garage.com/rates" },
      { src: "/captures/websites/kloditrainer_landing_page.png", alt: "Klodi Trainer landing page", caption: "Klodi Trainer — landing.", url: "kloditrainer.al" },
      { src: "/captures/websites/kloditrainer_fitness_quiz.png", alt: "Klodi Trainer — fitness quiz onboarding", caption: "Klodi Trainer — multi-step fitness quiz.", url: "kloditrainer.al/quiz" },
      { src: "/captures/websites/kloditrainer_transformations.png", alt: "Klodi Trainer — client transformations gallery", caption: "Klodi Trainer — transformation gallery.", url: "kloditrainer.al/transformations" },
      { src: "/captures/websites/kloditrainer_coach.png", alt: "Klodi Trainer — coach bio", caption: "Klodi Trainer — coach bio.", url: "kloditrainer.al/coach" },
      { src: "/captures/websites/jxsoft_landing_page.png", alt: "jxsoft.al landing page", caption: "jxsoft.al — landing.", url: "jxsoft.al" },
      { src: "/captures/websites/jxsoft_work.png", alt: "jxsoft.al — selected work", caption: "jxsoft.al — selected work.", url: "jxsoft.al/work" },
      { src: "/captures/websites/jxsoft_tech_stack.png", alt: "jxsoft.al — tech stack section", caption: "jxsoft.al — tech stack.", url: "jxsoft.al/stack" },
      { src: "/captures/websites/jxsoft_timeline.png", alt: "jxsoft.al — timeline", caption: "jxsoft.al — engagement timeline.", url: "jxsoft.al/timeline" },
    ],
    problem: [
      "Three small clients each needed a real web presence, fast — a neighborhood garage that wanted leads and a private CRM, a personal trainer who needed a credible online front door with a fitness quiz, and a software studio that needed a simple landing.",
      "Off-the-shelf SaaS builders look templated and don't extend. Each site is small enough that a one-day Vite + Vercel build pays for itself versus a year of WordPress / Wix subscriptions.",
    ],
    approach: [
      "All three are Vite + React + framer-motion sites deployed on Vercel. Kërçishta is the most ambitious — it adds a Three.js Hyperspeed hero for visual punch and a hidden, password-gated /admin CRM that posts leads and service records to MongoDB Atlas via Vercel functions, with revenue/cost charts and inline EN/SQ bilingual content driven by a single translations file.",
      "Klodi Trainer leans on a multi-step fitness quiz that funnels visitors into a coaching consult, paired with a transformation gallery for social proof — no CMS, content lives in the repo. jxsoft.al is deliberately restrained — fast load, clean type, no animation theater — because it's a brochure site where credibility matters more than wow-factor.",
      "Where each site needed something custom (CRM auth, Three.js, quiz state machine), I built the smallest version of it; where it didn't, I shipped boring HTML+CSS and moved on.",
    ],
    techStack: {
      Frontend: [
        "React 19",
        "Vite 6",
        "TypeScript",
        "Tailwind",
        "framer-motion",
        "three 0.167 (Kërçishta)",
        "postprocessing (Kërçishta)",
      ],
      Backend: [
        "Vercel serverless functions",
        "Express (local dev)",
        "MongoDB 7 driver (Kërçishta CRM)",
        "JWT + bcryptjs",
        "helmet",
        "express-rate-limit",
      ],
      Infra: ["Vercel", "Render (Kërçishta)", "MongoDB Atlas"],
      Other: [
        "Bearer token derived from `ADMIN_PASSWORD` env var, stored in sessionStorage (Kërçishta /admin)",
      ],
    },
    underHood: [
      {
        path: "Kërçishta /admin",
        title: "hidden, password-gated CRM",
        body: "Not in nav, no public link — just a known URL plus a password. Dead-simple security model that's exactly right for a one-person garage; same Vercel deploy as the public site.",
      },
      {
        path: "Klodi Trainer fitness quiz",
        title: "multi-step state machine → coaching funnel",
        body: "A short quiz (goal, history, schedule, injuries) funnels visitors into a tailored consult booking. State lives in URL params so partial answers survive refresh — no backend until the final submit.",
      },
      {
        path: "Kërçishta HyperSpeedPresets.js",
        title: "Three.js Hyperspeed hero",
        body: "Preset config gives a 1-day build a real visual hook without bringing in a full 3D pipeline. Decision: visual punch only where it earns its weight.",
      },
    ],
    metrics: [
      { value: "3", label: "live brand sites (kerçishta-garage / kloditrainer / jxsoft)" },
      { value: "1", label: "MongoDB-backed CRM (Kërçishta /admin)" },
      { value: "EN/SQ", label: "bilingual content on Kërçishta" },
      { value: "1-2", label: "days each from first commit to shipped" },
      { value: "Vite + Vercel", label: "shared pipeline across all three" },
    ],
    timeline:
      "Kërçishta Garage built ~2026-01-20 to 21 (1-2 days). Klodi Trainer and jxsoft.al shipped as small marketing builds in similar timeframes. All three live on Vercel.",
    role: "Solo across all three — frontend, backend, Three.js, CRM, bilingual content.",
    liftQuote:
      "\"Three live sites, one pipeline — visual punch only where it earned its weight, boring static everywhere else.\"",
    links: [
      { label: "kerçishta-garage.com", href: "archived — domain offline" },
      { label: "kloditrainer.al", href: "https://kloditrainer.al" },
      { label: "jxsoft.al", href: "https://jxsoft.al" },
    ],
  },
  // ---------------------------------------------------------------------------
  // 10. advance.al
  // ---------------------------------------------------------------------------
  {
    slug: "advance-al",
    order: 10,
    title: "advance.al",
    tagline:
      "Albania's job marketplace — AI CV generation, AI profile-fill, embedding-ranked matching, auto-notify on match.",
    year: 2026,
    status: "shipped",
    hero: "/captures/advance_al/home.png",
    heroAlt:
      "advance.al home page — Albania's job marketplace, search bar over a hero",
    stack: ["React 18 + Vite", "Express + MongoDB", "OpenAI embeddings"],
    pitch:
      "advance.al is Albania's job marketplace, with the AI layer doing real work end-to-end: jobseekers upload any CV (PDF or DOCX) and OpenAI structured-extraction auto-fills their profile; the platform also generates a branded Word-document CV in Albanian or English from that structured data. Every job and every candidate gets vector-embedded with text-embedding-3-small, then ranked with cosine similarity + a 7-dimension match score (title, skills, experience, location, education, salary, availability) + a bilingual category boost so old internships don't crowd current skills. Every new posting fans out automatic bilingual notifications via Resend to every matched user, with UTM tracking and one-click unsubscribe.",
    essay:
      "advance.al is Albania's job marketplace and the only project here with paying users from day one — three sides on one platform (jobseekers, employers, admins), each with their own dashboard. The AI layer does real work end-to-end: a jobseeker uploads any CV (PDF or DOCX), `pdfjs-dist` + `mammoth` extract the text, and OpenAI structured-extraction auto-fills the entire profile — skills, work history, education, contact, summary — so they're match-ready without typing a thing. The platform also generates a branded Word-document CV in Albanian or English from that same structured data using the `docx` library, with consistent colors and typography across the export. Matching combines two signals: every job and every profile gets vector-embedded with `text-embedding-3-small` (1536 dims) for semantic ranking, and on top of cosine similarity sits a 7-dimension explainable score (title, skills, experience, location, education, salary, availability) — so the employer dashboard can show *why* a candidate scored 78 and not just the number. The third AI hook is the automatic notification fanout: every time an employer publishes a new job, an embedding worker recomputes matches and Resend sends a bilingual job-alert email to every qualified user with UTM tracking and a one-click unsubscribe token. The whole backend is Express 5 + MongoDB 8 with a Redis rate-limited OpenAI client, an embedding queue worker on its own heartbeat process, an alert system that emails me when drift crosses a threshold, GDPR retention crons that purge soft-deleted accounts after 30 days, and 288 Jest tests under a strict philosophy that bans permissive matchers and tautological assertions. The frontend is React 18 + Vite + Mantine + shadcn/ui, fully bilingual SQ/EN, with Playwright \"walker\" tests that screenshot every public + jobseeker + employer + admin route across desktop + iPhone 12 + Pixel 5 for every release. I learned how a marketplace actually works by running one.",
    shots: [
      {
        src: "/captures/advance_al/jobs_listing.png",
        alt: "Jobs listing with filters by city, category, level",
        caption:
          "Jobs feed — filters by city, category, level, posted-date. Backed by an embedding-ranked match score on the logged-in path.",
        url: "advance.al/jobs",
      },
      {
        src: "/captures/advance_al/job_detail.png",
        alt: "Job detail page with company, description, apply CTA",
        caption:
          "Job detail — company, description, apply CTA. Application creates a stored Application doc and notifies the employer.",
        url: "advance.al/jobs/:id",
      },
      {
        src: "/captures/advance_al/jobseeker_landing.png",
        alt: "Marketing landing page for jobseekers",
        caption:
          "Jobseekers landing — pitch + sign-up funnel. Profile fields drive the embedding used to rank match scores.",
        url: "advance.al/jobseekers",
      },
      {
        src: "/captures/advance_al/employer_landing.png",
        alt: "Marketing landing page for employers",
        caption:
          "Employers landing — pricing, features, post-a-job funnel.",
        url: "advance.al/employers",
      },
      {
        src: "/captures/advance_al/employer_dashboard.png",
        alt: "Employer dashboard with 3 active jobs and applicant counts",
        caption:
          "Employer dashboard — active job list with applicant counts. Real-time as applications land.",
        url: "advance.al/employer-dashboard",
      },
      {
        src: "/captures/advance_al/post_job_wizard.png",
        alt: "Multi-step post-job wizard — step 1 of 4",
        caption:
          "Post-job wizard — four-step flow. Title + category embeddings are computed on save.",
        url: "advance.al/post-job",
      },
      {
        src: "/captures/advance_al/jobseeker_profile.png",
        alt: "Jobseeker profile with skills, work, and education filled in",
        caption:
          "Jobseeker profile — skills, work, education. Saving re-embeds the user and re-ranks recommended jobs.",
        url: "advance.al/profile",
      },
      {
        src: "/captures/advance_al/mobile_home.png",
        alt: "advance.al home page on iPhone 12",
        caption:
          "Mobile — full responsive build, captured nightly by the Playwright walker on iPhone 12 + Pixel 5.",
      },
    ],
    problem: [
      "Albania's job market lives in WhatsApp groups, Facebook walls, and a handful of legacy job boards that look like 2010. Employers can't reach qualified candidates outside their immediate network, and jobseekers can't get visibility into who's hiring beyond Tirana — let alone what they're actually qualified for.",
      "I took advance.al over and built it into a real marketplace: a discovery layer that ranks jobs by genuine fit instead of recency, with proper employer tooling on the other side so SMEs can actually run hiring without a Greenhouse subscription priced in dollars.",
    ],
    approach: [
      "The system has three personas. Jobseekers register, fill a structured profile (skills, work history, education, location, preferences), and get a feed ranked by an embedding-based match score plus saved-jobs + applications. Employers register their company, post jobs through a four-step wizard, manage applicants from a dashboard, and run bulk-notification campaigns. Admins get a business-control panel — feature flags, configuration audits, system health, revenue analytics, GDPR retention crons.",
      "Backend is Express 5 + MongoDB 8 (Mongoose) + Upstash Redis for rate-limiting + Cloudinary for file uploads + Sentry for errors. Embeddings come from OpenAI `text-embedding-3-small` (1536 dims), with a shared client and rate-limited p-limit pool so jobs + users + scripts don't trample each other. CV parsing uses `pdfjs-dist` + `mammoth` to extract text, then OpenAI for structured extraction.",
      "Frontend is React 18 + Vite + TypeScript + Mantine for forms + Radix/shadcn for primitives, with a typed API client and proper auth context. Testing is the heaviest part of this stack: 288 backend Jest tests under a strict philosophy (no permissive matchers, no `toBeTruthy` for fields under test, no own-backend mocking), plus Playwright \"walker\" suites that step through every public + logged-in route across three viewports and ship screenshot reports.",
    ],
    techStack: {
      Frontend: [
        "React 18",
        "Vite",
        "TypeScript",
        "Mantine 8",
        "shadcn/ui (Radix)",
        "react-hook-form",
        "react-query",
        "Tailwind",
        "Playwright",
      ],
      Backend: [
        "Express 5",
        "Mongoose 8 + MongoDB",
        "Upstash Redis",
        "JWT + bcryptjs",
        "express-rate-limit",
        "helmet + CORS allowlist",
        "express-validator",
        "Jest (288 tests)",
      ],
      AI: [
        "OpenAI text-embedding-3-small (1536d)",
        "Cosine similarity + 7-dim explainable match score",
        "OpenAI structured extraction for CV → profile auto-fill",
        "docx library — branded CV generation (SQ + EN)",
        "Bilingual domain inference (SQ + EN tokens)",
        "Embedding worker process + match-and-notify fanout",
      ],
      Infra: [
        "Cloudinary",
        "Sentry",
        "Nodemailer (transactional email)",
        "Twilio (optional SMS)",
        "Vercel preview URLs (CORS whitelist)",
      ],
    },
    underHood: [
      {
        path: "backend/src/services/cvParsingService.js + cvDocumentService.js",
        title: "AI profile-fill in, branded CV out",
        body: "Upload any CV (PDF or DOCX) → pdfjs-dist + mammoth extract the text → OpenAI structured-extraction auto-fills the whole profile (skills, work, education, summary). Same structured data drives a docx-generated branded Word CV in Albanian or English, with consistent colors and typography. CV in, profile populated; profile in, polished CV out — the AI does the boring part both directions.",
      },
      {
        path: "backend/src/services/userEmbeddingService.js + candidateMatching.js",
        title: "embeddings + 7-dim explainable match score",
        body: "Pure cosine similarity ranked old banking internships too high for senior devs. So matching combines two signals: text-embedding-3-small for semantic ranking, plus a hand-built 7-dimension breakdown (title, skills, experience, location, education, salary, availability) that scores 0-100 with each component shown to the employer. A bilingual domain inferrer recognises both English (developer, finance) and Albanian (zhvillues, programues, financë) skill tokens to apply a hard category-match boost — bilingual products need bilingual heuristics.",
      },
      {
        path: "backend/src/workers/embeddingWorker.js + lib/notificationService.js",
        title: "automatic match-and-notify fanout",
        body: "When an employer publishes a job, a dedicated worker process recomputes match scores and fans out a bilingual job-alert email via Resend to every qualified user — with UTM tracking, escapeHtml on every user-supplied field, and a one-click unsubscribe token. An alertService emails me directly when the embedding queue stalls or drift crosses a threshold, because semantic search fails silently by default.",
      },
    ],
    metrics: [
      { value: "288", label: "backend Jest tests across 18 route modules" },
      { value: "20", label: "Mongoose models (Application, Job, User, BusinessCampaign, etc.)" },
      { value: "108", label: ".tsx files in the frontend" },
      { value: "18", label: "REST route modules (incl. dedicated /cv and /matching)" },
      { value: "1536", label: "OpenAI embedding dims (text-embedding-3-small)" },
      { value: "7", label: "match-score dimensions (title, skills, experience, location, education, salary, availability)" },
      { value: "SQ + EN", label: "fully bilingual — UI, emails, generated CVs" },
    ],
    timeline:
      "Took over and rebuilt through 2026 H1; live on advance.al with paying employers and a steady jobseeker feed. Currently shipping continuously.",
    role:
      "Solo across backend, frontend, embedding pipeline, admin tooling, deploy.",
    liftQuote:
      "\"CV in, profile populated; profile in, polished CV out — the AI does the boring part both directions, and every new job fans out matched bilingual alerts automatically.\"",
    links: [
      { label: "Live site", href: "https://advance.al" },
      { label: "Code", href: "private — available on request" },
    ],
  },
] as const satisfies readonly Project[];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return projects.map((p) => p.slug);
}
