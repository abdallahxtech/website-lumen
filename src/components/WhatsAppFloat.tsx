import { WhatsApp } from "./Icons";
import { waLink, waMessages } from "@/lib/whatsapp";

export function WhatsAppFloat() {
  return (
    <a
      href={waLink(waMessages.general)}
      target="_blank"
      rel="noopener"
      aria-label="Chat with Lumen Realty on WhatsApp (opens in a new tab)"
      data-event="click_whatsapp"
      className="fixed z-40 grid h-14 w-14 place-items-center rounded-full bg-[var(--lumen-teal)] text-white shadow-[0_14px_34px_-12px_rgba(13,24,42,.7)] transition-transform duration-300 hover:scale-105 hover:bg-[var(--deep-teal)]"
      style={{ right: "calc(20px + env(safe-area-inset-right, 0px))", bottom: "calc(20px + env(safe-area-inset-bottom, 0px))" }}
    >
      <WhatsApp className="h-7 w-7" />
    </a>
  );
}
