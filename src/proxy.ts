import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { canonicalCasePath, canonicalRedirectUrl } from "@/lib/canonical-host";

// Send public non-canonical hosts to https://1800cashforcars.com.au. See canonical-host.ts for the exemptions.
// A brand-case address such as /AutoVal goes to its lower-case page in the same single redirect.
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const path = canonicalCasePath(pathname);
  const target = canonicalRedirectUrl(request.headers.get("host"), path, search);
  if (target) return NextResponse.redirect(target, 308);
  if (path === pathname) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = path;
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
