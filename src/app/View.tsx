"use client";

import Link from "next/link";
import { ArrowRight, MapPin, Phone, Clock, ChevronDown, Scissors, ShieldCheck } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import SmartImage from "@/components/SmartImage";
import { WhatsAppIcon, LotusMark, InstagramIcon } from "@/components/icons";
import { list } from "@/lib/defaults";
import { waLink, telHref } from "@/lib/format";
import { useSheet } from "@/components/SheetProvider";
import { distinct } from "@/lib/sheet-core";

export default function HomeView() {
  const { settings: s, products, deities } = useSheet();

  const featuredList = products.filter((p) => p.featured);
  const featured = (featuredList.length ? featuredList : products).slice(0, 8);

  const count = (c: string) => products.filter((p) => p.category === c).length;
  const sub = (custom: string, auto: string[]) => custom || auto.slice(0, 6).join(" · ");

  const categories = [
    {
      href: "/idols",
      image: s.cat_idols_image,
      title: s.cat_idols_title,
      sub: sub(s.cat_idols_sub, distinct(products.filter((p) => p.category === "idols").map((p) => p.materials))),
      meta: `${count("idols")} items`,
    },
    {
      href: "/poshak",
      image: s.cat_poshak_image,
      title: s.cat_poshak_title,
      sub: sub(s.cat_poshak_sub, distinct(products.filter((p) => p.category === "poshak").map((p) => p.fabrics))),
      meta: `${count("poshak")} items`,
    },
    {
      href: "/puja",
      image: s.cat_puja_image,
      title: s.cat_puja_title,
      sub: sub(s.cat_puja_sub, distinct(products.filter((p) => p.category === "puja").map((p) => [p.subcategory]))),
      meta: `${count("puja")} items`,
    },
  ];

  const badges = [s.hero_badge_1, s.hero_badge_2, s.hero_badge_3].filter(Boolean);
  const customPoints = list(s.custom_points);
  const kicker = [s.city, s.est_year ? `Est. ${s.est_year}` : ""].filter(Boolean).join(" · ");

  const contact = [
    s.address && { icon: MapPin, label: "Visit the Shop", lines: [s.address], href: s.maps_link || undefined, cta: s.maps_link ? "Get directions" : "" },
    (s.phone || s.whatsapp_display) && {
      icon: Phone,
      label: "Call or WhatsApp",
      lines: [s.phone, s.whatsapp_display ? `${s.whatsapp_display} (WhatsApp)` : ""].filter(Boolean),
      href: s.phone ? telHref(s.phone) : waLink(s.whatsapp, s.wa_greeting),
      cta: "Tap to call",
    },
    s.hours && { icon: Clock, label: "Shop Hours", lines: [s.hours], href: s.instagram || undefined, cta: s.instagram ? "See us on Instagram" : "" },
  ].filter(Boolean) as { icon: typeof MapPin; label: string; lines: string[]; href?: string; cta: string }[];

  return (
    <>
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative overflow-hidden bg-espresso-950">
        {s.hero_image && (
          <SmartImage
            src={s.hero_image}
            alt={s.shop_name}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[72%_center] sm:object-[65%_center] lg:object-center"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-espresso-950/98 via-espresso-950/70 to-espresso-950/5 sm:via-espresso-950/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso-950 via-transparent to-espresso-950/40" />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 top-0 h-[34rem] w-[34rem] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(202,164,79,0.16) 0%, transparent 65%)" }}
        />

        <div className="relative mx-auto flex min-h-[78svh] max-w-7xl flex-col justify-center px-5 pb-24 pt-16 sm:px-8 lg:px-10">
          <div className="max-w-2xl">
            {kicker && (
              <div className="animate-fade-up flex items-center gap-3" style={{ animationDelay: "0.05s" }}>
                <span className="h-px w-10 bg-gold-500" />
                <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-gold-300 sm:text-[11px]">{kicker}</span>
              </div>
            )}

            <h1
              className="animate-fade-up mt-5 font-display text-[2.6rem] font-black leading-[1.04] text-cream-50 sm:text-6xl lg:text-[4.4rem]"
              style={{ animationDelay: "0.15s" }}
            >
              {s.hero_title_1}
              <br />
              <span className="gold-text italic">{s.hero_title_2}</span>
            </h1>
            {s.tagline_hi && (
              <p className="animate-fade-up mt-4 font-hindi text-lg text-gold-200/95 sm:text-2xl" style={{ animationDelay: "0.25s" }}>
                {s.tagline_hi}
              </p>
            )}
            {s.hero_text && (
              <p className="animate-fade-up mt-4 max-w-lg text-[15px] leading-relaxed text-cream-100/80" style={{ animationDelay: "0.32s" }}>
                {s.hero_text}
              </p>
            )}

            <div className="animate-fade-up mt-7 flex flex-wrap items-center gap-3" style={{ animationDelay: "0.4s" }}>
              <Link href="/poshak" className="btn-gold inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-xs font-extrabold uppercase tracking-[0.16em] sm:text-[13px]">
                Explore Poshak
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={waLink(s.whatsapp, `${s.wa_greeting} I would like to enquire about your collection.`)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-gold-400/50 bg-espresso-950/40 px-6 py-3.5 text-xs font-extrabold uppercase tracking-[0.16em] text-gold-200 backdrop-blur-sm transition-all hover:border-gold-300 hover:bg-espresso-950/70"
              >
                <WhatsAppIcon className="h-5 w-5 text-[#25d366]" />
                WhatsApp Us
              </a>
            </div>

            {badges.length > 0 && (
              <div className="animate-fade-up mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-[11px] font-medium text-cream-100/65" style={{ animationDelay: "0.48s" }}>
                {badges.map((b) => (
                  <span key={b} className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-gold-400" /> {b}
                  </span>
                ))}
              </div>
            )}
          </div>

          <a href="#categories" className="absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-cream-100/45 transition-colors hover:text-gold-300" aria-label="Scroll to collections">
            <span className="text-[9px] font-bold uppercase tracking-[0.3em]">Explore</span>
            <ChevronDown className="h-5 w-5 animate-bounce" />
          </a>
        </div>
      </section>

      {/* ═══════════════ CATEGORIES ═══════════════ */}
      <section id="categories" className="relative bg-cream-50 py-14 sm:py-18 lg:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-gold-700">
                <LotusMark className="h-4 w-4 text-gold-600" /> Our Collections
              </p>
              <h2 className="mt-2 font-display text-3xl font-extrabold text-espresso-950 sm:text-4xl lg:text-5xl">
                Shop by <span className="italic text-gold-700">Collection</span>
              </h2>
            </div>
            <Link href="/catalog" className="group flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-espresso-800 transition-colors hover:text-gold-800">
              View everything
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {categories.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="group relative h-56 overflow-hidden rounded-2xl ring-1 ring-espresso-900/10 transition-all duration-500 hover:ring-gold-500/50 sm:h-72 lg:h-96"
              >
                <SmartImage
                  src={c.image}
                  alt={c.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso-950/95 via-espresso-950/35 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-gold-400">{c.meta}</p>
                  <h3 className="mt-1 font-display text-2xl font-bold text-cream-50 transition-colors group-hover:text-gold-200 lg:text-3xl">{c.title}</h3>
                  {c.sub && <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-cream-100/65">{c.sub}</p>}
                  <span className="mt-3 inline-flex items-center gap-2 rounded-full border border-gold-400/50 bg-gold-500/10 px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-gold-300 transition-all group-hover:gap-3 group-hover:border-gold-300">
                    Explore <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ DEITY RAIL ═══════════════ */}
      <section className="border-y border-gold-500/20 bg-espresso-900 py-10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <p className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-gold-400">{s.deities_title}</p>
          <div className="scrollbar-none -mx-5 mt-5 flex gap-4 overflow-x-auto px-5 pb-2 sm:gap-6 sm:px-8 lg:justify-center">
            {deities.map((d) => (
              <Link key={d.name} href={`/search?q=${encodeURIComponent(d.name)}`} className="group flex w-24 shrink-0 flex-col items-center gap-2 sm:w-28">
                <span className="flex h-20 w-20 items-center justify-center rounded-full border border-gold-500/35 bg-gradient-to-b from-espresso-800 to-espresso-950 shadow-[inset_0_2px_6px_rgba(202,164,79,0.15)] transition-all duration-300 group-hover:border-gold-400">
                  <span className="font-hindi text-xl text-gold-300 transition-transform duration-300 group-hover:scale-110 sm:text-2xl">{d.mono}</span>
                </span>
                <span className="text-center text-[9px] font-semibold uppercase leading-tight tracking-[0.12em] text-cream-100/60 transition-colors group-hover:text-gold-300">
                  {d.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURED ═══════════════ */}
      {featured.length > 0 && (
        <section className="bg-cream-50 py-14 sm:py-18 lg:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-3xl font-extrabold text-espresso-950 sm:text-4xl lg:text-5xl">
                Featured <span className="italic text-gold-700">Items</span>
              </h2>
              <Link href="/catalog" className="group flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-espresso-800 transition-colors hover:text-gold-800">
                View all products
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:gap-5">
              {featured.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════ CUSTOMISATION ═══════════════ */}
      <section className="relative overflow-hidden border-y border-gold-500/25 bg-espresso-950">
        <div className="grid lg:grid-cols-2">
          <div className="relative z-10 flex flex-col justify-center px-6 py-14 sm:px-12 lg:py-20 lg:pl-16 xl:pl-24">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-gold-400/45 bg-gold-400/10 px-4 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.3em] text-gold-300">
              <Scissors className="h-3.5 w-3.5" /> Customisation Available
            </span>
            <h2 className="mt-5 font-display text-3xl font-extrabold leading-[1.08] text-cream-50 sm:text-5xl">
              {s.custom_title_1}
              <br />
              <span className="gold-text italic">{s.custom_title_2}</span>
            </h2>
            {customPoints.length > 0 && (
              <ul className="mt-6 space-y-2.5 text-[13px] leading-snug text-cream-100/75">
                {customPoints.map((line) => (
                  <li key={line} className="flex items-start gap-2.5">
                    <LotusMark className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                    {line}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/custom-order" className="btn-gold inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-xs font-extrabold uppercase tracking-[0.16em]">
                Start Custom Order
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={waLink(s.whatsapp, `${s.wa_greeting} I would like a custom poshak / item for my deity.`)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#25d366]/50 bg-[#25d366]/10 px-6 py-3.5 text-xs font-extrabold uppercase tracking-[0.16em] text-[#25d366] transition-colors hover:bg-[#25d366]/20"
              >
                <WhatsAppIcon className="h-5 w-5" />
                WhatsApp
              </a>
            </div>
          </div>
          <div className="relative h-64 sm:h-80 lg:h-auto">
            <SmartImage src={s.custom_image} alt="Custom poshak" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-r from-espresso-950 via-espresso-950/25 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-espresso-950/70 via-transparent to-transparent lg:bg-none" />
          </div>
        </div>
      </section>

      {/* ═══════════════ CONTACT STRIP ═══════════════ */}
      {contact.length > 0 && (
        <section className="bg-gradient-to-br from-gold-200 via-gold-300 to-gold-500">
          <div
            className="mx-auto grid max-w-7xl divide-y divide-espresso-900/15 px-5 sm:divide-x sm:divide-y-0 sm:px-8 lg:px-10"
            style={{ gridTemplateColumns: `repeat(${Math.min(contact.length, 3)}, minmax(0, 1fr))` }}
          >
            {contact.map(({ icon: Icon, label, lines, href, cta }) => {
              const inner = (
                <>
                  <Icon className="h-6 w-6 text-espresso-900" strokeWidth={1.6} />
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-espresso-800">{label}</p>
                  {lines.map((l) => (
                    <p key={l} className="text-[12px] font-medium leading-snug text-espresso-950/90">{l}</p>
                  ))}
                  {cta && (
                    <span className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-espresso-900 underline underline-offset-4">{cta}</span>
                  )}
                </>
              );
              const cls = "group flex flex-col items-center gap-2 px-6 py-6 text-center transition-colors hover:bg-espresso-950/5";
              return href ? (
                <a key={label} href={href} target="_blank" rel="noreferrer" className={cls}>{inner}</a>
              ) : (
                <div key={label} className={cls}>{inner}</div>
              );
            })}
          </div>
        </section>
      )}
      {s.instagram && (
        <div className="bg-espresso-950 py-5 text-center">
          <a href={s.instagram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-gold-300 hover:text-gold-200">
            <InstagramIcon className="h-4 w-4" /> {s.instagram_handle || "Follow us on Instagram"}
          </a>
        </div>
      )}
    </>
  );
}
