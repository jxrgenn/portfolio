"use client";

import dynamic from "next/dynamic";

const MockupB = dynamic(() => import("./MockupB").then((m) => m.MockupB), {
  ssr: false,
});

export default function Page() {
  return <MockupB />;
}
