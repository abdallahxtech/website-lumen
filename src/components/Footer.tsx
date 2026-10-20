import Link from "next/link";
import { Logo } from "./Logo";
import { site, officeAddressLines } from "@/content/site";
import { services } from "@/content/services";
import { waLink, waMessages } from "@/lib/whatsapp";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="on-deep dark" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Site footer</h2>
      <div className="wrap pb-10 pt-20">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div className="max-w-sm">
            <Logo variant="reverse" className="h-12 w-auto" />
            <p className="muted mt-6 text-[.95rem]">{site.legalDescriptor} in Dubai.</p>
          </div>
          <div>
            <p className="label label-gold mb-5">Services</p>
            <ul className="grid gap-3 text-[.95rem]">
              {services.map((s) => (
                <li key={s.slug}><Link className="no-underline hover:text-white" href={`/services/${s.slug}`}>{s.name}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label label-gold mb-5">Explore</p>
            <ul className="grid gap-3 text-[.95rem]">
              {[["/properties", "Properties"], ["/developments", "New Developments"], ["/communities", "Communities"], ["/about", "About Lumen"], ["/team", "Our Team"], ["/insights", "Insights"]].map(([h, l]) => (
                <li key={h}><Link className="no-underline hover:text-white" href={h}>{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label label-gold mb-5">Visit and contact</p>
            <address className="not-italic text-[.95rem] leading-relaxed">
              {officeAddressLines.map((l) => <span key={l} className="block">{l}</span>)}
            </address>
            <p className="mt-4 text-[.95rem]">
              <a className="no-underline hover:text-white" href={`tel:${site.phone.e164}`}>{site.phone.display}</a>
              <span className="muted"> · </span>
              <a className="no-underline hover:text-white" href={waLink(waMessages.general)} target="_blank" rel="noopener">WhatsApp</a>
            </p>
          </div>
        </div>
        <hr className="rule mt-16" />
        <div className="muted mt-6 flex flex-col gap-3 text-[.82rem] md:flex-row md:items-center md:justify-between">
          <p className="num">
            RERA ORN {site.licensing.reraOrn.value} · Dubai trade licence {site.licensing.tradeLicence.value}
          </p>
          <p className="flex flex-wrap gap-x-6 gap-y-2">
            <Link className="no-underline hover:text-white" href="/privacy-policy">Privacy policy</Link>
            <Link className="no-underline hover:text-white" href="/terms">Terms of use</Link>
            <span>© {year} Lumen Realty</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
