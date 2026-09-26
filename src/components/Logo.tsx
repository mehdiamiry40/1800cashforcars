export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex shrink-0 items-center gap-2.5">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-cash-400 text-navy-950 shadow-[0_3px_0_0_#c79b00]">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
          <path d="M5 11.5 6.8 7.2A2 2 0 0 1 8.6 6h6.8a2 2 0 0 1 1.8 1.2l1.8 4.3A2.5 2.5 0 0 1 21 14v3a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1v-3a2.5 2.5 0 0 1 2-2.5Zm2.2-.5h9.6l-1.3-3.1a.5.5 0 0 0-.5-.4H9a.5.5 0 0 0-.5.4L7.2 11Z" />
        </svg>
      </span>
      <span className={`font-display leading-none ${light ? "text-white" : "text-navy-900"}`}>
        <span className="block text-[11px] font-extrabold tracking-[0.2em] text-cash-400">1800</span>
        <span className="block whitespace-nowrap text-base font-black uppercase sm:text-lg">Cash For Cars</span>
      </span>
    </span>
  );
}
