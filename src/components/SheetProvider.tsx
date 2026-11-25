"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { gvizUrl, loadSheet } from "@/lib/sheet-core";
import type { SheetData, SheetUrls } from "@/lib/types";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

const SheetContext = createContext<SheetData | null>(null);
const SettledContext = createContext<boolean>(false);
const UrlsContext = createContext<SheetUrls | null>(null);

/**
 * Holds the shop data. It starts with the snapshot taken when the site was built, then reloads the
 * Google Sheet in the visitor's browser so edits appear without rebuilding the site.
 * If Google cannot be reached, the snapshot simply stays on screen.
 */
export function SheetProvider({
  initial,
  urls,
  children,
}: {
  initial: SheetData;
  /** Sheet addresses from the build settings. Null = look in /sheet-config.json instead. */
  urls: SheetUrls | null;
  children: ReactNode;
}) {
  const [data, setData] = useState<SheetData>(initial);
  const [settled, setSettled] = useState(false);
  const [activeUrls, setActiveUrls] = useState<SheetUrls | null>(urls);
  const latest = useRef<SheetData>(initial);
  const resolved = useRef<SheetUrls | null>(urls);

  useEffect(() => {
    let dead = false;

    async function resolveUrls(): Promise<SheetUrls | null> {
      if (resolved.current) return resolved.current;
      try {
        const res = await fetch(`${BASE}/sheet-config.json`, { cache: "no-store" });
        if (!res.ok) return null;
        const c = (await res.json()) as { sheet_id?: string; tab_settings?: string; tab_products?: string; tab_deities?: string };
        const id = (c.sheet_id || "").trim();
        if (!id) return null;
        resolved.current = {
          settings: gvizUrl(id, c.tab_settings || "Settings"),
          products: gvizUrl(id, c.tab_products || "Products"),
          deities: gvizUrl(id, c.tab_deities || "Deities"),
        };
        return resolved.current;
      } catch {
        return null;
      }
    }

    async function refresh() {
      const u = await resolveUrls();
      if (dead) return;
      if (!u) {
        setSettled(true);
        return;
      }
      setActiveUrls(u);
      const { data: fresh } = await loadSheet(u, latest.current);
      if (dead) return;
      latest.current = fresh;
      setData(fresh);
      setSettled(true);
    }

    refresh();
    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      dead = true;
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return (
    <SheetContext.Provider value={data}>
      <SettledContext.Provider value={settled}>
        <UrlsContext.Provider value={activeUrls}>{children}</UrlsContext.Provider>
      </SettledContext.Provider>
    </SheetContext.Provider>
  );
}

export function useSheet(): SheetData {
  const ctx = useContext(SheetContext);
  if (!ctx) throw new Error("useSheet must be used inside <SheetProvider>");
  return ctx;
}

/** True once the browser has tried to reload the sheet (whether or not it worked). */
export function useSheetSettled(): boolean {
  return useContext(SettledContext);
}

/** The sheet addresses in use (null when no sheet is connected). */
export function useSheetUrls(): SheetUrls | null {
  return useContext(UrlsContext);
}
