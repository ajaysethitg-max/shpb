"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingBag, Flame, Sparkles, Check } from "lucide-react";
import type { Product } from "@/lib/types";
import { useCart } from "./CartProvider";
import SmartImage from "./SmartImage";
import { WhatsAppIcon } from "./icons";
import { formatINR, waLink, productEnquireMessage } from "@/lib/format";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem, whatsapp, settings, siteUrl } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const isPor = product.price === null;
  const needsChoice = product.materials.length > 1 || product.fabrics.length > 1 || product.sizes.length > 1;
  const attrLine = [
    product.materials.length > 1 ? `${product.materials.length} materials` : product.materials[0],
    product.fabrics.length > 1 ? `${product.fabrics.length} fabrics` : product.fabrics[0],
    product.subcategory,
  ]
    .filter(Boolean)
    .join(" · ");

  const quickAdd = () => {
    const variant = [product.materials[0], product.fabrics[0], product.sizes[0]].filter(Boolean).join(" · ");
    addItem({ slug: product.slug, name: product.name, image: product.image, variant, price: product.price }, 1, true);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  };

  const waHref = waLink(
    whatsapp,
    `${productEnquireMessage(settings.wa_greeting, product, siteUrl)}${isPor ? "\n\nPlease share the price." : ""}`,
  );

  return (
    <article className="card card-hover group relative flex flex-col overflow-hidden rounded-2xl">
      <Link href={`/products/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-cream-100" aria-label={product.name}>
        <SmartImage
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-espresso-950/45 via-transparent to-transparent opacity-70" />
        <div className="absolute left-2 top-2 flex flex-col gap-1.5">
          {product.bestseller && (
            <span className="flex items-center gap-1 rounded-full bg-gold-400/95 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.14em] text-espresso-950 shadow">
              <Flame className="h-3 w-3" /> Bestseller
            </span>
          )}
          {product.featured && (
            <span className="flex items-center gap-1 rounded-full bg-espresso-900/90 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.14em] text-gold-300 ring-1 ring-gold-500/40 backdrop-blur-sm">
              <Sparkles className="h-3 w-3" /> Featured
            </span>
          )}
          {!product.inStock && (
            <span className="rounded-full bg-sindoor-500 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.14em] text-white">
              Out of stock
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-3 sm:p-3.5">
        <span className="text-[9px] font-extrabold uppercase tracking-[0.22em] text-gold-700">{product.deity}</span>
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 min-h-[2.4rem] text-[13px] font-semibold leading-snug text-espresso-900 transition-colors hover:text-gold-800 sm:text-[13.5px]">
            {product.name}
          </h3>
        </Link>
        {attrLine && (
          <p className="line-clamp-1 text-[10px] font-medium uppercase tracking-[0.12em] text-espresso-500">{attrLine}</p>
        )}

        <div className="mt-auto pt-2 leading-tight">
          {isPor ? (
            <>
              <span className="block font-display text-[15px] font-extrabold text-espresso-900">Price on Request</span>
              <span className="text-[9px] font-medium uppercase tracking-wider text-espresso-500">Ask on WhatsApp</span>
            </>
          ) : (
            <span className="block font-display text-[17px] font-extrabold text-espresso-950">{formatINR(product.price)}</span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {needsChoice ? (
            <Link
              href={`/products/${product.slug}`}
              className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-espresso-900 bg-espresso-900 text-[10px] font-extrabold uppercase tracking-[0.12em] text-gold-300 transition-colors hover:bg-espresso-800"
            >
              <ShoppingBag className="h-4 w-4" strokeWidth={1.8} />
              Choose Options
            </Link>
          ) : (
            <button
              onClick={quickAdd}
              disabled={!product.inStock}
              className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-espresso-900 bg-espresso-900 text-[10px] font-extrabold uppercase tracking-[0.12em] text-gold-300 transition-colors hover:bg-espresso-800 disabled:opacity-50"
            >
              {justAdded ? <Check className="h-4 w-4" strokeWidth={2.4} /> : <ShoppingBag className="h-4 w-4" strokeWidth={1.8} />}
              {justAdded ? "Added" : "Add to Order"}
            </button>
          )}
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#25d366]/50 bg-[#25d366]/10 text-[#128c4a] transition-all hover:bg-[#25d366]/25"
            aria-label={`Ask about ${product.name} on WhatsApp`}
            title="Ask on WhatsApp"
          >
            <WhatsAppIcon className="h-5 w-5" />
          </a>
        </div>
      </div>
    </article>
  );
}
