import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Silence inferred root warnings by pinning to this project folder
    root: __dirname,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5050/api/:path*",
      },
    ];
  },
};

export default nextConfig;
