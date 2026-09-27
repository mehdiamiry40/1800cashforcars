import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CallUsAndTerms, ContentBlocks } from "@/components/Blocks";
import { PageShell } from "@/components/PageShell";
import { pages } from "@/lib/content";

export const dynamicParams = false;

const images: Record<string, string> = {
  "cash-for-cars": "/images/cash.jpg",
  "car-removals": "/images/hero-truck.jpg",
  services: "/images/hero-towing.jpg",
  "scrap-car-removal": "/images/tile-scrap.jpg",
  "car-wreckers": "/images/tile-wreckers.jpg",
  "car-disposal": "/images/tile-disposal.jpg",
};

export function generateStaticParams() {
  return pages.map((p) => ({ page: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[page]">): Promise<Metadata> {
  const { page } = await params;
  const p = pages.find((x) => x.slug === page);
  if (!p) return {};
  return {
    title: { absolute: p.metaTitle },
    description: p.description,
    alternates: { canonical: `/${p.slug}` },
  };
}

export default async function ContentPageRoute({ params }: PageProps<"/[page]">) {
  const { page } = await params;
  const p = pages.find((x) => x.slug === page);
  if (!p) notFound();

  return (
    <PageShell title={p.title} intro={p.description} image={images[p.slug]}>
      <ContentBlocks blocks={p.blocks} />
      <div className="mt-12">
        <CallUsAndTerms />
      </div>
    </PageShell>
  );
}
