import type { Metadata } from "next";
import { PageHead, metaContent } from "@/components/PageHead";
import { SiteShell } from "@/components/SiteShell";
import { notFoundPage, readHtml } from "@/lib/content";

export const metadata: Metadata = {
  title: { absolute: notFoundPage.title },
  robots: metaContent(notFoundPage.metas, "robots"),
};

export default function NotFound() {
  return (
    <>
      <PageHead metas={notFoundPage.metas} />
      <SiteShell menu={{}} bodyClass={notFoundPage.bodyClass} mainHtml={readHtml(notFoundPage.html)} />
    </>
  );
}
