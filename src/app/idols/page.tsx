import type { Metadata } from "next";
import { getSettings } from "@/lib/store";
import IdolsView from "./View";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return { title: s.idols_title, description: s.idols_text, alternates: { canonical: "/idols" } };
}

export default function Page() {
  return <IdolsView />;
}
