"use client";

import { useState } from "react";
import { Scissors, Ruler, Palette, Wallet, CalendarHeart, CheckCircle2 } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import SmartImage from "@/components/SmartImage";
import { waLink } from "@/lib/format";
import { WhatsAppIcon, LotusMark } from "@/components/icons";

type Props = {
  intro: string;
  note: string;
  deities: string[];
  itemTypes: string[];
  sizes: string[];
  fabrics: string[];
  colours: string[];
  steps: string[];
  image: string;
};

export default function CustomOrderForm({ intro, note, deities, itemTypes, sizes, fabrics, colours, steps, image }: Props) {
  const { whatsapp, settings } = useCart();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    deity: deities[0] ?? "",
    itemType: itemTypes[0] ?? "",
    size: "",
    fabric: "",
    colour: "",
    occasion: "",
    budget: "",
    notes: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const message = () =>
    [
      `${settings.wa_greeting} I would like a custom order from ${settings.shop_name}:`,
      "",
      `Item: ${form.itemType}`,
      form.deity && `Deity: ${form.deity}`,
      form.size && `Size: ${form.size}`,
      form.fabric && `Fabric: ${form.fabric}`,
      form.colour && `Colour: ${form.colour}`,
      form.occasion && `Occasion: ${form.occasion}`,
      form.budget && `Budget: ₹${form.budget.replace(/\D/g, "")}`,
      form.notes && `Design notes: ${form.notes}`,
      "",
      `Name: ${form.name.trim()}`,
      form.phone && `Mobile: ${form.phone.trim()}`,
      "",
      "(I will send a reference photo here)",
    ]
      .filter((l) => l !== "" ? Boolean(l) : true)
      .join("\n");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.name.trim().length < 2) return setError("Please enter your name.");
    window.open(waLink(whatsapp, message()), "_blank", "noopener");
    setSent(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (sent) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-16 text-center sm:px-8">
        <span className="animate-check-pop inline-flex h-24 w-24 items-center justify-center rounded-full border border-gold-500/50 bg-gold-100">
          <CheckCircle2 className="h-14 w-14 text-gold-700" strokeWidth={1.5} />
        </span>
        <h1 className="mt-6 font-display text-3xl font-black text-espresso-950 sm:text-4xl">
          WhatsApp <span className="gold-text italic">opened</span>
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-espresso-700">
          Press <b>Send</b> in WhatsApp, then <b>attach your reference photo</b> in the same chat. We will confirm the design and price there.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href={waLink(whatsapp, message())} target="_blank" rel="noreferrer" className="btn-wa inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-xs font-extrabold uppercase tracking-[0.16em]">
            <WhatsAppIcon className="h-5 w-5" /> Open WhatsApp again
          </a>
          <button onClick={() => setSent(false)} className="rounded-full border border-espresso-900 px-6 py-3.5 text-xs font-extrabold uppercase tracking-[0.16em] text-espresso-900 transition-colors hover:bg-espresso-900 hover:text-gold-300">
            Edit request
          </button>
        </div>
      </div>
    );
  }

  const chips = (options: string[], field: "fabric" | "colour") => (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <button type="button" key={o} className="chip" data-active={form[field] === o} onClick={() => setForm((s) => ({ ...s, [field]: o }))}>
          {o}
        </button>
      ))}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
      <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-gold-700">
        <Scissors className="h-4 w-4" /> Customisation available
      </p>
      <h1 className="mt-2 font-display text-4xl font-black leading-[1.05] text-espresso-950 sm:text-5xl">
        Custom <span className="gold-text italic">Order</span>
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-espresso-600 sm:text-[15px]">{intro}</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <form onSubmit={submit} className="card space-y-5 rounded-3xl p-6 sm:p-7 lg:col-span-7">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="co-name">Your name *</label>
              <input id="co-name" className="field" required value={form.name} onChange={set("name")} />
            </div>
            <div>
              <label className="field-label" htmlFor="co-phone">Mobile number</label>
              <input id="co-phone" className="field" inputMode="tel" value={form.phone} onChange={set("phone")} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {deities.length > 0 && (
              <div>
                <label className="field-label" htmlFor="co-deity">Deity</label>
                <select id="co-deity" className="field" value={form.deity} onChange={set("deity")}>
                  {deities.map((d) => <option key={d} value={d}>{d}</option>)}
                  <option value="Other (write in notes)">Other (write in notes)</option>
                </select>
              </div>
            )}
            {itemTypes.length > 0 && (
              <div>
                <label className="field-label" htmlFor="co-type">What should we make?</label>
                <select id="co-type" className="field" value={form.itemType} onChange={set("itemType")}>
                  {itemTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="co-size"><Ruler className="mr-1 inline h-3.5 w-3.5" />Size</label>
              <select id="co-size" className="field" value={form.size} onChange={set("size")}>
                <option value="">Select size</option>
                {sizes.map((s) => <option key={s} value={s}>{s}</option>)}
                <option value="Custom (from photo)">Custom (from photo)</option>
              </select>
            </div>
            <div>
              <label className="field-label" htmlFor="co-occasion"><CalendarHeart className="mr-1 inline h-3.5 w-3.5" />Occasion</label>
              <input id="co-occasion" className="field" value={form.occasion} onChange={set("occasion")} placeholder="Optional" />
            </div>
          </div>

          {fabrics.length > 0 && (
            <div>
              <span className="field-label">Fabric</span>
              {chips(fabrics, "fabric")}
            </div>
          )}

          <div>
            <span className="field-label"><Palette className="mr-1 inline h-3.5 w-3.5" />Colour</span>
            {colours.length > 0 && chips(colours, "colour")}
            <input className="field mt-2" value={form.colour} onChange={set("colour")} placeholder="Or type any colour" aria-label="Colour" />
          </div>

          <div>
            <label className="field-label" htmlFor="co-budget"><Wallet className="mr-1 inline h-3.5 w-3.5" />Budget (₹), optional</label>
            <input id="co-budget" className="field" inputMode="numeric" value={form.budget} onChange={set("budget")} />
          </div>

          <div>
            <label className="field-label" htmlFor="co-notes">Design notes</label>
            <textarea id="co-notes" className="field min-h-28" value={form.notes} onChange={set("notes")} placeholder="Border, motifs, matching mukut, anything else…" />
          </div>

          {error && <p role="alert" className="rounded-xl border border-sindoor-500/40 bg-sindoor-500/10 px-4 py-3 text-[13px] font-semibold text-sindoor-500">{error}</p>}

          <button type="submit" className="btn-wa flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-extrabold uppercase tracking-[0.16em]">
            <WhatsAppIcon className="h-5 w-5" /> Send Request on WhatsApp
          </button>
          <p className="text-center text-[10px] leading-relaxed text-espresso-500">
            This opens WhatsApp with your details filled in. Attach your reference photo in that chat.
          </p>
        </form>

        <aside className="lg:col-span-5">
          <div className="sticky top-24 space-y-5">
            {image && (
              <div className="relative h-56 overflow-hidden rounded-3xl sm:h-64">
                <SmartImage src={image} alt="Custom poshak" fill sizes="(max-width:1024px) 100vw, 40vw" className="object-cover" />
              </div>
            )}
            {steps.length > 0 && (
              <div className="card rounded-2xl p-5">
                <p className="field-label">How it works</p>
                <ol className="mt-3 space-y-3 text-[12.5px] leading-snug text-espresso-800">
                  {steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-espresso-900 text-[11px] font-extrabold text-gold-300">{i + 1}</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            )}
            {note && (
              <div className="flex items-center gap-3 rounded-2xl border border-gold-500/30 bg-gold-100 px-5 py-4">
                <LotusMark className="h-8 w-8 shrink-0 text-gold-700" />
                <p className="text-[11.5px] leading-snug text-espresso-800">{note}</p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
