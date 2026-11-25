"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingBag, ArrowLeft, Lock } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import SmartImage from "@/components/SmartImage";
import { formatINR, waLink, orderMessage } from "@/lib/format";
import { WhatsAppIcon, LotusMark } from "@/components/icons";

export default function CheckoutPage() {
  const { items, subtotal, porCount, clearCart, whatsapp, settings, freeShippingThreshold } = useCart();

  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "", state: "", pincode: "", notes: "" });
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const message = orderMessage({
    greeting: settings.wa_greeting,
    shopName: settings.shop_name,
    items,
    total: subtotal,
    hasPor: porCount > 0,
    customer: {
      name: form.name.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      pincode: form.pincode.trim(),
      notes: form.notes.trim(),
    },
  });

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.name.trim().length < 2) return setError("Please enter your name.");
    if (form.phone.replace(/\D/g, "").length < 10) return setError("Please enter your 10-digit mobile number.");
    if (items.length === 0) return setError("Your order is empty. Add something first.");
    window.open(waLink(whatsapp, message), "_blank", "noopener");
    setSent(true);
  };

  if (sent) {
    return (
      <div className="mx-auto max-w-xl px-5 py-16 text-center sm:px-8">
        <LotusMark className="mx-auto h-14 w-14 text-gold-600" />
        <h1 className="mt-5 font-display text-3xl font-black text-espresso-950 sm:text-4xl">
          WhatsApp <span className="gold-text italic">opened</span>
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-espresso-700">
          Press <b>Send</b> in WhatsApp to place your order. We will reply there to confirm availability, price and delivery.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a
            href={waLink(whatsapp, message)}
            target="_blank"
            rel="noreferrer"
            className="btn-wa inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-xs font-extrabold uppercase tracking-[0.16em]"
          >
            <WhatsAppIcon className="h-5 w-5" /> Open WhatsApp again
          </a>
          <button
            onClick={() => {
              clearCart();
              setSent(false);
            }}
            className="rounded-full border border-espresso-900 px-6 py-3.5 text-xs font-extrabold uppercase tracking-[0.16em] text-espresso-900 transition-colors hover:bg-espresso-900 hover:text-gold-300"
          >
            Order sent, clear my list
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-5 py-20 text-center">
        <LotusMark className="mx-auto h-16 w-16 text-gold-600" />
        <h1 className="mt-4 font-display text-3xl font-extrabold text-espresso-950">Your order is empty</h1>
        <p className="mt-2 text-sm text-espresso-600">Add idols, poshak or puja items first.</p>
        <Link href="/poshak" className="btn-gold mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-xs font-extrabold uppercase tracking-[0.16em]">
          Explore Poshak <ShoppingBag className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const freeLeft = freeShippingThreshold > 0 ? Math.max(0, freeShippingThreshold - subtotal) : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8 lg:px-10">
      <Link href="/catalog" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-espresso-500 hover:text-gold-800">
        <ArrowLeft className="h-4 w-4" /> Continue shopping
      </Link>
      <h1 className="mt-3 font-display text-3xl font-black text-espresso-950 sm:text-4xl">
        Send your <span className="gold-text italic">Order</span>
      </h1>
      {settings.order_note && (
        <p className="mt-1.5 flex items-start gap-2 text-[12px] font-semibold text-peacock-700">
          <Lock className="mt-0.5 h-4 w-4 shrink-0" /> {settings.order_note}
        </p>
      )}

      <form onSubmit={send} className="mt-6 grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <fieldset className="card rounded-2xl p-5 sm:p-6">
            <legend className="sr-only">Your details</legend>
            <p className="field-label">Your details</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input className="field" placeholder="Full name *" required value={form.name} onChange={set("name")} aria-label="Full name" />
              <input className="field" placeholder="Mobile number *" required inputMode="tel" value={form.phone} onChange={set("phone")} aria-label="Mobile number" />
            </div>
          </fieldset>

          <fieldset className="card rounded-2xl p-5 sm:p-6">
            <legend className="sr-only">Delivery address</legend>
            <p className="field-label">Delivery address (optional for shop pickup)</p>
            <textarea className="field mt-3 min-h-20" placeholder="House / street / area" value={form.address} onChange={set("address")} aria-label="Address" />
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <input className="field" placeholder="City" value={form.city} onChange={set("city")} aria-label="City" />
              <input className="field" placeholder="State" value={form.state} onChange={set("state")} aria-label="State" />
              <input className="field" placeholder="PIN code" inputMode="numeric" maxLength={6} value={form.pincode} onChange={set("pincode")} aria-label="PIN code" />
            </div>
            <textarea className="field mt-3 min-h-16" placeholder="Notes (optional)" value={form.notes} onChange={set("notes")} aria-label="Order notes" />
          </fieldset>

          {error && (
            <p role="alert" className="rounded-xl border border-sindoor-500/40 bg-sindoor-500/10 px-4 py-3 text-sm font-semibold text-sindoor-500">
              {error}
            </p>
          )}
        </div>

        <aside className="lg:col-span-5">
          <div className="sticky top-24 overflow-hidden rounded-2xl border border-gold-500/30 bg-espresso-900 shadow-2xl">
            <div className="border-b border-gold-500/20 px-6 py-4">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-gold-400">Your order</p>
            </div>
            <ul className="thin-scroll max-h-64 space-y-3 overflow-y-auto px-5 py-4">
              {items.map((i) => (
                <li key={`${i.slug}-${i.variant}`} className="flex items-center gap-3">
                  <span className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-espresso-800">
                    <SmartImage src={i.image} alt={i.name} fill sizes="56px" className="object-cover" />
                    <span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-bl-lg bg-gold-500 text-[9px] font-extrabold text-espresso-950">{i.qty}</span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-2 text-[11.5px] font-semibold leading-snug text-cream-100">{i.name}</span>
                    {i.variant && <span className="mt-0.5 block text-[9px] font-bold uppercase tracking-widest text-gold-500">{i.variant}</span>}
                  </span>
                  <span className="text-right text-[12px] font-bold text-gold-200">
                    {i.price === null ? "On request" : formatINR(i.price * i.qty)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="space-y-1.5 border-t border-gold-500/20 px-6 py-4 text-sm text-cream-100/80">
              {subtotal > 0 && (
                <div className="flex justify-between font-display text-lg font-extrabold text-gold-200">
                  <span>Total of priced items</span>
                  <span>{formatINR(subtotal)}</span>
                </div>
              )}
              {porCount > 0 && <p className="text-[11px] text-cream-100/55">{porCount} item(s) are price on request. We will confirm on WhatsApp.</p>}
              {freeLeft > 0 && subtotal > 0 && (
                <p className="text-[11px] text-cream-100/55">Add {formatINR(freeLeft)} more for free shipping.</p>
              )}
            </div>
            <div className="px-6 pb-6">
              <button type="submit" className="btn-wa flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-extrabold uppercase tracking-[0.16em]">
                <WhatsAppIcon className="h-5 w-5" /> Send Order on WhatsApp
              </button>
              <p className="mt-3 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-cream-100/40">
                No login or payment on this site
              </p>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}
