import { Hero } from "@/components/Hero";
import { ProjectCarousel3D } from "@/components/sections/ProjectCarousel3D";
import { WorkOutro } from "@/components/sections/WorkOutro";
import { LiveActivity } from "@/components/sections/LiveActivity";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { ProgressNav } from "@/components/scene/ProgressNav";
import { projects } from "@/lib/projects";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://jurgenhalili.dev").replace(/\/$/, "");
const NOW_ISO = new Date().toISOString();

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Jurgen Halili",
  alternateName: "Jurgen Halili — Portfolio",
  url: SITE_URL,
  inLanguage: "en",
  datePublished: "2026-04-29",
  dateModified: NOW_ISO,
  description:
    "Freelance full-stack software engineer in Kiel, Germany. Builds AI-driven products end-to-end — agent runtimes, multi-LLM pipelines, native apps. Microsoft Dynamics 365 / Business Central on the other rail. Available for contracts in Germany and remote-EU.",
  author: {
    "@type": "Person",
    name: "Jurgen Halili",
    url: `${SITE_URL}/about`,
  },
  publisher: {
    "@type": "Person",
    name: "Jurgen Halili",
    url: `${SITE_URL}/about`,
  },
  mainEntity: {
    "@type": "ItemList",
    name: "Production projects",
    itemListElement: projects.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/projects/${p.slug}`,
      name: p.title,
    })),
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <Hero />
      <ProjectCarousel3D />
      <WorkOutro />
      <LiveActivity />
      <About />
      <Contact />
      <ProgressNav />
    </>
  );
}
