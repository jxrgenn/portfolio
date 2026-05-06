import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/projects";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jurgenhalili.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, priority: 1.0, changeFrequency: "monthly" },
    { url: `${SITE_URL}/about`, lastModified: now, priority: 0.8, changeFrequency: "monthly" },
    { url: `${SITE_URL}/contact`, lastModified: now, priority: 0.5, changeFrequency: "yearly" },
  ];

  const projectRoutes: MetadataRoute.Sitemap = getAllSlugs().map((slug) => ({
    url: `${SITE_URL}/projects/${slug}`,
    lastModified: now,
    priority: 0.9,
    changeFrequency: "monthly",
  }));

  return [...staticRoutes, ...projectRoutes];
}
