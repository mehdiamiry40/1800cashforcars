-- Where the visitor who sent the quote came from: a Google Ads click ID (gclid, gbraid or wbraid),
-- campaign tags (utm_source, utm_medium, utm_campaign, utm_term, utm_content), the first page of the
-- visit (landing) and the host of the site that linked to it (referrer). See src/lib/ad-source.ts.
-- Null when the browser sent the form without the form's script, and for rows saved before this column.
-- To count quotes by source: select coalesce(attribution->>'utm_source', attribution->>'referrer', 'direct'), count(*) from quote_submissions group by 1;
-- Apply on the live project. Until then the site saves each quote without this column, so nothing is lost.
alter table public.quote_submissions add column if not exists attribution jsonb;

comment on column public.quote_submissions.attribution is 'Where the visitor came from: ad click ID, campaign tags, landing page and referrer host. Null when unknown.';
