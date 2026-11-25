"use client";

import { Suspense, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";

function Inner({ render }: { render: (sp: URLSearchParams | null) => ReactNode }) {
  const sp = useSearchParams();
  return <>{render(sp)}</>;
}

/**
 * Reads the address query (?deity=...) in the browser. The version without a query is what is
 * saved into the static page (so Google sees the full list); the browser then swaps in the
 * filtered one.
 */
export default function WithQuery({ render }: { render: (sp: URLSearchParams | null) => ReactNode }) {
  return (
    <Suspense fallback={render(null)}>
      <Inner render={render} />
    </Suspense>
  );
}
