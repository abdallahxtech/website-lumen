/**
 * Community guide content. Descriptions use long-standing, publicly known facts
 * only (landmarks, master developer, housing stock). No prices, yields,
 * inventory counts or travel times are published until a dated source exists.
 * `editorialReview` must be set to a reviewer + date before launch.
 */
export interface Community {
  slug: string;
  name: string;
  tagline: string;
  overview: string[];
  masterDeveloper: string;
  propertyTypes: string[];
  highlights: string[];
  /** Approximate centre point, for the map link only. */
  coords: { lat: number; lng: number };
  tone: "teal" | "gold" | "navy";
  editorialReview: null | { by: string; date: string };
}

export const communities: Community[] = [
  {
    slug: "downtown-dubai",
    name: "Downtown Dubai",
    tagline: "The city's centre of gravity, around Burj Khalifa.",
    overview: [
      "Downtown Dubai is built around Burj Khalifa, The Dubai Mall and the Dubai Fountain, with Dubai Opera anchoring its Opera District.",
      "Homes are mostly high-rise apartments and penthouses, many with direct views of the tower or the fountain lake. It suits buyers who want an urban, walkable address in the middle of the city.",
    ],
    masterDeveloper: "Emaar Properties",
    propertyTypes: ["Apartments", "Penthouses", "Serviced residences"],
    highlights: ["Burj Khalifa", "The Dubai Mall", "Dubai Opera", "Burj Park"],
    coords: { lat: 25.1972, lng: 55.2744 },
    tone: "teal",
    editorialReview: null,
  },
  {
    slug: "palm-jumeirah",
    name: "Palm Jumeirah",
    tagline: "Island living on the city's best-known coastline.",
    overview: [
      "Palm Jumeirah is the palm-shaped island off Jumeirah's coast, with villas on the fronds, apartments along the trunk and resort hotels on the crescent.",
      "Many homes have private beach access. The island attracts buyers looking for waterfront villas, branded residences and holiday homes.",
    ],
    masterDeveloper: "Nakheel",
    propertyTypes: ["Villas", "Apartments", "Penthouses", "Branded residences"],
    highlights: ["Private beaches", "The Pointe", "Nakheel Mall", "Palm Monorail"],
    coords: { lat: 25.1124, lng: 55.139 },
    tone: "gold",
    editorialReview: null,
  },
  {
    slug: "dubai-marina",
    name: "Dubai Marina",
    tagline: "Towers, yachts and the promenade, beside JBR beach.",
    overview: [
      "Dubai Marina is a waterfront district built around a man-made canal, lined by residential towers and the Marina Walk promenade.",
      "It sits next to Jumeirah Beach Residence and The Walk, and is served by the Dubai Metro and Dubai Tram. Apartments here are popular with both residents and landlords.",
    ],
    masterDeveloper: "Emaar Properties (master plan)",
    propertyTypes: ["Apartments", "Penthouses"],
    highlights: ["Marina Walk", "JBR beach", "Dubai Marina Mall", "Dubai Tram"],
    coords: { lat: 25.0805, lng: 55.1403 },
    tone: "navy",
    editorialReview: null,
  },
  {
    slug: "dubai-hills-estate",
    name: "Dubai Hills Estate",
    tagline: "Green, family-oriented living around a championship golf course.",
    overview: [
      "Dubai Hills Estate is a master-planned community centred on an 18-hole golf course and a large central park.",
      "It combines villa and townhouse neighbourhoods with apartment buildings, schools, a hospital and Dubai Hills Mall, which makes it a frequent choice for families.",
    ],
    masterDeveloper: "Emaar Properties and Meraas",
    propertyTypes: ["Villas", "Townhouses", "Apartments"],
    highlights: ["Dubai Hills Golf Club", "Dubai Hills Park", "Dubai Hills Mall"],
    coords: { lat: 25.1095, lng: 55.2452 },
    tone: "teal",
    editorialReview: null,
  },
  {
    slug: "business-bay",
    name: "Business Bay",
    tagline: "Canal-side towers next to Downtown.",
    overview: [
      "Business Bay runs along the Dubai Water Canal, directly beside Downtown Dubai, with a mix of office and residential towers.",
      "Its apartments appeal to professionals who want to live near the centre, and to investors looking for city-centre rental stock.",
    ],
    masterDeveloper: "Dubai Properties",
    propertyTypes: ["Apartments", "Offices", "Hotel apartments"],
    highlights: ["Dubai Water Canal", "Bay Avenue", "Marasi Drive waterfront"],
    coords: { lat: 25.1865, lng: 55.2633 },
    tone: "navy",
    editorialReview: null,
  },
  {
    slug: "dubai-creek-harbour",
    name: "Dubai Creek Harbour",
    tagline: "A waterfront district on the historic Creek.",
    overview: [
      "Dubai Creek Harbour is a large waterfront development on Dubai Creek, next to the Ras Al Khor Wildlife Sanctuary.",
      "Much of its housing is apartment towers, several still under construction, which makes it a regular feature of off-plan conversations.",
    ],
    masterDeveloper: "Emaar Properties",
    propertyTypes: ["Apartments", "Off-plan residences"],
    highlights: ["Creek Marina", "Ras Al Khor Wildlife Sanctuary", "Creek Beach"],
    coords: { lat: 25.205, lng: 55.346 },
    tone: "gold",
    editorialReview: null,
  },
  {
    slug: "emaar-beachfront",
    name: "Emaar Beachfront",
    tagline: "Private-beach towers between the Marina and the Palm.",
    overview: [
      "Emaar Beachfront is a gated community of residential towers on its own stretch of beach, between Dubai Marina and Palm Jumeirah.",
      "Residents have direct beach access and views towards the Palm and the Marina skyline.",
    ],
    masterDeveloper: "Emaar Properties",
    propertyTypes: ["Apartments", "Penthouses"],
    highlights: ["Private beach", "Marina and Palm views", "Gated access"],
    coords: { lat: 25.0965, lng: 55.141 },
    tone: "teal",
    editorialReview: null,
  },
  {
    slug: "jumeirah-village-circle",
    name: "Jumeirah Village Circle",
    tagline: "A residential neighbourhood with broad choice and accessible entry prices.",
    overview: [
      "Jumeirah Village Circle (JVC) is a residential community laid out in a circular plan, with low- and mid-rise apartment buildings, townhouses and villas.",
      "Its range of property sizes makes it popular with first-time buyers, young families and investors.",
    ],
    masterDeveloper: "Nakheel",
    propertyTypes: ["Apartments", "Townhouses", "Villas"],
    highlights: ["Community parks", "Circle Mall", "Schools nearby"],
    coords: { lat: 25.0585, lng: 55.2091 },
    tone: "navy",
    editorialReview: null,
  },
];

export const getCommunity = (slug: string) => communities.find((c) => c.slug === slug);
