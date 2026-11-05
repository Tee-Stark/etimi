import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  reactStrictMode: true,
  // Content is read from disk at render time. Prerendered pages don't need it,
  // but a request-time render (e.g. an unknown slug that must 404) does, so
  // the content folder is traced into every server function.
  outputFileTracingIncludes: {
    "/*": ["./content/**/*"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
