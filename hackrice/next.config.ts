import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Silence inferred root warnings by pinning to this project folder
    root: __dirname,
  },
};

export default nextConfig;
