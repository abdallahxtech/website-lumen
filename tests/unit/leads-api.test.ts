import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { randomUUID } from "node:crypto";
import { POST } from "@/app/api/leads/route";
import { listLeads } from "@/lib/leads/store";
import { __resetRateLimit } from "@/lib/leads/rate-limit";

const valid = () => ({
  idempotencyKey: randomUUID(),
  name: "Test Person",
  phone: "+971 50 123 4567",
  email: "",
  enquiryType: "consultation",
  message: "Looking in Dubai Hills",
  consent: true,
  context: { community: "Dubai Hills Estate" },
  sourcePage: "/contact",
  elapsedMs: 9000,
});

let ip = 0;
const req = (body: unknown, raw = false) =>
  new NextRequest("http://localhost/api/leads", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": `10.0.0.${++ip}` },
    body: raw ? (body as string) : JSON.stringify(body),
  });

beforeEach(() => {
  __resetRateLimit();
  delete process.env.CRM_PROVIDER;
  delete process.env.CRM_WEBHOOK_URL;
});
afterEach(() => vi.unstubAllGlobals());

describe("POST /api/leads", () => {
  it("stores a valid lead before reporting success", async () => {
    const body = valid();
    const res = await POST(req(body));
    const json = await res.json();
    expect(res.status).toBe(201);
    expect(json.id).toMatch(/^LR-\d{6}-[A-F0-9]{6}$/);
    const stored = listLeads().find((l) => l.id === json.id)!;
    expect(stored.phone).toBe("+971501234567");
    expect(stored.status).toBe("crm_skipped");
    expect(JSON.parse(stored.context).community).toBe("Dubai Hills Estate");
  });

  it("rejects a missing consent", async () => {
    const res = await POST(req({ ...valid(), consent: false }));
    expect(res.status).toBe(422);
    expect((await res.json()).fieldErrors.consent).toBeTruthy();
  });

  it("rejects an invalid phone number", async () => {
    const res = await POST(req({ ...valid(), phone: "12ab" }));
    expect(res.status).toBe(422);
    expect((await res.json()).fieldErrors.phone).toMatch(/country code/);
  });

  it("rejects malformed JSON", async () => {
    const res = await POST(req("{not json", true));
    expect(res.status).toBe(400);
  });

  it("does not create duplicates for a repeated submission", async () => {
    const body = valid();
    const a = await (await POST(req(body))).json();
    const before = listLeads().length;
    const b = await (await POST(req(body))).json();
    expect(b.id).toBe(a.id);
    expect(b.duplicate).toBe(true);
    expect(listLeads().length).toBe(before);
  });

  it("silently drops honeypot and too-fast submissions without storing", async () => {
    const before = listLeads().length;
    const r1 = await POST(req({ ...valid(), website: "spam.example" }));
    const r2 = await POST(req({ ...valid(), elapsedMs: 200 }));
    expect(r1.status).toBe(202);
    expect(r2.status).toBe(202);
    expect((await r1.json()).id).toBeUndefined();
    expect(listLeads().length).toBe(before);
  });

  it("rate-limits repeated submissions from one address", async () => {
    const headers = { "content-type": "application/json", "x-forwarded-for": "192.168.1.9" };
    const statuses: number[] = [];
    for (let i = 0; i < 7; i++) {
      const r = await POST(new NextRequest("http://localhost/api/leads", { method: "POST", headers, body: JSON.stringify(valid()) }));
      statuses.push(r.status);
    }
    expect(statuses.slice(0, 5).every((s) => s === 201)).toBe(true);
    expect(statuses[5]).toBe(429);
  });

  it("keeps the lead when the CRM webhook fails", async () => {
    process.env.CRM_PROVIDER = "webhook";
    process.env.CRM_WEBHOOK_URL = "https://crm.example/hook";
    vi.stubGlobal("fetch", vi.fn(async () => new Response("down", { status: 503 })));
    const json = await (await POST(req(valid()))).json();
    const stored = listLeads().find((l) => l.id === json.id)!;
    expect(stored.status).toBe("crm_failed");
    expect(stored.crmError).toMatch(/503/);
  });

  it("records a CRM timeout as a failure without losing the lead", async () => {
    process.env.CRM_PROVIDER = "webhook";
    process.env.CRM_WEBHOOK_URL = "https://crm.example/hook";
    vi.stubGlobal("fetch", vi.fn(async () => { const e = new Error("aborted"); e.name = "AbortError"; throw e; }));
    const json = await (await POST(req(valid()))).json();
    expect(listLeads().find((l) => l.id === json.id)!.crmError).toBe("CRM request timed out");
  });

  it("marks the lead synced and stores the CRM reference on success", async () => {
    process.env.CRM_PROVIDER = "webhook";
    process.env.CRM_WEBHOOK_URL = "https://crm.example/hook";
    process.env.CRM_WEBHOOK_SECRET = "s3cret";
    const fetchMock = vi.fn(async (_url: string, init: RequestInit) => {
      expect((init.headers as Record<string, string>)["x-lumen-signature"]).toMatch(/^[a-f0-9]{64}$/);
      return Response.json({ id: 4242 });
    });
    vi.stubGlobal("fetch", fetchMock);
    const json = await (await POST(req(valid()))).json();
    const stored = listLeads().find((l) => l.id === json.id)!;
    expect(stored.status).toBe("crm_synced");
    expect(stored.crmReference).toBe("4242");
    delete process.env.CRM_WEBHOOK_SECRET;
  });
});
