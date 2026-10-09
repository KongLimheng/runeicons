import type { NextConfig } from "next";

import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(fileURLToPath(import.meta.url));

// Files in /public are served with `max-age=0, must-revalidate` by default, so
// every page view re-requests every sprite, texture and SVG. These names are not
// content-hashed, so cache for a day and revalidate in the background instead of
// marking them immutable.
const PUBLIC_ASSET_CACHE = "public, max-age=86400, stale-while-revalidate=604800";
const PUBLIC_ASSET_DIRS = [
  "sprites",
  "normal",
  "duotone",
  "fill",
  "pixelated",
  "glass-icons",
  "textures",
  "landing",
  "about",
  "brand",
  "brand-logos",
];

const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    inlineCss: true,
  },
  poweredByHeader: false,
  turbopack: {
    root: projectRoot,
  },
  images: {
    // Only a handful of local images are optimized; keep each result cached
    // instead of re-transforming it every 4 hours (the default).
    minimumCacheTTL: 60 * 60 * 24 * 31,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
      ...PUBLIC_ASSET_DIRS.map((dir) => ({
        source: `/${dir}/:path*`,
        headers: [{ key: "Cache-Control", value: PUBLIC_ASSET_CACHE }],
      })),
      {
        source: "/og-image.png",
        headers: [{ key: "Cache-Control", value: PUBLIC_ASSET_CACHE }],
      },
      {
        // Always requested with a content hash (?v=…), see app/editor/page.tsx.
        source: "/editor/assets.json",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
  async rewrites() {
    return [
      { source: "/apple-touch-icon.png", destination: "/apple-icon" },
      {
        source: "/apple-touch-icon-precomposed.png",
        destination: "/apple-icon",
      },
    ];
  },
};

export default nextConfig;
