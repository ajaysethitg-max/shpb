"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";
const PLACEHOLDER = `${BASE}/images/placeholder.svg`;

/** Image that falls back to a placeholder if the link is missing or broken. */
export default function SmartImage({ src, alt, ...rest }: Omit<ImageProps, "src"> & { src: string }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  // Files kept inside the site (starting with "/") need the site's folder prefix on GitHub Pages.
  const local = src.startsWith("/") ? `${BASE}${src}` : src;
  const shown = !src || failedSrc === src ? PLACEHOLDER : local;
  return <Image {...rest} src={shown} alt={alt} unoptimized onError={() => setFailedSrc(src)} />;
}
