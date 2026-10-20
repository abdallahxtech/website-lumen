import "server-only";
import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { randomUUID } from "node:crypto";
import type { LeadInput } from "./schema";

/**
 * Durable lead store. A lead is written here BEFORE any CRM call, so a CRM
 * outage never loses an enquiry. Path is configurable via LEADS_DB_PATH and
 * must sit on persistent storage in production (a mounted volume).
 */
export interface LeadRecord {
  id: string;
  createdAt: string;
  idempotencyKey: string;
  enquiryType: string;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  context: string; // JSON
  sourcePage: string | null;
  utm: string | null; // JSON
  consent: number;
  marketingConsent: number;
  status: "received" | "crm_synced" | "crm_failed" | "crm_skipped";
  crmReference: string | null;
  crmError: string | null;
  notificationStatus: string | null;
}

let db: Database.Database | null = null;

function getDb() {
  if (db) return db;
  const path = process.env.LEADS_DB_PATH ?? "./data/leads.db";
  if (path !== ":memory:") mkdirSync(dirname(path), { recursive: true });
  db = new Database(path);
  db.pragma("journal_mode = WAL");
  db.exec(`CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    createdAt TEXT NOT NULL,
    idempotencyKey TEXT NOT NULL UNIQUE,
    enquiryType TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    message TEXT,
    context TEXT NOT NULL,
    sourcePage TEXT,
    utm TEXT,
    consent INTEGER NOT NULL,
    marketingConsent INTEGER NOT NULL,
    status TEXT NOT NULL,
    crmReference TEXT,
    crmError TEXT,
    notificationStatus TEXT
  );
  CREATE INDEX IF NOT EXISTS leads_created ON leads(createdAt);`);
  return db;
}

export function findByIdempotencyKey(key: string): LeadRecord | undefined {
  return getDb().prepare("SELECT * FROM leads WHERE idempotencyKey = ?").get(key) as LeadRecord | undefined;
}

/** Inserts a lead. Returns the existing record (duplicate=true) if the key was already used. */
export function insertLead(input: LeadInput): { record: LeadRecord; duplicate: boolean } {
  const existing = findByIdempotencyKey(input.idempotencyKey);
  if (existing) return { record: existing, duplicate: true };
  const record: LeadRecord = {
    id: `LR-${new Date().toISOString().slice(2, 10).replace(/-/g, "")}-${randomUUID().slice(0, 6).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    idempotencyKey: input.idempotencyKey,
    enquiryType: input.enquiryType,
    name: input.name,
    phone: input.phone,
    email: input.email ?? null,
    message: input.message ?? null,
    context: JSON.stringify(input.context ?? {}),
    sourcePage: input.sourcePage ?? null,
    utm: input.utm ? JSON.stringify(input.utm) : null,
    consent: 1,
    marketingConsent: input.marketingConsent ? 1 : 0,
    status: "received",
    crmReference: null,
    crmError: null,
    notificationStatus: null,
  };
  getDb()
    .prepare(
      `INSERT INTO leads VALUES (@id,@createdAt,@idempotencyKey,@enquiryType,@name,@phone,@email,@message,@context,@sourcePage,@utm,@consent,@marketingConsent,@status,@crmReference,@crmError,@notificationStatus)`,
    )
    .run(record);
  return { record, duplicate: false };
}

export function updateLeadIntegration(id: string, patch: Pick<LeadRecord, "status" | "crmReference" | "crmError">) {
  getDb().prepare("UPDATE leads SET status=@status, crmReference=@crmReference, crmError=@crmError WHERE id=@id").run({ id, ...patch });
}

export function listLeads(limit = 200): LeadRecord[] {
  return getDb().prepare("SELECT * FROM leads ORDER BY createdAt DESC LIMIT ?").all(limit) as LeadRecord[];
}
