import { site } from "@/content/site";

export const waLink = (message?: string) =>
  `https://wa.me/${site.whatsapp.waNumber}${message ? `?text=${encodeURIComponent(message)}` : ""}`;

export const waMessages = {
  general: "Hello Lumen Realty, I'd like to speak with an advisor.",
  development: (name: string) =>
    `Hello Lumen Realty, I am interested in ${name}. Could you please share current availability, prices and payment plan details?`,
  property: (title: string, ref: string) =>
    `Hello Lumen Realty, I'm interested in ${title} (ref ${ref}). Is it still available, and could we arrange a viewing?`,
  community: (name: string) =>
    `Hello Lumen Realty, I'm looking for property in ${name}. Could you share what's currently available?`,
  advisor: (name: string) => `Hello Lumen Realty, I'd like to speak with ${name}.`,
};
