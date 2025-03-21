import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverRuntimeConfig: {
    apiBaseUrl: process.env.API_BASE_URL || "https://candidate-assignment.neversitup.com"
  },
};

export default nextConfig;
