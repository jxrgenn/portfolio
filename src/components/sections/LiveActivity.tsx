import { LiveActivityClient } from "./LiveActivityClient";

const USER = "jxrgenn";
const REVALIDATE = 3600; // 1 hour

export type Day = { date: string; level: number; count: number };
export type ActivityData = {
  days: Day[];
  total: number;
  current: number;
  longest: number;
  busiest: Day | null;
  fetchedAt: string;
  fallback: boolean;
};

function buildFallbackDays(): Day[] {
  return Array.from({ length: 371 }).map((_, i) => {
    const dt = new Date(Date.now() - (370 - i) * 86400000);
    const seed =
      Math.sin(i * 0.31) * 1.6 +
      Math.cos(i * 0.71) * 1.2 +
      ((i * 7919) % 11) * 0.18;
    const count = Math.max(0, Math.round(seed));
    const level =
      count >= 6 ? 4 : count >= 3 ? 3 : count >= 2 ? 2 : count >= 1 ? 1 : 0;
    return { date: dt.toISOString().slice(0, 10), level, count };
  });
}

function statsFor(days: Day[]): Pick<ActivityData, "total" | "current" | "longest" | "busiest"> {
  const total = days.reduce((s, d) => s + d.count, 0);
  let busiest: Day | null = null;
  for (const d of days) if (!busiest || d.count > busiest.count) busiest = d;
  let longest = 0;
  let run = 0;
  for (const d of days) {
    if (d.count > 0) {
      run++;
      if (run > longest) longest = run;
    } else run = 0;
  }
  let current = 0;
  let i = days.length - 1;
  while (i >= 0 && days[i].count === 0) i--;
  while (i >= 0 && days[i].count > 0) {
    current++;
    i--;
  }
  return { total, current, longest, busiest };
}

const FALLBACK: ActivityData = (() => {
  const days = buildFallbackDays();
  return {
    days,
    ...statsFor(days),
    fetchedAt: new Date().toISOString(),
    fallback: true,
  };
})();

async function loadActivity(): Promise<ActivityData> {
  let html: string | null = null;
  try {
    const res = await fetch(
      `https://github.com/users/${USER}/contributions`,
      {
        next: { revalidate: REVALIDATE },
        headers: {
          "User-Agent": "jxrgenn-portfolio (+https://portfolio-seven-opal-35.vercel.app)",
          Accept: "text/html",
        },
      },
    );
    if (res.ok) html = await res.text();
  } catch {
    // network error — silently fall back
  }
  if (!html) return FALLBACK;

  // GitHub renders each contribution day as:
  //   <td data-date="YYYY-MM-DD" data-level="0..4" id="contribution-day-component-X-Y" ...>
  // Counts live in associated tool-tip elements:
  //   <tool-tip for="contribution-day-component-X-Y">N contributions on Month Day.</tool-tip>
  const cellMap = new Map<string, Day>();
  const cellRe =
    /<td[^>]*?data-date="(\d{4}-\d{2}-\d{2})"[^>]*?data-level="(\d)"[^>]*?id="(contribution-day-component-\d+-\d+)"/g;
  for (const m of html.matchAll(cellRe)) {
    cellMap.set(m[3], {
      date: m[1],
      level: Math.max(0, Math.min(4, parseInt(m[2], 10))),
      count: 0,
    });
  }

  const ttRe =
    /<tool-tip[^>]*?for="(contribution-day-component-\d+-\d+)"[^>]*?>([^<]*)<\/tool-tip>/g;
  for (const m of html.matchAll(ttRe)) {
    const cell = cellMap.get(m[1]);
    if (!cell) continue;
    const num = /^(\d+)/.exec(m[2]);
    cell.count = num ? parseInt(num[1], 10) : 0;
  }

  if (cellMap.size === 0) return FALLBACK;

  const days = [...cellMap.values()].sort((a, b) =>
    a.date.localeCompare(b.date),
  );

  return {
    days,
    ...statsFor(days),
    fetchedAt: new Date().toISOString(),
    fallback: false,
  };
}

export async function LiveActivity() {
  const data = await loadActivity();
  return <LiveActivityClient data={data} />;
}
