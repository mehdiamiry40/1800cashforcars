import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { canonicalRedirectUrl } from "@/lib/canonical-host";

// Send public non-canonical hosts to https://1800cashforcars.com.au. See canonical-host.ts for the exemptions.
export function proxy(request: NextRequest) {
  const target = canonicalRedirectUrl(request.headers.get("host"), request.nextUrl.pathname, request.nextUrl.search);
  if (!target) return NextResponse.next();
  return NextResponse.redirect(target, 308);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
