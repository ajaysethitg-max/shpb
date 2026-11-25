import type { Metadata } from "next";
import SearchView from "./View";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false, follow: true },
};

export default function Page() {
  return <SearchView />;
}
