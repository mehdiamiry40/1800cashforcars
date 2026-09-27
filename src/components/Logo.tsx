// Brand mark: a car carrying a dollar sign on an orange badge.
export function LogoMark({ className = "h-11 w-11" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <rect width="48" height="48" rx="12" fill="#ea580c" />
      <path d="M6 32.5v-5.2c0-1.6 1.1-3 2.7-3.3l4.6-.9 4.9-5.6a4 4 0 0 1 3-1.4h8.4a4 4 0 0 1 3 1.3l5 5.7 3.1.7a3 3 0 0 1 2.3 2.9v5.8Z" fill="#fff" />
      <path d="M19.4 23.4 22 20.3a1.6 1.6 0 0 1 1.2-.5h2.3v3.6ZM28 19.8h2.1c.5 0 .9.2 1.2.5l2.7 3.1H28Z" fill="#0d1b34" opacity=".85" />
      <circle cx="14.5" cy="33" r="4.2" fill="#0d1b34" /><circle cx="14.5" cy="33" r="1.6" fill="#fff" />
      <circle cx="34" cy="33" r="4.2" fill="#0d1b34" /><circle cx="34" cy="33" r="1.6" fill="#fff" />
      <circle cx="24.5" cy="11" r="6" fill="#0d1b34" />
      <text x="24.5" y="14.6" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="10" fill="#fff">$</text>
    </svg>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex shrink-0 items-center gap-2.5">
      <LogoMark className="h-10 w-10 sm:h-12 sm:w-12" />
      <span className="font-heading leading-none">
        <span className="block text-[13px] font-bold tracking-[0.32em] text-brand">1800</span>
        <span className={`block whitespace-nowrap text-[20px] font-extrabold uppercase tracking-wide sm:text-[26px] ${light ? "text-white" : "text-navy"}`}>
          Cash For Cars
        </span>
      </span>
    </span>
  );
}
