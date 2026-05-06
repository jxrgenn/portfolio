"use client";

import dynamic from "next/dynamic";

export const WorldMap = dynamic(
  () => import("./WorldMap").then((m) => m.WorldMap),
  { ssr: false },
);
