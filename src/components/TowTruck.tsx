// Decorative illustration: tow truck carrying a car.
export function TowTruck({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 520 220" className={className} aria-hidden>
      <ellipse cx="260" cy="206" rx="240" ry="8" fill="#000" opacity=".25" />
      {/* flatbed */}
      <path d="M40 150h300l14-10h8v22H40z" fill="#dfe6f3" />
      <rect x="40" y="160" width="330" height="14" rx="3" fill="#9fb0cc" />
      {/* cab */}
      <path d="M370 174V96a10 10 0 0 1 10-10h58a12 12 0 0 1 10 5l34 46a16 16 0 0 1 3 9v28a8 8 0 0 1-8 8H370z" fill="#ffd21f" />
      <path d="M392 100h44l28 38h-72z" fill="#0a1f44" opacity=".85" />
      <rect x="470" y="160" width="20" height="8" rx="2" fill="#ff8a3d" />
      <rect x="380" y="146" width="24" height="5" rx="2.5" fill="#c79b00" />
      {/* beacon */}
      <rect x="400" y="78" width="26" height="9" rx="3" fill="#ff8a3d" />
      {/* car on bed */}
      <path d="M72 148v-22c0-6 4-10 10-11l40-6 28-26c5-4 10-6 16-6h78c7 0 13 3 17 8l24 28 36 5c8 1 13 7 13 14v16z" fill="#1d6fe0" />
      <path d="M160 86h40v28h-66zM212 86h24c4 0 7 2 9 4l19 24h-52z" fill="#bfe0ff" />
      <rect x="298" y="124" width="12" height="7" rx="2" fill="#ffe066" />
      <rect x="74" y="126" width="9" height="7" rx="2" fill="#ff5a5a" />
      <circle cx="120" cy="150" r="20" fill="#0b1324" /><circle cx="120" cy="150" r="8" fill="#9fb0cc" />
      <circle cx="262" cy="150" r="20" fill="#0b1324" /><circle cx="262" cy="150" r="8" fill="#9fb0cc" />
      {/* truck wheels */}
      <circle cx="96" cy="182" r="22" fill="#0b1324" /><circle cx="96" cy="182" r="9" fill="#dfe6f3" />
      <circle cx="150" cy="182" r="22" fill="#0b1324" /><circle cx="150" cy="182" r="9" fill="#dfe6f3" />
      <circle cx="430" cy="182" r="22" fill="#0b1324" /><circle cx="430" cy="182" r="9" fill="#dfe6f3" />
      {/* cash tag */}
      <g transform="rotate(-8 190 40)">
        <rect x="150" y="18" width="92" height="40" rx="8" fill="#16a34a" />
        <text x="196" y="45" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="22" fill="#fff">$$$</text>
      </g>
    </svg>
  );
}
