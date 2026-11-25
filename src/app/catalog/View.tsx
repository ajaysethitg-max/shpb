"use client";

import PageHeader from "@/components/PageHeader";
import CatalogClient from "@/components/CatalogClient";
import { useSheet } from "@/components/SheetProvider";

export default function CatalogView() {
  const { settings: s, products: items, deities } = useSheet();
  return (
    <>
      <PageHeader kicker={s.shop_name} title="Shop All" description={s.catalog_text} />
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-12">
        <CatalogClient products={items} deities={deities.map((d) => d.name)} />
      </div>
    </>
  );
}
