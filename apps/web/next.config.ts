import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/schemas", "@repo/types", "@repo/utils"],
};

export default nextConfig;

