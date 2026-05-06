"use client";

import dynamic from "next/dynamic";

export const WireShape = dynamic(
  () => import("./WireShape").then((m) => m.WireShape),
  { ssr: false },
);
