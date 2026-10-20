/**
 * Company facts. Every value here is shown publicly.
 * `verified` records whether the value has been confirmed against authorized
 * company documentation (trade licence, RERA certificate). Unverified values
 * are still displayed as supplied, but must be confirmed before launch —
 * see docs/launch-checklist.md.
 */
export const site = {
  name: "Lumen Realty",
  legalDescriptor: "Real estate buying, selling and leasing brokerage",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://lumenrealty.ae",
  whatsapp: {
    display: "+971 50 635 5365",
    e164: "+971506355365",
    waNumber: "971506355365",
  },
  phone: { display: "+971 50 635 5365", e164: "+971506355365" },
  /** No public email supplied yet. Leave null until confirmed; never invent one. */
  email: null as string | null,
  office: {
    unit: "Office 3001A",
    building: "Al Saqr Business Tower",
    street: "Sheikh Zayed Road",
    area: "Trade Center Second",
    city: "Dubai",
    country: "United Arab Emirates",
    countryCode: "AE",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Al+Saqr+Business+Tower+Sheikh+Zayed+Road+Dubai",
  },
  licensing: {
    reraOrn: { value: "64951", verified: false, source: "Company profile, Oct 2026" },
    tradeLicence: { value: "1652672", verified: false, source: "Company profile, Oct 2026" },
  },
  /** Only list social accounts that have been confirmed by the company. */
  social: [] as { label: string; url: string }[],
  /**
   * Hero photography. Set to a file in /public/media once licensed imagery is
   * supplied (e.g. "/media/hero-dubai.jpg"). While null, the hero renders the
   * branded architectural illustration.
   */
  media: {
    hero: null as null | { src: string; alt: string; credit: string },
  },
} as const;

export const officeAddressLines = [
  `${site.office.unit}, ${site.office.building}`,
  `${site.office.street}, ${site.office.area}`,
  `${site.office.city}, ${site.office.country}`,
];
