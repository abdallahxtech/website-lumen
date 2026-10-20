"use client";

import { useState } from "react";

/** Collapses the filter form into a toggle below the lg breakpoint; always open on desktop. */
export function FilterDrawer({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-y border-[var(--rule)] py-4 lg:border-0 lg:py-0">
      <button type="button" className="label flex w-full items-center justify-between py-2 lg:hidden" aria-expanded={open} aria-controls="filters" onClick={() => setOpen((v) => !v)}>
        Filter and sort <span aria-hidden>{open ? "–" : "+"}</span>
      </button>
      <div id="filters" className={`${open ? "block pt-6" : "hidden"} lg:block lg:pt-0`}>{children}</div>
    </div>
  );
}
