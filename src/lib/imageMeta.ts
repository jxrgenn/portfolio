import "server-only";
import path from "node:path";
import { promises as fs } from "node:fs";

const cache = new Map<string, { width: number; height: number }>();

export async function getImageMeta(
  src: string,
): Promise<{ width: number; height: number } | null> {
  const cached = cache.get(src);
  if (cached) return cached;

  try {
    const sharp = (await import("sharp")).default;
    const cleaned = src.startsWith("/") ? src.slice(1) : src;
    const file = path.join(process.cwd(), "public", cleaned);
    const buf = await fs.readFile(file);
    const meta = await sharp(buf).metadata();
    if (!meta.width || !meta.height) return null;
    const result = { width: meta.width, height: meta.height };
    cache.set(src, result);
    return result;
  } catch {
    return null;
  }
}

export function inferDeviceFromSrc(src: string): "desktop" | "mobile" {
  return /(^|[/_-])mobile([/_.-]|$)/i.test(src) ? "mobile" : "desktop";
}
