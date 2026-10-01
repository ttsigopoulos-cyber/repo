import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The Hardhat project in /blockchain has its own package.json and must not be bundled.
  outputFileTracingExcludes: { "*": ["./blockchain/**/*"] },
};

export default nextConfig;
