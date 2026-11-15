import { site } from "@/lib/site";

// Where to report a security problem with this site, in the standard place (RFC 9116).
export const dynamic = "force-static";

const DAY = 24 * 60 * 60 * 1000;

export function GET() {
  // The standard asks for an expiry less than a year away. This is worked out when the site is
  // built, so every deploy renews it.
  const expires = new Date(Date.now() + 364 * DAY).toISOString().replace(/\.\d{3}Z$/, "Z");
  const body = [
    `Contact: mailto:${site.email}`,
    `Expires: ${expires}`,
    "Preferred-Languages: en",
    `Canonical: ${site.url}/.well-known/security.txt`,
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
