"use client";

import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { LotusMark } from "@/components/icons";
import WithQuery from "@/components/WithQuery";
import { useSheet } from "@/components/SheetProvider";

export default function SearchView() {
  return <WithQuery render={(sp) => <SearchResults q={(sp?.get("q") ?? "").trim()} />} />;
}

function SearchResults({ q }: { q: string }) {
  const { products, deities } = useSheet();

  const tokens = q.toLowerCase().split(/\s+/).filter(Boolean).slice(0, 6);
  const results = tokens.length
    ? products
        .filter((p) => {
          const hay = [p.name, p.deity, p.subcategory, p.category, p.materials.join(" "), p.fabrics.join(" "), p.description]
            .join(" ")
            .toLowerCase();
          return tokens.every((t) => hay.includes(t));
        })
        .slice(0, 60)
    : [];

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
      <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-gold-700">
        <LotusMark className="h-4 w-4" /> Search
      </p>
      <h1 className="mt-2 font-display text-3xl font-black text-espresso-950 sm:text-5xl">
        {q ? (
          <>Results for <span className="gold-text italic">“{q}”</span></>
        ) : (
          <>What are you <span className="gold-text italic">looking for?</span></>
        )}
      </h1>
      <p className="mt-2 text-sm text-espresso-600">
        {q
          ? `${results.length} ${results.length === 1 ? "item" : "items"} found`
          : "Type in the search box above, or pick a deity below."}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {deities.map((d) => (
          <Link key={d.name} href={`/search?q=${encodeURIComponent(d.name)}`} className="chip">
            {d.name}
          </Link>
        ))}
      </div>

      {q && results.length === 0 && (
        <div className="mt-10 flex flex-col items-center gap-4 rounded-3xl border border-dashed border-gold-600/40 bg-cream-100 px-6 py-16 text-center">
          <Search className="h-12 w-12 text-gold-700" strokeWidth={1.5} />
          <h2 className="font-display text-2xl font-bold text-espresso-900">Nothing found for “{q}”</h2>
          <p className="max-w-md text-sm leading-relaxed text-espresso-600">
            Send us the details on WhatsApp or place a custom order. We can arrange it for you.
          </p>
          <Link href="/custom-order" className="btn-gold inline-flex items-center gap-2 rounded-full px-6 py-3 text-[11px] font-extrabold uppercase tracking-[0.16em]">
            Request a Custom Piece <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {results.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
