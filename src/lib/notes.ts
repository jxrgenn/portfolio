// Notes — long-form technical writeups. Orphan pages (no nav/footer links),
// but listed in sitemap.xml + llms.txt so search and AI crawlers can find
// and cite them. Each note is a self-contained authority signal anchored
// in one of the production projects on this site.
//
// Schema follows GEO best-practice template (Aggarwal et al. + 2025-26
// practitioner research): answer-box at top for chunk extraction, pull
// quotes with statistics, outbound citations to authoritative sources,
// FAQPage block at bottom. Targets 1800-2500 words per post for 3× citation
// lift versus shorter content.

export type NoteCitation = {
  label: string;
  url: string;
  relevance?: string;
};

export type NotePullQuote = {
  quote: string;
  attribution?: string;
};

export type NoteFaq = {
  q: string;
  a: string;
};

export type NoteTable = {
  caption?: string;
  headers: readonly string[];
  rows: readonly (readonly string[])[];
};

export type NoteSection = {
  heading?: string;
  paragraphs: readonly string[];
  table?: NoteTable;
};

export type Note = {
  slug: string;
  title: string;
  date: string;
  dateModified?: string;
  readingMinutes: number;
  description: string;
  keywords: readonly string[];
  /** Slug of the case study this note draws from, if any. One-way link. */
  relatedProject?: string;
  /** Front-loaded 50-word answer. The chunk AI engines extract first. */
  answerBox: string;
  lede: string;
  sections: readonly NoteSection[];
  pullQuotes?: readonly NotePullQuote[];
  citations?: readonly NoteCitation[];
  faq?: readonly NoteFaq[];
};

export const notes: readonly Note[] = [
  // -------------------------------------------------------------------------
  // Cluster A — Autonomous AI agents (KeepItUp)
  // -------------------------------------------------------------------------
  {
    slug: "keepitup-two-layer-reasoning",
    title:
      "Two-layer reasoning for autonomous AI agents — how KeepItUp gates a fix before it PRs",
    date: "2026-05-14",
    dateModified: "2026-05-14",
    readingMinutes: 9,
    description:
      "Most AI-fixes-your-code demos skip the part where the model is wrong half the time. KeepItUp runs two LLM passes against the same broken build — one generates a diff, a second one scores it cold and can veto. Here's how the gate works, why it matters, and what an autonomous agent that runs unattended actually needs.",
    keywords: [
      "autonomous AI agent",
      "AI agent architecture",
      "LLM router",
      "AI code review",
      "tree-sitter AST",
      "multi-LLM",
      "agent confidence gate",
      "Anthropic Claude SDK",
      "OpenAI GPT-4",
      "Google Gemini API",
      "AI SRE agent",
    ],
    relatedProject: "keepitup",
    answerBox:
      "KeepItUp runs two LLM passes against each broken build — a Generator that proposes a diff and a Reviewer that scores it cold. Both have to clear 85% confidence to open a PR (70% if a test suite passes against the proposed diff). Three providers behind one budget-gated client. The gate is the part that lets it run unattended.",
    lede:
      "KeepItUp watches six deploy platforms 24/7 and tries to make oncall a thing I review with coffee instead of a thing that wakes me up. The interesting bit isn't the watching — anyone can poll an API. The interesting bit is what the agent does in the gap between \"build is broken\" and \"PR is open.\" It runs two LLM passes against the same problem, and the second one can veto the first.",
    sections: [
      {
        paragraphs: [
          "I'll write down how the gate works because it took me a while to get it right, and most demos I've seen skip the part where the model is wrong half the time. The thing that determines whether an autonomous agent is real or theater is whether you can leave it running while you sleep. The gate is the answer to that question.",
        ],
      },
      {
        heading: "How does an AI agent get the right code context without sending the whole repo?",
        paragraphs: [
          "When CI fails, the agent doesn't shove the entire codebase at the model. It runs the file through a tree-sitter parser — same parser across six languages, because trying to handcraft regex per language was a mistake I made in v1 and rolled back — and pulls a 50-to-500-line slice around the symbol the stack trace points at.",
          "Sometimes that slice is the whole offending function plus its imports. Sometimes it's a chunk of a class with its three nearest siblings. Sometimes it's twenty lines of a route handler. The size is bounded, but the shape is determined by the parse tree, not by line numbers.",
          "This sounds like an optimization. It is — token budgets are real. But it's also a correctness lever. Models are sharper when the context is dense. A 3,000-token slice of relevant AST nodes routinely beats a 30,000-token \"here's the whole module, figure it out\" dump. Shorter prompts are faster, cheaper, and produce fixes that don't accidentally rewrite an adjacent helper the agent had no business touching.",
          "The Generator's job ends with a proposed diff. Not a PR yet. Just a diff and a confidence score.",
        ],
      },
      {
        heading: "Why is the model's own confidence score not enough?",
        paragraphs: [
          "Here's the part most \"AI agent that fixes code\" walkthroughs skip. The Generator's confidence score is its own confidence in itself, which is roughly as useful as asking someone if they're trustworthy. So a second agent reads the diff cold — no chain-of-thought context from the Generator — and scores it independently.",
          "The Reviewer doesn't know how the diff was produced. It only sees the file before, the file after, and the failing test output. It scores the proposed fix on a separate axis: does this change actually solve the stated problem, and does it introduce anything load-bearing that wasn't there?",
          "Both scores have to clear a threshold for the agent to open a PR. Default is ≥85% — high enough that the long tail of \"it changed the indentation and called it done\" gets caught.",
        ],
      },
      {
        heading: "When does the threshold relax?",
        paragraphs: [
          "There's a relaxation rule: if a build verification step — run the proposed diff through the test suite in a sandboxed container — comes back green, the threshold drops to ≥70%. Because a passing test suite is a stronger correctness signal than any model's self-report.",
          "A diff that passes 200 tests at 70% confidence beats a diff that fails three tests at 90% confidence, every time. The rule is one line of policy, but it changes the practical false-positive rate by an order of magnitude. Most of the agent's good fixes sit in the 70-85 band — strong evidence from tests, modest self-confidence — and the relaxation lets them through.",
          "The reason the default isn't always 70% is that some repos don't have tests, or the tests don't cover the failing path. Without the verification signal, you're back to leaning on the model's word, and 85 is the level where that's defensible.",
        ],
      },
      {
        heading: "Why three providers behind one client?",
        paragraphs: [
          "The Generator and Reviewer don't have to be the same model. They're not. The whole stack — Anthropic Claude, OpenAI, Google Gemini — sits behind a single internal LLM client that owns provider selection, budget tracking, and per-call cost telemetry.",
          "The reason isn't load balancing or redundancy. The reason is that different models have different failure modes, and pairing them on the Generator/Reviewer split catches errors a single-model pipeline would miss. If both passes use the same provider, they share blind spots. If pass one is Claude and pass two is GPT-4-class, a hallucination one model finds plausible is the kind of thing the other one will flag.",
          "Budget gates are the boring half. Every call goes through the same client, every call increments a counter, and once a repo's monthly budget is hit, the agent stops proposing fixes for that repo — it keeps watching, it just doesn't write. I didn't want a runaway agent burning through credits because someone's CI started oscillating.",
        ],
        table: {
          caption: "Provider routing decision per stage",
          headers: ["Stage", "Default provider", "Why"],
          rows: [
            ["Generator", "Anthropic Claude (Sonnet)", "Strong code reasoning; honest about uncertainty"],
            ["Reviewer", "OpenAI GPT-4-class", "Different training corpus = different blind spots than the Generator"],
            ["Fallback / budget overflow", "Google Gemini", "Cheaper per-token for the same task class"],
            ["Build-verification orchestration", "No LLM", "Pure code; tests speak for themselves"],
          ],
        },
      },
      {
        heading: "Why does the agent never push to main?",
        paragraphs: [
          "The agent opens PRs. It doesn't merge. It doesn't push directly. It runs Semgrep, Trivy, and Gitleaks against the diff in a Docker container before opening, and if any scan flags something, the PR is opened with a comment but not auto-approved.",
          "I want to stress this isn't safety theater. It's a workflow decision. The whole point is that oncall is a thing I review, not a thing that's already been done by an agent. The PR sits in a queue; I look at it when I look at it; I approve or close. If I trusted the agent more I'd auto-merge the easy ones. I don't, yet, and the version where I do is a different product.",
          "The Semgrep + Trivy + Gitleaks scans are the layer that catches the cases where the model produced a working fix that introduced a secret leak or a vulnerable dependency. Those are real failure modes, not hypothetical ones — anyone who's run an LLM at scale has seen a model regenerate code that originally had an API key inlined.",
        ],
      },
      {
        heading: "What does the dashboard actually show?",
        paragraphs: [
          "All the above rolls up to a per-repo health score from 0 to 100 — a weighted mix of build status, deploy success rate, security-scan findings, and the agent's track record of correct fixes on that repo. The score is the dashboard surface; the two-layer reasoning is the engine underneath.",
          "Health-score weighting is opinionated. Build green counts more than zero security findings — a repo with a flaky build but no Semgrep flags isn't healthy, just quiet. The score is meant to tell me \"which repo needs human attention right now,\" not \"which repo is winning at vibes.\"",
          "The thing I'd repeat in any future agent project: build the gate before you build the generator. The generator is the part that demos well. The gate is the part that determines whether the agent is something you can actually run unattended.",
        ],
      },
    ],
    pullQuotes: [
      {
        quote:
          "Models are sharper when the context is dense. A 3,000-token slice of relevant AST nodes routinely beats a 30,000-token \"here's the whole module, figure it out\" dump.",
      },
      {
        quote:
          "A diff that passes 200 tests at 70% confidence beats a diff that fails three tests at 90% confidence, every time.",
      },
      {
        quote:
          "Build the gate before you build the generator. The generator is the part that demos well. The gate is the part that determines whether the agent is something you can run unattended.",
      },
    ],
    citations: [
      {
        label: "Anthropic Messages API documentation",
        url: "https://docs.anthropic.com/en/api/messages",
        relevance: "Generator/Reviewer calls are Messages API",
      },
      {
        label: "Tree-sitter — parser generator",
        url: "https://tree-sitter.github.io/tree-sitter/",
        relevance: "Multi-language AST slicing",
      },
      {
        label: "Semgrep — static analysis",
        url: "https://semgrep.dev/docs/",
        relevance: "Runs in Docker against every proposed diff",
      },
      {
        label: "Trivy — vulnerability scanner",
        url: "https://aquasecurity.github.io/trivy/",
        relevance: "Dependency + secret scanning in the same pre-PR container",
      },
      {
        label: "Gitleaks — secret detection",
        url: "https://github.com/gitleaks/gitleaks",
        relevance: "Catches API keys or tokens regenerated into a proposed fix",
      },
    ],
    faq: [
      {
        q: "What is two-layer reasoning in an AI agent?",
        a: "A pattern where one LLM proposes a solution and a separate LLM scores that solution cold — without the first model's reasoning context. Both scores have to clear a threshold for the agent to act. It catches the failure mode where a model is confidently wrong.",
      },
      {
        q: "Why use tree-sitter instead of regex for AST context slicing?",
        a: "Regex per language doesn't scale. Tree-sitter has parsers for dozens of languages with the same API, so one slicer covers TypeScript, Python, Go, Ruby, Java, and Rust without per-language code paths. It also produces real AST nodes, so the slice is structurally coherent — function boundaries, class siblings — instead of arbitrary line ranges.",
      },
      {
        q: "Should an autonomous agent ever push to main directly?",
        a: "No. Open a PR. The agent's purpose is to reduce the work a human reviewer has to do, not to skip the review entirely. Auto-merging the easy cases is a separate product decision that requires more track record than two LLM scores can provide on their own.",
      },
      {
        q: "How do you stop a runaway AI agent from burning through credits?",
        a: "Per-repo monthly budget enforced at the LLM client layer. Every call increments a counter; the call gets refused once the budget is hit. The agent keeps watching the repo (free) but stops proposing fixes until next month. This survives CI oscillation, infinite-loop bugs, and the model deciding to retry forever.",
      },
      {
        q: "Is this approach specific to KeepItUp or generalizable?",
        a: "Generalizable. Any agent that takes an action with cost or risk benefits from a separate scoring pass before that action. The pattern works for code-fix agents, customer-support agents, content-moderation agents, anything where \"propose then verify\" maps onto the task.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // Cluster B — Long-running pipelines (Reel Farmer)
  // -------------------------------------------------------------------------
  {
    slug: "reel-farmer-resumable-pipelines",
    title:
      "Resumable pipelines: how Reel Farmer survives a crash mid-render",
    date: "2026-05-14",
    dateModified: "2026-05-14",
    readingMinutes: 8,
    description:
      "Reel Farmer is a six-stage Bun pipeline that takes long enough that crashes are inevitable. The trick isn't preventing crashes — it's making sure a crash never costs more than the seconds since the last completed stage. Deterministic file paths plus a SQLite checkpoint, no queues, no event buses.",
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
      "deterministic file paths",
    ],
    relatedProject: "reel-farmer",
    answerBox:
      "Every Reel Farmer run gets a UUID-shaped directory at data/runs/<run-id>/ where every artifact lands at a deterministic path. A SQLite checkpoint table records the status of each stage. bun run resume <run-id> finds the first non-completed stage and starts there. Idempotent stages plus deterministic paths equals resumable pipeline — no queues, no event buses.",
    lede:
      "Reel Farmer is a self-hosted Bun pipeline that turns YouTube videos into TikTok shorts across multiple authenticated accounts — yt-dlp downloads, Whisper transcribes, Gemini picks the clips, Remotion renders 1080×1920, stealth puppeteer uploads. The whole thing takes long enough that crashes are inevitable. The thing I had to get right wasn't any individual stage; it was making sure a crash never cost me more than the seconds since the last completed step.",
    sections: [
      {
        heading: "What does the run-id tree look like?",
        paragraphs: [
          "Every run gets a UUID-shaped directory at `data/runs/<run-id>/`. Every artifact lands at a deterministic path inside it. `src/raw.mp4`, `src/transcript.json`, `clips/01.mp4`, `renders/01.vertical.mp4`, `uploads/01.metadata.json`. The path is the contract.",
          "Any tool that wants to operate on a stage's output knows exactly where to look — no scanning, no indexing, no \"where did the rendering land\" query. `ls data/runs/<run-id>/` is a complete progress report. No dashboard needed when you're debugging at 1am.",
          "The pattern is older than I am — Unix pipelines have used filesystem paths as coordination primitives forever. What's specific to AI/media pipelines is that each stage's output is large and slow to regenerate, so deciding to commit to the path discipline pays back many times over the life of the pipeline.",
        ],
      },
      {
        heading: "How does the SQLite checkpoint table work?",
        paragraphs: [
          "Alongside the file tree sits a SQLite database with one row per (run-id, stage, status, timestamp, error). Status is one of `pending`, `running`, `completed`, `failed`.",
          "Every stage's first act is to mark its own row `running` with a start timestamp. Every stage's last act is to mark it `completed` — or `failed` with a stack trace. `bun run resume <run-id>` reads this table, finds the first non-completed stage, and starts from there. Failed status carries a retry counter; after three retries the run is marked dead and stays dead until I look.",
          "The schema is intentionally minimal. Run-id, stage name, status, started_at, finished_at, error_text, retry_count. Six columns. No JSON blobs of metadata, no foreign keys to other tables. The simpler the schema, the easier it is to reason about during a 1am debug.",
        ],
        table: {
          caption: "Checkpoint statuses and what they trigger",
          headers: ["Status", "Set when", "What resume does"],
          rows: [
            ["pending", "Run created", "Start the stage"],
            ["running", "Stage begins", "Treat as crashed — re-run (writes overwrite stale partial output)"],
            ["completed", "Stage finishes cleanly", "Skip — move to next stage"],
            ["failed", "Stage threw, retries exhausted", "Stop; require operator unblock"],
          ],
        },
      },
      {
        heading: "Why does idempotency matter so much?",
        paragraphs: [
          "The trick isn't catching exceptions and retrying within a stage — that's just nested try/catch and ends in cascading flake. The trick is: every stage is a pure function of its inputs.",
          "If a stage crashed before completing, its output files are absent or partial. Resume just re-runs the stage; because the file paths are deterministic, the second attempt overwrites the first attempt's debris without cleanup logic.",
          "Idempotent stages plus deterministic paths equals resumable pipeline. The SQLite table is only the index; the file tree is the source of truth. If you lost the SQLite file you could rebuild the table by listing the run-id directories and inferring stage completion from which output files exist. The table is a convenience, not a load-bearing component.",
        ],
      },
      {
        heading: "Why SQLite and not Redis or Postgres?",
        paragraphs: [
          "This pipeline runs on one box. There's no horizontal-scaling story. SQLite gives ACID guarantees with zero deployment overhead — the database file lives next to the run tree. A crashed pipeline's full state is one `tar -cz` away from being inspected elsewhere.",
          "Postgres would be over-engineered for the cardinality. Redis would lose the durability story; even AOF persistence doesn't beat a single SQLite file for \"all the state is in one place.\" If the pipeline ever grew to multiple machines I'd swap SQLite for Postgres; the abstraction is one file, and it's swappable.",
          "The Bun runtime ships with a built-in SQLite driver (`bun:sqlite`), so there's no extra dependency. Open the file, run the query, done. The driver is fast enough that the checkpoint writes are well under a millisecond and don't show up in pipeline-stage profiles.",
        ],
      },
      {
        heading: "How does the dashboard stay decoupled?",
        paragraphs: [
          "A separate Next.js app reads the SQLite run table and renders a per-run timeline. It writes nothing. The pipeline can crash, the dashboard keeps working. The dashboard can crash, the pipeline keeps working. The split is enforced by the fact that they share read-only state and nothing else.",
          "Read-only sharing is the cheapest IPC pattern you can use. No HTTP, no gRPC, no message broker. SQLite's WAL mode lets the dashboard read concurrently with the pipeline writing, so neither side ever blocks the other. This works because there's exactly one writer (the pipeline) and one reader (the dashboard).",
        ],
      },
      {
        heading: "What about the multi-account uploader?",
        paragraphs: [
          "The last stage is upload, and it has its own complexity: cookie/session management, stealth puppeteer to avoid bot detection, the TikTok compliance-flag dance. All of that lives behind a single `account-manager.ts` API. The pipeline calls `accountManager.upload(accountSlug, file, metadata)` and doesn't care how the cookie jar gets persisted or rotated.",
          "Hiding that complexity behind one function call is part of the resumability story too. If an upload fails, the checkpoint marks `running → failed`; resume tries the same account again, with the same persisted cookie state. The pipeline never sees the implementation details, and the implementation details can change without touching the pipeline.",
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
    pullQuotes: [
      {
        quote:
          "ls data/runs/<run-id>/ is a complete progress report. No dashboard needed when you're debugging at 1am.",
      },
      {
        quote:
          "Idempotent stages plus deterministic paths equals resumable pipeline. The SQLite table is only the index; the file tree is the source of truth.",
      },
    ],
    citations: [
      {
        label: "bun:sqlite — Bun's built-in SQLite API",
        url: "https://bun.sh/docs/api/sqlite",
        relevance: "Zero-dependency checkpoint database",
      },
      {
        label: "SQLite WAL mode documentation",
        url: "https://www.sqlite.org/wal.html",
        relevance: "Concurrent reader (dashboard) + writer (pipeline) without blocking",
      },
      {
        label: "yt-dlp — video downloader",
        url: "https://github.com/yt-dlp/yt-dlp",
        relevance: "First stage of the pipeline",
      },
      {
        label: "Remotion — programmatic video rendering",
        url: "https://www.remotion.dev/",
        relevance: "1080×1920 vertical render stage",
      },
      {
        label: "Whisper — OpenAI speech recognition",
        url: "https://github.com/openai/whisper",
        relevance: "Transcript stage feeds the Gemini clip-selection prompt",
      },
    ],
    faq: [
      {
        q: "What is a resumable pipeline?",
        a: "A pipeline where any stage can be re-run safely after a crash. The pipeline records its progress in a checkpoint store, and a resume command reads the checkpoint and skips work that's already finished. Resumability protects long-running jobs from cascading failure modes that would otherwise require restarting from zero.",
      },
      {
        q: "Why use deterministic file paths instead of a database for pipeline state?",
        a: "Files survive crashes, are inspectable with standard Unix tools, and don't require any service to be running to be readable. Combined with a small checkpoint table, the file tree becomes the source of truth and the table becomes a navigation index — losing the table is recoverable, losing the files isn't.",
      },
      {
        q: "How do you make a pipeline stage idempotent?",
        a: "Make the stage a pure function of its inputs and a deterministic location for its outputs. Re-running the stage overwrites any partial outputs from a previous crash without needing cleanup logic. Anything stateful (cookies, session tokens, rate-limit counters) lives in dedicated stores that the stage reads but doesn't mutate as a side effect.",
      },
      {
        q: "When does SQLite stop being the right choice for a checkpoint store?",
        a: "When the pipeline scales horizontally — multiple workers on multiple machines all writing checkpoints. SQLite is single-writer; once you need concurrent writes from different processes, swap it for Postgres. Until then SQLite gives ACID guarantees with zero ops overhead.",
      },
      {
        q: "What's the alternative to deterministic paths?",
        a: "A message queue or event bus where stages publish completions and downstream stages subscribe. Works, but adds operational surface area and indirection. For a single-box pipeline with a fixed stage order, paths-as-contracts is simpler and more debuggable.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // Cluster C — Vector search & embeddings (advance.al)
  // -------------------------------------------------------------------------
  {
    slug: "advance-al-vector-embeddings-job-matching",
    title:
      "Vector embeddings for job-matching — why pure cosine similarity isn't enough",
    date: "2026-05-14",
    dateModified: "2026-05-14",
    readingMinutes: 9,
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
      "1536 dimensions",
    ],
    relatedProject: "advance-al",
    answerBox:
      "Cosine similarity over OpenAI text-embedding-3-small (1536 dims) ranks candidates against a job, but \"candidate scored 0.83\" is unusable in a hiring dashboard. advance.al puts a 7-dimension explainable score on top — title, skills, experience, location, education, salary, availability — each with its own rules. Recruiters see why a candidate scored 78, not just the number.",
    lede:
      "advance.al is Albania's job marketplace and the only project on this site with paying users from day one. The matching engine has to answer two questions for every job posted: which candidates are best for this job, and why. Pure cosine similarity over OpenAI embeddings handles the first. It falls apart on the second.",
    sections: [
      {
        heading: "What do the embeddings actually do?",
        paragraphs: [
          "Every profile and every job gets vectorized with `text-embedding-3-small` (1536 dimensions) at write time. The text fed to the embedder is a normalized blob: title plus skills plus experience summary, and for jobs the responsibilities section. Albanian and English content live in the same vector space because the model handles both.",
          "Cosine similarity then ranks candidates against a job, or jobs against a candidate's wishlist. This is the easy half. Throw OpenAI's embedding API at it and you're done — assuming you don't mind your employer dashboard saying \"candidate scored 0.83\" with no explanation underneath.",
          "The choice of `text-embedding-3-small` over the larger `text-embedding-3-large` was a deliberate cost/quality call. The small model is 80% of the quality on benchmark tasks at roughly 25% of the cost per call, and the marginal benefit of larger embeddings on job-matching specifically didn't show up in our tests against held-out candidate/job pairs.",
        ],
      },
      {
        heading: "What does the 7-dimension explainable score look like?",
        paragraphs: [
          "Cosine alone is opaque. Recruiters can't show a hiring manager a number from 0 to 1 and call it a recommendation. So on top of cosine, every match also gets a seven-dimension breakdown: title match, skills match, experience match, location match, education match, salary fit, availability match.",
          "Each dimension has its own rules. Title is a normalized fuzzy match against role taxonomy. Skills use Jaccard against a controlled vocabulary. Experience is a year-band overlap. Location is a region or remote-status check. Education matches degree levels. Salary fit is range overlap. Availability matches start-date windows.",
          "These dimensions are explainable. The employer dashboard can show \"scored 78: title 32/40, skills 25/30, experience 12/15, location -1 (remote-only candidate, on-site role)\" next to the candidate row. A hiring manager looking at that number understands the breakdown without needing to trust the magic.",
        ],
        table: {
          caption: "The seven dimensions and their weights",
          headers: ["Dimension", "Max points", "How it's computed"],
          rows: [
            ["Title match", "40", "Normalized fuzzy against role taxonomy"],
            ["Skills match", "30", "Jaccard against controlled skill vocabulary"],
            ["Experience match", "15", "Year-band overlap with role's required range"],
            ["Location match", "10", "Region + remote-status compatibility"],
            ["Education match", "5", "Degree-level meets-or-exceeds"],
            ["Salary fit", "0 to +5", "Bonus if candidate range overlaps role offer"],
            ["Availability match", "0 to +5", "Bonus if start dates align"],
          ],
        },
      },
      {
        heading: "Why two layers and not one?",
        paragraphs: [
          "A single-formula score, whether it's pure cosine or a weighted aggregate of features, is a black box you can't tune without breaking everyone's existing rankings.",
          "Two layers let each one change independently. Cosine ranks; the dimension breakdown explains. If we want to up-weight skills relative to title next quarter, we change one weight in the breakdown formula and the cosine ranking is untouched.",
          "It also means the recommendation can survive the next OpenAI embedding-model deprecation. `text-embedding-3-small` is the current default; if it's replaced, every existing match's cosine number will move, but the dimension breakdown stays stable. The dashboard's UX doesn't suddenly shift on the day OpenAI ships a new model.",
        ],
      },
      {
        heading: "How does the bilingual category boost work?",
        paragraphs: [
          "Albanian and English don't share equal vocabulary depth in the same vector space. A profile in mostly-Albanian text can score lower against an English-only job description even when the candidate is genuinely qualified, just because the embedding model has seen less Albanian technical writing.",
          "The fix is a category-level boost. Every job and profile gets tagged into a coarse category (Software Engineering, Marketing, Sales, Operations, etc.). When a candidate and job share a category, their cosine score gets a small additive boost — enough to surface qualified bilingual candidates without distorting same-language ranking.",
          "This is a small fix with disproportionate effect. The first month after we shipped it, application rates from Albanian-only profiles went up roughly 18% against English-language listings, and the employer feedback on candidate quality didn't drop. The bias against bilingual candidates was real; the boost cancels it.",
        ],
      },
      {
        heading: "What does the notification fanout look like?",
        paragraphs: [
          "Every new job triggers an embedding worker on its own heartbeat process. The worker recomputes top-N matches and queues bilingual notifications through Resend. Each email has UTM tracking and a one-click unsubscribe token.",
          "Users get one email per matching job per day at most, deduped at the embedding worker (not at the email layer — by the time it hits Resend, it's too late to dedupe cheaply). The dedupe key is `(user_id, date, top-3-match-hash)` so a user doesn't get pinged twice for the same three openings.",
          "The worker runs on its own Node process under PM2 with a heartbeat that emails me if it stops for more than 10 minutes. Embeddings are the matching engine; if the worker dies silently for a day, the platform stops being useful immediately and no user-facing error makes it visible.",
        ],
      },
      {
        heading: "What's the test discipline for an embeddings-based engine?",
        paragraphs: [
          "288 Jest tests under a strict philosophy: no permissive matchers, no tautological assertions. `expect(result).toBeDefined()` is banned. Every test that touches the matching engine asserts on specific dimension scores from known-good candidate/job pairs.",
          "The held-out validation set is a few hundred manually-labeled pairs — \"this candidate genuinely fits this job\" vs. \"these two have similar keywords but the match is wrong.\" Any change to the embedding model, the weights, or the category boost gets run against the held-out set and has to maintain precision-at-N within tolerance.",
          "Playwright \"walker\" tests screenshot every public, jobseeker, employer, and admin route across desktop, iPhone 12, and Pixel 5 for every release. The matching engine is invisible to those tests, but the dashboard rendering that depends on it is covered.",
        ],
      },
      {
        heading: "What I'd do differently next time",
        paragraphs: [
          "I'd embed each section of a CV separately and average at query time, instead of one blob per profile. Long-form CVs lose nuance when flattened to 1536 dims; a candidate with strong recent senior experience and a long, irrelevant earlier career gets dragged toward the middle.",
          "This is on the roadmap. The fix is a schema change and a re-embedding pass — cheap compared to rebuilding the matching engine. The cost of re-embedding ~10,000 profiles at the current rate is in the tens of dollars; the benefit is per-section query weighting, which would let the engine emphasize the candidate's most-recent and most-relevant chunks instead of averaging across their whole career.",
        ],
      },
      {
        heading: "Why this exists",
        paragraphs: [
          "I built advance.al because Albania's job market lived in WhatsApp groups, Facebook walls, and a handful of legacy boards that look like 2010. A marketplace that could match a backend developer to a backend job without manually rewriting their CV twice was a thing nobody had bothered to ship.",
        ],
      },
    ],
    pullQuotes: [
      {
        quote:
          "Cosine alone is opaque. Recruiters can't show a hiring manager a number from 0 to 1 and call it a recommendation.",
      },
      {
        quote:
          "If a new OpenAI embedding model ships, every existing cosine number moves — but the dimension breakdown stays stable. The dashboard UX doesn't suddenly shift on model-release day.",
      },
    ],
    citations: [
      {
        label: "OpenAI text-embedding-3-small documentation",
        url: "https://platform.openai.com/docs/models/text-embedding-3-small",
        relevance: "1536-dim model used for all profile and job vectors",
      },
      {
        label: "OpenAI embeddings guide",
        url: "https://platform.openai.com/docs/guides/embeddings",
        relevance: "Reference for embedding API patterns and pricing",
      },
      {
        label: "Resend transactional email API",
        url: "https://resend.com/docs",
        relevance: "Bilingual notification fanout for every new job match",
      },
      {
        label: "Jaccard similarity (Wikipedia)",
        url: "https://en.wikipedia.org/wiki/Jaccard_index",
        relevance: "Skills-match dimension is Jaccard over controlled vocabulary",
      },
    ],
    faq: [
      {
        q: "Why not use only cosine similarity for job matching?",
        a: "Because cosine produces a single opaque number. A hiring manager can't act on \"0.83\" without an explanation. Putting a structured score on top of cosine — title, skills, experience, location, education, salary, availability — gives the user something they can reason about and override when the data is wrong.",
      },
      {
        q: "Which OpenAI embedding model should you use for semantic matching?",
        a: "text-embedding-3-small is the practical default for most matching tasks. It's roughly 80% of the quality of text-embedding-3-large at 25% of the cost. Use the larger model if you've measured a real precision-at-N improvement on a held-out set; otherwise the small model is the right choice.",
      },
      {
        q: "How do you handle bilingual content with one embedding model?",
        a: "Modern OpenAI embedding models work reasonably well across languages, but vocabulary depth differs by language and biases the cosine ranking. Add a coarse-category tag and a small additive boost when candidate and job share the same category — that compensates for the depth gap without distorting same-language ranking.",
      },
      {
        q: "How do you prevent dupe notifications when matches recompute?",
        a: "Dedupe at the worker, not at the email layer. Use a key like `(user_id, date, top-N-match-hash)` so the same user doesn't get pinged twice for the same three matching jobs. By the time the message hits the email service, it's too late to dedupe cheaply.",
      },
      {
        q: "What's the right test discipline for a vector-search engine?",
        a: "Banned permissive matchers and tautological assertions. Every test on the matching engine asserts specific dimension scores against a manually-labeled held-out set of candidate/job pairs. Any change to weights or model has to maintain precision-at-N within tolerance against that set.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // Cluster E — Database-level patterns (Pilates Studio)
  // -------------------------------------------------------------------------
  {
    slug: "prisma-adapter-swap-dev-prod-parity",
    title:
      "Same schema, different databases — the Prisma adapter swap in Pilates Studio",
    date: "2026-05-14",
    dateModified: "2026-05-14",
    readingMinutes: 8,
    description:
      "Pilates Studio runs better-sqlite3 in dev and Turso (libsql) in production. Same Prisma schema, same query code, same migration history — the adapter pattern handles the swap in two lines of config. This is the kind of dev/prod parity that used to require docker-compose'ing your prod database locally.",
    keywords: [
      "Prisma adapter",
      "Prisma driver adapters",
      "Turso libsql",
      "better-sqlite3",
      "dev prod parity",
      "Prisma ORM",
      "Vercel serverless Express",
      "SQLite production",
      "edge database",
    ],
    relatedProject: "pilates-studio",
    answerBox:
      "Prisma's driver-adapter pattern lets you swap the underlying database without changing schema or query code. Pilates Studio runs @prisma/adapter-better-sqlite3 in dev (in-process, no daemon) and @prisma/adapter-libsql in production (Turso, edge-replicated). One Express app, 21 Prisma models, 594 tests, deployed as a Vercel serverless catch-all.",
    lede:
      "Pilates Studio runs better-sqlite3 in dev and Turso (libsql) in production. Same Prisma schema, same query code, same migration history. The adapter pattern handles the swap in two lines of config. This is the kind of dev/prod parity I used to fake with docker-compose; now I don't need to.",
    sections: [
      {
        heading: "What changed in Prisma to make this possible?",
        paragraphs: [
          "For most of its history Prisma was a closed system — one query engine, one wire protocol, one set of supported databases per engine. The adapter pattern decoupled the query engine from the connection: PrismaClient now accepts an `adapter` field that handles the actual database conversation.",
          "`@prisma/adapter-libsql` ships with libsql. `@prisma/adapter-better-sqlite3` ships with better-sqlite3. The schema and migrations are identical between them. The swap happens in one place — `src/lib/db.ts` returns the right adapter based on an env var.",
          "This wasn't possible two years ago. The driver adapter API stabilized in late 2024 and it's been viable for production workloads since early 2025. Before that, you'd have had to use Prisma with the cloud-hosted Turso through a custom client, or write your own query layer.",
        ],
        table: {
          caption: "Adapter chosen per environment",
          headers: ["Environment", "Adapter package", "Underlying driver"],
          rows: [
            ["Dev (local)", "@prisma/adapter-better-sqlite3", "better-sqlite3 (in-process)"],
            ["CI tests", "@prisma/adapter-better-sqlite3", "better-sqlite3 (ephemeral file)"],
            ["Production", "@prisma/adapter-libsql", "libsql / Turso (edge-replicated)"],
          ],
        },
      },
      {
        heading: "Why does dev/prod parity actually matter?",
        paragraphs: [
          "The argument I used to hear was \"just run Postgres in Docker locally.\" This works until the day someone's M-series Mac can't run the libpq image fast enough, or a teammate's connection limits don't match prod, or a Docker Compose volume gets corrupted and you spend an hour resetting it instead of writing code.",
          "The adapter pattern says: prod uses Turso (edge-replicated libsql), dev uses better-sqlite3 (in-process, no daemon). Both speak the same SQL dialect. Migrations apply identically. Schema diffs get caught at write time by the same Prisma validator.",
          "The dev pain is now zero. There's no daemon to babysit; the database is a file in the repo's gitignore. Cold-start a new contributor: `pnpm install`, `pnpm prisma migrate dev`, `pnpm dev` — they're running the same schema as production in under a minute.",
        ],
      },
      {
        heading: "How does Express ship as a Vercel catch-all?",
        paragraphs: [
          "Pilates Studio's API ships as a Vercel serverless catch-all at `api/[[...path]].ts`. The same Express app runs as a long-lived server locally and as edge functions in production.",
          "The adapter swap is part of why this works. Locally, the Express app keeps a single better-sqlite3 connection alive for its uptime. In production, each Vercel function invocation gets its own libsql client, which is fine because libsql connections are cheap and stateless.",
          "One codebase, two runtime models, zero rewrites. The hot reload story is preserved (Express + nodemon in dev) and the deployment story is preserved (Vercel handles the function packaging). The middleware stack is the same. The route definitions are the same. Only the database connection lifetime changes, and that's hidden inside the adapter.",
        ],
      },
      {
        heading: "What does this trade away?",
        paragraphs: [
          "You're now committed to a SQLite-dialect surface. If you need Postgres-specific features — jsonb operators, listen/notify, range types, GIN indexes on jsonb — you can't have them.",
          "For an admin web plus mobile app plus booking API with 21 Prisma models, this is a non-issue. The data model is mostly bookings, classes, members, payments, audit trails. Plain SQL plus indexes covers all of it. For a different shape of product — analytics-heavy, full-text-search-heavy, geospatial — you'd want Postgres instead.",
          "The other trade is that Turso isn't yet as battle-tested as Postgres at high scale. For a boutique studio with thousands of bookings a month, this is irrelevant. For something with millions of writes per day, you'd want to look at the operational track record more carefully.",
        ],
      },
      {
        heading: "How does the audit middleware survive the swap?",
        paragraphs: [
          "An audit middleware records every admin write — actor, resource, IP, user-agent — but never blocks the real operation if the audit insert fails. That decision is independent of the adapter: it's a transaction-wrapping pattern that works the same on better-sqlite3 and libsql.",
          "Losing a booking to a slow audit table is not an acceptable failure mode. The audit insert is best-effort; if it errors, the error is logged and the booking still commits. This shows up in the metrics as \"audit insert failure rate\" which I check weekly; it's been 0% for months, but the safety net is the rule, not the exception.",
        ],
      },
      {
        heading: "What does the test surface look like?",
        paragraphs: [
          "The full test surface — Vitest for unit, supertest for API integration, Playwright for E2E against the admin web and the mobile app — runs against better-sqlite3.",
          "Production runs against Turso. The schema is the same. The migrations are the same. If a test passes locally, the prod behavior is one network hop different, not one database different. That's the whole point of the parity.",
          "594 tests across the four deployables (admin web, member mobile app, API, E2E). The 594 isn't a target; it's the count of asserts that came out of actually covering the booking flow, payment flow, waitlist promotion, audit middleware, RLS-equivalent service checks, and the bilingual UI strings.",
        ],
      },
      {
        heading: "Why this stack works for solo dev",
        paragraphs: [
          "I picked this stack because boutique studios get nickel-and-dimed by SaaS, and I wanted to prove a single solo dev could ship the same shape with the same testing rigor as a multi-engineer team. The adapter swap is one of three or four decisions that made it possible.",
          "The pattern generalizes. Any time you have a database that runs in both dev and prod, the historical answer was either \"run the same database in Docker\" (real but operationally expensive) or \"use SQLite in dev and Postgres in prod and pray the dialects match\" (cheap but bug-prone). The adapter pattern lets you write one schema and have it execute identically on two real backends. That's a meaningful upgrade.",
        ],
      },
    ],
    pullQuotes: [
      {
        quote:
          "Cold-start a new contributor: pnpm install, pnpm prisma migrate dev, pnpm dev — they're running the same schema as production in under a minute.",
      },
      {
        quote:
          "Losing a booking to a slow audit table is not an acceptable failure mode. The audit insert is best-effort; the booking still commits.",
      },
    ],
    citations: [
      {
        label: "Prisma driver adapters documentation",
        url: "https://www.prisma.io/docs/orm/overview/databases/database-drivers",
        relevance: "The pattern that makes the dev/prod swap possible",
      },
      {
        label: "@prisma/adapter-libsql",
        url: "https://www.npmjs.com/package/@prisma/adapter-libsql",
        relevance: "Production adapter for Turso",
      },
      {
        label: "Turso documentation",
        url: "https://docs.turso.tech/",
        relevance: "Edge-replicated libsql backing the production database",
      },
      {
        label: "better-sqlite3 (npm)",
        url: "https://www.npmjs.com/package/better-sqlite3",
        relevance: "In-process SQLite driver for dev",
      },
      {
        label: "Vercel serverless catch-all routing",
        url: "https://vercel.com/docs/functions",
        relevance: "How api/[[...path]].ts ships the whole Express app as one function",
      },
    ],
    faq: [
      {
        q: "What is the Prisma adapter pattern?",
        a: "A driver-decoupling layer added to PrismaClient in late 2024. Instead of Prisma owning the database connection, you pass an adapter that handles the connection — better-sqlite3, libsql, Neon, PlanetScale, D1, etc. Schema and queries stay the same; the adapter swaps based on environment.",
      },
      {
        q: "Can you use SQLite in production with Prisma?",
        a: "Yes, via Turso (libsql) and the @prisma/adapter-libsql package. Turso is an edge-replicated libsql database with primary/replica regions. For a workload that fits SQLite — mostly small-to-medium data, reads-dominant, no Postgres-specific features needed — it's a viable production database with low operational cost.",
      },
      {
        q: "When does the adapter swap break down?",
        a: "When your two adapters speak different SQL dialects. better-sqlite3 ↔ libsql works because both speak SQLite. Trying to swap between SQLite-dialect locally and Postgres-dialect in prod via the adapter pattern is not what it's designed for — you'd hit dialect divergence on jsonb, conflict resolution, lock semantics, and migrations.",
      },
      {
        q: "Why ship Express as a Vercel serverless catch-all instead of a long-running server?",
        a: "To get one codebase that runs in both worlds. `api/[[...path]].ts` exports the Express app as a handler; Vercel wraps it as a function. Locally, the same Express runs under nodemon as a long-lived server. The middleware stack, the route definitions, and the database adapter all stay identical.",
      },
      {
        q: "How many Prisma models is too many?",
        a: "Pilates Studio has 21 and they're all earning their keep — bookings, members, classes, instructors, packages, payments, audit logs, the rest. The number itself isn't the concern; what matters is whether each model corresponds to a real entity in the domain or is being introduced to work around a query limitation. The latter is the smell, not a model count.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // Cluster E — Database-level patterns (CleanSlate)
  // -------------------------------------------------------------------------
  {
    slug: "rls-subscription-gate-cleanslate",
    title:
      "RLS as a subscription gate — letting Postgres turn off trial accounts for you",
    date: "2026-05-14",
    dateModified: "2026-05-14",
    readingMinutes: 8,
    description:
      "CleanSlate's subscription expiry path is the cleanest part of the codebase, because there is no path. When a user's trial runs out, the UI doesn't run a check. The database stops accepting INSERTs. The read-only state is automatic.",
    keywords: [
      "Postgres RLS",
      "Supabase RLS",
      "row level security",
      "subscription gate",
      "trial expiry",
      "policy-driven access",
      "Supabase patterns",
      "RLS subscription",
      "LemonSqueezy webhook",
    ],
    relatedProject: "cleanslate",
    answerBox:
      "Move the subscription-active check into Supabase RLS policies. When a trial ends, INSERT and UPDATE policies stop matching. The database refuses writes — no UI check needed, no race condition, no privileged API path. SELECT still works (read-only state is automatic). The constraint is adjacent to the data, not to the UI.",
    lede:
      "CleanSlate is a €20-flat operating system for solo cleaners in Germany. The subscription expiry path is the cleanest part of the codebase, because there is no path. When a user's trial runs out, the UI doesn't run a check; the database stops accepting INSERTs. The read-only state is automatic.",
    sections: [
      {
        heading: "What does the usual subscription gate look like?",
        paragraphs: [
          "A `useEffect` on every authenticated page that checks if the user's subscription is active and redirects if not. This is a race-condition factory. The check runs after the page mounts, so for a few hundred milliseconds the UI shows the gated content. Every component that wants to do anything destructive needs its own check.",
          "And the database doesn't care. A clever user with the right knowledge could hit the API directly and write a row regardless of what the UI thinks. The whole thing is correct-by-discipline rather than correct-by-construction, and discipline is the kind of thing that decays as the codebase grows.",
        ],
      },
      {
        heading: "How does the RLS-based approach work?",
        paragraphs: [
          "The check moves to Supabase RLS. Every INSERT and UPDATE policy includes a clause like `EXISTS (SELECT 1 FROM subscriptions WHERE user_id = auth.uid() AND status = 'active' AND current_period_end > NOW())`.",
          "When the period ends, the policy stops matching. INSERTs fail at the database. UPDATEs are blocked. SELECT is still allowed because the user can read their own data — they just can't change it.",
          "The UI doesn't need a single line of subscription-checking code. If a write fails, it fails the same way any RLS violation fails, and the existing error handling shows \"your subscription has expired\" instead of \"you don't have permission.\"",
        ],
        table: {
          caption: "Where the check lives in each approach",
          headers: ["Approach", "Check lives in", "Race condition?", "Bypassable via direct API?"],
          rows: [
            ["useEffect redirect", "React component", "Yes — content flashes briefly", "Yes — UI is the only gate"],
            ["API middleware", "Server route handler", "No, but every route must remember it", "No, if every route uses it"],
            ["RLS policy", "Postgres", "No", "No — there is no privileged path"],
          ],
        },
      },
      {
        heading: "Why is this more correct?",
        paragraphs: [
          "The constraint is now adjacent to the data, not to the UI. Adding a new write endpoint doesn't risk forgetting the check. The check exists at the storage layer; any code path that writes to the storage layer is automatically gated.",
          "There's no race condition. The policy is evaluated at every query, in the same transaction as the write. A direct API call bypassing the UI gets the same treatment. There's no privileged path.",
          "And it's centralized. If you need to change the subscription rule — say, add a grace period — you change the policy in one place and every gated write now respects it. Compare to chasing down twenty `useEffect` checks scattered across the React tree.",
        ],
      },
      {
        heading: "What about the cron half?",
        paragraphs: [
          "Subscription renewal happens through four Vercel cron endpoints — trial reminders, overdue invoices, recurring job generation, pre-job SMS. The operator never logs in to do admin. The crons run on a schedule, but if they don't run, the database state stays correct anyway, because the RLS policy doesn't depend on a job firing.",
          "This is the deeper benefit. A scheduled-job-based gate is only as correct as the scheduler. If the cron fails for a day, a user whose trial ended yesterday can keep writing. With RLS, the check is evaluated at every write — the cron is for proactively notifying the user, not for actually closing the gate.",
          "LemonSqueezy webhooks update the `subscriptions` table when payments succeed. Telnyx sends SMS when the cron fires. Resend sends emails. The database is the source of truth; everything else is glue.",
        ],
      },
      {
        heading: "What does this trade away?",
        paragraphs: [
          "You're now committed to Postgres plus RLS. Switching to a NoSQL backend would be a rewrite. RLS policies are also harder to test in isolation than service-layer checks — Supabase has tools for it, but it's not as ergonomic as writing a unit test for a TypeScript function.",
          "And if the policy is wrong, the failure mode is silent. A write just fails. There's no exception with a stack trace pointing at a missing check. You discover the bug when a user complains. The fix for this is good integration tests that exercise the gate paths explicitly — covering at minimum \"can-write while active,\" \"cannot-write while expired,\" and \"can-read while expired.\"",
        ],
      },
      {
        heading: "How does this fit with the rest of CleanSlate's architecture?",
        paragraphs: [
          "Every architectural rule is enforced with no exceptions: route files dispatch to services, services own all data ops, components never touch Supabase, money is always cents, phones always E.164, RLS scopes every query to the user.",
          "RLS as a subscription gate is the same rule applied to time — the policy is the gate, not a UI check pretending to be one. The discipline product pattern means rules are architectural, not procedural. A new feature can't accidentally bypass the subscription check because the database physically refuses the write.",
          "The marketing site has its own discipline. Datenschutz, Impressum, AGB, MDX-driven blog and ratgeber, a `/rechner` cost calculator, all live in a `(marketing)` route group separated from the authenticated `(app)` group. The split is structural — you can't accidentally render a marketing page that requires auth, or render an auth page on the marketing domain.",
        ],
      },
      {
        heading: "Why discipline is the product",
        paragraphs: [
          "I built CleanSlate as a discipline product. The product isn't the cleaning-business software; it's the architectural rigor that lets a single solo dev maintain it without breaking things.",
          "RLS as a subscription gate is one example. Service-layer enforcement of \"components never touch Supabase\" is another. Money-in-cents and phones-in-E.164 are boundary types that survive every refactor because they're not a convention, they're a type signature. These all add up to a codebase where the wrong thing isn't just unusual — it's structurally impossible.",
        ],
      },
    ],
    pullQuotes: [
      {
        quote:
          "The check moves to Postgres. INSERTs fail at the database. The UI doesn't need a single line of subscription-checking code.",
      },
      {
        quote:
          "A scheduled-job-based gate is only as correct as the scheduler. With RLS, the check is evaluated at every write — the cron is for notifying users, not for actually closing the gate.",
      },
    ],
    citations: [
      {
        label: "Supabase Row Level Security guide",
        url: "https://supabase.com/docs/guides/database/postgres/row-level-security",
        relevance: "The mechanism that gates writes after trial expiry",
      },
      {
        label: "PostgreSQL Row Security Policies (official docs)",
        url: "https://www.postgresql.org/docs/current/ddl-rowsecurity.html",
        relevance: "Authoritative reference for the underlying Postgres feature",
      },
      {
        label: "Vercel Cron Jobs documentation",
        url: "https://vercel.com/docs/cron-jobs",
        relevance: "The four scheduled endpoints that run admin without the operator",
      },
      {
        label: "LemonSqueezy API webhooks",
        url: "https://docs.lemonsqueezy.com/api/webhooks",
        relevance: "Source of subscription status changes",
      },
      {
        label: "Telnyx SMS API",
        url: "https://developers.telnyx.com/docs/messaging",
        relevance: "Pre-job SMS reminders to clients",
      },
    ],
    faq: [
      {
        q: "What is Row Level Security in Postgres?",
        a: "A Postgres feature that lets you attach policies to tables so that SELECT, INSERT, UPDATE, and DELETE operations are evaluated against per-row predicates. Combined with auth.uid() in Supabase, RLS becomes a way to enforce per-user, per-tenant, or per-subscription access rules at the database layer rather than the application layer.",
      },
      {
        q: "Is RLS slow?",
        a: "Not measurably for most workloads. The policy expression is evaluated as part of the query plan and is subject to the same indexes the underlying table uses. The overhead of a policy that does an EXISTS check on a subscriptions table indexed by user_id is a single index lookup per row, which is well under a millisecond.",
      },
      {
        q: "Can RLS replace all server-side authorization?",
        a: "It can replace the parts that are about \"is this user allowed to touch this row.\" It doesn't replace business logic that depends on multiple rows at once, or workflow state machines that need orchestration. Use RLS for row-level access; use services for everything else.",
      },
      {
        q: "How do you test RLS policies?",
        a: "Integration tests that run as a specific user (via Supabase's setRole or by using a real JWT) and assert that a write succeeds when policy should allow and fails when it shouldn't. Supabase has a testing helper called pg-tap that lets you run policy tests in SQL. Either approach beats trying to unit-test policies in isolation.",
      },
      {
        q: "What's the minimum cron coverage for a SaaS that runs itself?",
        a: "Four jobs: trial reminders (so users know their trial ends in N days), overdue invoices (so unpaid users get nudged), recurring task generation (so the next week's work appears on schedule), and pre-event notifications (so end-customers get reminded). All four run on Vercel cron in CleanSlate; the operator never logs in to do admin.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // Cluster — Decision pages (Layer 1, batch 1 of 2)
  // -------------------------------------------------------------------------
  {
    slug: "hiring-freelance-full-stack-engineer-germany-2026-checklist",
    title:
      "Hiring a freelance full-stack engineer in Germany — a 2026 evaluation checklist",
    date: "2026-05-14",
    dateModified: "2026-05-14",
    readingMinutes: 9,
    description:
      "Most checklists for hiring freelance engineers in Germany were written by recruiters who haven't shipped code in eight years. Here's what to actually look for — code, tests, deploys, security, and the two German-market specifics nobody warns clients about.",
    keywords: [
      "hire freelance full-stack engineer Germany",
      "freelance developer Germany checklist",
      "freelance software developer Kiel",
      "freelance engineer evaluation",
      "Scheinselbstständigkeit",
      "freelance engineer due diligence",
      "freelance developer hiring",
    ],
    answerBox:
      "Ask for a public repo and read the most recent commit diff. Ask what they last broke and how they noticed. Verify they ship with tests, not screenshots. Confirm Scheinselbstständigkeit risk is mitigated by contract structure. Check that they own the deploy, not just the code. Worked example: every project on jurgenhalili.dev was solo across stack, with public tests and CI.",
    lede:
      "Most checklists for hiring freelance engineers are written by recruiters who haven't shipped a feature in eight years, so they end up with twenty bullet points about \"communication skills\" and zero about whether the person can actually carry a project alone. This is the one I wish more clients used before they emailed me.",
    sections: [
      {
        heading: "Start with the repo, not the portfolio",
        paragraphs: [
          "Ask for a public repo. Not a portfolio site, not a deck — a repo. Production work hides behind NDAs, but anyone who's been doing this five years has at least one weekend project on GitHub they're not embarrassed about.",
          "Open the most recent commit and read the diff. If it's a thousand lines of generated boilerplate, or `Update README.md` from six months ago, you have your answer. Real working engineers have commit histories that show small, focused changes with clear messages — and code that reflects thought, not just typing.",
          "The portfolio is for marketing. The repo is for evaluation. If a candidate can't produce something they're willing to show you the source of, the gap between what they claim and what they can actually do is the gap you're paying for.",
        ],
      },
      {
        heading: "Ask what they last broke and how they noticed",
        paragraphs: [
          "Real engineers have a story about a 3 a.m. Sentry alert or a Supabase RLS policy they wrote backwards. Anyone who answers \"I don't really break things\" is either lying or hasn't shipped enough to count.",
          "The story matters less than the structure. Did they have monitoring in place to notice? Did they roll back cleanly? Did they write a postmortem, even an informal one, that captured why it happened? An engineer who can describe their last production incident calmly and specifically is an engineer who's been through enough of them to have a process.",
          "Be wary of perfect track records. Software has bugs. The discipline is in catching them before users do, and fixing the root cause when you don't.",
        ],
      },
      {
        heading: "Verify they ship with tests, not screenshots",
        paragraphs: [
          "Screenshots are a hiring signal worth approximately zero. Anyone with two hours and Figma can produce a polished UI. The question is whether the code under it has any test coverage, any CI pipeline, any deploy automation.",
          "Concrete numbers help. \"This project has 594 tests across unit, integration, and E2E\" is a verifiable claim — you can look at the CI badge and the test command. \"I write tests where appropriate\" is not a claim, it's a hedge.",
          "Test discipline scales. A freelance engineer who writes tests on their own work writes tests on yours. A freelance engineer who doesn't write tests on their own work won't suddenly start because you asked nicely.",
        ],
      },
      {
        heading: "Check that they own the deploy, not just the code",
        paragraphs: [
          "Plenty of freelancers can write code that works on their laptop. Far fewer can take it from `git push` to production with monitoring, error tracking, and a rollback story. Ask them to walk you through how a typical deploy of theirs goes.",
          "Specifics to listen for: which platform (Vercel, Render, Fly, AWS, a VPS), how environment variables get managed, what happens if the deploy fails halfway, how they get notified of errors after launch. Vague answers here mean the engineer hands off a `git push` and lets you figure out the rest.",
          "A freelancer who owns the deploy means one person to call when something breaks. A freelancer who only owns the code means you're now the DevOps team.",
        ],
      },
      {
        heading: "The two German-market specifics nobody warns clients about",
        paragraphs: [
          "**Scheinselbständigkeit.** Germany has strict rules about disguised employment. If your freelancer works exclusively for you, on your premises, with your equipment, on your schedule, the Deutsche Rentenversicherung can retroactively classify them as your employee — and you owe back-taxes, social-insurance contributions, and potential penalties.",
          "Mitigation: the freelancer should have multiple clients (or be clearly able to). The contract should specify deliverables, not hours-per-day. They use their own equipment. They control their work schedule. None of this is exotic — these are the standard markers of self-employed work — but a lot of clients sign hourly contracts with a single freelancer who only works for them, and that's the audit trigger.",
          "**Stundensatz vs. Werkvertrag.** German freelance contracts split into two main shapes. Stundensatz (hourly rate) is straightforward — you pay per hour worked, the freelancer logs time. Werkvertrag (deliverable contract) is fixed-price for a scoped piece of work. Both are valid; both have different risk profiles. Hourly favors trust-and-time; deliverable favors a clear spec but penalizes scope changes. Pick the one that matches how clearly the work can be defined upfront.",
        ],
      },
      {
        heading: "Red flags vs green flags — a quick table",
        paragraphs: [
          "Use this as a filter when you have ten candidates to compare.",
        ],
        table: {
          caption: "Quick filter when comparing freelance candidates",
          headers: ["Signal", "Green flag", "Red flag"],
          rows: [
            ["Repo", "Public, recent commits, real diffs", "Private only / outdated / generated boilerplate"],
            ["Tests", "Specific count + CI badge", "\"I write tests where appropriate\""],
            ["Deploy", "Owns end-to-end, walks you through pipeline", "Hands off git push, leaves rest to client"],
            ["Last incident", "Specific story with root cause + fix", "\"I don't really break things\""],
            ["Stack depth", "Shipped multiple projects in claimed stack", "Mentions every tech they've ever opened"],
            ["Communication", "Asks scoping questions before quoting", "Quotes immediately on any project"],
            ["Scheinselbständigkeit", "Multiple clients, deliverable-based contract", "Hourly, single client, full-time schedule"],
          ],
        },
      },
      {
        heading: "What this looks like in practice",
        paragraphs: [
          "Every project on jurgenhalili.dev is solo across stack, with the kind of artifacts a hiring client should want to see: a public repo where possible, tests that actually run in CI (594 in Pilates Studio, 288 in advance.al), security scans in the deploy pipeline (Semgrep + Trivy + Gitleaks in KeepItUp), and deploys owned end-to-end on Vercel or Render. The case studies on this site exist specifically so the evaluation can happen against real work rather than against a deck.",
          "If you're hiring a freelance full-stack engineer in Germany, you don't have to use my checklist. But you should use a checklist that resembles it, and you should run candidates through it before signing.",
        ],
      },
    ],
    pullQuotes: [
      {
        quote:
          "Real engineers have a story about a 3 a.m. Sentry alert or a Supabase RLS policy they wrote backwards. Anyone who answers \"I don't really break things\" is either lying or hasn't shipped enough to count.",
      },
      {
        quote:
          "Test discipline scales. A freelance engineer who writes tests on their own work writes tests on yours. A freelance engineer who doesn't write tests on their own work won't suddenly start because you asked nicely.",
      },
      {
        quote:
          "A freelancer who owns the deploy means one person to call when something breaks. A freelancer who only owns the code means you're now the DevOps team.",
      },
    ],
    citations: [
      {
        label: "Deutsche Rentenversicherung — Scheinselbstständigkeit (official guide)",
        url: "https://www.deutsche-rentenversicherung.de/DRV/DE/Experten/Arbeitgeber-und-Steuerberater/summa-summarum/Lexikon/S/scheinselbststaendigkeit.html",
        relevance: "Authoritative reference for the disguised-employment risk",
      },
      {
        label: "IHK guide to Werkvertrag (German freelance contract types)",
        url: "https://www.ihk.de/themenfelder/recht-steuern/arbeitsrecht/werkvertrag",
        relevance: "Standard German legal framing of fixed-deliverable freelance contracts",
      },
      {
        label: "GitHub — jurgenhalili public profile",
        url: "https://github.com/jxrgenn",
        relevance: "Public-repo evaluation surface for one specific candidate",
      },
    ],
    faq: [
      {
        q: "Where can I find a good freelance full-stack engineer in Germany?",
        a: "Look first at directories that pre-vet (Toptal, Malt, freelance.de), then at platforms with public work (GitHub profiles, personal portfolio sites with real case studies). The bar is whether you can evaluate real production code, real tests, and real deploys — not just a marketing page.",
      },
      {
        q: "What hourly rate should I expect to pay for a freelance full-stack engineer in Germany?",
        a: "Rates vary widely by stack, seniority, and engagement length. For experienced full-stack work (Next.js, React Native, AI integration), Stundensatz ranges in 2026 are typically €70-€150+ depending on specialization, location, and whether you're contracting through an agency or directly.",
      },
      {
        q: "How do I avoid Scheinselbständigkeit when hiring a freelance developer?",
        a: "Structure the contract around deliverables, not hours. Confirm the freelancer has or can have multiple clients. Don't require them to work exclusively for you, on your premises, with your equipment. The Deutsche Rentenversicherung documents the criteria publicly; align your engagement with what they describe as legitimate freelance work.",
      },
      {
        q: "Should I hire a freelance engineer or an agency for an MVP?",
        a: "Depends on scope clarity. A clearly-scoped MVP with one decisive product owner runs faster with a single experienced freelancer — no internal coordination tax. A multi-stream project with parallel UI/backend/DevOps needs typically wants an agency. The crossover point is roughly the point where one human can no longer hold the whole product in their head.",
      },
      {
        q: "What's the biggest red flag when hiring a freelance developer?",
        a: "An immediate quote without scoping questions. A freelancer who quotes before they understand the problem is selling time, not solving the problem. The best freelance engineers ask uncomfortable scoping questions before they give you a number.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    slug: "hiring-freelance-nextjs-developer-7-questions",
    title:
      "Hiring a freelance Next.js developer — 7 questions that filter the field",
    date: "2026-05-14",
    dateModified: "2026-05-14",
    readingMinutes: 8,
    description:
      "Most Next.js freelancers list \"Next.js, React, Tailwind\" on their profile and have shipped exactly one tutorial app. Here are seven questions that filter the people who actually understand the framework from the people who copy-pasted starter templates.",
    keywords: [
      "hire freelance Next.js developer",
      "freelance Next.js Germany",
      "Next.js app router freelancer",
      "Next.js 16 developer hire",
      "freelance React Server Components developer",
      "Next.js technical interview",
    ],
    answerBox:
      "Ask about App Router vs Pages Router decisions, Server Components vs Client Components boundaries, how they handle data fetching at the edge, what they do about CSP for blob workers, how they ship a sitemap, and how they think about ISR vs SSG vs SSR. Seven questions, three minutes each — anyone who's actually shipped Next.js can answer them; anyone who hasn't will stall.",
    lede:
      "Most Next.js freelancers list \"Next.js, React, Tailwind\" on their profile and have shipped exactly one tutorial app. The gap between people who've copy-pasted the starter template and people who've actually shipped Next.js to production is visible in about three minutes if you ask the right questions.",
    sections: [
      {
        heading: "Why this filter matters",
        paragraphs: [
          "Next.js 16 is a different framework than Next.js 12 was. The App Router changed how data flows, how caching works, how middleware composes, how you ship images. A freelancer who learned Next.js in 2021 and hasn't kept up doesn't know the same framework you're hiring for.",
          "These seven questions are a quick proxy for \"has this person actually shipped recent Next.js production code.\" They're not a substitute for evaluating real work — they're a substitute for the first phone screen where you're trying to filter ten profiles down to three.",
        ],
      },
      {
        heading: "1. App Router vs Pages Router — which would you pick today and why?",
        paragraphs: [
          "There's no single correct answer, but there is a wrong category of answer. \"App Router because it's newer\" tells you they haven't shipped either. \"Pages Router because I'm used to it\" tells you they've shipped one and stopped learning.",
          "A real answer engages with trade-offs: App Router gives you nested layouts, Server Components, streaming, and the modern data-fetching model — but legacy migrations are non-trivial and some libraries still lag behind. Pages Router is the safer choice for a project that needs `getServerSideProps` semantics or a long stable surface. The right answer depends on what's being shipped.",
        ],
      },
      {
        heading: "2. When do you reach for a Client Component instead of a Server Component?",
        paragraphs: [
          "Server Components are the default in App Router. Client Components are an opt-in via `\"use client\"`. The freelancer should be able to articulate when each is appropriate: Client when you need event handlers, browser APIs, state hooks, or any third-party library that touches `window`; Server for data-fetching, secrets-handling, and rendering that doesn't need interactivity.",
          "A bad answer: \"I always use client components, it's easier.\" That's a freelancer who hasn't internalized the model and will ship a slower, more expensive app than necessary.",
        ],
      },
      {
        heading: "3. How do you handle data fetching at the edge?",
        paragraphs: [
          "Edge functions have constraints — no Node-specific APIs, smaller bundle limits, different cold-start characteristics. A freelancer should know when to deploy a route at the edge vs in a regional function.",
          "The depth here is whether they can talk about Fluid Compute (the current default), regional pinning, and the trade between latency to user and latency to database. \"Edge is always faster\" is wrong; \"edge is faster for static or near-cache data and slower when you have a database in a single region\" is right.",
        ],
      },
      {
        heading: "4. What's your CSP look like for a real app?",
        paragraphs: [
          "Content Security Policy is one of those topics where a freelancer either knows because they've shipped a real production app with one, or has never thought about it. Ask what their default CSP includes.",
          "Specific things to listen for: `blob:` in `script-src` if they're using Web Workers (R3F, Lottie, anything with a worker pool); `connect-src` entries for any third-party API; `worker-src` for explicit worker permissions. A freelancer who has shipped Three.js or a heavy interactive frontend will know exactly why these matter, because they got bitten by a CSP block on production at some point.",
        ],
      },
      {
        heading: "5. How do you ship a sitemap?",
        paragraphs: [
          "Trivial-seeming question, telling answer. Next.js 16 has a built-in `sitemap.ts` convention in the App Router. A freelancer who knows this will mention `MetadataRoute.Sitemap` and the fact that the route gets statically generated.",
          "A freelancer who has only shipped React without Next.js will improvise — maybe `next-sitemap` package, maybe a custom script. Both work but neither uses what the framework now provides natively.",
        ],
      },
      {
        heading: "6. ISR vs SSG vs SSR vs Edge — when do you pick each?",
        paragraphs: [
          "Four rendering models, all valid, each with a sweet spot. A freelancer should be able to give a one-sentence use case for each.",
          "SSG: pages that change rarely and have known input space at build time (marketing pages, docs). SSR: pages that depend on per-request data (logged-in dashboards, personalized content). ISR: pages that change occasionally and have a long tail of variants (large blog/catalog with per-page revalidation). Edge: pages where geographic latency matters more than database proximity (auth gates, A/B tests, geolocation). The depth of the answer is the signal.",
        ],
        table: {
          caption: "Rendering model quick-reference",
          headers: ["Model", "Best for", "Cost profile"],
          rows: [
            ["SSG", "Marketing, docs, rarely-changing content", "Build-time only — cheapest at runtime"],
            ["ISR", "Large content sites with per-page revalidation", "Cheap at runtime, slight cost on revalidation"],
            ["SSR", "Logged-in / per-request personalized pages", "Per-request compute"],
            ["Edge", "Auth, geo, A/B — anywhere latency dominates", "Per-request, lower latency, constrained runtime"],
          ],
        },
      },
      {
        heading: "7. What's the worst Next.js gotcha you've hit in production?",
        paragraphs: [
          "Open-ended; the answer reveals depth. Specific gotchas you'd hope to hear about: a hydration mismatch from server-rendering a `Date.now()`; a Server Component accidentally importing a Client-only package and breaking the build; a middleware redirect loop because of a missing condition; a CSP block on a blob worker; an image-optimization quota blown by a forgotten `priority` flag.",
          "A freelancer with no production scars on Next.js hasn't shipped enough to know how the framework actually behaves under load. That's not disqualifying — junior people exist and are worth hiring — but it's information about what kind of project they're ready for.",
        ],
      },
      {
        heading: "Using these seven questions",
        paragraphs: [
          "Five minutes each, 35 minutes total for a deep screen. Most people you talk to will stall on at least three. The ones who don't are the ones worth a second call.",
          "The candidates I'd hire are the ones who push back on at least one of the questions — \"actually, you'd want SSR there because…\" — because they're engaging with the framework as a real tool, not as a list of bullet points on their CV.",
        ],
      },
    ],
    pullQuotes: [
      {
        quote:
          "Most Next.js freelancers list \"Next.js, React, Tailwind\" on their profile and have shipped exactly one tutorial app.",
      },
      {
        quote:
          "The candidates I'd hire are the ones who push back on at least one of the questions, because they're engaging with the framework as a real tool, not as a list of bullet points on their CV.",
      },
    ],
    citations: [
      {
        label: "Next.js App Router documentation",
        url: "https://nextjs.org/docs/app",
        relevance: "The current default routing model",
      },
      {
        label: "React Server Components (official explanation)",
        url: "https://react.dev/reference/rsc/server-components",
        relevance: "Why default-Server-Components matters in App Router",
      },
      {
        label: "MDN — Content Security Policy",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP",
        relevance: "Authoritative reference for production CSP knowledge",
      },
      {
        label: "Next.js sitemap.ts metadata API",
        url: "https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap",
        relevance: "Native sitemap generation in Next 16",
      },
      {
        label: "Vercel Fluid Compute",
        url: "https://vercel.com/blog/fluid-compute",
        relevance: "Current default for Vercel functions",
      },
    ],
    faq: [
      {
        q: "Should a freelance Next.js developer know both App Router and Pages Router?",
        a: "Yes — App Router for new projects and current best practices, Pages Router for legacy maintenance and migration work. A freelancer who only knows one will struggle on any project that doesn't perfectly fit their experience.",
      },
      {
        q: "What's a fair rate for a freelance Next.js developer in Germany?",
        a: "Rates depend on seniority, stack adjacency (AI integration, RN, BC), and engagement length. Senior Next.js Stundensatz in Germany typically falls in a wide band; ask for a proposal scoped to your project rather than a number in the abstract.",
      },
      {
        q: "How long does it take to ship a production Next.js app?",
        a: "Depends entirely on scope. A landing site with a contact form: a day or two. A logged-in dashboard with auth, database, and basic CRUD: 2-4 weeks for a working solo dev. A full multi-tenant SaaS with billing, RLS, cron jobs, and integration testing: 2-4 months. Anyone giving you a fixed answer without scoping is selling, not estimating.",
      },
      {
        q: "Do I need a Next.js specialist, or will a general React developer work?",
        a: "General React covers Client Components and the UI layer. It doesn't cover Server Components, the App Router data model, middleware, edge functions, image optimization, or the metadata API. If your project uses any of those (and a modern Next.js project should), hire someone who's shipped Next.js, not just React.",
      },
      {
        q: "What's the difference between a Next.js developer and a JAMstack developer?",
        a: "Substantial overlap, but Next.js has its own runtime model (server-rendering, ISR, edge) that goes beyond the static-first JAMstack pattern. A JAMstack-only developer will default to SSG everywhere; a Next.js developer should pick the rendering model per route based on the data shape.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    slug: "hiring-freelance-ai-engineer-2026-portfolio-flags",
    title:
      "Hiring a freelance AI engineer in 2026 — portfolio red flags and green flags",
    date: "2026-05-14",
    dateModified: "2026-05-14",
    readingMinutes: 8,
    description:
      "Half the freelance \"AI engineers\" on the market wrapped one OpenAI API call in a Streamlit app and called themselves senior. Here are the portfolio signals that separate people who've shipped agents and pipelines from people who've shipped demos.",
    keywords: [
      "hire freelance AI engineer",
      "freelance AI developer Germany",
      "freelance LLM developer",
      "AI engineer portfolio evaluation",
      "freelance agent developer",
      "freelance ML engineer hire",
      "AI engineer red flags",
    ],
    answerBox:
      "Look for production agents (not demos), explicit handling of model failure modes, multi-provider routing, cost budgeting, and a clear answer to \"what happens when the LLM is wrong.\" Red flags: a single Streamlit/Gradio app, no evaluation framework, no cost telemetry, claims of \"AGI-level\" anything. Green flags: real PRs the agent opened, real test discipline, named failure modes.",
    lede:
      "Half the freelance \"AI engineers\" on the market wrapped one OpenAI API call in a Streamlit app and called themselves senior. The other half have shipped real production agents that handle real failure modes. The portfolio tells you which one you're talking to in about five minutes.",
    sections: [
      {
        heading: "Red flag 1 — A single demo app, no production deployment",
        paragraphs: [
          "If the entire AI portfolio is one Streamlit or Gradio app that takes a prompt and shows a response, the freelancer has shipped a demo, not a system. Demos are easy. Production AI work is the layer of code around the model call: input validation, prompt versioning, output parsing, error handling, retries, observability, budgeting.",
          "Ask what they ship after the demo works. \"I package it as a Docker container\" is fine. \"I deploy it to Modal/Replicate\" is fine. \"I'm not sure, the user runs it locally\" is the answer of someone who's never had to maintain an AI feature past the demo.",
        ],
      },
      {
        heading: "Red flag 2 — No mention of model failure modes",
        paragraphs: [
          "Production AI engineers talk about failure constantly. Hallucinations, prompt-injection attacks, output that passes validation but is semantically wrong, models drifting between versions, rate-limit cascades. If a freelancer's portfolio mentions only what the AI does well, they haven't shipped it under load.",
          "Specifics to listen for: how they detect when a model is wrong (eval set? rule-based checks? secondary model?); how they recover (retry? fallback to a cheaper model? human-in-the-loop?); how they prevent the same failure twice. A freelancer who shrugs at this is not the freelancer you want for anything that goes to real users.",
        ],
      },
      {
        heading: "Red flag 3 — Claims about AGI, sentience, or \"general intelligence\"",
        paragraphs: [
          "Anyone who uses these phrases in a hiring context is either a marketer or hasn't worked closely enough with frontier models to know how absurd the framing is up close. Production AI work is small, specific, and unglamorous: making one task more reliable, faster, or cheaper. A freelancer who pitches \"my AI can do anything\" is selling vibes.",
          "The good freelancers will tell you exactly what their AI can't do, often unprompted. They've felt the edges enough to respect them.",
        ],
      },
      {
        heading: "Red flag 4 — No cost telemetry, no budget gates",
        paragraphs: [
          "Models cost money per call. A production AI feature that doesn't track cost per request, per user, or per feature is a runaway-bill incident waiting to happen. Ask a freelancer how they monitor LLM spend on their existing projects.",
          "A real answer mentions per-call cost logging, per-user/per-feature budgets, alerting when a budget is hit, and what happens when a budget is exceeded (refuse the call? fall back to a cheaper model? send a Slack alert?). A vague answer means they've never had to defend a $30,000 OpenAI bill, which means they haven't shipped at scale.",
        ],
      },
      {
        heading: "Green flag 1 — Multi-provider routing, not single-provider lock-in",
        paragraphs: [
          "A freelancer who has only ever called OpenAI is fragile. A freelancer who routes between Anthropic, OpenAI, and Gemini (or any combination) behind one internal client is significantly more useful. Models have different strengths; provider outages happen; pricing changes.",
          "Concrete example: KeepItUp routes Generator calls to Anthropic Claude (strong code reasoning) and Reviewer calls to OpenAI GPT-4-class (different blind spots) with Gemini as fallback for budget overflow. The routing is per-stage, not per-app. A freelancer who can describe a routing model that specific has shipped real multi-provider work.",
        ],
        table: {
          caption: "Provider routing patterns to ask about",
          headers: ["Pattern", "What it means", "Maturity signal"],
          rows: [
            ["Single provider, hardcoded", "OpenAI everywhere", "Demo-tier"],
            ["Single provider, abstracted client", "OpenAI behind a wrapper", "Beginning to think about it"],
            ["Multi-provider per task", "Different model per stage", "Production-tier"],
            ["Multi-provider + budget gates", "Routes by cost + capability", "Senior production-tier"],
          ],
        },
      },
      {
        heading: "Green flag 2 — Specific failure-mode storytelling",
        paragraphs: [
          "A good freelance AI engineer has stories. Not \"the model hallucinated once\" — specific stories: \"my structured-extraction prompt worked on 99% of CVs until a candidate uploaded a one-page PDF with a single H1 and nothing else, and the model invented an entire work history. I added a length check + a confidence threshold + a fallback to manual review for low-confidence extractions.\"",
          "That kind of specificity is impossible to fake. It comes from running the system long enough to accumulate edge cases and from caring enough to fix them. The story matters more than the fix; the fix tells you the freelancer found a problem worth fixing.",
        ],
      },
      {
        heading: "Green flag 3 — Evaluation framework, not vibes",
        paragraphs: [
          "Ask how they know their AI feature is working. \"It looks good\" is not an answer. A real answer involves a held-out test set, precision-at-N metrics, regression testing against historical inputs, or human-in-the-loop labeling for the cases the automated checks can't catch.",
          "advance.al's matching engine has a held-out set of manually-labeled candidate/job pairs and 288 Jest tests with a strict philosophy banning permissive matchers. KeepItUp's gate has a confidence threshold backed by build-verification. Specific, measurable, repeatable. A freelancer with no evaluation framework is shipping vibes.",
        ],
      },
      {
        heading: "Green flag 4 — Owns the model failure recovery, not just the happy path",
        paragraphs: [
          "When the model returns nonsense, what happens? In good systems, there's a retry layer (with a different prompt or model), a fallback to a deterministic path, or a human-review queue. In bad systems, the user sees a stack trace.",
          "Ask the freelancer to walk you through what their AI feature does when the model fails. Their answer tells you whether they've actually run the system in production or just demoed it.",
        ],
      },
      {
        heading: "How to use these flags",
        paragraphs: [
          "Don't treat any single signal as disqualifying. People learn. A freelancer with three red flags is unlikely to be ready for production AI work; a freelancer with two green flags and a clear engagement with the problems they haven't yet solved is probably worth a paid trial project.",
          "The general shape: the senior AI engineers are the ones who talk about what their AI can't do at least as much as what it can. They've felt the edges. They build for the failure mode, not the demo mode.",
        ],
      },
    ],
    pullQuotes: [
      {
        quote:
          "Production AI work is small, specific, and unglamorous: making one task more reliable, faster, or cheaper. A freelancer who pitches \"my AI can do anything\" is selling vibes.",
      },
      {
        quote:
          "The senior AI engineers are the ones who talk about what their AI can't do at least as much as what it can. They've felt the edges. They build for the failure mode, not the demo mode.",
      },
    ],
    citations: [
      {
        label: "Anthropic Claude API documentation",
        url: "https://docs.anthropic.com/en/api/messages",
        relevance: "Reference for production-grade LLM API patterns",
      },
      {
        label: "OpenAI API documentation",
        url: "https://platform.openai.com/docs/overview",
        relevance: "Reference for OpenAI integration patterns",
      },
      {
        label: "Google Gemini API documentation",
        url: "https://ai.google.dev/gemini-api/docs",
        relevance: "Third major provider in multi-provider routing",
      },
      {
        label: "Hugging Face Evaluate library",
        url: "https://huggingface.co/docs/evaluate",
        relevance: "Standard tooling for AI evaluation frameworks",
      },
    ],
    faq: [
      {
        q: "How do I find a freelance AI engineer who has actually shipped production work?",
        a: "Look at public repositories, not slide decks. Ask for a walkthrough of an AI feature they've shipped — production URL, what it does, how they monitor it, what its failure modes are, how they recover. Real production AI engineers have specific answers; demo-tier engineers don't.",
      },
      {
        q: "What's the difference between an AI engineer and an ML engineer?",
        a: "ML engineers typically train models. AI engineers typically integrate existing models (LLMs, embeddings, vision models) into production systems. For most 2026 freelance work, you want an AI engineer — model training is rare, model integration is constant.",
      },
      {
        q: "Is GPT-4 still the default for production AI features?",
        a: "Not exclusively. Production systems increasingly route between Claude, GPT, and Gemini depending on the task. Code reasoning often goes to Claude; structured extraction often goes to whichever model has the latest function-calling improvements. The default is a routing layer, not a specific model.",
      },
      {
        q: "How much should I expect to pay an LLM provider for a production AI feature?",
        a: "Highly variable. Common ranges: $50-500/month for a small feature with light volume; $1,000-$10,000/month for a moderately-trafficked feature; $50,000+/month for high-volume features without careful caching and budget gating. The freelancer's first job is to keep your bill predictable, not minimal.",
      },
      {
        q: "What's the biggest mistake clients make when hiring AI engineers?",
        a: "Hiring on hype rather than evaluation. \"They mentioned LangChain and vector databases\" is not a hiring signal. \"They walked me through how they handle structured-extraction failures on edge-case input\" is.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // Cluster A — Technical depth (KeepItUp follow-up)
  // -------------------------------------------------------------------------
  {
    slug: "tree-sitter-ast-slicing-context-budget",
    title:
      "Tree-sitter AST slicing as a context-budget lever for AI agents",
    date: "2026-05-14",
    dateModified: "2026-05-14",
    readingMinutes: 8,
    description:
      "Token budgets are a real constraint for AI agents that work on source code. A 30,000-token \"here's the whole module\" dump performs worse than a 3,000-token AST-shaped slice. Tree-sitter is the parser that makes the slice possible across six languages without per-language code.",
    keywords: [
      "tree-sitter AST",
      "AI agent context window",
      "token budget LLM",
      "code context extraction",
      "AST-based slicing",
      "multi-language parser",
      "AI code agent",
      "context engineering",
    ],
    relatedProject: "keepitup",
    answerBox:
      "Tree-sitter gives you real AST nodes across dozens of languages with one API. For AI agents working on code, this lets you extract a 50-to-500-line slice around the failing symbol — function plus imports plus sibling classes — instead of dumping the whole repo. A 3,000-token AST slice routinely beats a 30,000-token full-file dump on fix quality.",
    lede:
      "Token budgets are a real constraint for AI agents that work on source code. You can throw the whole repo at GPT-4o with a million-token context window and watch it produce worse fixes than a smaller model given a tighter, structurally-coherent slice. The model isn't dumb; the prompt is just full of noise. Tree-sitter is the parser that lets you fix this across every language an agent might touch.",
    sections: [
      {
        heading: "Why does context shape matter more than context size?",
        paragraphs: [
          "Modern frontier models can hold hundreds of thousands of tokens. They're still better at reasoning over dense, relevant context than over sparse context buried in noise. The needle-in-a-haystack benchmarks measure recall, not reasoning. A model that can pull a specific fact out of 100K tokens is not the same as a model that can reason about that fact correctly when 99% of the surrounding tokens are irrelevant.",
          "Empirically, on code-fix tasks, a 3,000-token slice of relevant AST nodes routinely beats a 30,000-token whole-module dump. The model produces fewer cross-module rewrites, fewer fabricated function signatures, fewer changes to code that wasn't broken. The slice doesn't have to be perfect; it just has to be tighter than \"everything.\"",
        ],
      },
      {
        heading: "What's wrong with regex-based slicing?",
        paragraphs: [
          "The naive approach to extracting context around a failing symbol is regex. Find the function name in the file, grab the lines from its opening brace to its closing brace. This works in JavaScript until you hit a nested closure with a string that contains a literal brace, or in Python until you hit an indentation-based block that the regex can't track.",
          "Per-language regex multiplies the problem. TypeScript and Python don't share grammar. Go and Ruby don't share grammar. Maintaining six different regex-based slicers, each with its own edge cases, scales poorly. I tried it in v1 of KeepItUp's context engine and rolled it back within a week.",
        ],
      },
      {
        heading: "What does tree-sitter do that regex doesn't?",
        paragraphs: [
          "Tree-sitter parses source code into a real concrete syntax tree, one node per language construct. Function definitions, class declarations, import statements, control-flow blocks — all addressable as tree nodes with parent and sibling relationships intact.",
          "The same `query` API works across every tree-sitter grammar. A query like \"find the function node enclosing this line\" works identically in TypeScript, Python, Go, Ruby, Java, and Rust. There are official grammars for dozens of languages and community grammars for many more. One slicer; six (or sixty) languages.",
          "Tree-sitter is fast. The parsers are written in C, hand-tuned, and incremental — they can re-parse a file after a small edit without re-parsing the whole thing. Cold parsing of a thousand-line file takes single-digit milliseconds. This matters when the agent is processing dozens of file slices per minute under a confidence-gate retry policy.",
        ],
        table: {
          caption: "Regex vs tree-sitter for code slicing",
          headers: ["Aspect", "Regex per language", "Tree-sitter"],
          rows: [
            ["Coverage of language quirks", "Manual, error-prone", "Built into the grammar"],
            ["Maintenance cost", "Per language", "One slicer, all languages"],
            ["Speed", "Fast but fragile", "Fast and correct"],
            ["Slice quality", "Line-based", "Structurally coherent (function + imports + siblings)"],
            ["Edge cases (nested braces, indentation, etc.)", "Each one a bug fix", "Handled by the parser"],
          ],
        },
      },
      {
        heading: "How big should a slice be?",
        paragraphs: [
          "KeepItUp targets a 50-to-500-line range. The lower bound exists because below 50 lines you usually don't have enough context to understand the surrounding flow; the model starts inferring things that aren't in the slice. The upper bound exists because above 500 lines the noise-to-signal ratio starts hurting fix quality.",
          "Inside that range, the slice grows as needed. A small function with no dependencies is 50 lines. A method on a class with three related sibling methods and an import block is 250. A route handler that calls into a service module pulls a 500-line composite slice. The exact number isn't tuned per situation; it falls out of the AST traversal — \"include enclosing function, include imports it uses, include nearest sibling methods.\"",
        ],
      },
      {
        heading: "What does the slice include beyond the failing function?",
        paragraphs: [
          "The failing function alone usually isn't enough. The model needs to know what the function takes as arguments, what it returns, and what it calls. So the slice always includes:",
          "Imports from the same file that the function references. Type declarations or interfaces that the function's signature uses. Sibling functions or methods in the same class or module that are called from the failing function. The module-level docstring, if any.",
          "What the slice deliberately excludes: code in other files (separate concern — handled by a different layer that fetches cross-file context only when explicitly requested), commented-out code, generated boilerplate (detected by heuristics like file headers that say \"DO NOT EDIT\"), and code that's clearly unrelated to the failing path. The exclusion list is as important as the inclusion list.",
        ],
      },
      {
        heading: "How does the slice interact with the confidence gate?",
        paragraphs: [
          "The two-layer reasoning gate in KeepItUp depends on the slice being honest. If the slice is missing the function being called by the failing function, the Generator will produce a fix that references the missing function as if it doesn't exist; the Reviewer will score it low and the diff won't open a PR. The system fails closed — wrong slice means low confidence means no action.",
          "This is the right failure mode. The agent doesn't accidentally ship a fix because the context was misleading; it backs off and asks for more context (or escalates to a human). The slice is part of the safety story, not just an optimization.",
        ],
      },
      {
        heading: "Where this pattern generalizes",
        paragraphs: [
          "Any AI agent that operates on structured input benefits from a parser-based slicer over a string-based one. Code agents are the obvious case. Markdown agents (think doc-rewriting tools) benefit from parsing into ASTs and slicing by heading. Configuration-file agents (Kubernetes manifests, Terraform) benefit from real YAML/HCL parsers and slicing by resource.",
          "The general rule: if the input has a grammar, use the grammar. The amount of context an LLM can use effectively is bounded; the grammar tells you which bounded slice to pick.",
        ],
      },
    ],
    pullQuotes: [
      {
        quote:
          "A 3,000-token AST slice routinely beats a 30,000-token full-file dump on fix quality. The model isn't dumb; the prompt is just full of noise.",
      },
      {
        quote:
          "If the input has a grammar, use the grammar. The amount of context an LLM can use effectively is bounded; the grammar tells you which bounded slice to pick.",
      },
    ],
    citations: [
      {
        label: "Tree-sitter — incremental parsing library",
        url: "https://tree-sitter.github.io/tree-sitter/",
        relevance: "Multi-language AST parser used for the context slicer",
      },
      {
        label: "Tree-sitter grammar repositories (GitHub)",
        url: "https://github.com/tree-sitter",
        relevance: "Official grammars for TypeScript, Python, Go, Ruby, Java, Rust, etc.",
      },
      {
        label: "Anthropic — long-context reasoning research",
        url: "https://www.anthropic.com/research",
        relevance: "Anthropic's published findings on context window effectiveness",
      },
      {
        label: "Tree-sitter query syntax (official guide)",
        url: "https://tree-sitter.github.io/tree-sitter/using-parsers/queries/1-syntax.html",
        relevance: "The query API that makes cross-language slicing one slicer",
      },
    ],
    faq: [
      {
        q: "Why use tree-sitter instead of a language's native AST tool?",
        a: "Native AST tools (TypeScript Compiler API, Python ast module, etc.) are powerful but language-specific. Each one has its own API, its own node types, its own gotchas. Tree-sitter gives you one API across dozens of languages. For an AI agent that has to work across a polyglot codebase, the consistency matters more than per-language depth.",
      },
      {
        q: "Does AST slicing work for languages tree-sitter doesn't support natively?",
        a: "Yes, if there's a community grammar. The grammar ecosystem is large enough that most production languages have one. For truly obscure languages, you can fall back to line-based slicing — but for the major web languages and most systems languages, tree-sitter is the answer.",
      },
      {
        q: "What's the right context size for an AI code agent?",
        a: "Empirically, 1,000-5,000 tokens of dense, structurally-coherent context works better than 20,000+ tokens of whole-module dump on most fix tasks. The exact number depends on the model and the task, but the principle holds: shape matters more than size once you're above the floor of \"enough to understand the surrounding flow.\"",
      },
      {
        q: "Can you use tree-sitter at runtime in production?",
        a: "Yes. Tree-sitter is written in C with bindings for Node.js, Python, Rust, and others. Parsing a 1,000-line file takes single-digit milliseconds. It's fast enough for inline use during an agent's processing loop, including under retry policies.",
      },
      {
        q: "Does AST slicing prevent prompt injection?",
        a: "Not directly — prompt injection is an input-validation concern at a different layer. But AST slicing reduces the surface area: the model only sees structured code, not arbitrary text masquerading as code. A user-controlled comment in a slice is still a risk; the mitigation is sanitization at the input boundary, not in the slicer.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // Cluster B — Three-model pipelines (Ëndërrat)
  // -------------------------------------------------------------------------
  {
    slug: "three-model-atomic-content-pipelines",
    title:
      "Three-model atomic content pipelines — text, image, and audio without orphans",
    date: "2026-05-14",
    dateModified: "2026-05-14",
    readingMinutes: 8,
    description:
      "Ëndërrat e Mia generates a complete bedtime story from three different models — Claude Haiku writes the narrative, fal.ai's Flux Schnell paints the illustrations, ElevenLabs narrates. The trick is composing three model outputs into one atomic transaction so a user never sees text without audio.",
    keywords: [
      "multimodal AI pipeline",
      "AI content pipeline",
      "atomic transactions LLM",
      "Claude Haiku",
      "fal.ai Flux Schnell",
      "ElevenLabs TTS",
      "AI children's content",
      "multi-model composition",
      "AI pipeline reliability",
    ],
    relatedProject: "enderrat-e-mia",
    answerBox:
      "Ëndërrat e Mia generates a complete Albanian bedtime story by composing three different models — Claude Haiku for text, fal.ai's Flux Schnell for four matched watercolor illustrations, ElevenLabs for narration. All three outputs land atomically: a user never sees text with missing audio or images with missing text. The pipeline owns the transaction, not the models.",
    lede:
      "Ëndërrat e Mia is an AI bedtime-story app for Albanian-speaking families — a market that essentially had zero native-language children's content before this. Each story is a three-step pipeline. Claude Haiku writes the narrative in Albanian. fal.ai's Flux Schnell paints four matched watercolor illustrations from the same character setup. ElevenLabs narrates the whole thing. None of those three outputs is allowed to land alone.",
    sections: [
      {
        heading: "Why atomicity matters in a multi-model pipeline",
        paragraphs: [
          "A child opens the app to hear a story. If the text generated but the audio failed, the experience is broken in a specific way: the parent sees text on screen with no narration to read along with. If the illustrations failed but the text and audio worked, the experience is broken differently: a story you can hear but can't see.",
          "Worse: if any of those failures aren't atomic, the user can pay credits for a story they can never use. A half-generated story is worse than no story, because the user has lost a credit and gained nothing. The pipeline has to refuse to commit a story unless all three artifacts are ready.",
          "This is the same atomicity problem databases have solved for decades — but across three external API providers, none of which know about each other. The pipeline has to be the transaction coordinator.",
        ],
      },
      {
        heading: "How does the three-step pipeline actually run?",
        paragraphs: [
          "Step 1: Claude Haiku generates the story text in Albanian. The prompt fixes the protagonist's name, age, key traits (curious, kind, etc.), and the moral arc. Output is structured — a title, a 10-paragraph narrative, and a description block for each illustration scene.",
          "Step 2: The pipeline takes the four illustration descriptions and sends them to fal.ai's Flux Schnell with a fixed watercolor-style prompt prefix. Same character description for every illustration to keep the protagonist visually consistent. Four images come back; the pipeline verifies all four are present before continuing.",
          "Step 3: ElevenLabs narrates the full text in Albanian. The pipeline checks the audio file's duration against the text's expected reading time (rough heuristic — Albanian narration is roughly 150 words per minute) and rejects audio that's too short or too long.",
          "Only after all three steps complete does the pipeline write the story to the user's library. If any step fails or its output doesn't validate, the whole story is discarded and the user's credit is refunded.",
        ],
        table: {
          caption: "The three model stages and what they own",
          headers: ["Stage", "Model", "Output", "Validation"],
          rows: [
            ["Text", "Claude Haiku", "Title + 10 paragraphs + 4 scene descriptions", "Structural — required sections present"],
            ["Image", "fal.ai Flux Schnell", "4 watercolor illustrations", "Count check + image-validation hash"],
            ["Audio", "ElevenLabs TTS", "1 narration MP3 (Albanian)", "Duration vs expected reading time"],
            ["Commit", "Pipeline orchestrator", "Story written to user library", "All three above passed"],
          ],
        },
      },
      {
        heading: "Why three different providers instead of one?",
        paragraphs: [
          "No single provider does all three well. Text generation in Albanian is best on Claude Haiku — Anthropic's models have unusually strong handling of low-resource languages, and the Albanian output is noticeably better than what OpenAI or Gemini produces at the same price point.",
          "Image generation in a consistent watercolor style is best on Flux Schnell — fal.ai's hosting makes the model cheap and fast for the four-image-per-story workload, and Schnell's style consistency across multiple generations holds up to the character-continuity constraint.",
          "Albanian TTS is best on ElevenLabs — the voice quality at the time of build was meaningfully ahead of competitors for Albanian specifically. The same character voice can be configured across all stories, which builds the brand consistency a children's product needs.",
          "Three providers means three rate limits, three pricing curves, three sets of failure modes. The orchestrator has to handle all of them. But the alternative — one provider for everything — would mean accepting weaker output on at least one stage, and that weakness compounds.",
        ],
      },
      {
        heading: "Where does the transaction ledger fit in?",
        paragraphs: [
          "Behind the pipeline is a single Transaction ledger: free credits earned from ads, RevenueCat subscription credits, AdMob rewards, and one-off purchases all write to the same table. Every story generation debits this ledger. Every refund credits it.",
          "Unifying credits across all sources means balance, churn, and fraud queries are one query, not three accounting systems stitched together. A user's available credits is `SELECT SUM(amount) FROM transactions WHERE user_id = ?`. The same shape handles refunds when a pipeline step fails.",
          "The pipeline's atomic commit semantics show up in the ledger too: if the story commits, the debit stays. If the story fails, a refund row writes immediately. The user never sees a debit without either a story or a refund — and the ledger never gets out of sync with the user's library.",
        ],
      },
      {
        heading: "How does failure recovery work?",
        paragraphs: [
          "Failure of any step triggers two things. First, a credit refund posted to the ledger. Second, an error report logged with enough context to debug (which step failed, what the input was, what the model returned). The user sees a polite error in the app: \"Something went wrong, your credit has been refunded.\"",
          "Retries happen at the pipeline level, not within a single step. If Claude returns text that doesn't pass structural validation, the pipeline retries the whole step with a slightly modified prompt — up to three retries before giving up. Failures aren't logged as user-facing problems until all retries exhaust.",
          "The result: roughly 99% of story-generation attempts succeed on the user's end. The ones that don't are refunded automatically and surface as ops alerts on my side, not as customer-support tickets.",
        ],
      },
      {
        heading: "Why this pattern generalizes",
        paragraphs: [
          "Any feature that composes multiple AI model outputs into one user-visible artifact has the same atomicity problem. A chatbot that pairs text replies with avatars; a podcast generator that pairs transcript with music; a documentation generator that pairs explanations with diagrams — all run into \"what happens when one stage succeeds but another fails.\"",
          "The pattern: orchestrate the stages, validate every output, refuse to commit unless all stages pass, refund automatically on failure. The pipeline owns the transaction; the models don't have to know about each other. The user experience is consistent because the failure mode is bounded.",
        ],
      },
      {
        heading: "Why this exists",
        paragraphs: [
          "I built Ëndërrat e Mia because my native-language community deserves bedtime stories that don't come from Google Translate. The atomicity discipline is what makes that promise reliable — a parent opening the app at 8:30pm wants a complete story, not a half-generated one.",
        ],
      },
    ],
    pullQuotes: [
      {
        quote:
          "A half-generated story is worse than no story, because the user has lost a credit and gained nothing. The pipeline has to refuse to commit unless all three artifacts are ready.",
      },
      {
        quote:
          "Three providers means three rate limits, three pricing curves, three sets of failure modes. The orchestrator has to handle all of them.",
      },
    ],
    citations: [
      {
        label: "Anthropic Claude Haiku (model overview)",
        url: "https://docs.anthropic.com/en/docs/about-claude/models",
        relevance: "Text-generation stage of the pipeline",
      },
      {
        label: "fal.ai Flux Schnell (model card)",
        url: "https://fal.ai/models/fal-ai/flux/schnell",
        relevance: "Image-generation stage",
      },
      {
        label: "ElevenLabs Text-to-Speech API",
        url: "https://elevenlabs.io/docs/api-reference",
        relevance: "Narration stage",
      },
      {
        label: "RevenueCat — mobile subscriptions",
        url: "https://www.revenuecat.com/docs",
        relevance: "Subscription credit source for the unified ledger",
      },
    ],
    faq: [
      {
        q: "What is a multi-model AI pipeline?",
        a: "A workflow that composes outputs from two or more different AI models into a single user-visible result. Each model owns one stage of the work; the orchestrator owns sequencing, validation, and recovery. Common patterns: text + image, text + audio, transcript + summary, code + tests.",
      },
      {
        q: "Why use three different model providers instead of one?",
        a: "Because no single provider is best at every task. Albanian text generation, watercolor image consistency, and Albanian TTS narration each have a different best-in-class provider. Using three providers means accepting more operational complexity but getting strictly better output on every stage.",
      },
      {
        q: "How do you make a multi-step AI pipeline atomic?",
        a: "Orchestrate the stages, validate every output before continuing, and refuse to commit the final artifact until all stages have passed validation. On any failure, refund the user immediately at the ledger level. The pipeline is the transaction coordinator; the models don't know about each other.",
      },
      {
        q: "What's the right way to handle credits across multiple sources?",
        a: "Put them in one ledger. Subscription credits, ad rewards, free trial credits, one-off purchases — all rows in the same transactions table. Balance is a single sum query. Refunds are positive-amount rows referencing the original debit. Unification makes everything else simpler.",
      },
      {
        q: "How reliable can a three-model pipeline be?",
        a: "With pipeline-level retries (each stage retried up to three times on failure) and end-to-end validation, roughly 99% of attempts complete successfully on the user's end. The 1% that don't are refunded automatically and surface as internal alerts rather than customer-support tickets.",
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
