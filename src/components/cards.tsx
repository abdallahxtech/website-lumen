import { PhotoBox } from "@/components/Photo";
import type { MediaKey } from "@/content/media";
import Link from "next/link";
import Image from "next/image";
import { Plate } from "./Art";
import { Mark } from "./Logo";
import { ArrowUpRight } from "./Icons";
import type { TeamMember } from "@/content/team";
import { initials } from "@/content/team";
import type { Community } from "@/content/communities";
import type { Article } from "@/content/insights";
import type { Development, Property } from "@/content/listings";
import { formatAed } from "@/lib/calc";
import { getCommunity } from "@/content/communities";

export function Portrait({ member, className = "" }: { member: TeamMember; className?: string }) {
  return (
    <div className={`relative aspect-[4/5] overflow-hidden bg-[var(--deep-teal)] ${className}`}>
      {member.photo ? (
        <Image src={member.photo} alt={`Portrait of ${member.name}`} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover" />
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(120%_80%_at_80%_10%,rgba(187,166,130,.32),transparent_60%),linear-gradient(165deg,var(--lumen-teal),var(--midnight))]">
          <span className="display text-[clamp(3rem,6vw,4.5rem)] font-light tracking-[.08em] text-[var(--pearl-sand)]">{initials(member.name)}</span>
          <Mark variant="reverse" className="absolute -bottom-10 -right-10 h-40 w-40 opacity-[.12]" />
        </div>
      )}
    </div>
  );
}

export function TeamCard({ member }: { member: TeamMember }) {
  return (
    <Link href={`/team/${member.slug}`} className="zoom-host group grid gap-5 no-underline">
      <div className="zoom-frame"><Portrait member={member} /></div>
      <div>
        <p className="display text-[1.55rem] leading-tight">{member.name}</p>
        <p className="muted mt-1 text-[.92rem]">{member.title}</p>
      </div>
    </Link>
  );
}

export function CommunityCard({ c, index }: { c: Community; index: number }) {
  return (
    <Link href={`/communities/${c.slug}`} className="zoom-host group relative block aspect-[3/4] min-w-0 overflow-hidden text-[var(--on-dark)] no-underline">
      <div className="zoom-frame absolute inset-0"><PhotoBox name={`community-${c.slug}` as MediaKey} sizes="(min-width:1024px) 25vw, (min-width:640px) 45vw, 80vw" /></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(13,24,42,.92)] via-[rgba(13,24,42,.35)] to-[rgba(13,24,42,.05)]" />
      <div className="absolute inset-x-0 bottom-0 grid gap-2 p-6">
        <p className="label label-gold num">{String(index + 1).padStart(2, "0")} · {c.masterDeveloper.split(" (")[0]}</p>
        <p className="display text-[2rem] leading-none text-white">{c.name}</p>
        <p className="text-[.9rem] text-[var(--on-dark-soft)]">{c.tagline}</p>
      </div>
      <span className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full border border-white/30 transition-colors group-hover:border-[var(--champagne)] group-hover:bg-[var(--champagne)] group-hover:text-[var(--midnight-deep)]">
        <ArrowUpRight className="h-4 w-4" />
      </span>
    </Link>
  );
}

export function ArticleCard({ a }: { a: Article; i?: number }) {
  return (
    <Link href={`/insights/${a.slug}`} className="zoom-host group grid content-start gap-5 no-underline">
      <div className="zoom-frame aspect-[16/10] overflow-hidden"><PhotoBox name={`article-${a.slug}` as MediaKey} sizes="(min-width:768px) 33vw, 100vw" /></div>
      <p className="label label-gold">{a.category} · {a.readingMinutes} min read</p>
      <p className="display t-4 group-hover:text-[var(--lumen-teal)]">{a.title}</p>
      <p className="muted text-[.95rem]">{a.dek}</p>
    </Link>
  );
}

export function PropertyCard({ p }: { p: Property }) {
  const img = p.images[0];
  return (
    <Link href={`/properties/${p.slug}`} className="zoom-host group grid gap-4 no-underline">
      <div className="zoom-frame relative aspect-[4/3] overflow-hidden bg-[var(--paper)]">
        {img ? <Image src={img.src} alt={img.alt} fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover" /> : <Plate seed={p.slug} />}
        <span className="label absolute left-4 top-4 bg-[var(--ivory)] px-3 py-2 text-[.58rem]">{p.availability}</span>
      </div>
      <div className="grid gap-1">
        <p className="label muted">{getCommunity(p.community)?.name ?? p.community} · {p.propertyType}</p>
        <p className="display t-4">{p.title}</p>
        <p className="num muted text-[.92rem]">{p.bedrooms === 0 ? "Studio" : `${p.bedrooms} bed`} · {p.bathrooms} bath · {p.areaSqft.toLocaleString("en-US")} sq ft</p>
        <p className="num mt-1 font-semibold">{formatAed(p.priceAed)}{p.transaction === "rent" ? " / year" : ""}</p>
      </div>
    </Link>
  );
}

export function DevelopmentCard({ d, large = false }: { d: Development; large?: boolean }) {
  const img = d.gallery[0];
  return (
    <Link href={`/developments/${d.slug}`} className="zoom-host group grid gap-4 no-underline">
      <div className={`zoom-frame relative overflow-hidden ${large ? "aspect-[16/10]" : "aspect-[4/5]"}`}>
        {img ? <Image src={img.src} alt={img.alt} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" /> : <Plate seed={d.slug} />}
      </div>
      <p className="label label-gold">{d.developer.name} · {getCommunity(d.community)?.name ?? d.community}</p>
      <p className={`display ${large ? "t-3" : "t-4"}`}>{d.name}</p>
      <p className="muted num text-[.92rem]">
        {d.projectStatus}{d.handover ? ` · Handover ${d.handover}` : ""}{d.startingPriceAed ? ` · From ${formatAed(d.startingPriceAed)}` : ""}
      </p>
    </Link>
  );
}
