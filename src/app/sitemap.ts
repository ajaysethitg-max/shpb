import type { MetadataRoute } from "next";
import { getProducts, getSettings, siteUrl } from "@/lib/store";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [s, products] = await Promise.all([getSettings(), getProducts()]);
  const base = siteUrl(s);
  const pages = ["", "/deities", "/idols", "/poshak", "/puja", "/catalog", "/custom-order", "/about"];
  return [
    ...pages.map((p) => ({ url: `${base}${p}${p ? "/" : ""}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.8 })),
    ...products.map((p) => ({ url: `${base}/products/${p.slug}/`, changeFrequency: "weekly" as const, priority: 0.6 })),
  ];
}
