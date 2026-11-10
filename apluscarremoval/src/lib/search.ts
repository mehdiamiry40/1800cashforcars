import index from "@content/search-index.json";
import { esc } from "./html";

type Entry = {
  path: string;
  kind: "post" | "page";
  title: string;
  date: string;
  image?: string;
  /** Post card markup as the blog archives render it. Pages get an equivalent card. */
  card?: string;
  text: string;
};

const entries = index as Entry[];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function pageCard(entry: Entry): string {
  const date = new Date(`${entry.date}Z`);
  const title = esc(entry.title);
  return `<div class="col post-item" >
			<div class="col-inner">
				<div class="box box-text-bottom box-blog-post has-hover">
					${
            entry.image
              ? `<div class="box-image" ><div class="image-cover" style="padding-top:56%;"><a href="${entry.path}" class="plain" aria-label="${title}"><img src="${esc(entry.image)}" class="attachment-medium size-medium wp-post-image" alt="${title}" decoding="async" loading="lazy" /></a></div></div>`
              : ""
          }
					<div class="box-text text-center" >
					<div class="box-text-inner blog-post-inner">
						<h5 class="post-title is-large "><a href="${entry.path}" class="plain">${title}</a></h5>
						<div class="is-divider"></div>
					</div>
					</div>
					<div class="badge absolute top post-date badge-outline">
						<div class="badge-inner">
							<span class="post-date-day">${String(date.getUTCDate()).padStart(2, "0")}</span><br>
							<span class="post-date-month is-xsmall">${MONTHS[date.getUTCMonth()]}</span>
						</div>
					</div>
				</div>
			</div>
		</div>`;
}

/** Every word must appear in the title or body, like WordPress search. Titles rank first, then newest. */
export function search(query: string): Entry[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean).slice(0, 10);
  if (words.length === 0) return [];
  return entries
    .filter((entry) => words.every((word) => entry.title.toLowerCase().includes(word) || entry.text.includes(word)))
    .sort((a, b) => {
      const inTitle = (entry: Entry) => Number(words.every((word) => entry.title.toLowerCase().includes(word)));
      return inTitle(b) - inTitle(a) || b.date.localeCompare(a.date);
    });
}

export function searchForm(query: string): string {
  return `<form method="get" class="searchform" action="/" role="search">
		<div class="flex-row relative">
			<div class="flex-col flex-grow">
				<input type="search" class="search-field mb-0" name="s" value="${esc(query)}" id="s" placeholder="Search&hellip;" />
			</div>
			<div class="flex-col">
				<button type="submit" class="ux-search-submit submit-button secondary button icon mb-0" aria-label="Submit">
					<i class="icon-search" aria-hidden="true"></i>
				</button>
			</div>
		</div>
		<div class="live-search-results text-left z-top"></div>
	</form>`;
}

/** The theme's search results template (same markup as the blog archives). */
export function renderSearchMain(query: string): string {
  const results = search(query);
  const header = `<div id="content" class="blog-wrapper blog-archive page-wrapper">
		<header class="archive-page-header">
	<div class="row">
	<div class="large-12 text-center col">
	<h1 class="page-title is-large uppercase">
		Search Results for: <span>${esc(query)}</span>	</h1>
		</div>
	</div>
</header>

<div class="row align-center">
	<div class="large-10 col">
	`;
  const body = results.length
    ? `<div id="post-list">
  <div class="row large-columns-3 medium-columns- small-columns-1" >
  ${results.map((entry) => entry.card ?? pageCard(entry)).join("")}</div>
</div>`
    : `<section class="no-results not-found">
	<header class="page-title">
		<h1 class="page-title">Nothing Found</h1>
	</header>
	<div class="page-content">
		<p>Sorry, but nothing matched your search terms. Please try again with some different keywords.</p>
		${searchForm(query)}
	</div>
</section>`;
  return `${header}${body}
	</div>
</div>
</div>`;
}
