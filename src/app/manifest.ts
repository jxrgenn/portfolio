import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Jurgen Halili — Portfolio",
    short_name: "Jurgen Halili",
    description:
      "Freelance full-stack software engineer in Kiel, Germany. AI-driven products end-to-end — agent runtimes, multi-LLM pipelines, native apps.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0612",
    theme_color: "#0a0612",
    orientation: "portrait",
    icons: [
      {
        src: "/icon",
        sizes: "64x64",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
