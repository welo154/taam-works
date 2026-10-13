import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Temporary brand/placeholder assets are SVG until Figma exports land.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy:
      "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
