// Inline SVG dressing for the Whack-a-Dev board. Purely decorative: every
// piece is aria-hidden and carries no game state.

const HAMMER_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'>
<g transform='rotate(-35 20 20)'>
<rect x='17' y='14' width='6' height='24' rx='2' fill='#b45309' stroke='#4c1d95' stroke-width='1.5'/>
<rect x='6' y='4' width='28' height='13' rx='4' fill='#6d28d9' stroke='#2e1065' stroke-width='1.5'/>
<rect x='9' y='6' width='22' height='4' rx='2' fill='#a78bfa' opacity='.8'/>
</g></svg>`;

// Hotspot sits on the hammer head so the bonk lands where the player aims.
export const HAMMER_CURSOR = `url("data:image/svg+xml,${encodeURIComponent(HAMMER_SVG)}") 8 8, pointer`;

export function Desk({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 100 34" preserveAspectRatio="none" className={className}>
      <defs>
        <linearGradient id="deskTop" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#c4b5fd" />
          <stop offset="1" stopColor="#a78bfa" />
        </linearGradient>
        <linearGradient id="deskFront" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#7e22ce" />
          <stop offset="1" stopColor="#4c1d95" />
        </linearGradient>
      </defs>
      <rect x="0" y="6" width="100" height="28" fill="url(#deskFront)" />
      <rect x="0" y="4" width="100" height="6" rx="1.5" fill="url(#deskTop)" />
      <rect x="0" y="4" width="100" height="1.5" fill="#ede9fe" opacity=".8" />
      <rect x="10" y="14" width="80" height="6" rx="1.5" fill="#3b0764" opacity=".5" />
      <circle cx="14" cy="17" r="1.6" fill="#e9d5ff" />
      <rect x="20" y="15.8" width="14" height="2.4" rx="1.2" fill="#e9d5ff" opacity=".6" />
    </svg>
  );
}

export function Monitor({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 34" className={className}>
      <rect x="16" y="24" width="8" height="6" fill="#312e81" />
      <rect x="10" y="29" width="20" height="3" rx="1.5" fill="#312e81" />
      <rect x="1" y="1" width="38" height="25" rx="3" fill="#1e1b4b" stroke="#a78bfa" strokeWidth="1.5" />
      <rect x="4" y="4" width="32" height="19" rx="1.5" fill="#0f172a" />
      <rect x="7" y="8" width="12" height="2" rx="1" fill="#a78bfa" />
      <rect x="7" y="12" width="20" height="2" rx="1" fill="#f472b6" />
      <rect x="7" y="16" width="8" height="2" rx="1" fill="#34d399" />
    </svg>
  );
}

export function Mug({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
      <path d="M17 9h2a3 3 0 0 1 0 6h-2" fill="none" stroke="#fbbf24" strokeWidth="2.2" />
      <rect x="4" y="7" width="13" height="12" rx="2.5" fill="#fbbf24" />
      <rect x="4" y="7" width="13" height="3" rx="1.5" fill="#fde68a" />
      <path d="M8 5c0-2 2-2 2-4M12 5c0-2 2-2 2-4" fill="none" stroke="#fde68a" strokeWidth="1.4" strokeLinecap="round" opacity=".9" />
    </svg>
  );
}

export function PartyHat({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 28" className={className}>
      <path d="M12 2 L22 26 H2 Z" fill="#ec4899" />
      <path d="M12 2 L22 26 H17 L10 6 Z" fill="#f9a8d4" opacity=".8" />
      <path d="M5.5 18 Q12 14 18.5 18" fill="none" stroke="#fde047" strokeWidth="2.4" />
      <path d="M9 26 Q12 22 15 26" fill="none" stroke="#fde047" strokeWidth="2.4" />
      <circle cx="12" cy="2.5" r="2.5" fill="#fde047" />
    </svg>
  );
}

const BUNT_COLORS = ["#f472b6", "#fbbf24", "#a78bfa", "#34d399", "#fb7185", "#f9a8d4"];

export function Bunting({ className = "" }: { className?: string }) {
  const flags = Array.from({ length: 12 }, (_, i) => i);
  return (
    <svg aria-hidden="true" viewBox="0 0 400 44" preserveAspectRatio="none" className={className}>
      <path d="M0 6 Q200 30 400 6" fill="none" stroke="#fde68a" strokeWidth="2.5" />
      {flags.map((i) => {
        const x = 18 + i * 33;
        const t = x / 400;
        const y = 6 + 24 * 4 * t * (1 - t) * 0.5 + 6 * 4 * t * (1 - t);
        return (
          <path
            key={i}
            d={`M${x - 12} ${y} L${x + 12} ${y} L${x} ${y + 24} Z`}
            fill={BUNT_COLORS[i % BUNT_COLORS.length]}
            stroke="#3b0764"
            strokeWidth="1"
          />
        );
      })}
    </svg>
  );
}

export function Balloon({ color, className = "" }: { color: string; className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 60 120" className={className}>
      <path d="M30 78 q-4 10 4 20 q-8 6 -2 20" fill="none" stroke="#fef3c7" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="30" cy="40" rx="26" ry="34" fill={color} />
      <ellipse cx="20" cy="26" rx="8" ry="12" fill="#fff" opacity=".35" />
      <path d="M26 74 L30 82 L34 74 Z" fill={color} />
    </svg>
  );
}

export function Starburst({ className = "" }: { className?: string }) {
  const pts: string[] = [];
  for (let i = 0; i < 24; i++) {
    const r = i % 2 === 0 ? 50 : 32;
    const a = (Math.PI * 2 * i) / 24;
    pts.push(`${(50 + r * Math.cos(a)).toFixed(1)},${(50 + r * Math.sin(a)).toFixed(1)}`);
  }
  return (
    <svg aria-hidden="true" viewBox="0 0 100 100" className={className}>
      <polygon points={pts.join(" ")} fill="#fde047" stroke="#3b0764" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  );
}

export function StickyNote({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
      <path d="M2 3 h20 v15 l-5 5 H2 Z" fill="#fde047" />
      <path d="M17 23 v-5 h5 Z" fill="#facc15" />
      <rect x="5" y="7" width="12" height="1.6" rx=".8" fill="#a16207" opacity=".7" />
      <rect x="5" y="11" width="9" height="1.6" rx=".8" fill="#a16207" opacity=".7" />
      <rect x="5" y="15" width="6" height="1.6" rx=".8" fill="#a16207" opacity=".7" />
      <circle cx="12" cy="3" r="2" fill="#ec4899" />
    </svg>
  );
}
