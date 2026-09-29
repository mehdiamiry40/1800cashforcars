// Flat vehicle illustrations for the "what we buy" row, drawn to match Roo.
const BODY = "#2F5DA8";
const GLASS = "#CFE3F7";
const TYRE = "#1D2433";
const HUB = "#D9DEE8";

function Wheels({ xs, y = 50 }: { xs: number[]; y?: number }) {
  return (
    <>
      {xs.map((x) => (
        <g key={x}>
          <circle cx={x} cy={y} r="9" fill={TYRE} />
          <circle cx={x} cy={y} r="3.5" fill={HUB} />
        </g>
      ))}
    </>
  );
}

const shapes: Record<string, React.ReactNode> = {
  car: (
    <>
      <path fill={BODY} d="M8 48 C 8 38, 14 33, 24 31 L 34 18 C 37 14, 41 12, 47 12 H 62 C 68 12, 72 15, 75 19 L 84 31 C 94 32, 100 38, 100 48 Z" />
      <path fill={GLASS} d="M37 30 L 44 20 C 45 18, 47 17, 49 17 H 54 V 30 Z M59 30 V 17 H 62 C 65 17, 67 18, 68 20 L 75 30 Z" />
      <Wheels xs={[28, 80]} />
    </>
  ),
  ute: (
    <>
      <path fill="#C8743A" d="M6 48 V 32 H 52 V 48 Z" />
      <path fill="#A55A27" d="M6 32 H 52 V 36 H 6 Z" />
      <path fill={BODY} d="M50 48 V 22 C 50 17, 54 14, 59 14 H 76 C 80 14, 83 16, 85 19 L 94 31 C 99 33, 102 38, 102 48 Z" />
      <path fill={GLASS} d="M62 30 V 19 H 75 C 77 19, 79 20, 80 22 L 86 30 Z" />
      <Wheels xs={[24, 82]} />
    </>
  ),
  van: (
    <>
      <path fill="#F5F7FA" d="M6 48 V 16 C 6 12, 9 9, 13 9 H 72 C 78 9, 82 12, 85 17 L 96 32 C 100 35, 102 40, 102 48 Z" stroke="#C9D2E0" strokeWidth="2" />
      <path fill={GLASS} d="M74 30 V 15 H 78 C 80 15, 81 16, 82 18 L 90 30 Z" />
      <path fill={BODY} d="M6 36 H 102 V 40 H 6 Z" />
      <Wheels xs={[26, 82]} />
    </>
  ),
  "4wd": (
    <>
      <path fill="#3E6B48" d="M10 48 V 24 C 10 19, 13 16, 18 16 H 70 C 75 16, 78 18, 81 22 L 90 32 C 97 33, 102 38, 102 48 Z" />
      <path fill={GLASS} d="M20 30 V 21 H 44 V 30 Z M49 30 V 21 H 70 C 72 21, 74 22, 75 24 L 80 30 Z" />
      <rect x="2" y="26" width="10" height="16" rx="5" fill={TYRE} />
      <path fill="#2C4E34" d="M12 12 H 76 V 16 H 12 Z" />
      <Wheels xs={[30, 82]} />
    </>
  ),
  truck: (
    <>
      <path fill="#F5F7FA" d="M4 46 V 8 H 66 V 46 Z" stroke="#C9D2E0" strokeWidth="2" />
      <path fill="#C2410C" d="M4 30 H 66 V 34 H 4 Z" />
      <path fill={BODY} d="M68 46 V 18 C 68 15, 70 13, 73 13 H 88 C 91 13, 93 15, 95 18 L 102 30 V 46 Z" />
      <path fill={GLASS} d="M76 28 V 18 H 87 C 88 18, 89 19, 90 20 L 95 28 Z" />
      <Wheels xs={[20, 44, 86]} y={50} />
    </>
  ),
  scrap: (
    <>
      <g transform="rotate(-6 54 36)">
        <path fill="#9A6A4A" d="M10 48 C 10 38, 16 33, 26 31 L 36 18 C 39 14, 43 12, 49 12 H 64 C 70 12, 74 15, 77 19 L 86 31 C 96 32, 100 38, 100 48 Z" />
        <path fill="#6E4A33" d="M30 40 l 6 -4 l 4 5 z M60 22 l 8 3 l -5 5 z M80 40 l 6 -3 l 2 6 z" />
        <path fill="#C9B8A8" d="M39 30 L 46 20 H 55 V 30 Z" />
      </g>
      <circle cx="30" cy="51" r="9" fill={TYRE} />
      <ellipse cx="82" cy="54" rx="10" ry="5" fill={TYRE} />
    </>
  ),
};

export const vehicleTypes = [
  { key: "scrap", label: "Scrap & wrecks" },
  { key: "car", label: "Cars" },
  { key: "ute", label: "Utes" },
  { key: "van", label: "Vans" },
  { key: "4wd", label: "4WDs" },
  { key: "truck", label: "Trucks" },
] as const;

export function VehicleIcon({ type, className = "" }: { type: string; className?: string }) {
  return (
    <svg viewBox="0 0 108 62" className={className} aria-hidden>
      <ellipse cx="54" cy="60" rx="46" ry="2.5" fill="#000" opacity=".08" />
      {shapes[type]}
    </svg>
  );
}
