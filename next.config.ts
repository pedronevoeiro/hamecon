import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s.asiaimport.com.br",
      },
    ],
  },
};

export default nextConfig;
