import { NextResponse, type NextRequest } from "next/server";
import { leadSchema } from "@/lib/leads/schema";
import { insertLead, updateLeadIntegration } from "@/lib/leads/store";
import { forwardToCrm } from "@/lib/leads/crm";
import { rateLimit } from "@/lib/leads/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIN_FILL_MS = 1500;

function clientIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: NextRequest) {
  const limit = rateLimit(`lead:${clientIp(req)}`, Number(process.env.LEADS_RATE_LIMIT ?? 5));
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many enquiries from this connection. Please wait a few minutes, or message us on WhatsApp." },
      { status: 429, headers: { "retry-after": String(limit.retryAfterSec) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "We couldn't read that submission. Please try again." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return NextResponse.json({ ok: false, error: "Please check the highlighted fields.", fieldErrors }, { status: 422 });
  }

  const input = parsed.data;

  // Spam signals: filled honeypot or an implausibly fast submission.
  // Accept silently without storing, so bots get no feedback.
  if (input.website || (input.elapsedMs !== undefined && input.elapsedMs < MIN_FILL_MS)) {
    return NextResponse.json({ ok: true, stored: false }, { status: 202 });
  }

  let record;
  try {
    const result = insertLead(input);
    if (result.duplicate) {
      return NextResponse.json({ ok: true, stored: true, id: result.record.id, duplicate: true });
    }
    record = result.record;
  } catch (e) {
    console.error("[leads] store failure", e instanceof Error ? e.message : e);
    return NextResponse.json(
      { ok: false, error: "We couldn't save your enquiry just now. Please try again, or message us on WhatsApp." },
      { status: 503 },
    );
  }

  const crm = await forwardToCrm(record);
  updateLeadIntegration(record.id, { status: crm.status, crmReference: crm.reference, crmError: crm.error });
  if (crm.status === "crm_failed") console.warn(`[leads] CRM forward failed for ${record.id}: ${crm.error}`);

  // The lead is stored either way; CRM failures are retried from the admin view.
  return NextResponse.json({ ok: true, stored: true, id: record.id }, { status: 201 });
}
