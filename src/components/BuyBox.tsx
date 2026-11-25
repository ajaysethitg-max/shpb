"use client";

import { useState } from "react";
import { ShoppingBag, Minus, Plus } from "lucide-react";
import type { Product } from "@/lib/types";
import { useCart } from "./CartProvider";
import { WhatsAppIcon } from "./icons";
import { formatINR, waLink, productEnquireMessage } from "@/lib/format";

function Choice({
  label,
  options,
  value,
  onChange,
  error,
}: {
  label: string;
  options: string[];
  value: string | null;
  onChange: (v: string) => void;
  error: boolean;
}) {
  if (options.length === 0) return null;
  return (
    <div className="mt-5">
      <div className="flex items-center justify-between">
        <span className="field-label !mb-0">{label}</span>
        {error && <span className="text-[11px] font-bold uppercase tracking-wider text-sindoor-500">Please choose</span>}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            aria-pressed={value === o}
            className={`min-w-12 rounded-xl border px-3 py-2 text-[12px] font-bold transition-all ${
              value === o
                ? "border-espresso-900 bg-espresso-900 text-gold-300 shadow-md"
                : error
                  ? "border-sindoor-500/60 bg-sindoor-500/5 text-espresso-800"
                  : "border-espresso-900/20 bg-white text-espresso-800 hover:border-espresso-900"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function BuyBox({ product }: { product: Product }) {
  const { addItem, whatsapp, settings, siteUrl, freeShippingThreshold } = useCart();
  const [material, setMaterial] = useState<string | null>(product.materials.length === 1 ? product.materials[0] : null);
  const [fabric, setFabric] = useState<string | null>(product.fabrics.length === 1 ? product.fabrics[0] : null);
  const [size, setSize] = useState<string | null>(product.sizes.length === 1 ? product.sizes[0] : null);
  const [qty, setQty] = useState(1);
  const [showErrors, setShowErrors] = useState(false);

  const isPor = product.price === null;
  const missing =
    (product.materials.length > 0 && !material) ||
    (product.fabrics.length > 0 && !fabric) ||
    (product.sizes.length > 0 && !size);
  const variant = [material, fabric, size].filter(Boolean).join(" · ");

  const waHref = waLink(
    whatsapp,
    `${productEnquireMessage(settings.wa_greeting, product, siteUrl, variant)}${isPor ? "\n\nPlease share the price and availability." : ""}`,
  );

  const handleAdd = () => {
    if (missing) {
      setShowErrors(true);
      return;
    }
    addItem({ slug: product.slug, name: product.name, image: product.image, variant, price: product.price }, qty, true);
  };

  return (
    <div>
      <div className="mt-4 border-y border-espresso-900/12 py-4">
        {isPor ? (
          <>
            <p className="font-display text-3xl font-black text-espresso-950">Price on Request</p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-800">
              Add to your order or ask on WhatsApp to get the price
            </p>
          </>
        ) : (
          <div className="flex flex-wrap items-end gap-x-4 gap-y-1">
            <p className="font-display text-4xl font-black leading-none text-espresso-950">{formatINR(product.price)}</p>
            {freeShippingThreshold > 0 && (
              <p className="pb-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-800">
                Free shipping above {formatINR(freeShippingThreshold)}
              </p>
            )}
          </div>
        )}
      </div>

      <Choice label="Material" options={product.materials} value={material} onChange={setMaterial} error={showErrors && !material} />
      <Choice label="Fabric" options={product.fabrics} value={fabric} onChange={setFabric} error={showErrors && !fabric} />
      <Choice label="Size" options={product.sizes} value={size} onChange={setSize} error={showErrors && !size} />
      {product.sizes.length > 0 && (
        <p className="mt-2 text-[10.5px] text-espresso-500">
          Not sure of the size? Send us a photo of your deity on WhatsApp and we will help.
        </p>
      )}

      <div className="mt-5 flex items-stretch gap-3">
        <div className="flex items-center rounded-2xl border border-espresso-900/20 bg-white">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3 text-espresso-700 hover:text-espresso-950" aria-label="Decrease quantity">
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center font-display text-lg font-bold text-espresso-950">{qty}</span>
          <button onClick={() => setQty((q) => Math.min(99, q + 1))} className="p-3 text-espresso-700 hover:text-espresso-950" aria-label="Increase quantity">
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <button
          onClick={handleAdd}
          disabled={!product.inStock}
          className="btn-gold flex flex-1 items-center justify-center gap-2 rounded-2xl py-4 text-sm font-extrabold uppercase tracking-[0.14em] disabled:opacity-50"
        >
          <ShoppingBag className="h-5 w-5" strokeWidth={2} />
          {product.inStock ? "Add to Order" : "Out of stock"}
        </button>
      </div>

      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-2xl border border-[#25d366]/60 bg-[#25d366]/10 py-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#0e6b34] transition-colors hover:bg-[#25d366]/20"
      >
        <WhatsAppIcon className="h-4 w-4" />
        {isPor ? "Ask for price on WhatsApp" : "Ask about this on WhatsApp"}
      </a>
    </div>
  );
}
