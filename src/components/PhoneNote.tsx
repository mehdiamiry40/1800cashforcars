import { site } from "@/lib/site";

// Shown beside the number people actually dial. The brand is not an 1800 line.
export function PhoneNote({ className = "" }: { className?: string }) {
  return <p className={className}>{site.phoneNote}</p>;
}
