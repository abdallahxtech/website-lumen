"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { LeadForm } from "./LeadForm";
import { ArrowRight, Close } from "./Icons";
import { track } from "@/lib/analytics";

type Mode = "buy" | "rent" | "off-plan" | "sell";
const TABS: { id: Mode; label: string }[] = [
  { id: "buy", label: "Buy" },
  { id: "rent", label: "Rent" },
  { id: "off-plan", label: "Off-Plan" },
  { id: "sell", label: "Sell" },
];
const CATEGORIES = ["Apartment", "Villa", "Townhouse", "Penthouse", "Office"];
const SALE_BUDGETS = [["", "No minimum"], ["1000000", "AED 1M"], ["2000000", "AED 2M"], ["5000000", "AED 5M"], ["10000000", "AED 10M"], ["20000000", "AED 20M"]];
const RENT_BUDGETS = [["", "No minimum"], ["80000", "AED 80K / yr"], ["150000", "AED 150K / yr"], ["300000", "AED 300K / yr"], ["500000", "AED 500K / yr"]];
const BEDS = [["", "Any"], ["0", "Studio"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5+"]];

export function HeroSearch({
  communities,
  developments,
  hasProperties,
  hasDevelopments,
}: {
  communities: { slug: string; name: string }[];
  developments: { slug: string; name: string }[];
  hasProperties: boolean;
  hasDevelopments: boolean;
}) {
  const router = useRouter();
  const uid = useId();
  const id = (n: string) => `${uid}-${n}`;
  const [mode, setMode] = useState<Mode>("buy");
  const [v, setV] = useState<Record<string, string>>({});
  const [advisory, setAdvisory] = useState<null | Record<string, string>>(null);
  const set = (k: string) => (e: React.ChangeEvent<HTMLSelectElement>) => setV((s) => ({ ...s, [k]: e.target.value }));
  const budgets = mode === "rent" ? RENT_BUDGETS : SALE_BUDGETS;
  const communityName = communities.find((c) => c.slug === v.community)?.name;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    track("search_properties", { mode });
    if (mode === "sell") {
      router.push(`/contact?type=valuation${v.community ? `&community=${v.community}` : ""}`);
      return;
    }
    const params = new URLSearchParams();
    if (mode === "off-plan") {
      ["community", "developer", "year", "maxPrice"].forEach((k) => v[k] && params.set(k, v[k]));
      if (hasDevelopments) return router.push(`/developments?${params}`);
    } else {
      params.set("transaction", mode === "rent" ? "rent" : "sale");
      ["community", "type", "minPrice", "maxPrice", "beds"].forEach((k) => v[k] && params.set(k, v[k]));
      if (hasProperties) return router.push(`/properties?${params}`);
    }
    // No verified inventory published yet: turn the search into an advisory request.
    const prefs: Record<string, string> = { Intent: TABS.find((t) => t.id === mode)!.label };
    if (communityName) prefs.Community = communityName;
    if (v.type) prefs.Category = v.type;
    if (v.beds) prefs.Bedrooms = BEDS.find(([k]) => k === v.beds)?.[1] ?? v.beds;
    if (v.minPrice) prefs["Min budget"] = budgets.find(([k]) => k === v.minPrice)?.[1] ?? v.minPrice;
    if (v.maxPrice) prefs["Max budget"] = budgets.find(([k]) => k === v.maxPrice)?.[1] ?? v.maxPrice;
    if (v.developer) prefs.Development = developments.find((d) => d.slug === v.developer)?.name ?? v.developer;
    if (v.year) prefs.Completion = v.year;
    setAdvisory(prefs);
  }

  const select = (key: string, label: string, options: string[][]) => (
    <div className="field min-w-0">
      <label htmlFor={id(key)}>{label}</label>
      <select id={id(key)} className="input" value={v[key] ?? ""} onChange={set(key)}>
        {options.map(([val, l]) => <option key={val} value={val}>{l}</option>)}
      </select>
    </div>
  );
  const communityOpts = [["", "All communities"], ...communities.map((c) => [c.slug, c.name])];
  const year = new Date().getFullYear();

  return (
    <div className="bg-[var(--ivory)] text-[var(--ink)] shadow-[0_40px_80px_-40px_rgba(13,24,42,.55)]">
      <div role="tablist" aria-label="What are you looking for?" className="flex overflow-x-auto border-b border-[var(--rule)]">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            id={id(`tab-${t.id}`)}
            aria-selected={mode === t.id}
            aria-controls={id("panel")}
            onClick={() => { setMode(t.id); setV({}); setAdvisory(null); }}
            className={`label relative shrink-0 px-4 py-5 transition-colors sm:px-6 md:px-8 ${mode === t.id ? "text-[var(--ink)]" : "text-[var(--ink-faint)] hover:text-[var(--ink)]"}`}
          >
            {t.label}
            {mode === t.id && <span className="absolute inset-x-4 bottom-[-1px] h-[2px] bg-[var(--lumen-teal)] sm:inset-x-6 md:inset-x-8" />}
          </button>
        ))}
      </div>

      <div id={id("panel")} role="tabpanel" aria-labelledby={id(`tab-${mode}`)} className="p-6 md:p-8">
        {!advisory ? (
          <form onSubmit={onSubmit} className="grid items-end gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto]">
            {select("community", "Location", communityOpts)}
            {mode === "off-plan" ? (
              <>
                {select("developer", "Development", [["", developments.length ? "All developments" : "Any development"], ...developments.map((d) => [d.slug, d.name])])}
                {select("year", "Completion", [["", "Any year"], ...Array.from({ length: 5 }, (_, i) => [String(year + i), String(year + i)])])}
                {select("maxPrice", "Budget up to", [["", "Any budget"], ...SALE_BUDGETS.slice(1)])}
              </>
            ) : mode === "sell" ? (
              <>
                {select("type", "Property category", [["", "Select"], ...CATEGORIES.map((c) => [c, c])])}
                {select("beds", "Bedrooms", BEDS)}
                <div className="hidden lg:block" />
              </>
            ) : (
              <>
                {select("type", "Property category", [["", "All categories"], ...CATEGORIES.map((c) => [c, c])])}
                {select("minPrice", mode === "rent" ? "Annual rent from" : "Budget from", budgets)}
                {select("beds", "Bedrooms", BEDS)}
              </>
            )}
            <button type="submit" className="btn btn-primary sm:col-span-2 lg:col-span-1">
              {mode === "sell" ? "Request a Valuation" : "Search Properties"} <ArrowRight />
            </button>
          </form>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)]">
            <div className="min-w-0">
              <div className="flex items-start justify-between gap-4">
                <p className="display t-3">We&apos;ll prepare a shortlist for you.</p>
                <button type="button" onClick={() => setAdvisory(null)} className="grid h-10 w-10 shrink-0 place-items-center border border-[var(--rule)]" aria-label="Back to search">
                  <Close className="h-4 w-4" />
                </button>
              </div>
              <p className="muted mt-3">
                Our verified listings are being prepared for the new site. Leave your details and an advisor will send you properties that match what you selected.
              </p>
              <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 text-[.92rem]">
                {Object.entries(advisory).map(([k, val]) => (
                  <div key={k} className="min-w-0 border-t border-[var(--rule)] pt-2">
                    <dt className="label muted">{k}</dt>
                    <dd className="mt-1">{val}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <LeadForm
              defaultType={mode === "rent" ? "rent" : mode === "off-plan" ? "off_plan" : "buy"}
              lockType
              showDetails={false}
              context={{ community: communityName, details: advisory }}
              submitLabel="Send my search"
            />
          </div>
        )}
      </div>
    </div>
  );
}
