"use client";

import { useEffect, useState } from "react";
import { Phone, ArrowUp } from "lucide-react";
import { WhatsAppIcon } from "./icons";
import { useCart } from "./CartProvider";
import { waLink, telHref } from "@/lib/format";

export default function FloatingActions() {
  const { settings: s, whatsapp } = useCart();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="fixed bottom-5 right-4 z-[65] flex flex-col items-end gap-2.5 sm:bottom-7 sm:right-6">
        {s.phone && (
          <a
            href={telHref(s.phone)}
            className="group flex h-13 w-13 items-center gap-0 overflow-hidden rounded-full bg-espresso-900 py-3 pl-3.5 pr-3.5 text-gold-300 shadow-[0_10px_30px_-8px_rgba(0,0,0,0.6)] ring-1 ring-gold-500/40 transition-all duration-300 hover:pr-4"
            aria-label={`Call the shop at ${s.phone}`}
          >
            <Phone className="h-6 w-6 shrink-0" strokeWidth={1.8} />
            <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-xs font-bold uppercase tracking-wider opacity-0 transition-all duration-300 group-hover:ml-2 group-hover:max-w-[160px] group-hover:opacity-100 sm:inline">
              {s.phone}
            </span>
          </a>
        )}
        <a
          href={waLink(whatsapp, `${s.wa_greeting} I would like to enquire about your collection.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="wa-pulse flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-[#063b1e] shadow-[0_12px_34px_-6px_rgba(37,211,102,0.55)] transition-transform duration-200 hover:scale-105 sm:h-16 sm:w-16"
          aria-label="Chat on WhatsApp"
        >
          <WhatsAppIcon className="h-7 w-7 sm:h-8 sm:w-8" />
        </a>
      </div>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className={`fixed bottom-5 left-4 z-[65] rounded-full border border-gold-500/40 bg-cream-50/90 p-3 text-espresso-900 shadow-lg backdrop-blur transition-all duration-300 hover:border-gold-500 hover:text-gold-800 sm:bottom-7 sm:left-6 ${
          showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </>
  );
}
