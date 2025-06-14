import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('ethers'); // ⬅️ Ignore this module during server compilation
    }
    return config;
  },
};

export default nextConfig;
