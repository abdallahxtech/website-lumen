import { MARK_PATHS, WORD_PATHS } from "./logo-paths";

type Variant = "color" | "reverse" | "mono-dark";
const palette: Record<Variant, { main: string; gold: string }> = {
  color: { main: "#1C6767", gold: "#BBA682" },
  reverse: { main: "#F4F1EA", gold: "#BBA682" },
  "mono-dark": { main: "#1D2F49", gold: "#1D2F49" },
};

/** The approved Lumen Realty horizontal lock-up, drawn from the original artwork. */
export function Logo({ variant = "color", className, title = "Lumen Realty" }: { variant?: Variant; className?: string; title?: string }) {
  const c = palette[variant];
  return (
    <svg viewBox="16 58 1980 600" className={className} role="img" aria-label={title}>
      {[...MARK_PATHS, ...WORD_PATHS].map(([k, d], i) => (
        <path key={i} d={d} fill={c[k]} />
      ))}
    </svg>
  );
}

/** The standalone sunburst mark. */
export function Mark({ variant = "color", className, decorative = true }: { variant?: Variant; className?: string; decorative?: boolean }) {
  const c = palette[variant];
  return (
    <svg viewBox="16 58 504 504" className={className} aria-hidden={decorative} role={decorative ? undefined : "img"} aria-label={decorative ? undefined : "Lumen Realty"}>
      {MARK_PATHS.map(([k, d], i) => (
        <path key={i} d={d} fill={c[k]} />
      ))}
    </svg>
  );
}
