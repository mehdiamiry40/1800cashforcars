// Roo: the 1800 Cash For Cars kangaroo. Flat, friendly illustration in a few poses.
// All poses share one body so the character stays consistent across the site.

const FUR = "#C8743A";
const FUR_D = "#A55A27";
const CREAM = "#F5E1C6";
const DARK = "#35211A";

type Hand = "none" | "cash" | "phone" | "wave";

export type RooProps = {
  hand?: Hand;
  pouchCar?: boolean;
  hop?: boolean;
  confused?: boolean;
  className?: string;
  title?: string;
  width?: number;
  height?: number;
  flip?: boolean;
};

function Arm({ hand }: { hand: Hand }) {
  if (hand === "wave") {
    return (
      <>
        <path fill={FUR} d="M194 206 C 216 190, 240 170, 256 148 C 262 140, 273 145, 268 155 C 258 176, 234 200, 208 224 Z" />
        <ellipse fill={FUR_D} cx="264" cy="146" rx="10" ry="9" />
        <path d="M280 126 q 9 8 6 20 M292 116 q 13 12 9 32" stroke={FUR_D} strokeWidth="4" fill="none" strokeLinecap="round" opacity=".5" />
      </>
    );
  }
  if (hand === "phone") {
    return (
      <>
        <path fill={FUR} d="M194 206 C 214 196, 236 184, 252 172 C 260 166, 268 174, 262 182 C 248 196, 228 212, 206 224 Z" />
        <g transform="translate(248 128) rotate(12)">
          <rect x="0" y="0" width="24" height="42" rx="5" fill="#1D2433" />
          <rect x="3.5" y="5" width="17" height="28" rx="2" fill="#7FC8A9" />
          <circle cx="12" cy="37" r="2" fill="#7FC8A9" />
        </g>
        <ellipse fill={FUR_D} cx="258" cy="176" rx="10" ry="8" />
      </>
    );
  }
  return (
    <>
      <path fill={FUR} d="M194 204 C 214 208, 234 222, 244 238 C 249 246, 242 254, 234 249 C 222 240, 206 232, 190 224 Z" />
      {hand === "cash" && (
        <g transform="translate(222 226) rotate(-16)">
          <rect x="0" y="0" width="48" height="26" rx="3" fill="#237A4B" />
          <rect x="4" y="-5" width="48" height="26" rx="3" fill="#2F9B5E" transform="rotate(8 28 8)" />
          <rect x="8" y="-10" width="48" height="26" rx="3" fill="#48B777" transform="rotate(16 32 3)" />
          <text x="34" y="10" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="15" fill="#fff" textAnchor="middle" transform="rotate(16 32 3)">
            $
          </text>
        </g>
      )}
      <ellipse fill={FUR_D} cx="239" cy="246" rx="9" ry="7" />
    </>
  );
}

export function Roo({ hand = "none", pouchCar = false, hop = false, confused = false, className = "", title, width, height, flip = false }: RooProps) {
  return (
    <svg viewBox="-10 -30 330 450" width={width} height={height} className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title} style={flip ? { transform: "scaleX(-1)" } : undefined}>
      {hop && (
        <g stroke="#E3C9A6" strokeWidth="6" strokeLinecap="round">
          <path d="M-4 250 H 50" />
          <path d="M8 280 H 70" />
          <path d="M-4 310 H 40" />
        </g>
      )}
      <ellipse cx="160" cy="402" rx={hop ? 90 : 140} ry={hop ? 7 : 9} fill="#000" opacity=".07" />
      <g transform={hop ? "translate(10 -26) rotate(-10 160 300)" : undefined}>
        {/* tail */}
        <path fill={FUR_D} d="M112 312 C 86 336, 58 364, 18 386 C 8 392, 12 400, 24 399 C 70 396, 112 380, 146 356 Z" />
        {/* far foot */}
        <path fill={FUR_D} d="M152 374 C 178 374, 216 381, 240 387 C 249 390, 246 399, 236 399 L 152 398 Z" />
        {/* haunch */}
        <ellipse fill={FUR} cx="140" cy="316" rx="64" ry="68" />
        {/* near foot */}
        <path fill={FUR} d="M118 368 C 150 366, 202 375, 228 384 C 239 388, 235 400, 223 400 L 116 399 C 104 398, 104 370, 118 368 Z" />
        {/* body */}
        <path fill={FUR} d="M148 152 C 190 140, 224 170, 226 226 C 228 282, 212 332, 170 352 C 128 362, 98 330, 108 280 C 116 230, 116 172, 148 152 Z" />
        {/* belly */}
        <path fill={CREAM} d="M180 176 C 206 181, 215 217, 213 257 C 211 302, 197 334, 172 340 C 150 344, 139 320, 145 282 C 151 236, 159 179, 180 176 Z" />
        {pouchCar && (
          <>
            {/* a rusty old banger: we buy scrap */}
            <g transform="translate(142 258) scale(0.82)">
              <path fill="#8A7E6E" d="M4 42 C 4 32, 10 26, 20 24 L 29 10 C 32 5, 37 4, 43 5 L 58 3 C 64 3, 68 6, 71 11 L 78 24 C 86 26, 90 32, 90 42 Z" />
              <path fill="#9C5A33" d="M8 34 c 6 -4 12 -2 14 3 c -5 3 -10 3 -14 -3 Z M62 12 c 5 0 8 3 8 7 c -5 1 -9 -2 -8 -7 Z M44 30 c 4 -2 9 -1 10 3 c -4 2 -8 1 -10 -3 Z" />
              <path fill="#C9CFD6" d="M33 23 L 40 11 C 41 9, 43 8, 45 8 L 50 8 L 50 23 Z M55 23 L 55 7 L 58 7 C 61 7, 63 8, 64 10 L 70 23 Z" />
              <path d="M57 9 l 4 6 l -3 3 l 5 5" stroke="#6B7280" strokeWidth="1.4" fill="none" />
              <circle cx="84" cy="33" r="3.5" fill="#E8D9A8" />
            </g>
            <path fill={CREAM} d="M146 294 C 168 306, 196 306, 212 292 C 210 318, 196 336, 172 340 C 152 343, 142 322, 146 294 Z" />
          </>
        )}
        <path d="M148 294 C 168 306, 196 306, 211 292" stroke="#DDBB92" strokeWidth="5" fill="none" strokeLinecap="round" />
        {hand !== "phone" && hand !== "wave" && <Arm hand={hand} />}
        {/* neck */}
        <path fill={FUR} d="M156 162 C 161 128, 172 108, 190 94 L 218 122 C 207 140, 201 158, 197 172 Z" />
        {/* ears */}
        <path fill={FUR_D} d="M166 84 C 146 56, 140 22, 153 12 C 166 4, 182 40, 186 78 Z" />
        <path fill={FUR} d="M184 80 C 175 46, 179 10, 195 4 C 211 0, 216 40, 205 82 Z" />
        <path fill={CREAM} d="M189 70 C 184 46, 188 20, 196 16 C 204 14, 206 44, 200 72 Z" opacity=".9" />
        {/* head */}
        <path fill={FUR} d="M154 98 C 152 68, 180 54, 210 62 C 238 70, 268 86, 277 102 C 284 116, 273 130, 255 133 C 232 137, 204 138, 186 132 C 166 125, 155 114, 154 98 Z" />
        <path fill={CREAM} d="M224 112 C 241 104, 263 104, 274 110 C 279 119, 270 131, 252 132 C 237 133, 225 127, 224 112 Z" />
        <ellipse fill={DARK} cx="275" cy="105" rx="8" ry="6" />
        <ellipse fill={DARK} cx="214" cy="90" rx="7" ry="8.5" />
        <circle cx="216.5" cy="86.5" r="2.6" fill="#fff" />
        {confused ? (
          <path d="M240 124 C 248 120, 256 126, 264 122" stroke={DARK} strokeWidth="3.2" fill="none" strokeLinecap="round" />
        ) : (
          <path d="M238 121 C 247 128, 258 128, 264 123" stroke={DARK} strokeWidth="3.2" fill="none" strokeLinecap="round" />
        )}
        <ellipse cx="226" cy="113" rx="8" ry="4.5" fill="#EC8E6E" opacity=".45" />
        {(hand === "phone" || hand === "wave") && <Arm hand={hand} />}
      </g>
      {confused && (
        <text x="262" y="40" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="64" fill="#C2410C">
          ?
        </text>
      )}
    </svg>
  );
}

// Logo mark: Roo's head in a circle.
export function RooMark({ className = "h-10 w-10", light = false }: { className?: string; light?: boolean }) {
  const id = light ? "roo-mark-l" : "roo-mark";
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <defs>
        <clipPath id={id}>
          <rect width="64" height="64" />
        </clipPath>
      </defs>
      <rect width="64" height="64" fill={light ? "#FFFFFF" : "#C2410C"} />
      <g clipPath={`url(#${id})`}>
        <g transform="translate(-47 4) scale(0.37)">
          <path fill={FUR_D} d="M166 84 C 146 56, 140 22, 153 12 C 166 4, 182 40, 186 78 Z" />
          <path fill={FUR} d="M184 80 C 175 46, 179 10, 195 4 C 211 0, 216 40, 205 82 Z" />
          <path fill={CREAM} d="M189 70 C 184 46, 188 20, 196 16 C 204 14, 206 44, 200 72 Z" />
          <path fill={FUR} d="M150 200 C 156 140, 170 110, 190 94 L 222 122 C 210 150, 206 175, 204 200 Z" />
          <path fill={FUR} d="M154 98 C 152 68, 180 54, 210 62 C 238 70, 268 86, 277 102 C 284 116, 273 130, 255 133 C 232 137, 204 138, 186 132 C 166 125, 155 114, 154 98 Z" />
          <path fill={CREAM} d="M224 112 C 241 104, 263 104, 274 110 C 279 119, 270 131, 252 132 C 237 133, 225 127, 224 112 Z" />
          <ellipse fill={DARK} cx="275" cy="105" rx="9" ry="7" />
          <ellipse fill={DARK} cx="214" cy="90" rx="8" ry="10" />
          <circle cx="217" cy="86" r="3" fill="#fff" />
          <path d="M238 121 C 247 128, 258 128, 264 123" stroke={DARK} strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
}
