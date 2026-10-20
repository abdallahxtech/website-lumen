"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import { ArrowRight, Close, Menu, WhatsApp } from "./Icons";
import { waLink, waMessages } from "@/lib/whatsapp";
import { site } from "@/content/site";

export const NAV = [
  { href: "/properties", label: "Properties", short: "Properties" },
  { href: "/developments", label: "New Developments", short: "Developments" },
  { href: "/communities", label: "Communities", short: "Communities" },
  { href: "/services", label: "Our Services", short: "Services" },
  { href: "/about", label: "About Lumen", short: "About" },
  { href: "/team", label: "Our Team", short: "Team" },
  { href: "/insights", label: "Insights", short: "Insights" },
  { href: "/contact", label: "Contact", short: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const toggle = toggleRef.current;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && panelRef.current) {
        const items = panelRef.current.querySelectorAll<HTMLElement>("a,button");
        const first = items[0], last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      toggle?.focus();
    };
  }, [open]);

  const overHero = isHome && !scrolled && !open;
  const isCurrent = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="site-header" data-over-hero={overHero} style={isHome ? { position: "fixed", insetInline: 0 } : undefined}>
      <div className="wrap flex h-[76px] items-center gap-8 lg:h-[88px]">
        <Link href="/" aria-label="Lumen Realty, home" className="shrink-0">
          <Logo variant={overHero ? "reverse" : "color"} className="h-[38px] w-auto lg:h-[44px]" />
        </Link>
        <nav aria-label="Primary" className="ml-auto hidden xl:block">
          <ul className="flex items-center gap-6 whitespace-nowrap">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="nav-link" aria-current={isCurrent(n.href) ? "page" : undefined}>
                  {n.short}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link href="/contact?type=consultation" className={`btn hidden min-h-[46px] whitespace-nowrap px-5 text-[.85rem] md:inline-flex ${overHero ? "btn-light" : "btn-primary"} ml-auto xl:ml-0`}>
          Book a Private Consultation
        </Link>
        <button
          ref={toggleRef}
          type="button"
          className={`ml-auto grid h-11 w-11 place-items-center border md:ml-0 xl:hidden ${overHero ? "border-white/30 text-white" : "border-[var(--rule)] text-[var(--ink)]"}`}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <Close className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div
          id="mobile-nav"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-x-0 bottom-0 top-[calc(76px+env(safe-area-inset-top,0px))] z-40 overflow-y-auto bg-[var(--ivory)] lg:top-[calc(88px+env(safe-area-inset-top,0px))] xl:hidden"
        >
          <nav aria-label="Mobile" className="wrap flex min-h-full flex-col pb-[max(32px,env(safe-area-inset-bottom))] pt-6">
            <ul className="border-t border-[var(--rule)]">
              <li><Link href="/" className="display flex items-baseline justify-between border-b border-[var(--rule)] py-4 text-[2rem]">Home</Link></li>
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} aria-current={isCurrent(n.href) ? "page" : undefined} className="display flex items-center justify-between border-b border-[var(--rule)] py-4 text-[2rem] no-underline">
                    {n.label}
                    <ArrowRight className="h-5 w-5 text-[var(--lumen-teal)]" />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-auto grid gap-3 pt-10">
              <Link href="/contact?type=consultation" className="btn btn-primary">Book a Private Consultation</Link>
              <a href={waLink(waMessages.general)} target="_blank" rel="noopener" className="btn btn-outline">
                <WhatsApp className="h-5 w-5" /> WhatsApp {site.whatsapp.display}
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
