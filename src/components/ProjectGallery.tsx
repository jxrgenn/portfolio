import { ProjectDriftCarousel, type ResolvedShot } from "./ProjectDriftCarousel";
import { getImageMeta, inferDeviceFromSrc } from "@/lib/imageMeta";
import type { ProjectShot } from "@/lib/projects";

async function resolveShots(
  shots: readonly ProjectShot[],
): Promise<ResolvedShot[]> {
  return Promise.all(
    shots.map(async (s) => {
      const meta = await getImageMeta(s.src);
      const device = s.device ?? inferDeviceFromSrc(s.src);
      return {
        ...s,
        device,
        width: meta?.width ?? 1600,
        height: meta?.height ?? 1000,
      };
    }),
  );
}

export async function ProjectGallery({
  shots,
}: {
  shots: readonly ProjectShot[];
}) {
  if (!shots.length) return null;
  const resolved = await resolveShots(shots);
  return <ProjectDriftCarousel shots={resolved} />;
}
