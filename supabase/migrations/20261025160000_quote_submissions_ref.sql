-- Reference shown to the customer and in the quote email.
-- Apply on the live project before inserts that send `ref` can succeed.
alter table public.quote_submissions add column if not exists ref text unique;
