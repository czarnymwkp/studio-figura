import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "studiofigura.rzeszow.pl",
      },
      {
        protocol: "https",
        hostname: "www.studiofigurakrasnik.com.pl",
      },
    ],
  },
};

export default nextConfig;
