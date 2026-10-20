"use client";

import { useId, useMemo, useState } from "react";
import { estimateCosts, formatAed } from "@/lib/calc";
import { feeConfig } from "@/content/fees";
import { LeadForm } from "./LeadForm";

export function CostCalculator() {
  const uid = useId();
  const [price, setPrice] = useState(3_500_000);
  const [financing, setFinancing] = useState<"cash" | "mortgage">("cash");
  const [ltv, setLtv] = useState(75);
  const [sendOpen, setSendOpen] = useState(false);
  const r = useMemo(() => estimateCosts({ price, financing, ltvPercent: ltv }), [price, financing, ltv]);

  const details = {
    Price: formatAed(price),
    Financing: financing === "cash" ? "Cash" : `Mortgage, ${ltv}% loan`,
    "Estimated fees": formatAed(r.totalFees),
    "Cash required": formatAed(r.cashRequired),
  };

  return (
    <div className="grid gap-px bg-[var(--rule)] lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]">
      <div className="grid content-start gap-10 bg-[var(--ivory)] p-7 md:p-10">
        <div className="field">
          <label htmlFor={`${uid}-price`}>Property price</label>
          <output htmlFor={`${uid}-price`} className="display num block text-[clamp(2.2rem,4vw,3.2rem)] leading-none">{formatAed(price)}</output>
          <input
            id={`${uid}-price`}
            type="range"
            min={500_000}
            max={50_000_000}
            step={50_000}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="mt-4 h-8 w-full accent-[var(--lumen-teal)]"
            aria-valuetext={formatAed(price)}
          />
          <div className="field mt-2">
            <label htmlFor={`${uid}-price-input`} className="sr-only">Enter an exact price in AED</label>
            <input
              id={`${uid}-price-input`}
              inputMode="numeric"
              className="input num"
              value={price.toLocaleString("en-US")}
              onChange={(e) => {
                const n = Number(e.target.value.replace(/[^\d]/g, ""));
                if (!Number.isNaN(n)) setPrice(Math.min(n, 500_000_000));
              }}
            />
          </div>
        </div>

        <fieldset className="field">
          <legend className="field-label mb-3">How are you paying?</legend>
          <div className="grid grid-cols-2 border border-[var(--rule)]">
            {(["cash", "mortgage"] as const).map((k) => (
              <label key={k} className={`cursor-pointer px-4 py-3 text-center text-[.95rem] font-semibold transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[var(--champagne)] ${financing === k ? "bg-[var(--midnight)] text-white" : "text-[var(--ink-soft)] hover:text-[var(--ink)]"}`}>
                <input type="radio" name={`${uid}-fin`} value={k} checked={financing === k} onChange={() => setFinancing(k)} className="sr-only" />
                {k === "cash" ? "Cash" : "Mortgage"}
              </label>
            ))}
          </div>
        </fieldset>

        {financing === "mortgage" && (
          <div className="field">
            <label htmlFor={`${uid}-ltv`}>Loan amount: <span className="num">{ltv}%</span> of the price</label>
            <input id={`${uid}-ltv`} type="range" min={20} max={feeConfig.mortgage.maxLtvPercent} step={5} value={ltv} onChange={(e) => setLtv(Number(e.target.value))} className="h-8 w-full accent-[var(--lumen-teal)]" aria-valuetext={`${ltv} percent`} />
            <p className="muted text-[.85rem]">Maximum loan-to-value depends on your residency status, the property and the lender.</p>
          </div>
        )}

        <div className="border-t border-[var(--rule)] pt-6 text-[.88rem]">
          <p className="label muted">Assumptions last checked</p>
          <p className="num mt-1">{new Date(feeConfig.lastVerified).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
        </div>
      </div>

      <div className="on-midnight dark grid content-start gap-6 p-7 md:p-10" aria-live="polite">
        <p className="label label-gold">Estimated buying costs · ready property</p>
        <div className="table-scroll">
          <table className="num w-full border-collapse text-[.95rem]">
            <caption className="sr-only">Itemised purchase costs</caption>
            <thead className="sr-only"><tr><th scope="col">Cost</th><th scope="col">Amount</th></tr></thead>
            <tbody>
              {r.lines.map((l) => (
                <tr key={l.id} className="border-b border-[var(--rule-dark)]">
                  <th scope="row" className="py-4 pr-4 text-left font-normal">
                    {l.label}
                    <span className="mt-1 flex flex-wrap items-center gap-2 text-[.8rem] text-[var(--on-dark-soft)]">
                      <span className={`label rounded-full border px-2 py-[2px] text-[.55rem] ${l.kind === "regulated" ? "border-[var(--champagne)] text-[var(--champagne)]" : "border-[var(--rule-dark)]"}`}>
                        {l.kind === "regulated" ? "Official fee" : "Estimate"}
                      </span>
                      {l.basis}
                    </span>
                  </th>
                  <td className="whitespace-nowrap py-4 text-right align-top">{formatAed(l.amount)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th scope="row" className="display pt-6 text-left text-[1.5rem] font-light">Total fees</th>
                <td className="display whitespace-nowrap pt-6 text-right text-[1.8rem] text-[var(--champagne)]">{formatAed(r.totalFees)}</td>
              </tr>
              <tr>
                <th scope="row" className="pt-2 text-left font-normal text-[var(--on-dark-soft)]">Cash needed at transfer{financing === "mortgage" ? " (deposit + fees)" : ""}</th>
                <td className="whitespace-nowrap pt-2 text-right">{formatAed(r.cashRequired)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="border border-[var(--rule-dark)] p-4 text-[.88rem] text-[var(--on-dark-soft)]">
          <p className="label label-gold mb-2">Golden Visa</p>
          {r.meetsGoldenVisaThreshold
            ? "This price meets the AED 2 million minimum investment published for the real estate investor Golden Visa. Eligibility also depends on ownership, financing and the rules in force when you apply."
            : "The UAE publishes an AED 2 million minimum investment for the real estate investor Golden Visa. Eligibility also depends on ownership, financing and current rules."}
        </div>

        <details className="text-[.85rem] text-[var(--on-dark-soft)]">
          <summary className="cursor-pointer font-semibold text-[var(--on-dark)]">What&apos;s not included, and our sources</summary>
          <ul className="mt-3 list-disc space-y-1 pl-5">{feeConfig.exclusions.map((x) => <li key={x}>{x}</li>)}</ul>
          <ul className="mt-4 space-y-2">
            {feeConfig.sources.map((s) => (
              <li key={s.url}><a href={s.url} target="_blank" rel="noopener" className="underline underline-offset-2">{s.label}</a> — {s.covers}</li>
            ))}
          </ul>
        </details>
        <p className="text-[.8rem] text-[var(--on-dark-soft)]">Indicative only, not financial advice. Your advisor will confirm exact figures in a written cost sheet before transfer.</p>

        {!sendOpen ? (
          <button type="button" className="btn btn-light w-fit" onClick={() => setSendOpen(true)}>Send this estimate to an advisor</button>
        ) : (
          <div className="mt-2">
            <LeadForm defaultType="cost_estimate" lockType showDetails={false} context={{ details }} submitLabel="Send my estimate" tone="card" heading="Review my costs with an advisor" />
          </div>
        )}
      </div>
    </div>
  );
}
