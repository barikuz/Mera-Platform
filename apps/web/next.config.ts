import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: 'standalone',
  turbopack: {
    root: path.join(__dirname, '../..'),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ovkebmibzbombkoraavc.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
