import Link from "next/link";
import Image from "next/image";
import { HeroArt, Plate } from "@/components/Art";
import { Mark } from "@/components/Logo";
import { HeroSearch } from "@/components/HeroSearch";
import { CostCalculator } from "@/components/CostCalculator";
import { LeadForm } from "@/components/LeadForm";
import { SectionHead } from "@/components/ui";
import { ArticleCard, CommunityCard, DevelopmentCard, PropertyCard, TeamCard } from "@/components/cards";
import { ArrowRight, Phone, WhatsApp } from "@/components/Icons";
import { communities } from "@/content/communities";
import { services } from "@/content/services";
import { team } from "@/content/team";
import { publishedArticles } from "@/content/insights";
import { publishedDevelopments, publishedProperties } from "@/content/listings";
import { site } from "@/content/site";
import { waLink, waMessages } from "@/lib/whatsapp";

export default function Home() {
  const props = publishedProperties().slice(0, 3);
  const devs = publishedDevelopments().slice(0, 3);
  const articles = publishedArticles().slice(0, 3);
  const hero = site.media.hero;
  const d = (s: string) => ({ ["--d" as string]: s });

  return (
    <>
      {/* 01 — Hero */}
      <section className="dark relative isolate overflow-hidden bg-[var(--midnight-deep)] text-[var(--on-dark)]" aria-labelledby="hero-title">
        <div className="absolute inset-0 -z-10">
          {hero ? (
            <>
              <Image src={hero.src} alt={hero.alt} fill priority sizes="100vw" className="hero-media object-cover" />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,24,42,.85),rgba(13,24,42,.35)_60%,rgba(13,24,42,.15))]" />
            </>
          ) : (
            <HeroArt className="hero-media h-full w-full" />
          )}
        </div>
        <div className="wrap relative flex min-h-[min(100svh,980px)] flex-col justify-end pb-44 pt-40 md:pb-52 lg:pb-56">
          <p className="label label-gold enter-fade" style={d(".15s")}>Lumen Realty · Dubai</p>
          <h1 id="hero-title" className="display t-hero mt-7 text-white">
            <span className="unveil-line md:whitespace-nowrap" style={d(".3s")}>Exceptional places.</span>
            <span className="unveil-line italic text-[var(--pearl-sand)] md:whitespace-nowrap" style={d(".48s")}>A clearer perspective.</span>
          </h1>
          <p className="lede enter mt-8 text-[var(--on-dark-soft)]" style={d(".75s")}>
            Discover remarkable homes and considered investment opportunities across Dubai. With Lumen Realty, every property decision begins with clarity, expertise and personal attention.
          </p>
          <div className="enter mt-10 flex flex-wrap items-center gap-3" style={d(".9s")}>
            <Link href="/properties" className="btn btn-light">Explore Properties <ArrowRight /></Link>
            <Link href="/contact?type=consultation" className="btn btn-outline">Speak to an Advisor</Link>
          </div>
          <div className="enter mt-8 flex flex-wrap gap-x-8 gap-y-3 text-[.92rem]" style={d("1.05s")}>
            <Link href="/developments" className="link-line text-[var(--pearl-sand)]">Discover Developments</Link>
            <Link href="/contact?type=valuation" className="link-line text-[var(--pearl-sand)]">Request a Valuation</Link>
          </div>
        </div>
        <div className="wrap pointer-events-none absolute inset-x-0 bottom-[150px] hidden items-center justify-end gap-4 md:flex lg:bottom-[170px]">
          <Mark variant="reverse" className="h-6 w-6 opacity-70" />
          <span className="label text-[var(--on-dark-soft)]">Dubai · United Arab Emirates</span>
        </div>
      </section>

      {/* Property discovery, overlapping the hero edge (space reserved, no layout shift) */}
      <section aria-label="Property search" className="relative z-10">
        <div className="wrap -mt-32 lg:-mt-36">
          <div className="enter" style={d("1.1s")}>
            <HeroSearch
              communities={communities.map(({ slug, name }) => ({ slug, name }))}
              developments={publishedDevelopments().map(({ slug, name }) => ({ slug, name }))}
              hasProperties={publishedProperties().length > 0}
              hasDevelopments={publishedDevelopments().length > 0}
            />
          </div>
        </div>
      </section>

      {/* 02 — Introduction */}
      <section className="on-ivory band" aria-labelledby="intro-title">
        <div className="wrap grid items-center gap-14 lg:grid-cols-[minmax(0,.95fr)_minmax(0,1fr)] lg:gap-24">
          <figure className="relative min-w-0">
            <div className="aspect-[4/5] overflow-hidden lg:mr-10"><Plate seed="intro-arcade" tone="teal" kind="arcade" className="h-full w-full" /></div>
            <div className="absolute -bottom-8 right-0 hidden w-[44%] lg:block">
              <div className="aspect-square overflow-hidden border-[10px] border-[var(--ivory)]"><Plate seed="intro-towers" tone="gold" className="h-full w-full" /></div>
            </div>
          </figure>
          <div className="min-w-0">
            <p className="label label-gold">A different perspective</p>
            <h2 id="intro-title" className="display t-2 mt-6">Real estate guided by <em>clarity.</em></h2>
            <p className="lede muted mt-8">
              At Lumen Realty, we believe exceptional property decisions deserve more than a list of options. We combine thoughtful market guidance, personal service and transparent advice to help our clients move forward with confidence.
            </p>
            <Link href="/about" className="link-line mt-10 text-[var(--lumen-teal)]">Discover Lumen <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      {/* 03 + 04 — Properties and developments (verified inventory only) */}
      <section className="on-paper band" aria-labelledby="collection-title">
        <div className="wrap">
          <SectionHead
            eyebrow="The Lumen collection"
            title={<span id="collection-title">Architecture worth <em>discovering.</em></span>}
            intro="Homes we represent and new developments we can advise on. Every listing is checked and carries a valid advertising permit before it appears here."
          />
          {props.length > 0 && (
            <div className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-3">{props.map((p) => <PropertyCard key={p.slug} p={p} />)}</div>
          )}
          {devs.length > 0 && (
            <div className="mt-16 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
              <DevelopmentCard d={devs[0]} large />
              <div className="grid gap-10">{devs.slice(1).map((x) => <DevelopmentCard key={x.slug} d={x} />)}</div>
            </div>
          )}
          {props.length === 0 && devs.length === 0 && (
            <div className="mt-16 grid gap-px bg-[var(--rule)] md:grid-cols-2">
              {[
                { href: "/properties", t: "Properties", h: "Ready homes for sale and rent", b: "Apartments, villas and penthouses in the communities we know best. Our verified listings are being prepared for publication.", tone: "navy" as const, kind: "villa" as const },
                { href: "/developments", t: "New developments", h: "Off-plan projects, explained properly", b: "Developer track record, payment plans and handover timelines, set out side by side before you reserve.", tone: "teal" as const, kind: "towers" as const },
              ].map((x) => (
                <Link key={x.href} href={x.href} className="zoom-host group grid bg-[var(--paper)] no-underline">
                  <div className="zoom-frame aspect-[16/10] overflow-hidden"><Plate seed={x.href} tone={x.tone} kind={x.kind} className="h-full w-full" /></div>
                  <div className="grid gap-3 p-8 md:p-10">
                    <p className="label label-gold">{x.t}</p>
                    <p className="display t-3 group-hover:text-[var(--lumen-teal)]">{x.h}</p>
                    <p className="muted max-w-[52ch]">{x.b}</p>
                    <span className="link-line mt-3 w-fit text-[var(--lumen-teal)]">View {x.t.toLowerCase()} <ArrowRight className="h-4 w-4" /></span>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <p className="muted mt-10 max-w-[70ch] text-[.95rem]">
            Many of the homes we handle are offered privately. <Link href="/contact?type=buy" className="text-[var(--lumen-teal)] underline underline-offset-4">Share your brief</Link> and an advisor will send you what matches.
          </p>
        </div>
      </section>

      {/* 05 — Expertise */}
      <section className="on-ivory band" aria-labelledby="services-title">
        <div className="wrap">
          <SectionHead
            eyebrow="Our expertise"
            title={<span id="services-title">Considered advice for every <em>property decision.</em></span>}
            action={<Link href="/services" className="link-line w-fit text-[var(--lumen-teal)]">All services <ArrowRight className="h-4 w-4" /></Link>}
          />
          <div className="mt-16 grid gap-x-10 gap-y-16 md:grid-cols-2 lg:grid-cols-12">
            {services.map((s, i) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className={`zoom-host group grid content-start gap-5 no-underline ${["lg:col-span-7", "lg:col-span-5 lg:mt-28", "lg:col-span-5", "lg:col-span-7"][i]}`}
              >
                <div className={`zoom-frame overflow-hidden ${i % 3 === 0 ? "aspect-[16/10]" : "aspect-[4/3]"}`}>
                  <Plate seed={`svc-${s.slug}`} tone={s.plate} kind={(["villa", "towers", "arcade", "towers"] as const)[i]} className="h-full w-full" />
                </div>
                <div className="flex items-baseline justify-between gap-6 border-b border-[var(--rule)] pb-4">
                  <h3 className="display t-3 group-hover:text-[var(--lumen-teal)]">{s.name}</h3>
                  <ArrowRight className="h-5 w-5 shrink-0 text-[var(--lumen-teal)] transition-transform duration-500 group-hover:translate-x-1" />
                </div>
                <p className="muted max-w-[52ch]">{s.intro}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 06 — Communities */}
      <section className="on-midnight dark band overflow-hidden" aria-labelledby="communities-title">
        <div className="wrap">
          <SectionHead
            eyebrow="UAE lifestyle & communities"
            title={<span id="communities-title">Find where life feels <em>right.</em></span>}
            intro="Eight Dubai neighbourhoods, each with its own rhythm. Explore what it's like to live there, then ask us what's available."
            action={<Link href="/communities" className="link-line w-fit text-[var(--pearl-sand)]">All communities <ArrowRight className="h-4 w-4" /></Link>}
          />
        </div>
        <div className="mt-16">
          <ul className="wrap flex snap-x snap-mandatory gap-5 overflow-x-auto pb-6 [scrollbar-width:thin]" aria-label="Communities">
            {communities.map((c, i) => (
              <li key={c.slug} className="w-[78%] shrink-0 snap-start sm:w-[44%] lg:w-[calc((100%-60px)/4)]"><CommunityCard c={c} index={i} /></li>
            ))}
          </ul>
        </div>
      </section>

      {/* 07 — Why Lumen */}
      <section className="on-ivory band" aria-labelledby="why-title">
        <div className="wrap grid gap-16 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] lg:gap-24">
          <div className="min-w-0 lg:sticky lg:top-32 lg:self-start">
            <p className="label label-gold">Why Lumen</p>
            <h2 id="why-title" className="display t-2 mt-6">Expertise you can see. <em>Trust you can feel.</em></h2>
            <p className="lede muted mt-8">The name Lumen comes from light. These four commitments keep every client relationship clear.</p>
          </div>
          <ol className="grid min-w-0 gap-0">
            {[
              ["Selective excellence", "We show fewer properties, chosen with care. You won't be sent every listing in the building."],
              ["Trust & integrity", "Prices, fees and commission are written down at the start, and they don't change at the last minute."],
              ["Personal accountability", "One named advisor owns your enquiry from first call to handover, and answers for every step."],
              ["Shared success", "We measure ourselves by the clients who come back and the people they refer, not by how fast a deal closes."],
            ].map(([t, b]) => (
              <li key={t} className="grid grid-cols-[40px_minmax(0,1fr)] gap-6 border-t border-[var(--rule)] py-9 last:border-b">
                <Mark className="mt-1 h-7 w-7" />
                <div>
                  <h3 className="display t-3">{t}</h3>
                  <p className="muted mt-3 max-w-[54ch]">{b}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 08 — Investment intelligence */}
      <section className="on-sand band" aria-labelledby="intel-title">
        <div className="wrap">
          <SectionHead
            eyebrow="Investment intelligence"
            title={<span id="intel-title">Know the full cost <em>before you offer.</em></span>}
            intro="Move the price to see the main fees on a ready purchase in Dubai, which ones are set by the Dubai Land Department, and which are estimates."
          />
          <div className="mt-14"><CostCalculator /></div>
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              ["/services/buy", "The Dubai purchase process", "Five steps from offer to title deed"],
              ["/insights/dubai-property-buying-costs", "Fees and transfer costs", "What sits on top of the price"],
              ["/insights/off-plan-vs-ready-property", "Off-plan or ready", "Cash flow, timing and risk"],
              ["/insights/golden-visa-property-overview", "Golden Visa overview", "What the AED 2M figure means"],
            ].map(([href, t, s]) => (
              <Link key={href} href={href} className="group grid gap-2 border-t border-[rgba(29,47,73,.3)] pt-5 no-underline">
                <span className="display text-[1.45rem] leading-tight group-hover:text-[var(--lumen-teal)]">{t}</span>
                <span className="muted text-[.9rem]">{s}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 09 — People */}
      <section className="on-ivory band" aria-labelledby="people-title">
        <div className="wrap">
          <SectionHead
            eyebrow="Our people"
            title={<span id="people-title">People who know the market. <em>And value the relationship.</em></span>}
            action={<Link href="/team" className="link-line w-fit text-[var(--lumen-teal)]">Meet the team <ArrowRight className="h-4 w-4" /></Link>}
          />
          <div className="mt-16 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-4">
            {team.filter((m) => m.group === "leadership").map((m) => <TeamCard key={m.slug} member={m} />)}
          </div>
          <div className="mt-16 grid gap-6 border-t border-[var(--rule)] pt-10 md:grid-cols-[auto_minmax(0,1fr)] md:items-center md:gap-14">
            <p className="label label-gold">Sales & client services</p>
            <ul className="flex flex-wrap gap-x-10 gap-y-4">
              {team.filter((m) => m.group === "sales").map((m) => (
                <li key={m.slug}>
                  <Link href={`/team/${m.slug}`} className="group no-underline">
                    <span className="display text-[1.4rem] group-hover:text-[var(--lumen-teal)]">{m.name}</span>
                    <span className="muted ml-3 text-[.9rem]">{m.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 10 — Consultation */}
      <section className="on-midnight dark band" aria-labelledby="consult-title" id="consultation">
        <div className="wrap grid gap-16 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] lg:gap-24">
          <div className="min-w-0">
            <p className="label label-gold">Private consultation</p>
            <h2 id="consult-title" className="display t-2 mt-6">Your next chapter starts with the <em>right conversation.</em></h2>
            <p className="lede muted mt-8">Tell us a little about what you&apos;re planning. An advisor will call you back, or meet you at our office on Sheikh Zayed Road.</p>
            <ul className="mt-12 grid gap-5 text-[1.05rem]">
              <li><a href={`tel:${site.phone.e164}`} className="flex items-center gap-4 no-underline hover:text-white"><Phone className="h-5 w-5 text-[var(--champagne)]" /> <span className="num">{site.phone.display}</span></a></li>
              <li><a href={waLink(waMessages.general)} target="_blank" rel="noopener" className="flex items-center gap-4 no-underline hover:text-white"><WhatsApp className="h-5 w-5 text-[var(--champagne)]" /> WhatsApp the office</a></li>
            </ul>
          </div>
          <div className="min-w-0">
            <LeadForm defaultType="consultation" tone="card" submitLabel="Arrange a Private Consultation" whatsappMessage={waMessages.general} />
          </div>
        </div>
      </section>

      {/* 11 — Insights */}
      <section className="on-ivory band" aria-labelledby="insights-title">
        <div className="wrap">
          <SectionHead
            eyebrow="Insights"
            title={<span id="insights-title">Guides for <em>clear decisions.</em></span>}
            action={<Link href="/insights" className="link-line w-fit text-[var(--lumen-teal)]">All insights <ArrowRight className="h-4 w-4" /></Link>}
          />
          <div className="mt-16 grid gap-12 md:grid-cols-3">{articles.map((a, i) => <ArticleCard key={a.slug} a={a} i={i} />)}</div>
        </div>
      </section>
    </>
  );
}
