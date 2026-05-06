"use client";

import dynamic from "next/dynamic";

const MockupC = dynamic(() => import("./MockupC").then((m) => m.MockupC), {
  ssr: false,
});

export default function Page() {
  return <MockupC />;
}
