import { LotusMark } from "./icons";
import type { ReactNode } from "react";

export default function PageHeader({
  kicker,
  hindi,
  title,
  description,
  children,
}: {
  kicker: string;
  hindi?: string;
  title: ReactNode;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden border-b border-gold-500/20 bg-espresso-950">
      {/* Subtle radial gold glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(202,164,79,0.18) 0%, transparent 65%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(202,164,79,0.12) 0%, transparent 65%)" }}
      />
      <div className="relative mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-14 lg:px-10 lg:py-16">
        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.32em] text-gold-400">
          <LotusMark className="h-4 w-4 text-gold-500" /> {kicker}
        </p>
        {hindi && (
          <p className="mt-2 font-hindi text-base text-gold-200/70">{hindi}</p>
        )}
        <h1 className="mt-2 font-display text-4xl font-black text-cream-50 sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-cream-100/70 sm:text-[15px]">
          {description}
        </p>
        {children && <div className="mt-5">{children}</div>}
      </div>
    </div>
  );
}
