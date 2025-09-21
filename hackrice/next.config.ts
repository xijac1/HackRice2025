import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Silence inferred root warnings by pinning to this project folder
    root: __dirname,
  },
  async redirects() {
    return [
      // Optional: catch errors and send them to /auth-error
      {
        source: "/auth/error",
        destination: "/auth-error",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;