"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ENQUIRY_TYPES, enquiryLabels } from "@/lib/leads/enquiry";
import { waLink } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { ArrowRight, Check, WhatsApp } from "./Icons";

type EnquiryType = (typeof ENQUIRY_TYPES)[number];
type Ctx = Partial<Record<"project" | "property" | "community" | "budget" | "bedrooms", string>> & { details?: Record<string, string> };

const PUBLIC_TYPES: EnquiryType[] = ["consultation", "buy", "sell", "valuation", "rent", "off_plan", "callback", "general"];
const BUDGETS = ["Under AED 1M", "AED 1M – 2M", "AED 2M – 5M", "AED 5M – 10M", "Above AED 10M", "Not sure yet"];
const TIMEFRAMES = ["Within 3 months", "3–6 months", "6–12 months", "Just exploring"];
const SCHEDULED: EnquiryType[] = ["consultation", "viewing", "callback", "valuation"];

function newKey() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) => (+c ^ (Math.random() * 16) >> (+c / 4)).toString(16));
}

function readUtm(): Record<string, string> | undefined {
  try {
    const p = new URLSearchParams(window.location.search);
    const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"];
    const fresh = Object.fromEntries(keys.filter((k) => p.get(k)).map((k) => [k, p.get(k)!.slice(0, 200)]));
    if (Object.keys(fresh).length) sessionStorage.setItem("lumen_utm", JSON.stringify(fresh));
    const stored = sessionStorage.getItem("lumen_utm");
    return stored ? JSON.parse(stored) : undefined;
  } catch {
    return undefined;
  }
}

export function LeadForm({
  defaultType = "consultation",
  lockType = false,
  context = {},
  heading,
  submitLabel = "Send enquiry",
  whatsappMessage,
  tone = "light",
  showDetails = true,
}: {
  defaultType?: EnquiryType;
  lockType?: boolean;
  context?: Ctx;
  heading?: string;
  submitLabel?: string;
  whatsappMessage?: string;
  tone?: "light" | "card";
  showDetails?: boolean;
}) {
  const uid = useId();
  const f = (n: string) => `${uid}-${n}`;
  const [type, setType] = useState<EnquiryType>(defaultType);
  const [moreOpen, setMoreOpen] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [leadId, setLeadId] = useState<string | null>(null);
  const keyRef = useRef<string>("");
  const openedAt = useRef<number>(0);
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    keyRef.current = newKey();
    openedAt.current = Date.now();
  }, []);
  useEffect(() => {
    if (state === "done") doneRef.current?.focus();
  }, [state]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "sending") return;
    const fd = new FormData(e.currentTarget);
    const get = (k: string) => String(fd.get(k) ?? "").trim();

    const clientErrors: Record<string, string> = {};
    if (get("name").length < 2) clientErrors.name = "Enter your full name.";
    if (get("phone").replace(/\D/g, "").length < 8) clientErrors.phone = "Enter a mobile number with country code, for example +971 50 123 4567.";
    if (get("email") && !/^\S+@\S+\.\S+$/.test(get("email"))) clientErrors.email = "Enter a valid email address.";
    if (!fd.get("consent")) clientErrors.consent = "Please agree so we can contact you about this enquiry.";
    if (Object.keys(clientErrors).length) {
      setErrors(clientErrors);
      setFormError("Please check the highlighted fields.");
      formRef.current?.querySelector<HTMLElement>(`[name="${Object.keys(clientErrors)[0]}"]`)?.focus();
      return;
    }

    setErrors({});
    setFormError(null);
    setState("sending");
    track("lead_submit", { enquiry_type: type });

    const payload = {
      idempotencyKey: keyRef.current,
      name: get("name"),
      phone: get("phone"),
      email: get("email"),
      enquiryType: type,
      message: get("message"),
      consent: true,
      marketingConsent: Boolean(fd.get("marketing")),
      context: {
        ...context,
        budget: get("budget") || context.budget,
        timeframe: get("timeframe") || undefined,
        language: get("language") || undefined,
        contactPreference: (get("contactPreference") || undefined) as "whatsapp" | "phone" | "email" | undefined,
        preferredDate: get("preferredDate") || undefined,
        preferredTime: get("preferredTime") || undefined,
      },
      sourcePage: window.location.pathname,
      utm: readUtm(),
      website: get("website"),
      elapsedMs: Date.now() - openedAt.current,
    };

    try {
      const res = await fetch("/api/leads", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; id?: string; error?: string; fieldErrors?: Record<string, string> };
      if (res.ok && json.ok && json.id) {
        setLeadId(json.id);
        setState("done");
        track("lead_submit_success", { enquiry_type: type });
        keyRef.current = newKey();
        return;
      }
      if (res.ok && json.ok && !json.id) {
        // Spam heuristics tripped; ask the person to retry slowly rather than claiming success.
        throw new Error("We couldn't confirm your enquiry. Please wait a moment and send it again.");
      }
      if (json.fieldErrors) setErrors(Object.fromEntries(Object.entries(json.fieldErrors).map(([k, v]) => [k.replace(/^context\./, ""), v])));
      throw new Error(json.error ?? "Something went wrong while sending. Please try again.");
    } catch (err) {
      setState("error");
      setFormError(err instanceof Error && err.message !== "Failed to fetch" ? err.message : "We couldn't reach our server. Check your connection and try again, or message us on WhatsApp.");
      track("lead_submit_error", { enquiry_type: type });
    }
  }

  if (state === "done") {
    return (
      <div ref={doneRef} tabIndex={-1} role="status" className="grid gap-6 outline-none">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-[var(--lumen-teal)] text-white"><Check className="h-6 w-6" /></span>
        <div>
          <p className="display t-3">Thank you. Your enquiry is with our team.</p>
          <p className="muted mt-3">
            An advisor will contact you shortly. Your reference is <strong className="num text-[var(--ink)]">{leadId}</strong>.
          </p>
        </div>
        {whatsappMessage && (
          <div className="flex flex-wrap gap-3">
            <a className="btn btn-outline" href={waLink(`${whatsappMessage} (Ref ${leadId})`)} target="_blank" rel="noopener">
              <WhatsApp className="h-5 w-5" /> Continue on WhatsApp
            </a>
          </div>
        )}
        <button type="button" className="link-line w-fit text-[var(--lumen-teal)]" onClick={() => { setState("idle"); setLeadId(null); openedAt.current = Date.now(); }}>
          Send another enquiry
        </button>
      </div>
    );
  }

  const err = (k: string) =>
    errors[k] ? <p id={f(`${k}-err`)} className="field-error">{errors[k]}</p> : null;
  const aria = (k: string) => ({ "aria-invalid": errors[k] ? true : undefined, "aria-describedby": errors[k] ? f(`${k}-err`) : undefined });
  const scheduled = SCHEDULED.includes(type);

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className={`grid gap-7 ${tone === "card" ? "on-ivory p-7 md:p-10" : ""}`} aria-label={heading ?? "Enquiry form"}>
      {heading && <p className="display t-3">{heading}</p>}

      {!lockType && (
        <div className="field">
          <label htmlFor={f("type")}>I&apos;d like to</label>
          <select id={f("type")} name="enquiryType" className="input" value={type} onChange={(e) => setType(e.target.value as EnquiryType)}>
            {PUBLIC_TYPES.map((t) => <option key={t} value={t}>{enquiryLabels[t]}</option>)}
          </select>
        </div>
      )}

      <div className="grid gap-7 sm:grid-cols-2">
        <div className="field">
          <label htmlFor={f("name")}>Full name</label>
          <input id={f("name")} name="name" className="input" autoComplete="name" required {...aria("name")} />
          {err("name")}
        </div>
        <div className="field">
          <label htmlFor={f("phone")}>Mobile number</label>
          <input id={f("phone")} name="phone" type="tel" inputMode="tel" className="input" autoComplete="tel" placeholder="+971" required {...aria("phone")} />
          {err("phone")}
        </div>
      </div>

      <div className="field">
        <label htmlFor={f("email")}>Email <span className="normal-case tracking-normal">(optional)</span></label>
        <input id={f("email")} name="email" type="email" inputMode="email" className="input" autoComplete="email" {...aria("email")} />
        {err("email")}
      </div>

      {scheduled && (
        <fieldset className="grid gap-7 sm:grid-cols-2">
          <legend className="sr-only">Preferred appointment</legend>
          <div className="field">
            <label htmlFor={f("date")}>Preferred date</label>
            <input id={f("date")} name="preferredDate" type="date" className="input" min={new Date().toISOString().slice(0, 10)} />
          </div>
          <div className="field">
            <label htmlFor={f("time")}>Preferred time</label>
            <select id={f("time")} name="preferredTime" className="input" defaultValue="">
              <option value="">Any time</option>
              <option>Morning</option>
              <option>Afternoon</option>
              <option>Evening</option>
            </select>
          </div>
          <p className="muted -mt-3 text-[.85rem] sm:col-span-2">We&apos;ll confirm an exact time with you; this is a preference, not a booking.</p>
        </fieldset>
      )}

      {showDetails && (
        <div className="grid gap-7">
          <button type="button" className="link-line w-fit text-[var(--lumen-teal)]" aria-expanded={moreOpen} aria-controls={f("more")} onClick={() => setMoreOpen((v) => !v)}>
            {moreOpen ? "Hide extra details" : "Add budget, timing and preferences"}
          </button>
          <div id={f("more")} hidden={!moreOpen} className="grid gap-7 sm:grid-cols-2">
            <div className="field">
              <label htmlFor={f("budget")}>Budget</label>
              <select id={f("budget")} name="budget" className="input" defaultValue="">
                <option value="">Prefer not to say</option>
                {BUDGETS.map((b) => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor={f("timeframe")}>Timeframe</label>
              <select id={f("timeframe")} name="timeframe" className="input" defaultValue="">
                <option value="">Not decided</option>
                {TIMEFRAMES.map((b) => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor={f("pref")}>Best way to reach you</label>
              <select id={f("pref")} name="contactPreference" className="input" defaultValue="whatsapp">
                <option value="whatsapp">WhatsApp</option>
                <option value="phone">Phone call</option>
                <option value="email">Email</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor={f("lang")}>Preferred language</label>
              <select id={f("lang")} name="language" className="input" defaultValue="English">
                <option>English</option>
                <option>Arabic</option>
                <option>Other</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="field">
        <label htmlFor={f("message")}>Message <span className="normal-case tracking-normal">(optional)</span></label>
        <textarea id={f("message")} name="message" className="input" placeholder="Community, number of bedrooms, move-in date…" />
      </div>

      <div className="hidden" aria-hidden>
        <label htmlFor={f("website")}>Website</label>
        <input id={f("website")} name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-4">
        <label className="check">
          <input type="checkbox" name="consent" {...aria("consent")} />
          <span>I agree that Lumen Realty may contact me about this enquiry, as described in the <Link href="/privacy-policy" className="underline underline-offset-2">privacy policy</Link>.</span>
        </label>
        {err("consent")}
        <label className="check">
          <input type="checkbox" name="marketing" />
          <span>Send me occasional market updates and new launches (optional).</span>
        </label>
      </div>

      {formError && (
        <p role="alert" className="border-l-2 border-[var(--danger)] bg-[rgba(138,50,38,.06)] px-4 py-3 text-[.92rem] text-[var(--danger)]">{formError}</p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn btn-primary" disabled={state === "sending"} aria-busy={state === "sending"}>
          {state === "sending" ? "Sending…" : submitLabel} {state !== "sending" && <ArrowRight />}
        </button>
        {whatsappMessage && (
          <a href={waLink(whatsappMessage)} target="_blank" rel="noopener" className="link-line text-[var(--lumen-teal)]" onClick={() => track("click_whatsapp", { placement: "lead_form" })}>
            <WhatsApp className="h-4 w-4" /> Or message us on WhatsApp
          </a>
        )}
      </div>
    </form>
  );
}
