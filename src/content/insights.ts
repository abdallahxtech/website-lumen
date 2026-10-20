export interface Article {
  slug: string;
  title: string;
  dek: string;
  category: "Guide" | "Explainer";
  published: string;
  updated: string;
  readingMinutes: number;
  body: { h?: string; p: string[] }[];
  sources: { label: string; url: string }[];
  status: "draft" | "published";
}

/** Educational guides. Facts are limited to long-standing rules; check sources before each update. */
export const articles: Article[] = [
  {
    slug: "dubai-property-buying-costs",
    title: "What it really costs to buy property in Dubai",
    dek: "The fees that sit on top of the purchase price, and which of them are fixed by law.",
    category: "Guide",
    published: "2026-10-20",
    updated: "2026-10-20",
    readingMinutes: 5,
    body: [
      { p: ["The asking price is only part of the cost of buying a home in Dubai. Most buyers should plan for roughly 6–8% on top of the price for a cash purchase, and more with a mortgage. Here is where that money goes."] },
      { h: "The Dubai Land Department transfer fee", p: ["The largest single cost is the DLD transfer fee of 4% of the purchase price. The rules allow it to be shared between buyer and seller, but in practice the buyer usually pays it in full."] },
      { h: "Registration and trustee fees", p: ["Transfers are completed at a registration trustee office. The trustee fee depends on the property value and is subject to 5% VAT. The DLD also charges a title deed issuance fee and small knowledge and innovation fees."] },
      { h: "Agency commission", p: ["Brokerage commission is a commercial agreement rather than a government fee. A common convention is 2% of the price plus VAT, agreed in writing before you make an offer."] },
      { h: "If you use a mortgage", p: ["Mortgaged purchases add a DLD mortgage registration fee of 0.25% of the loan amount plus an administrative fee, and lender charges such as an arrangement fee and a valuation fee. These vary between banks."] },
      { h: "Use the calculator, then ask for a cost sheet", p: ["Our cost calculator itemises these figures for any price. Before transfer day your advisor should give you a written cost sheet for your specific property."] },
    ],
    sources: [
      { label: "Dubai Land Department", url: "https://dubailand.gov.ae/" },
      { label: "Property Finder — DLD fees in Dubai", url: "https://www.propertyfinder.ae/blog/dld-fees-dubai/" },
    ],
    status: "published",
  },
  {
    slug: "off-plan-vs-ready-property",
    title: "Off-plan or ready: how to choose",
    dek: "Two different ways to buy in Dubai, with different cash flows and different risks.",
    category: "Explainer",
    published: "2026-10-20",
    updated: "2026-10-20",
    readingMinutes: 4,
    body: [
      { h: "Ready property", p: ["A ready property can be viewed, rented out or moved into straight away. You pay the full price at transfer, either in cash or with a mortgage, and you know exactly what you're getting."] },
      { h: "Off-plan property", p: ["An off-plan unit is bought from the developer before or during construction. Payment is usually spread across the build under a payment plan, with the balance due at or after handover."] },
      { h: "What to weigh up", p: ["Off-plan can lower the cash you need upfront and give you a new specification, but you take on delivery risk: handover dates can move and the finished market may differ from today's. Ready property costs more upfront but can start earning rent immediately."] },
      { h: "Questions to ask about any off-plan project", p: ["Who is the developer and what have they delivered before? Is the project registered, and are payments going into its escrow account? What happens to your payments if the timeline changes? A good advisor will help you answer each of these before you reserve."] },
    ],
    sources: [{ label: "Dubai Land Department", url: "https://dubailand.gov.ae/" }],
    status: "published",
  },
  {
    slug: "golden-visa-property-overview",
    title: "The UAE Golden Visa and property: an overview",
    dek: "What the AED 2 million figure means, and why it is a starting point rather than a guarantee.",
    category: "Explainer",
    published: "2026-10-20",
    updated: "2026-10-20",
    readingMinutes: 3,
    body: [
      { p: ["The UAE's Golden Visa is a long-term residence visa. One route is for real estate investors, and the UAE government portal lists a minimum investment of AED 2 million."] },
      { h: "Why the property price alone doesn't settle it", p: ["Eligibility also depends on how the property is owned, whether it is financed, whether it is ready or off-plan, and on the rules in force when you apply. Those rules are set by the federal and emirate authorities and can change."] },
      { h: "How we help", p: ["We can tell you whether a property meets the published investment threshold and point you to the official application channels. For a definitive answer on your circumstances, check with the issuing authority or a licensed adviser before you buy."] },
    ],
    sources: [{ label: "UAE Government portal — Golden Visa", url: "https://u.ae/en/information-and-services/visa-and-emirates-id/residence-visas/golden-visa" }],
    status: "published",
  },
];

export const publishedArticles = () => articles.filter((a) => a.status === "published");
export const getArticle = (slug: string) => publishedArticles().find((a) => a.slug === slug);
