"use client";

import createGlobe from "cobe";
import { useEffect, useRef } from "react";

export function Globe({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let phi = 0;
    let raf = 0;
    let width = canvas.offsetWidth;

    const onResize = () => {
      if (canvas) width = canvas.offsetWidth;
    };
    window.addEventListener("resize", onResize);

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.25,
      dark: 1,
      diffuse: 1.6,
      mapSamples: 18000,
      mapBrightness: 5.2,
      baseColor: [0.16, 0.2, 0.26],
      markerColor: [34 / 255, 211 / 255, 238 / 255],
      glowColor: [0.13, 0.83, 0.93],
      markers: [
        // Tirana (origin) — slightly larger, but still flush with surface
        { location: [41.3275, 19.8187], size: 0.06 },
        // International reach — small surface points
        { location: [40.7128, -74.006], size: 0.035 },
        { location: [37.7749, -122.4194], size: 0.035 },
        { location: [51.5074, -0.1278], size: 0.035 },
        { location: [52.52, 13.405], size: 0.035 },
        { location: [35.6762, 139.6503], size: 0.03 },
      ],
    });

    const tick = () => {
      phi += 0.0035;
      globe.update({
        phi,
        width: width * 2,
        height: width * 2,
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      style={{ width: "100%", height: "100%", aspectRatio: 1 }}
      className={className}
      aria-hidden
    />
  );
}
