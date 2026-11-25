"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Search, ShoppingBag, Phone, MapPin, ChevronRight } from "lucide-react";
import { useCart } from "./CartProvider";
import { WhatsAppIcon, LotusMark } from "./icons";
import SmartImage from "./SmartImage";
import { waLink, telHref } from "@/lib/format";

const NAV = [
  { href: "/deities", label: "Deities" },
  { href: "/idols", label: "Idols" },
  { href: "/poshak", label: "Poshak" },
  { href: "/puja", label: "Puja & Accessories" },
  { href: "/catalog", label: "Shop All" },
  { href: "/custom-order", label: "Custom Order" },
  { href: "/about", label: "About Us" },
];

export default function Header() {
  const { count, openCart, settings: s, whatsapp } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const submitSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const q = query.trim();
    setMenuOpen(false);
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  };

  const marqueeChunk = (s.announcement || "").split("•").map((x) => x.trim()).filter(Boolean);
  const marqueeItems = [...marqueeChunk, ...marqueeChunk];

  const words = s.brand_line1.trim().split(/\s+/);
  const lastWord = words.length > 1 ? words.pop() : "";
  const firstWords = words.join(" ");
  const subLine = [s.city, s.est_year ? `Est. ${s.est_year}` : ""].filter(Boolean).join(" · ");

  return (
    <header className="relative z-40">
      {marqueeChunk.length > 0 && (
        <div className="overflow-hidden border-b border-gold-500/15 bg-espresso-950 py-1.5">
          <div className="animate-marquee flex w-max items-center gap-8 whitespace-nowrap">
            {marqueeItems.map((item, i) => (
              <span
                key={i}
                className="flex items-center gap-8 text-[10px] font-medium uppercase tracking-[0.18em] text-gold-300/90"
              >
                {item}
                <LotusMark className="h-3 w-3 text-gold-600" />
              </span>
            ))}
          </div>
        </div>
      )}

      <div
        className={`sticky top-0 border-b border-gold-500/15 bg-espresso-900/95 backdrop-blur-md transition-shadow duration-300 ${
          scrolled ? "shadow-[0_10px_40px_-15px_rgba(0,0,0,0.7)]" : ""
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-3 sm:gap-5 sm:px-5 md:h-[4.5rem] lg:px-8">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-lg p-2 text-gold-200 transition-colors hover:bg-white/5 lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <Link href="/" className="group flex min-w-0 items-center gap-2.5 sm:gap-3" onClick={() => setMenuOpen(false)}>
            <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-espresso-800 ring-1 ring-gold-500/50 transition-shadow duration-300 group-hover:shadow-[0_0_18px_rgba(202,164,79,0.4)] md:h-14 md:w-14">
              {s.logo_image ? (
                <SmartImage src={s.logo_image} alt={`${s.shop_name} logo`} fill sizes="56px" className="object-cover" priority />
              ) : (
                <LotusMark className="h-6 w-6 text-gold-400" />
              )}
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block font-display text-[1.05rem] font-bold tracking-wide text-cream-50 transition-colors group-hover:text-gold-200 sm:text-xl lg:text-[1.35rem]">
                {firstWords || lastWord ? (
                  <>
                    {firstWords} {lastWord && <span className="gold-text">{lastWord}</span>}
                  </>
                ) : (
                  s.shop_name
                )}
              </span>
              {s.brand_line2 && (
                <span className="block text-[8px] font-semibold uppercase tracking-[0.32em] text-gold-400 sm:text-[9.5px]">
                  {s.brand_line2}
                </span>
              )}
              {subLine && (
                <span className="hidden text-[8px] uppercase tracking-[0.2em] text-cream-50/35 md:block">{subLine}</span>
              )}
            </span>
          </Link>

          <form onSubmit={submitSearch} className="mx-auto hidden max-w-md flex-1 md:flex" role="search">
            <label className="group relative flex w-full items-center">
              <Search className="pointer-events-none absolute left-4 h-4 w-4 text-espresso-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search deity, poshak, idol, mala…"
                className="h-11 w-full rounded-full border border-transparent bg-cream-50 pl-11 pr-4 text-sm text-espresso-900 placeholder-espresso-500/70 outline-none transition-all focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
                aria-label="Search products"
              />
            </label>
          </form>

          <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2 md:ml-0">
            {s.phone && (
              <>
                <a href={telHref(s.phone)} className="hidden flex-col items-end leading-tight xl:flex" aria-label={`Call us at ${s.phone}`}>
                  <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-cream-50/45">Call the shop</span>
                  <span className="text-sm font-semibold text-gold-300 transition-colors hover:text-gold-200">{s.phone}</span>
                </a>
                <a href={telHref(s.phone)} className="rounded-full p-2 text-gold-300 transition-colors hover:bg-white/5 md:p-2.5 xl:hidden" aria-label="Call us">
                  <Phone className="h-5 w-5" strokeWidth={1.8} />
                </a>
              </>
            )}
            <a
              href={waLink(whatsapp, `${s.wa_greeting} I have a question.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full bg-[#25d366]/15 p-2.5 text-[#25d366] ring-1 ring-[#25d366]/30 transition-all hover:bg-[#25d366]/25 sm:block"
              aria-label="Chat on WhatsApp"
            >
              <WhatsAppIcon className="h-5 w-5" />
            </a>
            <button
              onClick={openCart}
              className="relative rounded-full p-2 text-cream-50 transition-colors hover:bg-white/5 md:p-2.5"
              aria-label={`Open your order, ${count} items`}
            >
              <ShoppingBag className="h-6 w-6" strokeWidth={1.6} />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-500 px-1 text-[10px] font-bold text-espresso-950 ring-2 ring-espresso-900">
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </button>
          </div>
        </div>

        <form onSubmit={submitSearch} className="border-t border-white/5 px-3 pb-2.5 pt-2 md:hidden" role="search">
          <label className="relative flex w-full items-center">
            <Search className="pointer-events-none absolute left-4 h-4 w-4 text-espresso-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search deity, poshak, idol, mala…"
              className="h-10 w-full rounded-full border border-transparent bg-cream-50 pl-11 pr-4 text-sm placeholder-espresso-500/70 outline-none focus:border-gold-500"
              aria-label="Search products"
            />
          </label>
        </form>

        <nav className="hidden border-t border-gold-500/10 lg:block" aria-label="Primary">
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-7 px-8">
            {NAV.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative py-3.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors ${
                    active ? "text-gold-300" : "text-cream-50/60 hover:text-gold-200"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute inset-x-0 bottom-0 h-0.5 origin-center bg-gradient-to-r from-transparent via-gold-400 to-transparent transition-transform duration-300 ${
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
          </div>
        </nav>

        <div
          className={`overflow-hidden border-gold-500/15 bg-espresso-900 transition-[max-height,opacity] duration-300 ease-in-out lg:hidden ${
            menuOpen ? "max-h-[560px] border-t opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="space-y-1 px-4 py-4">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-cream-50/80 transition-colors hover:bg-white/5 hover:text-gold-300"
              >
                {item.label}
                <ChevronRight className="h-4 w-4 text-gold-600" />
              </Link>
            ))}
            <a
              href={waLink(whatsapp, `${s.wa_greeting} I have a question.`)}
              target="_blank"
              rel="noreferrer"
              className="btn-wa mt-2 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Chat with us on WhatsApp
            </a>
            {s.address_short && (
              <p className="flex items-start gap-2 px-2 pt-2 text-[11px] leading-relaxed text-cream-50/45">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                {s.address_short}
              </p>
            )}
            {s.whatsapp_display && <p className="px-2 text-[11px] text-cream-50/45">{s.whatsapp_display}</p>}
          </div>
        </div>
      </div>
    </header>
  );
}
