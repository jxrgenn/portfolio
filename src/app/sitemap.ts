import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/projects";
import { getAllNoteSlugs } from "@/lib/notes";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jurgenhalili.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, priority: 1.0, changeFrequency: "monthly" },
    { url: `${SITE_URL}/about`, lastModified: now, priority: 0.8, changeFrequency: "monthly" },
  ];

  const projectRoutes: MetadataRoute.Sitemap = getAllSlugs().map((slug) => ({
    url: `${SITE_URL}/projects/${slug}`,
    lastModified: now,
    priority: 0.9,
    changeFrequency: "monthly",
  }));

  const noteRoutes: MetadataRoute.Sitemap = getAllNoteSlugs().map((slug) => ({
    url: `${SITE_URL}/notes/${slug}`,
    lastModified: now,
    priority: 0.7,
    changeFrequency: "yearly",
  }));

  return [...staticRoutes, ...projectRoutes, ...noteRoutes];
}
