"use client";

import { Check } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import CatalogClient from "@/components/CatalogClient";
import { list } from "@/lib/defaults";
import WithQuery from "@/components/WithQuery";
import { useSheet } from "@/components/SheetProvider";
import { distinct } from "@/lib/sheet-core";

export default function PoshakView() {
  const { settings: s, products: all, deities } = useSheet();
  const items = all.filter((p) => p.category === "poshak");

  return (
    <>
      <PageHeader kicker={s.shop_name} title={s.poshak_title} description={s.poshak_text}>
        <div className="flex flex-wrap gap-2">
          {list(s.poshak_badges).map((t) => (
            <span key={t} className="inline-flex items-center gap-2 rounded-full border border-gold-500/35 bg-gold-500/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-gold-200">
              <Check className="h-4 w-4" /> {t}
            </span>
          ))}
        </div>
      </PageHeader>
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-12">
        <WithQuery
          render={(sp) => (
            <CatalogClient
              key={`${sp?.get("deity")}|${sp?.get("fabric")}`}
              products={items}
              deities={deities.map((d) => d.name)}
              facetKey="fabrics"
              facetLabel="Fabric"
              facetOptions={distinct(items.map((p) => p.fabrics))}
              initialDeity={sp?.get("deity") ?? undefined}
              initialFacet={sp?.get("fabric") ?? undefined}
            />
          )}
        />
      </div>
    </>
  );
}
