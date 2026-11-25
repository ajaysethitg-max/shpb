import type { Metadata } from "next";
import { getSettings } from "@/lib/store";
import AboutView from "./View";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return { title: s.about_title, description: s.hero_text || s.tagline, alternates: { canonical: "/about" } };
}

export default function Page() {
  return <AboutView />;
}
