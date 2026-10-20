type P = { className?: string };
const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export const ArrowRight = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden {...base}><path d="M4 12h15M13 6l6 6-6 6" /></svg>
);
export const ArrowUpRight = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden {...base}><path d="M7 17 17 7M9 7h8v8" /></svg>
);
export const Close = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden {...base}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
export const Menu = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden {...base}><path d="M4 8h16M4 16h11" /></svg>
);
export const Check = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden {...base}><path d="M5 12.5 10 17l9-10" /></svg>
);
export const WhatsApp = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <path fill="currentColor" d="M12.04 2a9.9 9.9 0 0 0-8.5 15l-1.4 5 5.15-1.35A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.06.8.82-2.98-.2-.31a8.2 8.2 0 1 1 6.92 3.82Zm4.5-6.14c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.55.12-.17.25-.64.8-.78.97-.14.16-.29.18-.54.06a6.7 6.7 0 0 1-3.32-2.9c-.25-.43.25-.4.72-1.33.08-.16.04-.3-.02-.43-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47a.9.9 0 0 0-.66.31 2.77 2.77 0 0 0-.86 2.06c0 1.21.88 2.39 1 2.55.13.17 1.74 2.65 4.2 3.72 1.56.67 2.17.73 2.95.61.47-.07 1.46-.6 1.66-1.17.2-.58.2-1.07.15-1.17-.06-.11-.22-.17-.47-.29Z" />
  </svg>
);
export const Phone = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden {...base}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg>
);
export const Pin = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden {...base}><path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12Z" /><circle cx="12" cy="9" r="2.5" /></svg>
);
