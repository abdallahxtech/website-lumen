import { z } from "zod";
import { ENQUIRY_TYPES } from "./enquiry";
export { ENQUIRY_TYPES, enquiryLabels } from "./enquiry";

const phone = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s()-]/g, ""))
  .refine((v) => /^\+?\d{8,15}$/.test(v), "Enter a mobile number with country code, for example +971 50 123 4567.");

const optionalText = (max: number) => z.string().trim().max(max).optional().or(z.literal("").transform(() => undefined));

export const leadSchema = z.object({
  idempotencyKey: z.string().uuid(),
  name: z.string().trim().min(2, "Enter your full name.").max(120),
  phone,
  email: z.string().trim().email("Enter a valid email address.").max(200).optional().or(z.literal("").transform(() => undefined)),
  enquiryType: z.enum(ENQUIRY_TYPES),
  message: optionalText(2000),
  consent: z.literal(true, { message: "Please agree so we can contact you about this enquiry." }),
  marketingConsent: z.boolean().optional().default(false),
  context: z
    .object({
      project: optionalText(160),
      property: optionalText(160),
      community: optionalText(120),
      budget: optionalText(80),
      bedrooms: optionalText(20),
      timeframe: optionalText(60),
      language: optionalText(40),
      contactPreference: z.enum(["whatsapp", "phone", "email"]).optional(),
      preferredDate: optionalText(20),
      preferredTime: optionalText(20),
      details: z.record(z.string(), z.string().max(200)).optional(),
    })
    .optional()
    .default({}),
  sourcePage: z.string().max(300).optional(),
  utm: z.record(z.string(), z.string().max(200)).optional(),
  /** Honeypot: must stay empty. */
  website: z.string().max(500).optional(),
  /** Milliseconds the form was open before submit (bot signal). */
  elapsedMs: z.number().int().nonnegative().optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
