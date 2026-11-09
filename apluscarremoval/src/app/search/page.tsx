import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { renderSearchMain, search } from "@/lib/search";
import { BODY_CLASS_COMMON, SITE_NAME } from "@/lib/site";

/**
 * Site search. WordPress answered searches at /?s=term; next.config.ts rewrites that address
 * here, so the search forms in the page content keep working unchanged.
 */
type Props = { searchParams: Promise<{ s?: string | string[] }> };

async function queryOf(searchParams: Props["searchParams"]): Promise<string> {
  const { s } = await searchParams;
  return (Array.isArray(s) ? s[0] : (s ?? "")).trim().slice(0, 200);
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const query = await queryOf(searchParams);
  return { title: { absolute: `You searched for ${query} - ${SITE_NAME}` }, robots: "noindex, follow" };
}

export default async function SearchPage({ searchParams }: Props) {
  const query = await queryOf(searchParams);
  const found = search(query).length > 0;
  return (
    <SiteShell
      menu={{}}
      bodyClass={`search ${found ? "search-results" : "search-no-results"} ${BODY_CLASS_COMMON}`}
      mainHtml={renderSearchMain(query)}
    />
  );
}
