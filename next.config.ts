import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tmtqimgleiarfygheuzg.supabase.co",
      },
    ],
  },
};

export default nextConfig;