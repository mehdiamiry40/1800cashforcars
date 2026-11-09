import { urlSet } from "@/lib/sitemap";

export const dynamic = "force-static";

export function GET() {
  return urlSet("post");
}
