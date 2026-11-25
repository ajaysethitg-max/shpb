"use client";

import Link from "next/link";
import { MapPin, Phone, Mail, Clock, ChevronRight } from "lucide-react";
import { WhatsAppIcon, InstagramIcon, LotusMark } from "./icons";
import SmartImage from "./SmartImage";
import { waLink, telHref } from "@/lib/format";
import { useSheet } from "./SheetProvider";

export default function Footer() {
  const { settings: s } = useSheet();
  const year = new Date().getFullYear();
  const waMsg = `${s.wa_greeting} I would like to know more about ${s.shop_name}.`;

  const shopLinks = [
    { label: "Deities", href: "/deities" },
    { label: "Idols", href: "/idols" },
    { label: "Poshak", href: "/poshak" },
    { label: "Puja Items & Accessories", href: "/puja" },
    { label: "Shop All", href: "/catalog" },
    { label: "Custom Order", href: "/custom-order" },
  ];
  const helpLinks = [
    { label: "About Us", href: "/about" },
    ...(s.shipping_text ? [{ label: "Shipping & Delivery", href: "/about#shipping" }] : []),
    ...(s.returns_text ? [{ label: "Returns & Exchanges", href: "/about#returns" }] : []),
    ...(s.payment_text ? [{ label: "Payment", href: "/about#payment" }] : []),
    { label: "FAQ", href: "/about#faq" },
  ];
  const subLine = [s.city, s.est_year ? `Est. ${s.est_year}` : ""].filter(Boolean).join(" · ");

  return (
    <footer className="relative border-t border-gold-500/20 bg-espresso-950 text-cream-100">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gold-500/70 to-transparent" />

      <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-3">
              <span className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-espresso-800 ring-1 ring-gold-500/50">
                {s.logo_image ? (
                  <SmartImage src={s.logo_image} alt={`${s.shop_name} logo`} fill sizes="64px" className="object-cover" />
                ) : (
                  <LotusMark className="h-7 w-7 text-gold-400" />
                )}
              </span>
              <span className="leading-tight">
                <span className="block font-display text-xl font-bold text-cream-50">{s.brand_line1}</span>
                {s.brand_line2 && (
                  <span className="block text-[9px] font-semibold uppercase tracking-[0.32em] text-gold-400">{s.brand_line2}</span>
                )}
              </span>
            </Link>
            {(s.tagline_hi || s.tagline) && (
              <p className="mt-4 font-hindi text-[13px] leading-relaxed text-gold-200/80">
                {s.tagline_hi || s.tagline}
                {subLine && (
                  <>
                    <br />
                    <span className="font-sans text-[11px] uppercase tracking-[0.18em] text-cream-100/45">{subLine}</span>
                  </>
                )}
              </p>
            )}
            <div className="mt-5 flex items-center gap-2">
              {s.instagram && (
                <a
                  href={s.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-gold-500/30 bg-gold-500/10 p-2.5 text-gold-300 transition-all hover:border-gold-400 hover:text-gold-200"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="h-5 w-5" />
                </a>
              )}
              <a
                href={waLink(s.whatsapp, waMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[#25d366]/30 bg-[#25d366]/10 p-2.5 text-[#25d366] transition-all hover:border-[#25d366]/60"
                aria-label="Chat on WhatsApp"
              >
                <WhatsAppIcon className="h-5 w-5" />
              </a>
              {s.phone && (
                <a
                  href={telHref(s.phone)}
                  className="rounded-full border border-gold-500/30 bg-gold-500/10 p-2.5 text-gold-300 transition-all hover:border-gold-400"
                  aria-label="Call the shop"
                >
                  <Phone className="h-5 w-5" strokeWidth={1.8} />
                </a>
              )}
            </div>
          </div>

          <nav className="lg:col-span-2" aria-label="Shop">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold-500">Shop</h3>
            <ul className="mt-3 space-y-2">
              {shopLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="group flex items-center gap-1 text-[13px] text-cream-100/70 transition-colors hover:text-gold-200">
                    <ChevronRight className="h-3 w-3 text-gold-700 opacity-0 transition-opacity group-hover:opacity-100" />
                    <span className="-ml-4 transition-transform duration-200 group-hover:translate-x-4">{l.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="lg:col-span-2" aria-label="Help">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold-500">Help</h3>
            <ul className="mt-3 space-y-2">
              {helpLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[13px] text-cream-100/70 transition-colors hover:text-gold-200">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold-500">Contact</h3>
            <ul className="mt-3 space-y-2.5 text-[12.5px] leading-relaxed text-cream-100/70">
              {s.address && (
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                  <span>{s.address}</span>
                </li>
              )}
              {s.phone && (
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0 text-gold-500" />
                  <a href={telHref(s.phone)} className="hover:text-gold-200">{s.phone}</a>
                </li>
              )}
              <li className="flex items-center gap-2">
                <WhatsAppIcon className="h-4 w-4 shrink-0 text-gold-500" />
                <a href={waLink(s.whatsapp, waMsg)} target="_blank" rel="noreferrer" className="hover:text-gold-200">
                  {s.whatsapp_display || s.whatsapp}
                </a>
              </li>
              {s.email && (
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0 text-gold-500" />
                  <a href={`mailto:${s.email}`} className="break-all hover:text-gold-200">{s.email}</a>
                </li>
              )}
              {s.hours && (
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 shrink-0 text-gold-500" />
                  {s.hours}
                </li>
              )}
            </ul>
            {s.payment_text && (
              <div className="mt-5 rounded-2xl border border-gold-500/20 bg-espresso-900 p-4">
                <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-gold-400">
                  <LotusMark className="h-4 w-4" /> Payment
                </p>
                <p className="mt-1.5 text-[11px] leading-relaxed text-cream-100/60">{s.payment_text}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-gold-500/15">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-5 py-4 text-[10px] uppercase tracking-[0.18em] text-cream-100/40 sm:flex-row lg:px-8">
          <p>
            © {year} {s.shop_name}
            {s.city ? ` · ${s.city}` : ""}
          </p>
          <p className="flex items-center gap-2">
            <LotusMark className="h-3.5 w-3.5 text-gold-600" />
            जय श्री कृष्ण
          </p>
        </div>
      </div>
    </footer>
  );
}
