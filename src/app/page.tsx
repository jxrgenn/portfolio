import { Hero } from "@/components/Hero";
import { ProjectCarousel3D } from "@/components/sections/ProjectCarousel3D";
import { WorkOutro } from "@/components/sections/WorkOutro";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { ProgressNav } from "@/components/scene/ProgressNav";

export default function Home() {
  return (
    <>
      <Hero />
      <ProjectCarousel3D />
      <WorkOutro />
      <About />
      <Contact />
      <ProgressNav />
    </>
  );
}
