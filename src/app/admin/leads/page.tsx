import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { listLeads, updateLeadIntegration } from "@/lib/leads/store";
import { forwardToCrm } from "@/lib/leads/crm";
import { enquiryLabels } from "@/lib/leads/enquiry";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Leads", robots: { index: false, follow: false } };

async function retryCrm(formData: FormData) {
  "use server";
  const id = String(formData.get("id"));
  const lead = listLeads(1000).find((l) => l.id === id);
  if (!lead) return;
  const r = await forwardToCrm(lead);
  updateLeadIntegration(id, { status: r.status, crmReference: r.reference, crmError: r.error });
  revalidatePath("/admin/leads");
}

const statusLabel: Record<string, string> = { received: "Stored", crm_synced: "In CRM", crm_failed: "CRM failed", crm_skipped: "Stored (no CRM)" };

export default function LeadsAdmin() {
  const leads = listLeads(500);
  return (
    <section className="on-ivory">
      <div className="wrap py-16">
        <p className="label label-gold">Admin</p>
        <h1 className="display t-2 mt-4">Website enquiries</h1>
        <p className="muted mt-3">{leads.length} most recent. Leads are saved here before any CRM call, so nothing is lost if the CRM is unavailable.</p>
        <div className="table-scroll mt-10">
          <table className="num w-full min-w-[960px] border-collapse text-left text-[.9rem]">
            <thead>
              <tr className="label muted border-b border-[var(--rule)]">
                {["Reference", "Received", "Type", "Name", "Mobile", "Email", "Context", "Source", "Status", ""].map((h) => <th key={h} className="py-3 pr-4 font-normal">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => {
                const ctx = JSON.parse(l.context) as Record<string, unknown>;
                const ctxText = Object.entries(ctx).filter(([, v]) => v).map(([k, v]) => `${k}: ${typeof v === "object" ? Object.entries(v as object).map(([a, b]) => `${a} ${b}`).join(", ") : v}`).join(" · ");
                return (
                  <tr key={l.id} className="border-b border-[var(--rule)] align-top">
                    <td className="py-3 pr-4 font-semibold">{l.id}</td>
                    <td className="py-3 pr-4 whitespace-nowrap">{new Date(l.createdAt).toLocaleString("en-GB", { timeZone: "Asia/Dubai" })}</td>
                    <td className="py-3 pr-4">{enquiryLabels[l.enquiryType as keyof typeof enquiryLabels] ?? l.enquiryType}</td>
                    <td className="py-3 pr-4">{l.name}</td>
                    <td className="py-3 pr-4 whitespace-nowrap">{l.phone}</td>
                    <td className="py-3 pr-4">{l.email ?? "—"}</td>
                    <td className="py-3 pr-4 max-w-[320px]">{ctxText || "—"}{l.message ? <span className="muted mt-1 block">“{l.message}”</span> : null}</td>
                    <td className="py-3 pr-4">{l.sourcePage ?? "—"}</td>
                    <td className="py-3 pr-4">{statusLabel[l.status] ?? l.status}{l.crmError ? <span className="muted block text-[.8rem]">{l.crmError}</span> : null}{l.crmReference ? <span className="muted block text-[.8rem]">CRM #{l.crmReference}</span> : null}</td>
                    <td className="py-3">{l.status === "crm_failed" && <form action={retryCrm}><input type="hidden" name="id" value={l.id} /><button className="link-line text-[var(--lumen-teal)]" type="submit">Retry CRM</button></form>}</td>
                  </tr>
                );
              })}
              {leads.length === 0 && <tr><td colSpan={10} className="muted py-10">No enquiries yet. New website enquiries appear here as soon as they are submitted.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
