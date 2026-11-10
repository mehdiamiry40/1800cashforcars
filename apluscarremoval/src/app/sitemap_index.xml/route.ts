import { sitemapIndex } from "@/lib/sitemap";

export const dynamic = "force-static";

export function GET() {
  return sitemapIndex();
}
