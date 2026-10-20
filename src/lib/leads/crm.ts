import "server-only";
import type { LeadRecord } from "./store";

/**
 * CRM forwarding. Lumen's CRM has not been confirmed, so the default is
 * `none`: leads are stored locally and visible at /admin/leads.
 *
 * CRM_PROVIDER=webhook  → POSTs the lead as JSON to CRM_WEBHOOK_URL with an
 *                         HMAC-SHA256 signature (CRM_WEBHOOK_SECRET). Works with
 *                         n8n, Make, Zapier or a custom Odoo/Zoho bridge.
 * CRM_PROVIDER=odoo     → creates a crm.lead through Odoo's JSON-RPC API using
 *                         ODOO_URL, ODOO_DB, ODOO_USER and ODOO_API_KEY.
 *
 * Zoho CRM is documented in docs/lead-integration.md and can be added as a
 * third adapter once Lumen confirms it and issues OAuth credentials.
 */
export type CrmResult = { status: "crm_synced" | "crm_failed" | "crm_skipped"; reference: string | null; error: string | null };

const TIMEOUT_MS = 8000;

async function withTimeout(url: string, init: RequestInit) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
}

export function leadPayload(lead: LeadRecord) {
  return {
    leadId: lead.id,
    createdAt: lead.createdAt,
    enquiryType: lead.enquiryType,
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
    message: lead.message,
    context: JSON.parse(lead.context),
    sourcePage: lead.sourcePage,
    utm: lead.utm ? JSON.parse(lead.utm) : null,
    consent: Boolean(lead.consent),
    marketingConsent: Boolean(lead.marketingConsent),
  };
}

async function sendWebhook(lead: LeadRecord): Promise<CrmResult> {
  const url = process.env.CRM_WEBHOOK_URL;
  if (!url) return { status: "crm_failed", reference: null, error: "CRM_WEBHOOK_URL is not set" };
  const body = JSON.stringify(leadPayload(lead));
  const headers: Record<string, string> = { "content-type": "application/json", "x-lumen-lead-id": lead.id };
  const secret = process.env.CRM_WEBHOOK_SECRET;
  if (secret) {
    const { createHmac } = await import("node:crypto");
    headers["x-lumen-signature"] = createHmac("sha256", secret).update(body).digest("hex");
  }
  const res = await withTimeout(url, { method: "POST", headers, body });
  if (!res.ok) return { status: "crm_failed", reference: null, error: `Webhook responded ${res.status}` };
  let reference: string | null = null;
  try {
    const json = (await res.json()) as { id?: string | number };
    reference = json?.id != null ? String(json.id) : null;
  } catch {
    /* non-JSON response is acceptable */
  }
  return { status: "crm_synced", reference, error: null };
}

async function odooRpc(service: string, method: string, args: unknown[]) {
  const res = await withTimeout(`${process.env.ODOO_URL}/jsonrpc`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", method: "call", params: { service, method, args }, id: Date.now() }),
  });
  const json = (await res.json()) as { result?: unknown; error?: { message?: string } };
  if (json.error) throw new Error(json.error.message ?? "Odoo error");
  return json.result;
}

async function sendOdoo(lead: LeadRecord): Promise<CrmResult> {
  const { ODOO_URL, ODOO_DB, ODOO_USER, ODOO_API_KEY } = process.env;
  if (!ODOO_URL || !ODOO_DB || !ODOO_USER || !ODOO_API_KEY) return { status: "crm_failed", reference: null, error: "Odoo credentials are incomplete" };
  const uid = await odooRpc("common", "login", [ODOO_DB, ODOO_USER, ODOO_API_KEY]);
  if (!uid) return { status: "crm_failed", reference: null, error: "Odoo authentication failed" };
  const p = leadPayload(lead);
  const ctx = Object.entries(p.context ?? {}).filter(([, v]) => v).map(([k, v]) => `${k}: ${typeof v === "object" ? JSON.stringify(v) : v}`);
  const id = await odooRpc("object", "execute_kw", [
    ODOO_DB, uid, ODOO_API_KEY, "crm.lead", "create",
    [{
      name: `${p.enquiryType.replace("_", " ")} — ${p.name}`,
      contact_name: p.name,
      phone: p.phone,
      email_from: p.email ?? false,
      description: [p.message ?? "", "", ...ctx, "", `Source: ${p.sourcePage ?? "website"}`, `Lumen lead ID: ${p.leadId}`].join("\n"),
      type: "lead",
    }],
  ]);
  return { status: "crm_synced", reference: String(id), error: null };
}

export async function forwardToCrm(lead: LeadRecord): Promise<CrmResult> {
  const provider = (process.env.CRM_PROVIDER ?? "none").toLowerCase();
  try {
    if (provider === "webhook") return await sendWebhook(lead);
    if (provider === "odoo") return await sendOdoo(lead);
    return { status: "crm_skipped", reference: null, error: null };
  } catch (e) {
    const msg = e instanceof Error ? (e.name === "AbortError" ? "CRM request timed out" : e.message) : "Unknown CRM error";
    return { status: "crm_failed", reference: null, error: msg.slice(0, 300) };
  }
}
