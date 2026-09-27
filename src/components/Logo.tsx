export function Logo() {
  return (
    <span className="flex shrink-0 items-center gap-3">
      <svg viewBox="0 0 64 44" className="h-10 w-14 sm:h-12 sm:w-16" aria-hidden>
        <ellipse cx="32" cy="41" rx="28" ry="3" fill="#000" opacity=".12" />
        <path d="M8 22 13 9a6 6 0 0 1 5.6-4h26.8A6 6 0 0 1 51 9l5 13a6 6 0 0 1 4 5.6V35a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7.4A6 6 0 0 1 8 22Z" fill="#5cb85c" />
        <path d="M15 21 18.5 11a2.5 2.5 0 0 1 2.3-1.6h22.4A2.5 2.5 0 0 1 45.5 11L49 21Z" fill="#dff3df" />
        <circle cx="14" cy="28" r="3.5" fill="#fff" /><circle cx="50" cy="28" r="3.5" fill="#fff" />
        <rect x="24" y="26" width="16" height="4" rx="2" fill="#2f7d27" />
        <rect x="8" y="36" width="10" height="6" rx="2" fill="#2b2c2e" /><rect x="46" y="36" width="10" height="6" rx="2" fill="#2b2c2e" />
      </svg>
      <span className="font-heading text-[26px] leading-none text-ink sm:text-[38px]">
        <b className="font-bold">1800</b> <span className="font-normal">Cash For Cars</span>
      </span>
    </span>
  );
}
