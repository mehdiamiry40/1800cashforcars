import { Roo } from "./Roo";

// Hero illustration: Roo holding out cash for a rusty old car.
// Flat style, sharp edges, to match the rest of the brand.
function OldCar() {
  return (
    <g>
      {/* ground shadow */}
      <ellipse cx="200" cy="432" rx="190" ry="10" fill="#000" opacity=".08" />
      {/* body */}
      <path
        fill="#8C9BAB"
        d="M18 392 L 18 350 C 18 340, 24 334, 34 332 L 96 322 L 138 268 C 144 261, 152 258, 162 258 L 262 258 C 272 258, 280 262, 286 269 L 326 322 L 368 330 C 380 332, 388 340, 388 352 L 388 392 Z"
      />
      {/* primer patch and rust */}
      <path fill="#B9B2A5" d="M200 330 L 262 328 L 266 372 L 204 376 Z" />
      <path fill="#9C5A33" d="M30 372 c 10 -8 26 -6 30 6 c -10 6 -22 6 -30 -6 Z M300 360 c 8 -6 22 -4 24 6 c -8 5 -18 4 -24 -6 Z M150 278 c 6 -4 14 -2 15 4 c -6 3 -12 2 -15 -4 Z M352 340 c 6 -3 14 0 14 6 c -6 2 -11 0 -14 -6 Z" />
      {/* dent */}
      <path d="M110 350 q 18 10 38 0" stroke="#6F7E8E" strokeWidth="4" fill="none" />
      {/* windows */}
      <path fill="#CBD5DF" d="M148 318 L 168 276 C 170 272, 174 270, 178 270 L 208 270 L 208 318 Z" />
      <path fill="#CBD5DF" d="M220 318 L 220 270 L 258 270 C 262 270, 266 272, 268 276 L 294 318 Z" />
      {/* cracked back window */}
      <path d="M236 276 l 10 14 l -6 6 l 12 16" stroke="#7C8794" strokeWidth="2" fill="none" />
      {/* door line and handle */}
      <path d="M214 322 V 388" stroke="#6F7E8E" strokeWidth="3" />
      <rect x="226" y="334" width="16" height="5" fill="#5E6B78" />
      <rect x="160" y="334" width="16" height="5" fill="#5E6B78" />
      {/* bumpers and lights */}
      <rect x="10" y="378" width="30" height="12" fill="#5E6B78" />
      <rect x="370" y="378" width="28" height="12" fill="#5E6B78" />
      <rect x="376" y="344" width="12" height="12" fill="#F2E3A7" />
      <rect x="18" y="346" width="10" height="12" fill="#C0392B" />
      {/* wheels: one hubcap missing */}
      <g>
        <circle cx="100" cy="394" r="36" fill="#1D2433" />
        <circle cx="100" cy="394" r="17" fill="#3A4150" />
        <circle cx="100" cy="394" r="6" fill="#1D2433" />
      </g>
      <g>
        <circle cx="306" cy="394" r="36" fill="#1D2433" />
        <circle cx="306" cy="394" r="19" fill="#C9CFD6" />
        <circle cx="306" cy="394" r="6" fill="#8A93A0" />
      </g>
    </g>
  );
}

export function HeroScene({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 640 450" className={className} role="img" aria-label="Roo the kangaroo holding out cash for a rusty old car">
      <OldCar />
      {/* Roo, flipped to face the car, holding out cash */}
      <g transform="translate(652 38) scale(-1 1)">
        <Roo hand="cash" mirrored width={300} height={409} />
      </g>
    </svg>
  );
}
