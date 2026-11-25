import type { Metadata } from "next";
import SheetCheckView from "./View";

export const metadata: Metadata = { title: "Sheet check", robots: { index: false, follow: false } };

export default function Page() {
  return <SheetCheckView />;
}
