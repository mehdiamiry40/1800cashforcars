import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHead, metaContent } from "@/components/PageHead";
import { SiteShell } from "@/components/SiteShell";
import { allSlugs, renderMain, resolve } from "@/lib/content";

// Every public URL is known at build time; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return allSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/[[...slug]]">): Promise<Metadata> {
  const resolved = resolve((await params).slug);
  if (!resolved) return {};
  const { route } = resolved;
  return {
    title: { absolute: route.title },
    description: metaContent(route.metas, "description"),
    robots: metaContent(route.metas, "robots"),
    alternates: route.canonical ? { canonical: route.canonical } : undefined,
  };
}

export default async function Page({ params }: PageProps<"/[[...slug]]">) {
  const resolved = resolve((await params).slug);
  if (!resolved) notFound();
  const { route } = resolved;
  return (
    <>
      <PageHead metas={route.metas} jsonLd={route.jsonLd} />
      <SiteShell menu={route.menu} bodyClass={route.bodyClass} mainHtml={renderMain(resolved)} />
    </>
  );
}
