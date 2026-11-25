"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X, RotateCcw, MessageCircle } from "lucide-react";
import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";
import { useCart } from "./CartProvider";
import { waLink } from "@/lib/format";
import { LotusMark } from "./icons";

type SortKey = "featured" | "price-asc" | "price-desc" | "name";
type FacetKey = "materials" | "fabrics" | "subcategory";

const ALL = "All Deities";

export default function CatalogClient({
  products,
  deities,
  facetLabel,
  facetOptions,
  facetKey,
  initialDeity,
  initialFacet,
}: {
  products: Product[];
  deities: string[];
  facetLabel?: string;
  facetOptions?: string[];
  facetKey?: FacetKey;
  initialDeity?: string;
  initialFacet?: string;
}) {
  const { whatsapp, settings } = useCart();
  const [query, setQuery] = useState("");
  const [deity, setDeity] = useState<string>(initialDeity ?? ALL);
  const [facet, setFacet] = useState<string>(initialFacet ?? "All");
  const [sort, setSort] = useState<SortKey>("featured");
  const [mobileFilters, setMobileFilters] = useState(false);

  const deityOptions = useMemo(() => [ALL, ...deities], [deities]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter((p) => {
      // products for "All Deities" (accessories) show under every deity
      if (deity !== ALL && p.deity !== deity && !/^all deities/i.test(p.deity)) return false;
      if (facet !== "All" && facetKey) {
        const v = p[facetKey];
        const has = Array.isArray(v) ? v.includes(facet) : v === facet;
        if (!has) return false;
      }
      if (!q) return true;
      const hay = [p.name, p.deity, p.subcategory, p.materials.join(" "), p.fabrics.join(" "), p.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return q.split(/\s+/).every((t) => hay.includes(t));
    });
    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
        break;
      case "price-desc":
        list = [...list].sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
        break;
      case "name":
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        list = [...list].sort(
          (a, b) => Number(b.featured) - Number(a.featured) || Number(b.bestseller) - Number(a.bestseller),
        );
    }
    return list;
  }, [products, query, deity, facet, sort, facetKey]);

  const activeFilters = (deity !== ALL ? 1 : 0) + (facet !== "All" ? 1 : 0) + (query.trim() ? 1 : 0);

  const reset = () => {
    setQuery("");
    setDeity(ALL);
    setFacet("All");
    setSort("featured");
  };

  const filterPanel = (
    <div className="space-y-5">
      <div>
        <label htmlFor="deity-filter" className="field-label">Deity</label>
        <select id="deity-filter" value={deity} onChange={(e) => setDeity(e.target.value)} className="field">
          {deityOptions.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {facetOptions && facetOptions.length > 0 && facetLabel && (
        <div>
          <span className="field-label">{facetLabel}</span>
          <div className="flex flex-wrap gap-1.5">
            {["All", ...facetOptions].map((opt) => (
              <button key={opt} className="chip" data-active={facet === opt} onClick={() => setFacet(opt)}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeFilters > 0 && (
        <button
          onClick={reset}
          className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-sindoor-500 transition-colors hover:text-espresso-900"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset filters ({activeFilters})
        </button>
      )}

      <div className="rounded-2xl border border-gold-500/30 bg-gold-100 p-4">
        <p className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-gold-800">
          <MessageCircle className="h-4 w-4" /> Need help choosing?
        </p>
        <p className="mt-1.5 text-[11px] leading-relaxed text-espresso-800">
          Not sure about size, material or fabric? Message us on WhatsApp.
        </p>
        <a
          href={waLink(whatsapp, `${settings.wa_greeting} I need help choosing the right item for my deity.`)}
          target="_blank"
          rel="noreferrer"
          className="btn-wa mt-3 flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-[10px] font-extrabold uppercase tracking-[0.14em]"
        >
          Ask on WhatsApp
        </a>
      </div>
    </div>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <aside className="hidden lg:col-span-3 lg:block">
        <div className="sticky top-24 rounded-2xl border border-espresso-900/10 bg-white/60 p-5 backdrop-blur">
          <p className="mb-4 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.25em] text-espresso-800">
            <SlidersHorizontal className="h-4 w-4 text-gold-700" /> Filters
          </p>
          {filterPanel}
        </div>
      </aside>

      <div className="lg:col-span-9">
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-espresso-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search within this collection…"
              className="field h-11 rounded-full pl-11"
              aria-label="Search products in this collection"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-espresso-500 hover:text-espresso-900"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </label>

          <button
            onClick={() => setMobileFilters((v) => !v)}
            className="flex h-11 items-center gap-2 rounded-full border border-espresso-900/15 bg-white px-4 text-[11px] font-bold uppercase tracking-wider text-espresso-800 lg:hidden"
            aria-expanded={mobileFilters}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilters > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-espresso-900 text-[9px] font-extrabold text-gold-300">
                {activeFilters}
              </span>
            )}
          </button>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="field h-11 w-auto rounded-full font-medium"
            aria-label="Sort products"
          >
            <option value="featured">Sort: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>

        {mobileFilters && (
          <div className="mt-3 rounded-2xl border border-espresso-900/10 bg-white/80 p-4 backdrop-blur lg:hidden">{filterPanel}</div>
        )}

        <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-espresso-500">
          {filtered.length} {filtered.length === 1 ? "item" : "items"} found
        </p>

        {filtered.length === 0 ? (
          <div className="mt-6 flex flex-col items-center gap-4 rounded-3xl border border-dashed border-gold-600/40 bg-cream-100 px-6 py-16 text-center">
            <LotusMark className="h-12 w-12 text-gold-600" />
            <h3 className="font-display text-2xl font-bold text-espresso-900">Nothing matches yet</h3>
            <p className="max-w-md text-sm text-espresso-600">Tell us what you need on WhatsApp. We can arrange it for you.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <button onClick={reset} className="btn-gold rounded-full px-6 py-3 text-[11px] font-extrabold uppercase tracking-[0.16em]">
                Clear filters
              </button>
              <a
                href={waLink(whatsapp, `${settings.wa_greeting} I am looking for something specific:`)}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-espresso-900 px-6 py-3 text-[11px] font-extrabold uppercase tracking-[0.16em] text-espresso-900 transition-colors hover:bg-espresso-900 hover:text-gold-300"
              >
                Ask on WhatsApp
              </a>
            </div>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
            {filtered.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
