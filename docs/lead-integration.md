# Lead integration

## Flow

```
Browser form ──POST /api/leads──▶ validate (zod) ─▶ rate limit ─▶ spam checks
                                                   │
                                                   ▼
                                       INSERT into SQLite (leads.db)   ◀── source of truth
                                                   │
                                                   ▼
                                CRM adapter (none | webhook | odoo), 8 s timeout
                                                   │
                                     update status / CRM reference / error
                                                   ▼
                              201 { id }  ──▶  form shows "Your reference is LR-…"
```

- **Success is shown only when the server returns a stored lead ID.** A WhatsApp link is offered afterwards as an optional next step and is never treated as delivery.
- **Idempotency:** each form instance sends a UUID `idempotencyKey`. Repeats, including double-clicks and network retries, return the original lead (`duplicate: true`) without creating a second row.
- **Spam:** a hidden honeypot field and a minimum 1.5 s fill time. Suspicious submissions get a 202 with no ID and are not stored, so the form asks the person to try again rather than showing success.
- **Rate limit:** 5 per IP per 10 minutes (`LEADS_RATE_LIMIT`). The limiter is in-memory, so use Redis if the site runs on several instances.
- **CRM failure:** the lead stays stored with `status = crm_failed` and the error text. `/admin/leads` has a "Retry CRM" button.
- **Privacy:** analytics events (`lead_submit`, `lead_submit_success`, `lead_submit_error`) carry only the enquiry type, never personal data. Server logs record lead IDs and error messages only.

## Lead record

| Field | Notes |
|---|---|
| `id` | `LR-YYMMDD-XXXXXX` |
| `createdAt`, `idempotencyKey` | |
| `enquiryType` | general, buy, rent, sell, valuation, off_plan, brochure, availability, viewing, callback, consultation, cost_estimate |
| `name`, `phone` (normalised), `email` | |
| `message`, `context` (JSON: project, property, community, budget, bedrooms, timeframe, language, contactPreference, preferredDate/Time, details) | |
| `sourcePage`, `utm` (utm_*, gclid, fbclid) | |
| `consent`, `marketingConsent` | Marketing consent is a separate, optional box |
| `status`, `crmReference`, `crmError`, `notificationStatus` | |

## CRM options

Lumen's CRM has not been confirmed, and BetaEdge systems are not used without authorisation.

**Webhook (`CRM_PROVIDER=webhook`).** This is the most flexible option and works with n8n, Make, Zapier or a custom bridge into Zoho, Odoo or Bitrix24. The body is the lead JSON. When `CRM_WEBHOOK_SECRET` is set, `x-lumen-signature` carries an HMAC-SHA256 of the raw body, which the receiver should verify. Return JSON `{ "id": "<crm id>" }` to have the reference recorded.

**Odoo (`CRM_PROVIDER=odoo`).** This creates a `crm.lead` through JSON-RPC (`common.login` then `object.execute_kw … create`). Use a dedicated user with CRM rights only, and an API key rather than a password.

**Zoho CRM** (not yet implemented). Map the lead to the Leads module: `Last_Name` from the name, `Mobile` from the phone, `Email`, `Lead_Source` = "Website", `Description` from the message plus context, and custom fields for enquiry type and project. This needs a server-side OAuth refresh token (`ZOHO_CLIENT_ID`, `ZOHO_CLIENT_SECRET`, `ZOHO_REFRESH_TOKEN`, data-centre domain `zoho.com` or `zoho.eu`). It should be added as a third adapter in `src/lib/leads/crm.ts` once confirmed.

## Notifications

Email notifications are not enabled because no destination address was supplied. Once Lumen provides a sales inbox, add an SMTP or transactional email adapter (for example Postmark or Amazon SES) after the CRM step, and record the result in `notificationStatus`.
