-- Accepted quote-form submissions.
-- The server inserts with the Supabase service role key, which bypasses row level security.
-- Row level security is enabled and there are no policies, so the anon and authenticated
-- roles cannot read or write these rows.

create table public.quote_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  email text not null default '',
  address text not null,
  vehicle text not null,
  description text not null,
  expected text not null default '',
  page text not null default '',
  user_agent text
);

comment on table public.quote_submissions is 'Quote form submissions saved by the server in addition to the email.';
comment on column public.quote_submissions.name is 'Your name.';
comment on column public.quote_submissions.phone is 'Mobile.';
comment on column public.quote_submissions.email is 'Email. Empty when the visitor leaves it blank.';
comment on column public.quote_submissions.address is 'Suburb / address.';
comment on column public.quote_submissions.vehicle is 'Year, make and model.';
comment on column public.quote_submissions.description is 'Car condition.';
comment on column public.quote_submissions.expected is 'Hoping for. Stored after the same price normalisation as the email.';
comment on column public.quote_submissions.page is 'Source page path submitted with the form, for example /quote.';
comment on column public.quote_submissions.user_agent is 'User-Agent header on the submission request.';

alter table public.quote_submissions enable row level security;
