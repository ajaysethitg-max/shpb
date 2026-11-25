"use client";

import Link from "next/link";
import { X, ShoppingBag, Trash2, Minus, Plus, Truck, ClipboardList } from "lucide-react";
import { useCart, cartKey } from "./CartProvider";
import SmartImage from "./SmartImage";
import { formatINR, waLink, orderMessage } from "@/lib/format";
import { WhatsAppIcon, LotusMark } from "./icons";

export default function CartDrawer() {
  const { items, count, subtotal, porCount, isOpen, closeCart, setQty, removeItem, whatsapp, freeShippingThreshold, settings } =
    useCart();

  const showShipBar = freeShippingThreshold > 0 && subtotal > 0;
  const remaining = Math.max(0, freeShippingThreshold - subtotal);
  const progress = freeShippingThreshold > 0 ? Math.min(100, (subtotal / freeShippingThreshold) * 100) : 0;

  const quickMessage = orderMessage({
    greeting: settings.wa_greeting,
    shopName: settings.shop_name,
    items,
    total: subtotal,
    hasPor: porCount > 0,
  });

  return (
    <>
      <div
        onClick={closeCart}
        aria-hidden="true"
        className={`fixed inset-0 z-[55] bg-espresso-950/70 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your order"
        className={`fixed inset-y-0 right-0 z-[60] flex w-full max-w-md flex-col border-l border-gold-500/25 bg-cream-50 shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-espresso-900/10 bg-espresso-900 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="h-5 w-5 text-gold-400" strokeWidth={1.8} />
            <h2 className="font-display text-lg font-bold text-cream-50">
              Your Order
              <span className="ml-2 text-sm font-medium text-gold-400">
                {count} {count === 1 ? "item" : "items"}
              </span>
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="rounded-full p-2 text-cream-50/70 transition-colors hover:bg-white/5 hover:text-cream-50"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full border border-gold-500/40 bg-gold-100">
              <LotusMark className="h-9 w-9 text-gold-600" />
            </span>
            <h3 className="font-display text-2xl font-bold text-espresso-900">Nothing added yet</h3>
            <p className="max-w-[30ch] text-sm leading-relaxed text-espresso-600">
              Browse idols, poshak and puja items, add what you need, then send the order on WhatsApp.
            </p>
            <Link href="/poshak" onClick={closeCart} className="btn-gold rounded-full px-6 py-3 text-sm font-bold uppercase tracking-wider">
              Explore Poshak
            </Link>
            <Link href="/idols" onClick={closeCart} className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-700 underline underline-offset-4 hover:text-gold-600">
              or see idols
            </Link>
          </div>
        ) : (
          <>
            {showShipBar && (
              <div className="border-b border-espresso-900/10 bg-cream-100 px-5 py-3">
                <div className="flex items-center justify-between gap-3 text-[11px] font-medium text-espresso-700">
                  <span className="flex items-center gap-1.5">
                    <Truck className="h-4 w-4 text-gold-700" />
                    {remaining > 0 ? (
                      <>
                        Add <b className="text-espresso-900">{formatINR(remaining)}</b> more for free shipping
                      </>
                    ) : (
                      <b className="text-peacock-700">Free shipping unlocked</b>
                    )}
                  </span>
                  <span className="text-espresso-500">{Math.round(progress)}%</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-espresso-900/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-200 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="thin-scroll flex-1 overflow-y-auto px-4 py-4">
              <ul className="space-y-3">
                {items.map((item) => {
                  const key = cartKey(item);
                  return (
                    <li key={key} className="card flex gap-3 rounded-2xl p-2.5">
                      <Link
                        href={`/products/${item.slug}`}
                        onClick={closeCart}
                        className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-cream-100"
                      >
                        <SmartImage src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <Link
                              href={`/products/${item.slug}`}
                              onClick={closeCart}
                              className="line-clamp-2 text-[13px] font-semibold leading-snug text-espresso-900 hover:text-gold-800"
                            >
                              {item.name}
                            </Link>
                            {item.variant && (
                              <span className="mt-1 inline-block rounded-full bg-espresso-900 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-gold-300">
                                {item.variant}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => removeItem(key)}
                            className="rounded-lg p-1.5 text-espresso-400 transition-colors hover:bg-sindoor-500/10 hover:text-sindoor-500"
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="flex items-center rounded-full border border-espresso-900/15 bg-white">
                            <button onClick={() => setQty(key, item.qty - 1)} className="p-1.5 text-espresso-700 transition-colors hover:text-espresso-950" aria-label="Decrease quantity">
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-7 text-center text-sm font-bold text-espresso-900">{item.qty}</span>
                            <button onClick={() => setQty(key, item.qty + 1)} className="p-1.5 text-espresso-700 transition-colors hover:text-espresso-950" aria-label="Increase quantity">
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <span className="text-sm font-bold text-espresso-900">
                            {item.price === null ? "Price on request" : formatINR(item.price * item.qty)}
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="border-t border-espresso-900/10 bg-white px-5 py-4">
              {subtotal > 0 && (
                <div className="flex items-center justify-between text-sm text-espresso-600">
                  <span>Total of priced items</span>
                  <span className="font-display text-xl font-extrabold text-espresso-950">{formatINR(subtotal)}</span>
                </div>
              )}
              {porCount > 0 && (
                <p className="mt-1 text-[11px] leading-snug text-espresso-500">
                  {porCount} {porCount === 1 ? "item is" : "items are"} price on request. We will confirm the price on WhatsApp.
                </p>
              )}
              <a
                href={waLink(whatsapp, quickMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-wa mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-extrabold uppercase tracking-[0.14em]"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Send Order on WhatsApp
              </a>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-espresso-900/25 bg-cream-50 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-espresso-800 transition-colors hover:bg-cream-100"
              >
                <ClipboardList className="h-4 w-4" />
                Add delivery details first
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
