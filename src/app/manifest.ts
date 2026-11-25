import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/store";

export const dynamic = "force-static";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const s = await getSettings();
  return {
    name: s.shop_name,
    short_name: s.brand_line1 || s.shop_name,
    description: s.tagline,
    start_url: `${BASE}/`,
    display: "standalone",
    background_color: "#14100c",
    theme_color: "#14100c",
    icons: s.logo_image ? [{ src: s.logo_image, sizes: "512x512", type: "image/png" }] : [],
  };
}
