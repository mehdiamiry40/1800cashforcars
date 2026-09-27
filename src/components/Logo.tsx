// Sign-style wordmark: orange "1800" block + heavy name.
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex shrink-0 items-stretch font-display leading-none">
      <span className="flex items-center bg-brand px-2 py-1.5 text-[20px] font-extrabold tracking-[0.01em] text-white sm:px-2.5 sm:text-[25px]">1800</span>
      <span
        className={`flex items-center whitespace-nowrap border-y-[3px] border-r-[3px] px-2 py-1 text-[20px] font-extrabold uppercase tracking-[0.02em] sm:px-2.5 sm:text-[25px] ${
          light ? "border-white/80 text-white" : "border-navy text-navy"
        }`}
      >
        Cash for Cars
      </span>
    </span>
  );
}
