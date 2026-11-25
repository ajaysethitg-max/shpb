"use client";

import Link from "next/link";
import { Info } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import CatalogClient from "@/components/CatalogClient";
import WithQuery from "@/components/WithQuery";
import { useSheet } from "@/components/SheetProvider";
import { distinct } from "@/lib/sheet-core";

export default function PujaView() {
  const { settings: s, products: all, deities } = useSheet();
  const items = all.filter((p) => p.category === "puja");
  const subcats = distinct(items.map((p) => [p.subcategory]));

  return (
    <>
      <PageHeader kicker={s.shop_name} title={s.puja_title} description={s.puja_text}>
        <div className="scrollbar-none -mx-1 flex gap-2 overflow-x-auto pb-1">
          {subcats.map((c) => (
            <Link
              key={c}
              href={`/puja?subcategory=${encodeURIComponent(c)}`}
              className="chip !border-gold-500/40 !bg-gold-500/10 !text-gold-200 hover:!border-gold-400"
            >
              {c}
            </Link>
          ))}
        </div>
      </PageHeader>

      {s.puja_note && (
        <div className="border-b border-espresso-900/10 bg-espresso-900">
          <div className="mx-auto flex max-w-7xl items-start gap-2 px-5 py-3 text-[12px] leading-snug text-cream-100/80 sm:px-8 lg:px-10">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
            <span>{s.puja_note}</span>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-12">
        <WithQuery
          render={(sp) => (
            <CatalogClient
              key={`${sp?.get("deity")}|${sp?.get("subcategory")}`}
              products={items}
              deities={deities.map((d) => d.name)}
              facetKey="subcategory"
              facetLabel="Category"
              facetOptions={subcats}
              initialDeity={sp?.get("deity") ?? undefined}
              initialFacet={sp?.get("subcategory") ?? undefined}
            />
          )}
        />
      </div>
    </>
  );
}
