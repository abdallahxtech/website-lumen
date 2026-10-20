/**
 * Branded architectural illustrations used wherever licensed photography has
 * not yet been supplied. They are drawn, not photographic, so they never imply
 * a real listing. Swap for <Image> once media is available (see
 * docs/content-inventory.md → Media slots).
 */

function rng(seedStr: string) {
  let s = 0;
  for (const ch of seedStr) s = (s * 31 + ch.charCodeAt(0)) >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}

type Tower = { x: number; w: number; h: number; crown: number };

function skyline(seed: string, count: number, minH: number, maxH: number, width: number, minW = 26, maxW = 84) {
  const r = rng(seed);
  const towers: Tower[] = [];
  let x = -20;
  for (let i = 0; i < count && x < width + 20; i++) {
    const w = minW + r() * (maxW - minW);
    const c = r();
    towers.push({ x, w, h: minH + r() ** 1.6 * (maxH - minH), crown: c < 0.55 ? 0 : c < 0.75 ? 2 : c < 0.92 ? 1 : 3 });
    x += w + r() * 10;
  }
  return towers;
}

function towerPath(t: Tower, base: number) {
  const top = base - t.h;
  const { x, w } = t;
  if (t.crown === 1) return `M${x} ${base}V${top + 18}L${x + w / 2} ${top}L${x + w} ${top + 18}V${base}Z`;
  if (t.crown === 2) return `M${x} ${base}V${top}H${x + w * 0.7}V${top - 14}H${x + w}V${base}Z`;
  if (t.crown === 3) return `M${x} ${base}V${top + 10}Q${x + w / 2} ${top - 12} ${x + w} ${top + 10}V${base}Z`;
  return `M${x} ${base}V${top}H${x + w}V${base}Z`;
}

/** Stepped, tapering spire inspired by Dubai's tallest silhouettes (not a replica). */
function spire(cx: number, base: number, h: number) {
  const steps = [
    [70, 0], [58, 0.22], [46, 0.42], [34, 0.6], [22, 0.75], [12, 0.86], [5, 0.94], [1.4, 1],
  ];
  let d = `M${cx - steps[0][0] / 2} ${base}`;
  steps.forEach(([w, f], i) => {
    const y = base - h * f;
    if (i > 0) d += `H${cx - w / 2}`;
    d += `V${y}`;
  });
  d += `H${cx + 0.7}`;
  [...steps].reverse().forEach(([w, f], i, arr) => {
    const y = base - h * f;
    d += `V${y}H${cx + w / 2}`;
    const next = arr[i + 1];
    if (next) d += `V${base - h * next[1]}`;
  });
  d += `V${base}Z`;
  return d;
}

export function HeroArt({ className }: { className?: string }) {
  const W = 1600, H = 900, horizon = 712;
  const far = skyline("far-lumen", 80, 30, 120, W, 14, 34);
  const mid = skyline("mid-lumen-dubai", 70, 40, 250, W, 12, 34).filter((t) => t.x > 560);
  const near: Tower[] = [];
  const r = rng("windows");
  const windows: { x: number; y: number }[] = [];
  mid.forEach((t) => {
    for (let k = 0; k < 4; k++) if (r() > 0.55) windows.push({ x: t.x + 6 + r() * (t.w - 12), y: horizon - 10 - r() * (t.h - 24) });
  });
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0b1526" />
          <stop offset="0.42" stopColor="#1D2F49" />
          <stop offset="0.7" stopColor="#1f4a57" />
          <stop offset="0.86" stopColor="#6c7266" />
          <stop offset="1" stopColor="#d4bd90" />
        </linearGradient>
        <radialGradient id="sun" cx="0.7" cy="0.79" r="0.46">
          <stop offset="0" stopColor="#f3e3bd" stopOpacity="0.9" />
          <stop offset="0.12" stopColor="#d8bf8e" stopOpacity="0.55" />
          <stop offset="0.45" stopColor="#BBA682" stopOpacity="0.12" />
          <stop offset="1" stopColor="#BBA682" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3d4f55" />
          <stop offset="0.25" stopColor="#1A4753" />
          <stop offset="1" stopColor="#0d182a" />
        </linearGradient>
        <linearGradient id="reflect" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0f1d30" stopOpacity="0.85" />
          <stop offset="1" stopColor="#0f1d30" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="shade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0b1526" stopOpacity="0.92" />
          <stop offset="0.5" stopColor="#0b1526" stopOpacity="0.45" />
          <stop offset="1" stopColor="#0d182a" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0d182a" stopOpacity="0" />
          <stop offset="1" stopColor="#0d182a" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="tower" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1b3247" />
          <stop offset="1" stopColor="#0f1d31" />
        </linearGradient>
        <filter id="soft"><feGaussianBlur stdDeviation="2.2" /></filter>
      </defs>
      <rect width={W} height={horizon} fill="url(#sky)" />
      <rect width={W} height={H} fill="url(#sun)" />
      <g fill="#2b4b58" opacity="0.5">{far.map((t, i) => <path key={i} d={towerPath(t, horizon)} />)}</g>
      <g fill="url(#tower)">
        {mid.map((t, i) => <path key={i} d={towerPath(t, horizon)} />)}
        <path d={spire(1120, horizon, 430)} />
      </g>
      <g fill="#f4e6c4">{windows.map((w, i) => <rect key={i} x={w.x} y={w.y} width="1.6" height="2.4" opacity={0.35 + (i % 5) * 0.1} />)}</g>
      <rect y={horizon} width={W} height={H - horizon} fill="url(#water)" />
      <g transform={`translate(0 ${horizon * 2}) scale(1 -1)`} opacity="0.38" filter="url(#soft)">
        <g fill="#14273b">{mid.map((t, i) => <path key={i} d={towerPath(t, horizon)} />)}<path d={spire(1120, horizon, 430)} /></g>
      </g>
      <rect y={horizon} width={W} height="200" fill="url(#reflect)" opacity="0.5" />
      <g stroke="#e9d6ab" strokeLinecap="round">
        {Array.from({ length: 20 }).map((_, i) => {
          const y = horizon + 8 + i * 8;
          const w = 150 - i * 6;
          return <line key={i} x1={1116 - w / 2 + ((i * 37) % 23)} x2={1116 + w / 2 - ((i * 19) % 17)} y1={y} y2={y} strokeWidth={1.1} opacity={0.5 - i * 0.02} />;
        })}
      </g>
      <g fill="#0b1626">{near.map((t, i) => <path key={i} d={towerPath({ ...t, h: t.h * 0.7 }, H)} opacity="0.9" />)}</g>
      <rect width={W} height={H} fill="url(#shade)" />
      <rect y={H - 260} width={W} height="260" fill="url(#floor)" />
    </svg>
  );
}

const tones = {
  teal: { bg: "#1A4753", bg2: "#1C6767", line: "#D1C9B9" },
  navy: { bg: "#142238", bg2: "#1D2F49", line: "#BBA682" },
  gold: { bg: "#8a7a5e", bg2: "#BBA682", line: "#F7F4EE" },
  sand: { bg: "#c4bba9", bg2: "#D1C9B9", line: "#1D2F49" },
} as const;

/** Line-drawn architectural plate: towers, a villa or an arcade, by `kind`. */
export function Plate({
  seed,
  tone = "teal",
  kind = "towers",
  className,
}: {
  seed: string;
  tone?: keyof typeof tones;
  kind?: "towers" | "villa" | "arcade";
  className?: string;
}) {
  const c = tones[tone];
  const W = 800, H = 1000, base = 860;
  const r = rng(seed);
  const id = `pl-${seed.replace(/[^a-z0-9]/gi, "")}`;
  let drawing: React.ReactNode;
  if (kind === "villa") {
    const x = 120, w = 560;
    drawing = (
      <g>
        <path d={`M${x} ${base}V${base - 180}H${x + w * 0.62}V${base}`} />
        <path d={`M${x + w * 0.38} ${base - 180}V${base - 330}H${x + w}V${base}`} />
        <path d={`M${x - 40} ${base - 180}H${x + w * 0.66}M${x + w * 0.34} ${base - 330}H${x + w + 40}`} strokeWidth="3" />
        {Array.from({ length: 5 }).map((_, i) => <path key={i} d={`M${x + 30 + i * 62} ${base}V${base - 140}`} opacity="0.6" />)}
        <path d={`M${x + w * 0.45} ${base - 300}H${x + w * 0.92}V${base - 210}H${x + w * 0.45}Z`} opacity="0.7" />
        <path d={`M40 ${base}H${W - 40}`} strokeWidth="2" />
        <path d={`M60 ${base + 30}H${W - 60}M120 ${base + 54}H${W - 120}`} opacity="0.35" />
        <path d={`M${x + w + 10} ${base}c0-80 30-140 70-200M${x + w + 30} ${base}c10-60 40-100 80-130`} opacity="0.6" />
      </g>
    );
  } else if (kind === "arcade") {
    drawing = (
      <g>
        {Array.from({ length: 4 }).map((_, i) => {
          const x = 110 + i * 150;
          return <path key={i} d={`M${x} ${base}V${base - 360}a65 65 0 0 1 130 0V${base}`} />;
        })}
        <path d={`M80 ${base - 470}H720M80 ${base}H720`} strokeWidth="2" />
        <path d={`M80 ${base - 500}H720`} opacity="0.5" />
        {Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M${110 + i * 75} ${base + 20}l-40 120`} opacity="0.25" />)}
      </g>
    );
  } else {
    const ts = skyline(seed, 9, 260, 640, W).map((t) => ({ ...t, w: t.w * 1.6 }));
    const placed: Tower[] = [];
    let cursor = 40;
    for (const t of ts) {
      placed.push({ ...t, x: cursor });
      cursor += t.w + 10 + r() * 10;
    }
    const fitted = placed.filter((t) => t.x + t.w < W - 30);
    drawing = (
      <g>
        {fitted.map((t, i) => (
          <g key={i}>
            <path d={towerPath(t, base)} />
            {Array.from({ length: Math.floor(t.h / 34) }).map((_, k) => (
              <path key={k} d={`M${t.x + 6} ${base - 26 - k * 34}H${t.x + t.w - 6}`} opacity="0.32" />
            ))}
          </g>
        ))}
        <path d={`M20 ${base}H${W - 20}`} strokeWidth="2" />
      </g>
    );
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c.bg2} />
          <stop offset="1" stopColor={c.bg} />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id})`} />
      <circle cx={W * (0.2 + r() * 0.6)} cy={H * 0.26} r="120" fill={c.line} opacity="0.07" />
      <g fill="none" stroke={c.line} strokeWidth="1.4" opacity="0.75">{drawing}</g>
    </svg>
  );
}
