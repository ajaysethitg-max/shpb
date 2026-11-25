import type { Metadata } from "next";
import { getSettings } from "@/lib/store";
import PoshakView from "./View";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return { title: s.poshak_title, description: s.poshak_text, alternates: { canonical: "/poshak" } };
}

export default function Page() {
  return <PoshakView />;
}
