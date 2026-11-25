import type { NextConfig } from "next";

// When the site lives in a folder (GitHub Pages "username.github.io/repo-name"), set
// NEXT_PUBLIC_BASE_PATH=/repo-name at build time. For your own domain leave it empty.
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");

const nextConfig: NextConfig = {
  // Static website: builds into the "out" folder, which works on GitHub Pages and any cPanel hosting.
  output: "export",
  trailingSlash: true,
  basePath: basePath || undefined,
  images: { unoptimized: true },
};

export default nextConfig;
