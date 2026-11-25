"use client";

import Link from "next/link";
import { ChevronRight, MessageCircle, ChevronDown } from "lucide-react";
import { waLink, productEnquireMessage } from "@/lib/format";
import Gallery from "@/components/Gallery";
import BuyBox from "@/components/BuyBox";
import ProductCard from "@/components/ProductCard";
import { useSheet, useSheetSettled } from "@/components/SheetProvider";
import { siteUrlOf } from "@/lib/sheet-core";

export default function ProductView({ slug }: { slug: string }) {
  const { settings: s, products: all } = useSheet();
  const settled = useSheetSettled();
  const product = all.find((p) => p.slug === slug);
  if (!product) return settled ? <ProductMissing /> : <div className="min-h-[60vh]" aria-busy="true" />;
  const url = siteUrlOf(s);

  const related = all
    .filter((p) => p.slug !== product.slug && (p.deity === product.deity || p.category === product.category))
    .sort((a, b) => Number(b.deity === product.deity) - Number(a.deity === product.deity))
    .slice(0, 4);

  const categoryHref = product.category === "idols" ? "/idols" : product.category === "poshak" ? "/poshak" : "/puja";
  const categoryLabel = product.category === "idols" ? s.idols_title : product.category === "poshak" ? s.poshak_title : s.puja_title;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.description || product.name,
    brand: { "@type": "Brand", name: s.shop_name },
    offers:
      product.price !== null
        ? {
            "@type": "Offer",
            priceCurrency: "INR",
            price: product.price,
            availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            seller: { "@type": "Organization", name: s.shop_name },
            url: `${url}/products/${product.slug}`,
          }
        : undefined,
  };

  const accordions = [
    { q: "Details", a: product.details },
    { q: "Shipping & delivery", a: s.shipping_text },
    { q: "Returns & exchange", a: s.returns_text },
    { q: "Payment", a: s.payment_text },
  ].filter((x) => x.a);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-8 lg:px-10">
        <nav className="flex flex-wrap items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-espresso-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gold-800">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={categoryHref} className="hover:text-gold-800">{categoryLabel}</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gold-800">{product.name}</span>
        </nav>

        <div className="mt-5 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <Gallery images={product.images} alt={product.name} />

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-espresso-900 px-3 py-1 text-[9px] font-extrabold uppercase tracking-[0.22em] text-gold-300">{product.deity}</span>
              {product.subcategory && product.subcategory !== product.deity && (
                <span className="rounded-full border border-gold-600/40 bg-gold-100 px-3 py-1 text-[9px] font-extrabold uppercase tracking-[0.22em] text-gold-800">{product.subcategory}</span>
              )}
              {product.bestseller && (
                <span className="rounded-full bg-gold-400 px-3 py-1 text-[9px] font-extrabold uppercase tracking-[0.22em] text-espresso-950">Bestseller</span>
              )}
            </div>

            <h1 className="mt-3 font-display text-3xl font-extrabold leading-[1.12] text-espresso-950 sm:text-4xl">{product.name}</h1>

            {product.description && <p className="mt-4 leading-relaxed text-espresso-700">{product.description}</p>}

            <BuyBox product={product} />

            {accordions.length > 0 && (
              <div className="mt-6 divide-y divide-espresso-900/10 rounded-2xl border border-espresso-900/12 bg-white/70">
                {accordions.map(({ q, a }) => (
                  <details key={q} className="accordion group">
                    <summary className="flex items-center justify-between gap-4 px-5 py-4 text-[12px] font-extrabold uppercase tracking-[0.16em] text-espresso-800">
                      {q}
                      <ChevronDown className="accordion-chevron h-4 w-4 shrink-0 text-gold-700" />
                    </summary>
                    <div className="whitespace-pre-line px-5 pb-4 text-[13px] leading-relaxed text-espresso-700">{a}</div>
                  </details>
                ))}
              </div>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-14 border-t border-espresso-900/10 pt-10">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-display text-2xl font-extrabold text-espresso-950 sm:text-3xl">
                You may <span className="italic text-gold-700">also like</span>
              </h2>
              <a
                href={waLink(s.whatsapp, `${productEnquireMessage(s.wa_greeting, product, url)}\n\nI am also interested in matching items.`)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-gold-800 hover:text-gold-700"
              >
                <MessageCircle className="h-4 w-4" /> Ask on WhatsApp
              </a>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

function ProductMissing() {
  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="font-display text-3xl font-extrabold text-espresso-950">Item not found</h1>
      <p className="mt-3 text-espresso-700">This item may have been removed or renamed.</p>
      <Link href="/catalog" className="btn-gold mt-6 inline-flex rounded-full px-6 py-3 text-[11px] font-extrabold uppercase tracking-[0.16em]">
        Browse all items
      </Link>
    </div>
  );
}
