export type TeamGroup = "leadership" | "sales";

export interface TeamMember {
  slug: string;
  name: string;
  title: string;
  group: TeamGroup;
  /** Public portrait in /public/team. Assign only when the person is confirmed. */
  photo: string | null;
  /** Verified biography. null until supplied by the company. */
  bio: string | null;
  languages: string[] | null;
  specialisms: string[] | null;
  /** Whether visitors may contact this person directly from the site. */
  contactable: boolean;
}

/** Names and titles exactly as supplied by Lumen Realty (Oct 2026). */
export const team: TeamMember[] = [
  { slug: "wael-naeem", name: "Wael Naeem", title: "CEO & Managing Director", group: "leadership", photo: "/team/wael-naeem-2026-10.jpg", bio: null, languages: null, specialisms: null, contactable: false },
  { slug: "bassel-elhewety", name: "Bassel Elhewety", title: "Chief Operating Officer", group: "leadership", photo: "/team/bassel-elhewety-2026-10.jpg", bio: null, languages: null, specialisms: null, contactable: false },
  { slug: "angelica-troya", name: "Angélica Troya", title: "Chief People Officer", group: "leadership", photo: "/team/angelica-troya.jpg", bio: null, languages: null, specialisms: null, contactable: false },
  { slug: "abdallah-emam", name: "Abdallah Emam", title: "Chief Technology Officer", group: "leadership", photo: "/team/abdallah-emam.jpg", bio: null, languages: null, specialisms: null, contactable: false },
  { slug: "mostafa-zanaty", name: "Mostafa Zanaty", title: "Senior Sales Consultant", group: "sales", photo: "/team/mostafa-zanaty.jpg", bio: null, languages: null, specialisms: null, contactable: true },
  { slug: "mohamad-sabiq", name: "Mohamad Sabiq", title: "Property Advisor", group: "sales", photo: null, bio: null, languages: null, specialisms: null, contactable: true },
  { slug: "sharon-paulson", name: "Sharon Paulson", title: "Office Administrator", group: "sales", photo: "/team/sharon-paulson-2026-10.jpg", bio: null, languages: null, specialisms: null, contactable: true },
];

export const getMember = (slug: string) => team.find((m) => m.slug === slug);
export const initials = (name: string) =>
  name.split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
