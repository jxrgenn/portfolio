import type { MetadataRoute } from "next";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://jurgenhalili.dev").replace(/\/$/, "");

// Explicitly named bots are listed for GEO discoverability — AI search engines
// (ChatGPT, Perplexity, Claude, Gemini SGE, Copilot, Apple Intelligence) treat
// named user-agents as higher-confidence signals than the catch-all `*`.
// Disallow the same private paths from every bot.
const AI_CRAWLERS = [
  "GPTBot", // OpenAI training + browse
  "OAI-SearchBot", // ChatGPT Search index
  "ChatGPT-User", // user-initiated ChatGPT browse
  "ClaudeBot", // Anthropic
  "anthropic-ai", // older Anthropic crawler
  "PerplexityBot", // Perplexity index
  "Perplexity-User", // Perplexity user fetch
  "Google-Extended", // Google SGE / Gemini training opt-in
  "Applebot-Extended", // Apple Intelligence
  "CCBot", // Common Crawl (training corpus)
  "Meta-ExternalAgent", // Meta AI
];

const DISALLOW = ["/cv.pdf"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      ...AI_CRAWLERS.map((bot) => ({
        userAgent: bot,
        allow: "/",
        disallow: DISALLOW,
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
