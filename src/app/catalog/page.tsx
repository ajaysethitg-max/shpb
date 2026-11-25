import type { Metadata } from "next";
import { getSettings } from "@/lib/store";
import CatalogView from "./View";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return { title: "Shop All", description: s.catalog_text, alternates: { canonical: "/catalog" } };
}

export default function Page() {
  return <CatalogView />;
}
