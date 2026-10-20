/** Enquiry types shared by the client forms and the server schema (no zod here, so it stays out of client bundles). */
export const ENQUIRY_TYPES = [
  "general",
  "buy",
  "rent",
  "sell",
  "valuation",
  "off_plan",
  "brochure",
  "availability",
  "viewing",
  "callback",
  "consultation",
  "cost_estimate",
] as const;

export const enquiryLabels: Record<(typeof ENQUIRY_TYPES)[number], string> = {
  general: "General enquiry",
  buy: "Buying a property",
  rent: "Renting or leasing",
  sell: "Selling a property",
  valuation: "Property valuation",
  off_plan: "Off-plan investment",
  brochure: "Project brochure",
  availability: "Availability check",
  viewing: "Viewing request",
  callback: "Callback request",
  consultation: "Private consultation",
  cost_estimate: "Cost estimate review",
};
