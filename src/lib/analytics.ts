/**
 * Analytics events. Nothing is sent unless a tag manager has been installed
 * (after consent) and has defined window.dataLayer. Never pass personal data
 * (names, phone numbers, emails, messages) into these events.
 */
type EventName =
  | "view_property"
  | "view_development"
  | "search_properties"
  | "lead_submit"
  | "lead_submit_success"
  | "lead_submit_error"
  | "click_whatsapp"
  | "request_brochure"
  | "request_viewing"
  | "request_valuation"
  | "request_consultation";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function track(event: EventName, params: Record<string, string | number | boolean> = {}) {
  if (typeof window === "undefined" || !Array.isArray(window.dataLayer)) return;
  window.dataLayer.push({ event, ...params });
}
