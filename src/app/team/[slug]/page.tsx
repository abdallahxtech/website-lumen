import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui";
import { Portrait } from "@/components/cards";
import { LeadForm } from "@/components/LeadForm";
import { WhatsApp, ArrowRight } from "@/components/Icons";
import { team, getMember } from "@/content/team";
import { site } from "@/content/site";
import { pageMeta } from "@/lib/seo";
import { waLink, waMessages } from "@/lib/whatsapp";

export function generateStaticParams() {
  return team.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const m = getMember((await params).slug);
  if (!m) return {};
  return pageMeta({ title: `${m.name}, ${m.title}`, description: `${m.name} is ${m.title} at Lumen Realty in Dubai.`, path: `/team/${m.slug}` });
}

export default async function MemberPage({ params }: { params: Promise<{ slug: string }> }) {
  const m = getMember((await params).slug);
  if (!m) notFound();
  const ld = { "@context": "https://schema.org", "@type": "Person", name: m.name, jobTitle: m.title, worksFor: { "@id": `${site.url}/#organization` } };
  const others = team.filter((x) => x.slug !== m.slug);

  return (
    <>
      <section className="on-ivory">
        <div className="wrap pb-20 pt-10">
          <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/team", label: "Our Team" }, { label: m.name }]} />
          <div className="mt-14 grid gap-14 md:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] lg:gap-24">
            <Portrait member={m} />
            <div className="min-w-0 self-end">
              <p className="label label-gold enter">{m.group === "leadership" ? "Executive leadership" : "Sales and client services"}</p>
              <h1 className="display t-1 enter mt-6" style={{ ["--d" as string]: ".08s" }}>{m.name}</h1>
              <p className="lede muted enter mt-4" style={{ ["--d" as string]: ".16s" }}>{m.title}</p>
              {m.bio ? <div className="prose-lumen mt-10"><p>{m.bio}</p></div> : <p className="muted mt-10 max-w-[56ch]">A full profile for {m.name.split(" ")[0]} will be published here soon.</p>}
              {(m.languages || m.specialisms) && (
                <dl className="mt-10 grid gap-6 sm:grid-cols-2">
                  {m.languages && <div><dt className="label muted">Languages</dt><dd className="mt-2">{m.languages.join(", ")}</dd></div>}
                  {m.specialisms && <div><dt className="label muted">Specialisms</dt><dd className="mt-2">{m.specialisms.join(", ")}</dd></div>}
                </dl>
              )}
              <div className="mt-12 flex flex-wrap gap-3">
                {m.contactable ? (
                  <>
                    <a href={waLink(waMessages.advisor(m.name))} target="_blank" rel="noopener" className="btn btn-primary"><WhatsApp className="h-5 w-5" /> Message {m.name.split(" ")[0]}</a>
                    <a href="#contact-form" className="btn btn-outline">Request a call back</a>
                  </>
                ) : (
                  <Link href="/contact?type=consultation" className="btn btn-primary">Book a Private Consultation <ArrowRight /></Link>
                )}
              </div>
              {m.contactable && <p className="muted mt-4 text-[.85rem]">Messages go to our office WhatsApp, {site.whatsapp.display}, and are passed to {m.name.split(" ")[0]}.</p>}
            </div>
          </div>
        </div>
      </section>
      {m.contactable && (
        <section id="contact-form" className="on-paper band-tight scroll-mt-24">
          <div className="wrap max-w-3xl"><LeadForm defaultType="callback" lockType tone="card" heading={`Ask ${m.name.split(" ")[0]} to call you`} context={{ details: { Advisor: m.name } }} submitLabel="Request a call back" /></div>
        </section>
      )}
      <section className="on-ivory band-tight">
        <div className="wrap">
          <h2 className="label label-gold">The rest of the team</h2>
          <ul className="mt-6 flex flex-wrap gap-x-10 gap-y-4">{others.map((o) => <li key={o.slug}><Link href={`/team/${o.slug}`} className="group no-underline"><span className="display text-[1.35rem] group-hover:text-[var(--lumen-teal)]">{o.name}</span> <span className="muted text-[.88rem]">{o.title}</span></Link></li>)}</ul>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </>
  );
}
