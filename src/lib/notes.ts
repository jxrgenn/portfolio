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
];

export function getNote(slug: string): Note | undefined {
  return notes.find((n) => n.slug === slug);
}

export function getAllNoteSlugs(): string[] {
  return notes.map((n) => n.slug);
}
