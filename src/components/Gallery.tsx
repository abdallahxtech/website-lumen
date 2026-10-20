"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { MediaItem } from "@/content/listings";
import { Close, ArrowRight } from "./Icons";

/** Responsive gallery with an accessible lightbox (Esc, arrow keys, focus return). */
export function Gallery({ items, title }: { items: MediaItem[]; title: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + items.length) % items.length)), [items.length]);

  useEffect(() => {
    if (open === null) { lastTrigger.current?.focus(); return; }
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "Tab") { e.preventDefault(); closeRef.current?.focus(); }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, close, step]);

  if (!items.length) return null;
  return (
    <>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4" aria-label={`${title} gallery`}>
        {items.map((m, i) => (
          <li key={m.src} className={i === 0 ? "col-span-2 row-span-2" : ""}>
            <button type="button" className="relative block aspect-[4/3] w-full overflow-hidden" onClick={(e) => { lastTrigger.current = e.currentTarget; setOpen(i); }} aria-label={`Open image ${i + 1} of ${items.length}: ${m.alt}`}>
              <Image src={m.src} alt="" fill sizes="(min-width:768px) 25vw, 50vw" className="object-cover transition-transform duration-700 hover:scale-105" />
            </button>
          </li>
        ))}
      </ul>
      {open !== null && (
        <div role="dialog" aria-modal="true" aria-label={`${title}, image ${open + 1} of ${items.length}`} className="fixed inset-0 z-[70] grid grid-rows-[auto_1fr_auto] bg-[rgba(11,21,38,.96)] text-white">
          <div className="flex justify-end p-4"><button ref={closeRef} type="button" onClick={close} className="grid h-11 w-11 place-items-center border border-white/30" aria-label="Close gallery"><Close className="h-5 w-5" /></button></div>
          <div className="relative mx-4"><Image src={items[open].src} alt={items[open].alt} fill sizes="100vw" className="object-contain" /></div>
          <div className="flex items-center justify-between gap-4 p-4 text-[.9rem]">
            <button type="button" onClick={() => step(-1)} className="grid h-11 w-11 rotate-180 place-items-center border border-white/30" aria-label="Previous image"><ArrowRight className="h-5 w-5" /></button>
            <p className="num text-center">{open + 1} / {items.length}{items[open].credit ? ` · ${items[open].credit}` : ""}</p>
            <button type="button" onClick={() => step(1)} className="grid h-11 w-11 place-items-center border border-white/30" aria-label="Next image"><ArrowRight className="h-5 w-5" /></button>
          </div>
        </div>
      )}
    </>
  );
}
