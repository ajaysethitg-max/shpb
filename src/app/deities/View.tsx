"use client";

import Link from "next/link";
import { ArrowRight, Shirt, Landmark } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import SmartImage from "@/components/SmartImage";
import { useSheet } from "@/components/SheetProvider";

export default function DeitiesView() {
  const { settings: s, deities, products } = useSheet();
  const countFor = (name: string) =>
    products.filter((p) => p.deity === name).length;

  return (
    <>
      <PageHeader kicker={s.shop_name} title={s.deities_title} description={s.deities_text} />

      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {deities.map((d, i) => {
            const c = countFor(d.name);
            return (
              <article key={d.name} className="card card-hover group relative flex flex-col overflow-hidden rounded-3xl">
                <div className="relative h-48 overflow-hidden bg-espresso-900 sm:h-52">
                  {d.image ? (
                    <SmartImage
                      src={d.image}
                      alt={d.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-[50%_20%] transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                    />
                  ) : (
                    <>
                      <div
                        aria-hidden
                        className="absolute inset-0"
                        style={{
                          background:
                            "radial-gradient(circle at 50% 30%, rgba(202,164,79,0.28), transparent 60%), linear-gradient(160deg,#221a14 0%,#14100c 100%)",
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-hindi text-6xl text-gold-400/90 drop-shadow-[0_2px_12px_rgba(202,164,79,0.35)] transition-transform duration-500 group-hover:scale-110">
                          {d.mono}
                        </span>
                      </div>
                    </>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso-950 via-espresso-950/30 to-transparent" />
                  <span className="absolute right-4 top-4 rounded-full border border-gold-500/40 bg-espresso-950/70 px-3 py-1 text-[9px] font-extrabold uppercase tracking-[0.22em] text-gold-300 backdrop-blur">
                    {c} {c === 1 ? "item" : "items"}
                  </span>
                  <div className="absolute bottom-4 left-5 right-5">
                    {d.hindi && <p className="font-hindi text-sm leading-none text-gold-300/90">{d.hindi}</p>}
                    <h2 className="mt-1.5 font-display text-2xl font-extrabold text-cream-50">{d.name}</h2>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  {d.tagline && (
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-gold-700">{d.tagline}</p>
                  )}
                  {d.description && <p className="mt-2 flex-1 text-[12.5px] leading-relaxed text-espresso-700">{d.description}</p>}
                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-dashed border-espresso-900/15 pt-4">
                    <Link
                      href={`/poshak?deity=${encodeURIComponent(d.name)}`}
                      className="flex items-center gap-1.5 rounded-full border border-espresso-900/20 px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-espresso-800 transition-colors hover:bg-espresso-900 hover:text-gold-300"
                    >
                      <Shirt className="h-3.5 w-3.5" /> Poshak
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                    <Link
                      href={`/idols?deity=${encodeURIComponent(d.name)}`}
                      className="flex items-center gap-1.5 rounded-full border border-gold-600/40 bg-gold-100 px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-gold-800 transition-colors hover:bg-gold-200"
                    >
                      <Landmark className="h-3.5 w-3.5" /> Idols
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
                <span aria-hidden className="pointer-events-none absolute right-4 top-24 select-none font-display text-[92px] font-black leading-none text-espresso-900/5">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </article>
            );
          })}
        </div>

        {s.deities_note && (
          <div className="mt-10 rounded-2xl border border-gold-500/30 bg-gold-100/60 p-5 text-center">
            <p className="text-[13px] leading-relaxed text-espresso-800">{s.deities_note}</p>
          </div>
        )}
      </div>
    </>
  );
}
