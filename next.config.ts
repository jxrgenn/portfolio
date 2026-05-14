import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  async redirects() {
    return [
      { source: "/projects/bohesh", destination: "/projects/dabei", permanent: true },
    ];
  },
};

export default nextConfig;
