import type { Metadata } from "next";
import { getSettings } from "@/lib/store";
import PujaView from "./View";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return { title: s.puja_title, description: s.puja_text, alternates: { canonical: "/puja" } };
}

export default function Page() {
  return <PujaView />;
}
