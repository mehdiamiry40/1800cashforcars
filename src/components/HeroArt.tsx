// Decorative hero illustration: a sedan in front of a fan of banknotes.
const notes = [
  { color: "#d9689b", label: "5" },
  { color: "#3f8fd0", label: "10" },
  { color: "#e0533e", label: "20" },
  { color: "#e8b830", label: "50" },
  { color: "#3fa35a", label: "100" },
  { color: "#e0533e", label: "20" },
  { color: "#e8b830", label: "50" },
  { color: "#3fa35a", label: "100" },
  { color: "#3f8fd0", label: "10" },
];

export function HeroArt({ car = "#26282b", className = "", cashOnly = false }: { car?: string; className?: string; cashOnly?: boolean }) {
  const light = car === "#e9ecef";
  return (
    <svg viewBox="0 0 520 300" className={className} aria-hidden>
      <g transform="translate(300 215)">
        {notes.map((n, i) => {
          const angle = -64 + i * 16;
          return (
            <g key={i} transform={`rotate(${angle})`}>
              <rect x="-26" y="-200" width="52" height="200" rx="3" fill={n.color} stroke="#fff" strokeWidth="1.5" />
              <rect x="-18" y="-190" width="36" height="70" rx="2" fill="#fff" opacity=".35" />
              <circle cx="0" cy="-95" r="12" fill="#fff" opacity=".3" />
              <text x="0" y="-160" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="15" fill="#fff" transform="rotate(90 0 -160)">
                {n.label}
              </text>
            </g>
          );
        })}
      </g>
      {!cashOnly && (
      <>
      <ellipse cx="265" cy="286" rx="230" ry="10" fill="#000" opacity=".2" />
      {/* car body */}
      <path
        d="M40 240Q38 208 72 201L148 192 196 152Q207 142 228 142H336Q356 142 369 154L414 192 462 200Q492 206 492 234V254Q492 264 482 264H50Q40 264 40 254Z"
        fill={car}
      />
      <path d="M44 226H488" stroke={light ? "#c5cad0" : "#ffffff"} strokeOpacity=".18" strokeWidth="3" />
      <path d="M204 154Q199 154 194 161L172 191H272V154Z" fill="#9fb4c8" />
      <path d="M282 154V191H392L357 159Q352 154 343 154Z" fill="#9fb4c8" />
      <path d="M277 150V262" stroke="#000" strokeOpacity=".25" strokeWidth="2" />
      <rect x="466" y="210" width="22" height="10" rx="3" fill="#f5f1d7" />
      <rect x="42" y="212" width="12" height="12" rx="2" fill="#d33" />
      <rect x="300" y="200" width="18" height="4" rx="2" fill="#bbb" />
      <rect x="200" y="200" width="18" height="4" rx="2" fill="#bbb" />
      {[125, 405].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="262" r="32" fill="#111" />
          <circle cx={cx} cy="262" r="19" fill="#c9cdd2" />
          <circle cx={cx} cy="262" r="6" fill="#8a9098" />
        </g>
      ))}
      </>
      )}
    </svg>
  );
}
