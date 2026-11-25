"use client";

import Link from "next/link";
import { MapPin, Phone, Mail, Clock, ChevronDown, ArrowRight, Sparkles } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import SmartImage from "@/components/SmartImage";
import { WhatsAppIcon, InstagramIcon, LotusMark } from "@/components/icons";
import { waLink, telHref } from "@/lib/format";
import { useSheet } from "@/components/SheetProvider";

export default function AboutView() {
  const { settings: s } = useSheet();
  const waMsg = `${s.wa_greeting} I would like to know more about ${s.shop_name}.`;
  const story = s.about_story.split("||").map((p) => p.trim()).filter(Boolean);
  const points = s.about_points.split("|").map((p) => p.trim()).filter(Boolean);

  const faqs: { id: string; q: string; a: string }[] = [];
  for (let i = 1; i <= 6; i++) {
    const q = s[`faq_${i}_q`];
    const a = s[`faq_${i}_a`];
    if (q && a) faqs.push({ id: `faq-${i}`, q, a });
  }
  if (s.shipping_text) faqs.push({ id: "shipping", q: "Shipping & delivery", a: s.shipping_text });
  if (s.returns_text) faqs.push({ id: "returns", q: "Returns & exchanges", a: s.returns_text });
  if (s.payment_text) faqs.push({ id: "payment", q: "Payment", a: s.payment_text });

  const hasContact = s.address || s.phone || s.email || s.hours;

  return (
    <>
      <PageHeader kicker={s.shop_name} title={s.about_title} description={s.tagline} />

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <div className={`grid items-center gap-10 ${s.about_image ? "lg:grid-cols-12" : ""}`}>
          {s.about_image && (
            <div className="relative h-80 overflow-hidden rounded-3xl lg:col-span-5 lg:h-[30rem]">
              <SmartImage src={s.about_image} alt={s.shop_name} fill sizes="(max-width: 1024px) 100vw, 42vw" className="object-cover" />
            </div>
          )}
          <div className={s.about_image ? "lg:col-span-7" : "max-w-3xl"}>
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-gold-700">
              <LotusMark className="h-4 w-4" />
              {[s.city, s.est_year ? `Est. ${s.est_year}` : ""].filter(Boolean).join(" · ") || s.shop_name}
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight text-espresso-950 sm:text-4xl">{s.shop_name}</h2>
            <div className="mt-5 space-y-4 text-[14px] leading-relaxed text-espresso-700">
              {story.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {points.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-3">
                {points.map((t) => (
                  <span key={t} className="flex items-center gap-2 rounded-full border border-gold-600/40 bg-gold-100 px-4 py-2 text-[11px] font-semibold text-gold-900">
                    <Sparkles className="h-4 w-4" /> {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {(hasContact || s.maps_embed) && (
        <section className="border-t border-gold-500/20 bg-espresso-950">
          <div className={`mx-auto grid max-w-7xl ${s.maps_embed ? "lg:grid-cols-2" : ""}`}>
            {s.maps_embed && (
              <div className="relative min-h-72 sm:min-h-96">
                <iframe
                  title={`Map — ${s.shop_name}`}
                  src={s.maps_embed}
                  className="absolute inset-0 h-full w-full border-0 grayscale-[30%] contrast-[1.05]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
            <div className="flex flex-col justify-center gap-5 px-6 py-10 sm:px-12">
              <h2 className="font-display text-3xl font-extrabold text-cream-50 sm:text-4xl">
                Visit <span className="gold-text italic">Us</span>
              </h2>
              <ul className="space-y-4 text-[13px] leading-relaxed text-cream-100/80">
                {s.address && (
                  <li className="flex items-start gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" />{s.address}</li>
                )}
                {s.phone && (
                  <li className="flex items-center gap-3"><Phone className="h-5 w-5 shrink-0 text-gold-400" /><a href={telHref(s.phone)} className="hover:text-gold-200">{s.phone}</a></li>
                )}
                <li className="flex items-center gap-3">
                  <WhatsAppIcon className="h-5 w-5 shrink-0 text-[#25d366]" />
                  <a href={waLink(s.whatsapp, waMsg)} target="_blank" rel="noreferrer" className="hover:text-gold-200">{s.whatsapp_display || s.whatsapp}</a>
                </li>
                {s.email && (
                  <li className="flex items-center gap-3"><Mail className="h-5 w-5 shrink-0 text-gold-400" /><a href={`mailto:${s.email}`} className="break-all hover:text-gold-200">{s.email}</a></li>
                )}
                {s.hours && (
                  <li className="flex items-center gap-3"><Clock className="h-5 w-5 shrink-0 text-gold-400" />{s.hours}</li>
                )}
              </ul>
              <div className="flex flex-wrap gap-3 pt-2">
                <a href={waLink(s.whatsapp, waMsg)} target="_blank" rel="noreferrer" className="btn-wa inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-xs font-extrabold uppercase tracking-[0.16em]">
                  <WhatsAppIcon className="h-5 w-5" /> Message us
                </a>
                {s.instagram && (
                  <a href={s.instagram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-gold-400/50 px-6 py-3.5 text-xs font-extrabold uppercase tracking-[0.16em] text-gold-200 transition-colors hover:border-gold-300 hover:text-gold-100">
                    <InstagramIcon className="h-5 w-5" /> Instagram
                  </a>
                )}
                {s.maps_link && (
                  <a href={s.maps_link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-cream-50/20 px-6 py-3.5 text-xs font-extrabold uppercase tracking-[0.16em] text-cream-100/80 transition-colors hover:border-cream-50/50">
                    <MapPin className="h-5 w-5" /> Directions
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {faqs.length > 0 && (
        <section id="faq" className="mx-auto max-w-4xl scroll-mt-28 px-5 py-14 sm:px-8">
          <h2 className="text-center font-display text-3xl font-extrabold text-espresso-950">
            Questions, <span className="italic text-gold-700">answered</span>
          </h2>
          <div className="mt-8 divide-y divide-espresso-900/10 rounded-3xl border border-espresso-900/12 bg-white">
            {faqs.map((f) => (
              <details key={f.id} id={f.id} className="accordion group scroll-mt-28">
                <summary className="flex items-center justify-between gap-4 px-6 py-5 text-[13px] font-extrabold uppercase tracking-[0.14em] text-espresso-800">
                  {f.q}
                  <ChevronDown className="accordion-chevron h-5 w-5 shrink-0 text-gold-700" />
                </summary>
                <div className="whitespace-pre-line px-6 pb-5 text-[13.5px] leading-relaxed text-espresso-700">{f.a}</div>
              </details>
            ))}
          </div>
          <p className="mt-6 text-center text-[12px] text-espresso-600">
            More questions?{" "}
            <a className="font-bold text-gold-800 underline underline-offset-4 hover:text-gold-700" href={waLink(s.whatsapp, waMsg)} target="_blank" rel="noreferrer">
              Ask us on WhatsApp
            </a>
          </p>
        </section>
      )}

      <section className="border-t border-gold-500/20 bg-gradient-to-r from-espresso-900 via-espresso-950 to-espresso-900">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-4 px-5 py-8 text-center sm:px-8">
          <Link href="/catalog" className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 px-5 py-2.5 text-[10px] font-extrabold uppercase tracking-[0.22em] text-gold-300 transition-colors hover:border-gold-300 hover:text-gold-100">
            Browse the complete collection <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
