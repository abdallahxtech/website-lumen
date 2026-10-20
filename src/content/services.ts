export interface Service {
  slug: "buy" | "sell" | "rent" | "off-plan";
  name: string;
  short: string;
  headline: string;
  intro: string;
  enquiryType: string;
  cta: string;
  includes: string[];
  process: { title: string; body: string; document?: string }[];
  faqs: { q: string; a: string }[];
  plate: "teal" | "gold" | "navy";
}

export const services: Service[] = [
  {
    slug: "buy",
    name: "Buy a Property",
    short: "Buy",
    headline: "Buy with the full picture in front of you.",
    intro:
      "We start with how you want to live or invest, then build a short, considered shortlist. Every option comes with its price history, its fees and an honest view of what it's worth.",
    enquiryType: "buy",
    cta: "Start your search",
    includes: [
      "A shortlist matched to your brief, not to whatever is listed this week",
      "Pricing checked against recent registered transactions",
      "Private, accompanied viewings",
      "Negotiation, Form F and transfer coordination",
      "Mortgage introductions where useful",
    ],
    process: [
      { title: "Brief and budget", body: "We agree your requirements, budget and whether you'll finance the purchase.", document: "Mortgage pre-approval" },
      { title: "Shortlist and viewings", body: "A focused shortlist, priced against recent sales, then viewings on your schedule.", document: "Market comparison" },
      { title: "Offer and agreement", body: "We negotiate on your behalf. Buyer and seller sign the RERA sales agreement, usually with a 10% security deposit.", document: "Form F (MOU)" },
      { title: "Developer clearance", body: "The seller requests a no-objection certificate confirming no service charges are outstanding.", document: "Developer NOC" },
      { title: "Transfer", body: "Ownership transfers at a Dubai Land Department trustee office, and you receive the title deed.", document: "Title deed" },
    ],
    faqs: [
      { q: "Can foreign nationals buy property in Dubai?", a: "Yes. Non-UAE nationals can buy freehold property in designated freehold areas, which include most of the communities we cover." },
      { q: "What does buying cost on top of the price?", a: "The largest item is the Dubai Land Department transfer fee of 4% of the price. There are also registration and trustee fees, agency commission and, with a mortgage, lender fees. Our cost calculator itemises them." },
      { q: "How long does a ready purchase take?", a: "It depends mainly on financing and on the developer issuing the NOC. A cash purchase is usually quicker than a mortgaged one; your advisor will give you a timeline for your specific property." },
    ],
    plate: "teal",
  },
  {
    slug: "sell",
    name: "Sell a Property",
    short: "Sell",
    headline: "A realistic price, presented properly, to serious buyers.",
    intro:
      "Selling well starts with an accurate valuation. We price from comparable registered sales, present your home with care and qualify buyers before they walk through the door.",
    enquiryType: "sell",
    cta: "Request a valuation",
    includes: [
      "A valuation based on comparable registered sales",
      "Professional photography and listing copy",
      "Advertising under a valid DLD permit",
      "Buyer qualification before viewings",
      "Coordination through NOC and transfer",
    ],
    process: [
      { title: "Valuation", body: "We review comparable sales and your property's condition, then agree a pricing strategy with you." },
      { title: "Listing agreement", body: "We sign the RERA listing agreement and obtain the advertising permit.", document: "Form A" },
      { title: "Marketing and viewings", body: "Your property is presented to qualified buyers, with feedback after every viewing." },
      { title: "Offer and agreement", body: "We negotiate the offer and prepare the sales agreement.", document: "Form F (MOU)" },
      { title: "Transfer", body: "We coordinate the NOC, any mortgage settlement and the transfer appointment." },
    ],
    faqs: [
      { q: "How do you value my property?", a: "We compare recent registered sales of similar units in your building or community, then adjust for floor, view, layout and condition." },
      { q: "Can I sell a mortgaged property?", a: "Yes. The outstanding mortgage is settled as part of the transfer, and we coordinate the release with your bank." },
    ],
    plate: "navy",
  },
  {
    slug: "rent",
    name: "Rent & Lease",
    short: "Rent",
    headline: "Leasing done properly the first time.",
    intro:
      "For tenants, we find homes that fit and check the paperwork before you pay. For landlords, we find reliable tenants and manage the contract and its registration.",
    enquiryType: "rent",
    cta: "Find a rental",
    includes: [
      "Tenant and landlord representation",
      "Tenancy contract preparation",
      "Ejari registration",
      "Renewal guidance with reference to the RERA rental index",
    ],
    process: [
      { title: "Requirements", body: "We agree location, size, budget and move-in date." },
      { title: "Viewings", body: "We arrange viewings and check ownership and permits before you commit." },
      { title: "Contract", body: "The tenancy contract is agreed and signed, with cheques or payments as agreed." },
      { title: "Ejari", body: "The contract is registered with Ejari, which you need for utilities and many government services.", document: "Ejari certificate" },
    ],
    faqs: [
      { q: "What is Ejari?", a: "Ejari is Dubai's official system for registering tenancy contracts. A registered contract is needed to connect utilities and for many residency services." },
      { q: "How are rent increases regulated?", a: "Rent increases at renewal are governed by Dubai's rental rules and the RERA rental index. We'll show you how they apply to your contract." },
    ],
    plate: "gold",
  },
  {
    slug: "off-plan",
    name: "Off-Plan Investment",
    short: "Off-plan",
    headline: "New developments, with the commitments laid out clearly.",
    intro:
      "Off-plan purchases can offer staged payments and new specifications, but they carry delivery and market risk. We set out the developer's track record, the payment plan and the escrow arrangements before you decide.",
    enquiryType: "off_plan",
    cta: "Discuss new launches",
    includes: [
      "Developer and project due diligence",
      "Side-by-side payment plan comparison",
      "Escrow and project registration checks",
      "Oqood registration and handover support",
    ],
    process: [
      { title: "Shortlist projects", body: "We compare projects by developer record, location, specification and payment plan." },
      { title: "Reserve", body: "You reserve a unit with the developer's booking payment and sign the reservation form." },
      { title: "Sale and purchase agreement", body: "You sign the developer's SPA and the purchase is registered with DLD.", document: "Oqood registration" },
      { title: "Construction payments", body: "Instalments follow the payment plan, paid into the project's escrow account." },
      { title: "Handover", body: "We help with the snagging inspection and handover, and the title deed is issued on completion." },
    ],
    faqs: [
      { q: "Is my off-plan payment protected?", a: "Dubai requires off-plan payments to go into a project escrow account regulated by the authorities. We check the project's registration before you pay." },
      { q: "Are returns guaranteed?", a: "No. Capital growth and rental income are never guaranteed, and handover dates can move. We'll walk you through the risks as well as the opportunity." },
    ],
    plate: "teal",
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
