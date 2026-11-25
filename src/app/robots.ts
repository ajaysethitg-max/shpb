import type { MetadataRoute } from "next";
import { getSettings, siteUrl } from "@/lib/store";

export const dynamic = "force-static";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const base = siteUrl(await getSettings());
  return { rules: { userAgent: "*", allow: "/", disallow: ["/search/", "/checkout/"] }, sitemap: `${base}/sitemap.xml` };
}
