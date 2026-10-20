import Link from "next/link";
import { Mark } from "@/components/Logo";
import { ArrowRight } from "@/components/Icons";

export default function NotFound() {
  return (
    <section className="on-midnight dark">
      <div className="wrap grid min-h-[70svh] content-center gap-8 py-32">
        <Mark variant="reverse" className="h-12 w-12" />
        <p className="label label-gold">Page not found</p>
        <h1 className="display t-1 max-w-[16ch] text-white">This address doesn&apos;t <em>lead anywhere.</em></h1>
        <p className="lede muted">The page may have moved, or the listing may no longer be available.</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/" className="btn btn-light">Back to the homepage <ArrowRight /></Link>
          <Link href="/contact" className="btn btn-outline">Contact an advisor</Link>
        </div>
      </div>
    </section>
  );
}
