// Notes — long-form technical writeups. Orphan pages (no nav/footer links),
// but listed in sitemap.xml + llms.txt so search and AI crawlers can find
// and cite them. Each note is a self-contained authority signal anchored
// in one of the production projects on this site.

export type NoteSection = {
  heading?: string;
  paragraphs: string[];
};

export type Note = {
  slug: string;
  title: string;
  date: string; // ISO date — YYYY-MM-DD
  readingMinutes: number;
  description: string; // for meta + OG card
  keywords: readonly string[];
  /** Slug of the case study this note draws from, if any. One-way link. */
  relatedProject?: string;
  lede: string;
  sections: NoteSection[];
};

export const notes: readonly Note[] = [
  {
    slug: "keepitup-two-layer-reasoning",
    title:
      "Two-layer reasoning for autonomous AI agents — how KeepItUp gates a fix before it PRs",
    date: "2026-05-14",
    readingMinutes: 7,
    description:
      "Most AI-fixes-your-code demos skip the part where the model is wrong half the time. KeepItUp runs two LLM passes against the same problem, and the second one can veto the first. Here's how the gate works.",
    keywords: [
      "autonomous AI agent",
      "AI agent architecture",
      "LLM router",
      "AI code review",
      "tree-sitter AST",
      "multi-LLM",
      "agent gate",
      "Anthropic Claude",
      "OpenAI",
      "Google Gemini",
    ],
    relatedProject: "keepitup",
    lede:
      "KeepItUp watches six deploy platforms 24/7 and tries to make oncall a thing I review with coffee instead of a thing that wakes me up. The interesting bit isn't the watching — anyone can poll an API. The interesting bit is what the agent does in the gap between \"build is broken\" and \"PR is open.\" It runs two LLM passes against the same problem, and the second one can veto the first.",
    sections: [
      {
        paragraphs: [
          "I'll write down how the gate works because it took me a while to get it right, and most demos I've seen skip the part where the model is wrong half the time.",
        ],
      },
      {
        heading: "The Generator: a tree-sitter AST walker, not the whole repo",
        paragraphs: [
          "When CI fails, the agent doesn't shove the entire codebase at the model. It runs the file through a tree-sitter parser — same parser across six languages, because trying to handcraft regex per language was a mistake I made in v1 and rolled back — and pulls a 50-to-500-line slice around the symbol the stack trace points at. Sometimes that slice is the whole offending function plus its imports; sometimes it's a chunk of a class with its three nearest siblings; sometimes it's just twenty lines of a route handler. The size is bounded, but the shape is determined by the parse tree, not by line numbers.",
          "This sounds like an optimization — and it is, token budgets are real — but it's also a correctness lever. Models are sharper when the context is dense. A 3,000-token slice of relevant AST nodes routinely beats a 30,000-token \"here's the whole module, figure it out\" dump. The shorter prompt is faster, cheaper, and produces fixes that don't accidentally rewrite an adjacent helper the agent had no business touching.",
          "The Generator's job ends with a proposed diff. Not a PR yet. Just a diff and a confidence score.",
        ],
      },
      {
        heading: "The Reviewer: a separate agent that can say no",
        paragraphs: [
          "Here's the part most \"AI agent that fixes code\" walkthroughs skip. The Generator's confidence score is its own confidence in itself, which is roughly as useful as asking someone if they're trustworthy. So a second agent reads the diff cold — no chain-of-thought context from the Generator — and scores it independently.",
          "The Reviewer doesn't know how the diff was produced. It only sees the file before, the file after, and the failing test output. It scores the proposed fix on a separate axis: does this change actually solve the stated problem, and does it introduce anything load-bearing that wasn't there?",
          "Both scores have to clear a threshold for the agent to open a PR. Default is ≥85% — high enough that the long tail of \"it changed the indentation and called it done\" gets caught.",
          "There's a relaxation rule: if a build verification step — run the proposed diff through the test suite in a sandboxed container — comes back green, the threshold drops to ≥70%. Because a passing test suite is a stronger correctness signal than any model's self-report. A diff that passes 200 tests at 70% confidence beats a diff that fails three tests at 90% confidence, every time.",
        ],
      },
      {
        heading: "Three providers, one budget gate",
        paragraphs: [
          "The Generator and Reviewer don't have to be the same model. They're not. The whole stack — Anthropic Claude, OpenAI, Google Gemini — sits behind a single internal LLM client that owns provider selection, budget tracking, and per-call cost telemetry.",
          "The reason isn't load balancing or redundancy. The reason is that different models have different failure modes, and pairing them on the Generator/Reviewer split catches errors a single-model pipeline would miss. If both passes use the same provider, they share blind spots. If pass one is Claude and pass two is GPT-4-class, a hallucination one model finds plausible is the kind of thing the other one will flag.",
          "Budget gates are the boring half. Every call goes through the same client, every call increments a counter, and once a repo's monthly budget is hit, the agent stops proposing fixes for that repo — it keeps watching, just doesn't write. I didn't want a runaway agent burning through credits because someone's CI started oscillating.",
        ],
      },
      {
        heading: "The \"never pushes to main\" rule",
        paragraphs: [
          "The agent opens PRs. It doesn't merge. It doesn't push directly. It runs Semgrep, Trivy, and Gitleaks against the diff in a Docker container before opening, and if any scan flags something, the PR is opened with a comment but not auto-approved.",
          "I want to stress this isn't safety theater. It's a workflow decision. The whole point is that oncall is a thing I review, not a thing that's already been done by an agent. The PR sits in a queue; I look at it when I look at it; I approve or close. If I trusted the agent more I'd auto-merge the easy ones. I don't, yet, and the version where I do is a different product.",
        ],
      },
      {
        heading: "The repo health score is the surface, the gate is the engine",
        paragraphs: [
          "All the above rolls up to a per-repo health score from 0 to 100 — a weighted mix of build status, deploy success rate, security-scan findings, and the agent's track record of correct fixes on that repo. The score is the dashboard surface; the two-layer reasoning is the engine underneath.",
          "The thing I'd repeat in any future agent project: build the gate before you build the generator. The generator is the part that demos well. The gate is the part that determines whether the agent is something you can actually run unattended.",
        ],
      },
    ],
  },
  {
    slug: "reel-farmer-resumable-pipelines",
    title:
      "Resumable pipelines: how Reel Farmer survives a crash mid-render",
    date: "2026-05-14",
    readingMinutes: 6,
    description:
      "Reel Farmer is a six-stage Bun pipeline that takes long enough that crashes are inevitable. The trick isn't preventing crashes — it's making sure a crash never costs more than the seconds since the last completed stage. Deterministic file paths plus a SQLite checkpoint database, no queues, no event buses.",
    keywords: [
      "resumable pipeline",
      "checkpoint pattern",
      "long-running pipeline",
      "Bun TypeScript",
      "Remotion render",
      "yt-dlp",
      "Whisper transcription",
      "SQLite checkpoint",
      "idempotent stages",
    ],
    relatedProject: "reel-farmer",
    lede:
      "Reel Farmer is a self-hosted Bun pipeline that turns YouTube videos into TikTok shorts across multiple authenticated accounts — yt-dlp downloads, Whisper transcribes, Gemini picks the clips, Remotion renders 1080×1920, stealth puppeteer uploads. The whole thing takes long enough that crashes are inevitable. The thing I had to get right wasn't any individual stage; it was making sure a crash never cost me more than the seconds since the last completed step.",
    sections: [
      {
        heading: "The run-id tree",
        paragraphs: [
          "Every run gets a UUID-shaped directory at `data/runs/<run-id>/`. Every artifact lands at a deterministic path inside it. `src/raw.mp4`, `src/transcript.json`, `clips/01.mp4`, `renders/01.vertical.mp4`, `uploads/01.metadata.json`. The path is the contract.",
          "Any tool that wants to operate on a stage's output knows exactly where to look without scanning, without indexing, without a \"where did the rendering land\" query. Bonus: `ls data/runs/<run-id>/` is a complete progress report. No dashboard needed when you're debugging at 1am.",
        ],
      },
      {
        heading: "The SQLite checkpoint",
        paragraphs: [
          "Alongside the file tree sits a SQLite database with one row per (run-id, stage, status, timestamp, error). Status is one of `pending`, `running`, `completed`, `failed`.",
          "Every stage's first act is to mark its own row `running` with a start timestamp. Every stage's last act is to mark it `completed` — or `failed` with a stack trace. `bun run resume <run-id>` reads this table, finds the first non-completed stage, and starts from there. Failed status carries a retry counter; after three retries the run is marked dead and stays dead until I look.",
        ],
      },
      {
        heading: "Resume by design, not by retry",
        paragraphs: [
          "The trick isn't catching exceptions and retrying within a stage — that's just nested try/catch and ends in cascading flake. The trick is: every stage is a pure function of its inputs.",
          "If a stage crashed before completing, its output files are either absent or partial. Resume just re-runs the stage. Because the file paths are deterministic, the second attempt overwrites the first attempt's debris without needing cleanup logic.",
          "Idempotent stages plus deterministic paths equals resumable pipeline. The SQLite table is only the index; the file tree is the source of truth.",
        ],
      },
      {
        heading: "Why SQLite and not Redis or Postgres",
        paragraphs: [
          "This pipeline runs on one box. There's no horizontal-scaling story. SQLite gives me ACID guarantees with zero deployment overhead — the database file lives next to the run tree. A crashed pipeline's full state is one `tar -cz` away from being inspected on a different machine.",
          "Postgres would be over-engineered for the cardinality. Redis would lose the durability story; even AOF persistence doesn't beat a single SQLite file for \"all the state is in one place.\" If the pipeline ever grew to multiple machines I'd swap SQLite for Postgres; the abstraction is one file, and it's swappable.",
        ],
      },
      {
        heading: "The companion dashboard reads the same database",
        paragraphs: [
          "A separate Next.js app reads the SQLite run table and renders a per-run timeline. It writes nothing. The pipeline can crash, the dashboard keeps working. The dashboard can crash, the pipeline keeps working. The split is enforced by the fact that they share read-only state and nothing else.",
        ],
      },
      {
        heading: "Paths are contracts",
        paragraphs: [
          "I built this because I run a small media operation across multiple Albanian-themed accounts. A pipeline that needs an operator to babysit it isn't a pipeline; it's an annoying job.",
          "The design rule I'd repeat: paths are contracts. If two stages need to coordinate, give them a deterministic file location to coordinate through. No queues, no event buses, just a path you can `ls`.",
        ],
      },
    ],
  },
  {
    slug: "advance-al-vector-embeddings-job-matching",
    title:
      "Vector embeddings for job-matching — why pure cosine similarity isn't enough",
    date: "2026-05-14",
    readingMinutes: 7,
    description:
      "Cosine similarity over OpenAI embeddings handles ranking. It falls apart on explanation — recruiters can't show a hiring manager a number from 0 to 1 and call it a recommendation. advance.al puts a 7-dimension explainable score on top of the embedding so the dashboard can show why a candidate scored 78.",
    keywords: [
      "vector embeddings",
      "job matching",
      "semantic search",
      "cosine similarity",
      "explainable AI",
      "OpenAI embeddings",
      "text-embedding-3-small",
      "candidate matching",
      "recruiting AI",
    ],
    relatedProject: "advance-al",
    lede:
      "advance.al is Albania's job marketplace and the only project on this site with paying users from day one. The matching engine has to answer two questions for every job posted: which candidates are best for this job, and why. Pure cosine similarity over OpenAI embeddings handles the first. It falls apart on the second.",
    sections: [
      {
        heading: "What the embeddings actually do",
        paragraphs: [
          "Every profile and every job gets vectorized with `text-embedding-3-small` (1536 dimensions) at write time. The text fed to the embedder is a normalized blob: title plus skills plus experience summary, and for jobs the responsibilities section. Albanian and English content live in the same vector space because the model handles both.",
          "Cosine similarity then ranks candidates against a job, or jobs against a candidate's wishlist. This is the easy half. Throw OpenAI's embedding API at it and you're done — assuming you don't mind your employer dashboard saying \"candidate scored 0.83\" with no explanation underneath.",
        ],
      },
      {
        heading: "The 7-dimension explainable score on top",
        paragraphs: [
          "Cosine alone is opaque. Recruiters can't show a hiring manager a number from 0 to 1 and call it a recommendation. So on top of cosine, every match also gets a seven-dimension breakdown: title match, skills match, experience match, location match, education match, salary fit, availability match.",
          "Each dimension is computed with its own rules. Title is a normalized fuzzy match; skills use Jaccard against a controlled taxonomy; experience is a year-band overlap; location is a region/remote-status check; education matches degree levels; salary fit is range overlap; availability matches start-date windows. These are explainable. The employer dashboard can show \"scored 78: title 32/40, skills 25/30, experience 12/15, location -1 (remote-only candidate, on-site role)…\" next to the candidate row.",
        ],
      },
      {
        heading: "Why two layers and not one",
        paragraphs: [
          "A single-formula score, whether it's pure cosine or a weighted aggregate of features, is a black box you can't tune without breaking everyone's existing rankings.",
          "Two layers let each one change independently. Cosine ranks; the dimension breakdown explains. If we want to up-weight skills relative to title next quarter, we change one weight in the breakdown formula and the cosine ranking is untouched.",
          "It also means the recommendation can survive the next OpenAI embedding-model deprecation. `text-embedding-3-small` is the current default; if it's replaced, every existing match's cosine number will move, but the dimension breakdown stays stable.",
        ],
      },
      {
        heading: "The fanout",
        paragraphs: [
          "Every new job triggers an embedding worker on its own heartbeat process. The worker recomputes top-N matches and queues bilingual notifications through Resend. Each email has UTM tracking and a one-click unsubscribe token.",
          "Users get one email per matching job per day at most, deduped at the embedding worker (not at the email layer — by the time it hits Resend, it's too late to dedupe cheaply).",
        ],
      },
      {
        heading: "What I'd do differently",
        paragraphs: [
          "I'd embed each section of a CV separately and average at query time, instead of one blob per profile. Long-form CVs lose nuance when flattened to 1536 dims; a candidate with strong recent senior experience and a long, irrelevant earlier career gets dragged toward the middle.",
          "This is on the roadmap. The fix is a schema change and a re-embedding pass — cheap compared to rebuilding the matching engine.",
        ],
      },
      {
        heading: "Why this exists",
        paragraphs: [
          "I built advance.al because Albania's job market lived in WhatsApp groups, Facebook walls, and a handful of legacy boards that look like 2010. A marketplace that could match a backend developer to a backend job without manually rewriting their CV twice was a thing nobody had bothered to ship.",
        ],
      },
    ],
  },
  {
    slug: "prisma-adapter-swap-dev-prod-parity",
    title:
      "Same schema, different databases — the Prisma adapter swap in Pilates Studio",
    date: "2026-05-14",
    readingMinutes: 6,
    description:
      "Pilates Studio runs better-sqlite3 in dev and Turso (libsql) in production. Same Prisma schema, same query code, same migration history — the adapter pattern handles the swap in two lines of config. This is the kind of dev/prod parity I used to fake with docker-compose. I don't need to anymore.",
    keywords: [
      "Prisma adapter",
      "Turso libsql",
      "better-sqlite3",
      "dev prod parity",
      "Prisma ORM",
      "Vercel serverless Express",
      "SQLite production",
      "edge database",
    ],
    relatedProject: "pilates-studio",
    lede:
      "Pilates Studio runs better-sqlite3 in dev and Turso (libsql) in production. Same Prisma schema, same query code, same migration history. The adapter pattern handles the swap in two lines of config. This is the kind of dev/prod parity I used to fake with docker-compose; now I don't need to.",
    sections: [
      {
        heading: "What changed in Prisma",
        paragraphs: [
          "For most of its history, Prisma was a closed system — one query engine, one wire protocol, one set of supported databases per engine. The adapter pattern decoupled the query engine from the connection: PrismaClient now accepts an `adapter` field that handles the actual database conversation.",
          "`@prisma/adapter-libsql` ships with libsql. `@prisma/adapter-better-sqlite3` ships with better-sqlite3. The schema and migrations are identical between them. The swap happens in one place — `src/lib/db.ts` returns the right adapter based on an env var.",
        ],
      },
      {
        heading: "Why dev/prod parity actually matters",
        paragraphs: [
          "The argument I used to hear was \"just run Postgres in Docker locally.\" This works until the day someone's M-series Mac can't run the libpq Docker image fast enough, or a teammate's connection limits don't match prod.",
          "The adapter pattern says: prod uses Turso (edge-replicated libsql), dev uses better-sqlite3 (in-process, no daemon). Both speak the same SQL dialect. Migrations apply identically. Schema diffs get caught at write time by the same Prisma validator.",
          "The dev pain is now zero. There's no daemon to babysit; the database is a file in the repo's gitignore.",
        ],
      },
      {
        heading: "The catch-all Express-on-Vercel trick",
        paragraphs: [
          "Pilates Studio's API ships as a Vercel serverless catch-all at `api/[[...path]].ts`. The same Express app runs as a long-lived server locally and as edge functions in production.",
          "The adapter swap is part of why this works. Locally, the Express app keeps a single better-sqlite3 connection alive for its uptime. In production, each Vercel function invocation gets its own libsql client, which is fine because libsql connections are cheap and stateless.",
          "One codebase, two runtime models. Zero rewrites between them.",
        ],
      },
      {
        heading: "What this trades away",
        paragraphs: [
          "You're now committed to a SQLite-dialect surface. If you need Postgres-specific features — jsonb, listen/notify, range types — you can't have them.",
          "For an admin web plus mobile app plus booking API with 21 Prisma models, this is a non-issue. For a different shape of product it might be.",
        ],
      },
      {
        heading: "21 models, 594 tests, all under the same swap",
        paragraphs: [
          "The full test surface — Vitest for unit, supertest for API integration, Playwright for E2E against the admin web and the mobile app — runs against better-sqlite3.",
          "Production runs against Turso. The schema is the same. The migrations are the same. If a test passes locally, the prod behavior is one network hop different, not one database different.",
          "I picked this stack because boutique studios get nickel-and-dimed by SaaS, and I wanted to prove a single solo dev could ship the same shape with the same testing rigor as a multi-engineer team. The adapter swap is one of three or four decisions that made it possible.",
        ],
      },
    ],
  },
  {
    slug: "rls-subscription-gate-cleanslate",
    title:
      "RLS as a subscription gate — letting Postgres turn off trial accounts for you",
    date: "2026-05-14",
    readingMinutes: 6,
    description:
      "CleanSlate's subscription expiry path is the cleanest part of the codebase, because there is no path. When a trial runs out, the UI doesn't run a check. The database stops accepting INSERTs. The read-only state is automatic.",
    keywords: [
      "Postgres RLS",
      "Supabase RLS",
      "row level security",
      "subscription gate",
      "trial expiry",
      "policy-driven access",
      "Supabase patterns",
    ],
    relatedProject: "cleanslate",
    lede:
      "CleanSlate is a €20-flat operating system for solo cleaners in Germany. The subscription expiry path is the cleanest part of the codebase, because there is no path. When a user's trial runs out, the UI doesn't run a check; the database stops accepting INSERTs. The read-only state is automatic.",
    sections: [
      {
        heading: "What most subscription gates look like",
        paragraphs: [
          "The usual approach is a `useEffect` on every authenticated page that checks if the user's subscription is active and redirects if not. This is a race-condition factory. The check runs after the page mounts, so for a few hundred milliseconds the UI shows the gated content. Worse: every component that wants to do anything destructive needs its own check.",
          "And the database doesn't care. A clever user with the right knowledge could hit the API directly and write a row regardless of what the UI thinks.",
        ],
      },
      {
        heading: "The CleanSlate approach",
        paragraphs: [
          "The check moves to Supabase RLS. Every INSERT and UPDATE policy includes a clause like `EXISTS (SELECT 1 FROM subscriptions WHERE user_id = auth.uid() AND status = 'active' AND current_period_end > NOW())`.",
          "When the period ends, the policy stops matching. INSERTs fail at the database. UPDATEs are blocked. SELECT is still allowed because the user can read their own data — they just can't change it.",
          "The UI doesn't need a single line of subscription-checking code. If a write fails, it fails the same way any RLS violation fails, and the existing error handling shows \"your subscription has expired\" instead of \"you don't have permission.\"",
        ],
      },
      {
        heading: "Why this is more correct",
        paragraphs: [
          "The constraint is now adjacent to the data, not to the UI. Adding a new write endpoint doesn't risk forgetting the check.",
          "There's no race condition. The policy is evaluated at every query, in the same transaction as the write. A direct API call bypassing the UI gets the same treatment. There's no privileged path.",
        ],
      },
      {
        heading: "The cron half",
        paragraphs: [
          "Subscription renewal happens through four Vercel cron endpoints — trial reminders, overdue invoices, recurring job generation, pre-job SMS. The operator never logs in to do admin. The crons run on a schedule; if they don't run, the database state stays correct anyway, because the RLS policy doesn't depend on a job firing.",
          "LemonSqueezy webhooks update the `subscriptions` table when payments succeed. Telnyx sends SMS when the cron fires. Resend sends emails. The database is the source of truth; everything else is glue.",
        ],
      },
      {
        heading: "What this trades away",
        paragraphs: [
          "You're now committed to Postgres plus RLS. Switching to a NoSQL backend would be a rewrite. RLS policies are also harder to test in isolation than service-layer checks — Supabase has tools for it, but it's not as ergonomic as writing a unit test for a TypeScript function.",
          "And if the policy is wrong, the failure mode is silent. A write just fails. There's no exception with a stack trace pointing at a missing check. You discover the bug when a user complains.",
        ],
      },
      {
        heading: "Discipline is the product",
        paragraphs: [
          "I built CleanSlate as a discipline product. Every architectural rule is enforced with no exceptions: route files dispatch to services, services own all data ops, components never touch Supabase, money is always cents, phones always E.164. RLS as a subscription gate is the same rule applied to time — the policy *is* the gate, not a UI check pretending to be one.",
        ],
      },
    ],
  },
];

export function getNote(slug: string): Note | undefined {
  return notes.find((n) => n.slug === slug);
}

export function getAllNoteSlugs(): string[] {
  return notes.map((n) => n.slug);
}
