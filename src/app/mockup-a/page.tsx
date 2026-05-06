"use client";

import dynamic from "next/dynamic";

const MockupA = dynamic(() => import("./MockupA").then((m) => m.MockupA), {
  ssr: false,
});

export default function Page() {
  return <MockupA />;
}
