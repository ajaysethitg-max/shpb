"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import ProductView from "./products/[slug]/View";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";
const noop = () => () => {};
const safeDecode = (v: string) => {
  try {
    return decodeURIComponent(v);
  } catch {
    return v;
  }
};

/**
 * A static site has no page for items added to the sheet after the last build.
 * The web server shows this 404 page for them, and we open the item from the live sheet here.
 */
export default function NotFound() {
  const path = useSyncExternalStore(
    noop,
    () => window.location.pathname,
    () => "",
  );
  if (!path) return <div className="min-h-[60vh]" aria-busy="true" />;

  const local = BASE && path.startsWith(BASE) ? path.slice(BASE.length) : path;
  const m = local.match(/^\/products\/([^/]+)\/?$/);
  if (m) return <ProductView slug={safeDecode(m[1])} />;

  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="font-display text-3xl font-extrabold text-espresso-950">Page not found</h1>
      <p className="mt-3 text-espresso-700">The page you are looking for does not exist or has moved.</p>
      <Link href="/" className="btn-gold mt-6 inline-flex rounded-full px-6 py-3 text-[11px] font-extrabold uppercase tracking-[0.16em]">
        Go to home page
      </Link>
    </div>
  );
}
