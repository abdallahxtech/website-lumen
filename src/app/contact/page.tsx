import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
import { LeadForm } from "@/components/LeadForm";
import { Phone, Pin, WhatsApp, ArrowUpRight } from "@/components/Icons";
import { ENQUIRY_TYPES, enquiryLabels } from "@/lib/leads/enquiry";
import { site, officeAddressLines } from "@/content/site";
import { getCommunity } from "@/content/communities";
import { pageMeta } from "@/lib/seo";
import { waLink, waMessages } from "@/lib/whatsapp";

export const metadata: Metadata = pageMeta({
  title: "Contact Lumen Realty",
  description: "Arrange a private consultation, request a valuation or ask about a property. Office on Sheikh Zayed Road, Dubai.",
  path: "/contact",
});

type T = (typeof ENQUIRY_TYPES)[number];
const SELECTABLE: T[] = ["consultation", "buy", "sell", "valuation", "rent", "off_plan", "callback", "general"];

export default async function ContactPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const type: T = (ENQUIRY_TYPES as readonly string[]).includes(sp.type ?? "") ? (sp.type as T) : "consultation";
  const project = sp.project?.slice(0, 160);
  const community = sp.community ? getCommunity(sp.community)?.name : undefined;
  const heading = project ? `${enquiryLabels[type]}: ${project}` : type === "consultation" ? "Arrange a private consultation" : enquiryLabels[type];
  const wa = project ? waMessages.development(project) : waMessages.general;

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={<>Let&apos;s begin with a <em>conversation.</em></>}
        intro="Tell us what you're planning and an advisor will reply, usually the same working day. Prefer to talk now? WhatsApp or call the office."
        crumbs={[{ href: "/", label: "Home" }, { label: "Contact" }]}
      />
      <section className="on-ivory band-tight">
        <div className="wrap grid gap-16 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,.75fr)] lg:gap-24">
          <div className="min-w-0">
            <LeadForm key={`${type}-${project ?? ""}`} defaultType={type} lockType={!SELECTABLE.includes(type)} heading={heading} context={{ project, community }} submitLabel={type === "consultation" ? "Arrange a Private Consultation" : "Send enquiry"} whatsappMessage={wa} />
          </div>
          <aside className="min-w-0 grid content-start gap-10" aria-label="Contact details">
            <div>
              <p className="label label-gold">WhatsApp and phone</p>
              <p className="display num mt-3 text-[2rem]">{site.whatsapp.display}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a className="btn btn-primary" href={waLink(waMessages.general)} target="_blank" rel="noopener"><WhatsApp className="h-5 w-5" /> WhatsApp</a>
                <a className="btn btn-outline" href={`tel:${site.phone.e164}`}><Phone className="h-5 w-5" /> Call</a>
              </div>
            </div>
            <div>
              <p className="label label-gold">Office</p>
              <address className="mt-3 not-italic leading-relaxed">{officeAddressLines.map((l) => <span key={l} className="block">{l}</span>)}</address>
              <a className="link-line mt-4 text-[var(--lumen-teal)]" href={site.office.mapsUrl} target="_blank" rel="noopener"><Pin className="h-4 w-4" /> Directions <ArrowUpRight className="h-4 w-4" /></a>
            </div>
            <div>
              <p className="label label-gold">Licensing</p>
              <p className="num mt-3">RERA ORN {site.licensing.reraOrn.value}<br />Dubai trade licence {site.licensing.tradeLicence.value}</p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
