"use client";

import SmartImage from "./SmartImage";
import { useCallback, useEffect, useState } from "react";
import { ZoomIn, X, ChevronLeft, ChevronRight, Expand } from "lucide-react";

export default function Gallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const current = images[index] ?? images[0];

  const step = useCallback(
    (dir: 1 | -1) => {
      setIndex((i) => (i + dir + images.length) % images.length);
      setZoomed(false);
    },
    [images.length],
  );

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, step]);

  return (
    <div>
      {/* Main image */}
      <button
        onClick={() => setLightbox(true)}
        className="group relative block aspect-[4/5] w-full cursor-zoom-in overflow-hidden rounded-3xl border border-espresso-900/10 bg-cream-100 sm:aspect-[5/5.5]"
        aria-label="Open image zoom"
      >
        <SmartImage
          src={current}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        />
        <span className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-espresso-950/70 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-200 backdrop-blur-sm transition-opacity group-hover:opacity-100">
          <ZoomIn className="h-4 w-4" /> Tap to zoom
        </span>
      </button>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={`${src}-${i}`}
              onClick={() => setIndex(i)}
              className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-xl border transition-all sm:h-24 sm:w-20 ${
                i === index
                  ? "border-gold-500 ring-2 ring-gold-500/50"
                  : "border-espresso-900/15 opacity-60 hover:opacity-100"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <SmartImage src={src} alt={`${alt} — view ${i + 1}`} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image zoom"
          className="fixed inset-0 z-[80] flex items-center justify-center bg-espresso-950/92 backdrop-blur-sm"
          onClick={() => setLightbox(false)}
        >
          <button
            className="absolute right-4 top-4 rounded-full border border-gold-500/40 p-2.5 text-gold-300 transition-colors hover:bg-white/5"
            onClick={() => setLightbox(false)}
            aria-label="Close zoom"
          >
            <X className="h-6 w-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); step(-1); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-gold-500/30 bg-espresso-900/70 p-2.5 text-gold-300 hover:bg-espresso-800 sm:left-6"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); step(1); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-gold-500/30 bg-espresso-900/70 p-2.5 text-gold-300 hover:bg-espresso-800 sm:right-6"
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <div
            className="relative h-[82vh] w-[92vw] max-w-3xl overflow-hidden"
            onClick={(e) => {
              e.stopPropagation();
              setZoomed((z) => !z);
            }}
          >
            <SmartImage
              src={current}
              alt={alt}
              fill
              sizes="100vw"
              className={`select-none object-contain transition-transform duration-500 ${
                zoomed ? "scale-[1.75] cursor-zoom-out" : "scale-100 cursor-zoom-in"
              }`}
              draggable={false}
            />
          </div>
          <span className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-espresso-900/80 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-cream-100/70">
            <Expand className="h-3.5 w-3.5" /> {zoomed ? "Click to fit" : "Click image to zoom"} · {index + 1}/{images.length}
          </span>
        </div>
      )}
    </div>
  );
}
