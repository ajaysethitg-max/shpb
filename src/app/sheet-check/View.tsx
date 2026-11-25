"use client";

import { useEffect, useState } from "react";
import { fetchRows, findHeaderRow } from "@/lib/sheet-core";
import { useSheet, useSheetSettled, useSheetUrls } from "@/components/SheetProvider";

type TabReport = { tab: string; error?: string; rows?: number; headerRow?: number; header?: string[]; sample?: string[][] };

/** Shows what the browser can read from the Google Sheet. Open /sheet-check/ on your website. */
export default function SheetCheckView() {
  const urls = useSheetUrls();
  const data = useSheet();
  const settled = useSheetSettled();
  const [reports, setReports] = useState<TabReport[] | null>(null);

  useEffect(() => {
    if (!urls) return;
    let dead = false;
    (async () => {
      const out: TabReport[] = [];
      for (const tab of ["settings", "products", "deities"] as const) {
        const { rows, error } = await fetchRows(urls[tab]);
        if (!rows) {
          out.push({ tab, error: error || "no data" });
          continue;
        }
        const at = findHeaderRow(rows);
        out.push({
          tab,
          rows: rows.length,
          headerRow: at + 1,
          header: rows[at]?.slice(0, 8),
          sample: rows.slice(at + 1, at + 4).map((r) => r.slice(0, 4).map((c) => c.slice(0, 40))),
        });
      }
      if (!dead) setReports(out);
    })();
    return () => {
      dead = true;
    };
  }, [urls]);

  const s = data.settings;
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 text-sm text-espresso-800">
      <h1 className="font-display text-2xl font-extrabold">Sheet check</h1>
      <p className="mt-2">
        Sheet connected: <b>{urls ? "yes" : "NO (no Sheet ID found)"}</b> · Live reload finished: <b>{settled ? "yes" : "not yet"}</b>
      </p>
      <p className="mt-1">
        Products on the website: <b>{data.products.length}</b> · Deities: <b>{data.deities.length}</b>
      </p>
      <p className="mt-1">Shop name: <b>{s.shop_name}</b> · Phone: <b>{s.phone || "(blank)"}</b></p>
      <p className="mt-1 break-all">logo_image: <b>{s.logo_image || "(blank)"}</b></p>
      <p className="mt-1 break-all">hero_image: <b>{s.hero_image || "(blank)"}</b></p>

      {urls && !reports && <p className="mt-6">Reading the sheet…</p>}
      {reports?.map((r) => (
        <div key={r.tab} className="mt-6 rounded-xl border border-espresso-900/15 bg-white/70 p-4">
          <h2 className="font-bold uppercase tracking-wider">{r.tab}</h2>
          {r.error ? (
            <p className="mt-1 text-red-700">Could not read: {r.error}</p>
          ) : (
            <>
              <p className="mt-1">Rows read: {r.rows} · Header found on row {r.headerRow}</p>
              <p className="mt-1 break-words">Columns: {r.header?.join(" | ")}</p>
              <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-xs">{r.sample?.map((x) => x.join(" | ")).join("\n")}</pre>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

