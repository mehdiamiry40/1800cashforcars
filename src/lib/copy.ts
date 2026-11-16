// Shared shape for long-form page copy. Paragraphs stay plain text so FAQ schema
// can reuse the same sentences without markup.

export type InlineLink = { phrase: string; href: string };

export type CopyParagraph = { text: string; links?: InlineLink[] };

export type CopySection = {
  heading: string;
  paragraphs: CopyParagraph[];
  list?: { bold: string; text: string; links?: InlineLink[] }[];
};

export type CopyFaq = { q: string; a: string; links?: InlineLink[] };

export type Block = {
  heading: string;
  summary?: string;
  icon?: "car" | "truck" | "cash" | "recycle" | "paperwork";
  paras?: string[];
  list?: { bold: string; text: string }[];
  /** Phrases inside `summary` that should be links. */
  links?: InlineLink[];
};

export type ContentPage = {
  slug: string;
  /** The page's H1. */
  title: string;
  /** Short name for the breadcrumb, related links, the FAQ heading and schema. Defaults to `title`. */
  label?: string;
  metaTitle: string;
  description: string;
  intro?: string;
  /** One line under the intro, usually a hand-off link to a neighbouring page. */
  introNote?: CopyParagraph;
  /** Related-link labels used on this page only, keyed by href. */
  relatedLabels?: Record<string, string>;
  blocks: Block[];
  /** Visible long-form copy. When set, the page renders this instead of accordion blocks. */
  sections?: CopySection[];
  /** Shown as an FAQ list under the blocks, with FAQ schema. */
  faqs?: CopyFaq[];
};
