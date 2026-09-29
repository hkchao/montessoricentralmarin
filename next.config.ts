import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Default allowlist is [75]; gallery uses quality={90}.
    qualities: [75, 90],
  },
  async redirects() {
    return [{ source: "/our-school", destination: "/about", permanent: true }];
  },
};

export default nextConfig;
