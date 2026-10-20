"use client";

import Link from "next/link";
import { useEffect } from "react";
import { site } from "@/content/site";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error.digest ?? "client error");
  }, [error]);
  return (
    <section className="on-ivory">
      <div className="wrap grid min-h-[60svh] content-center gap-6 py-28">
        <p className="label label-gold">Something went wrong</p>
        <h1 className="display t-2 max-w-[18ch]">This page didn&apos;t load properly.</h1>
        <p className="lede muted">Please try again. If it keeps happening, message us on WhatsApp at {site.whatsapp.display}.</p>
        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn btn-primary" onClick={reset}>Try again</button>
          <Link href="/" className="btn btn-outline">Homepage</Link>
        </div>
      </div>
    </section>
  );
}
