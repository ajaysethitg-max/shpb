import type { Metadata } from "next";
import { getSettings } from "@/lib/store";
import DeitiesView from "./View";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return { title: s.deities_title, description: s.deities_text, alternates: { canonical: "/deities" } };
}

export default function Page() {
  return <DeitiesView />;
}
