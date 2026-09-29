import { RooMark } from "./Roo";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex shrink-0 items-center gap-2.5">
      <RooMark className="h-10 w-10 sm:h-11 sm:w-11" light={light} />
      <span className="font-heading leading-none">
        <span className={`block text-[12px] font-extrabold tracking-[0.2em] ${light ? "text-brand-light" : "text-brand"}`}>1800</span>
        <span className={`block whitespace-nowrap text-[19px] font-extrabold tracking-[-0.01em] sm:text-[22px] ${light ? "text-white" : "text-ink"}`}>
          Cash For Cars
        </span>
      </span>
    </span>
  );
}
