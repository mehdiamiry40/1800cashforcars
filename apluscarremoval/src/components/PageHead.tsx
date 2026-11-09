import type { Meta } from "@/lib/content";

/**
 * Open Graph, article and Twitter tags exactly as Yoast printed them. React hoists <meta>
 * elements into <head>. Title, description, robots and canonical go through generateMetadata.
 */
export function PageHead({ metas, jsonLd = [] }: { metas: Meta[]; jsonLd?: string[] }) {
  return (
    <>
      {metas
        .filter((meta) => meta.key !== "robots" && meta.key !== "description")
        .map((meta) =>
          meta.attr === "property" ? (
            <meta key={meta.key} property={meta.key} content={meta.content} />
          ) : (
            <meta key={meta.key} name={meta.key} content={meta.content} />
          ),
        )}
      {jsonLd.map((json, i) => (
        // "<" is escaped so structured data can never close the script element early.
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: json.replace(/</g, "\\u003c") }} />
      ))}
    </>
  );
}

export function metaContent(metas: Meta[], key: string): string | undefined {
  return metas.find((meta) => meta.key === key)?.content;
}
