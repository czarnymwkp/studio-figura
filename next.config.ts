import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "studiofigura.rzeszow.pl",
      },
    ],
  },
};

export default nextConfig;
