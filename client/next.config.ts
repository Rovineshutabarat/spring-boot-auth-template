import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.icons8.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "edma-theme.vercel.app",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;