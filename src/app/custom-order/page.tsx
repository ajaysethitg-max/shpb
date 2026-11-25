import type { Metadata } from "next";
import { getSettings } from "@/lib/store";
import CustomOrderView from "./View";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return { title: "Custom Order", description: s.custom_intro, alternates: { canonical: "/custom-order" } };
}

export default function Page() {
  return <CustomOrderView />;
}
