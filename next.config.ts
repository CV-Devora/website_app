import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.xlsx": { type: "asset" },
    },
  },
};

export default nextConfig;
