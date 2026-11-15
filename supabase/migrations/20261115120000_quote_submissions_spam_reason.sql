-- Suspected-spam submissions are kept with a reason instead of being discarded unseen.
-- Null for a normal quote. The only value sent today is 'honeypot' (the hidden form field was filled).
-- These rows are not emailed. To review them: select * from quote_submissions where spam_reason is not null;
-- Apply on the live project before flagged inserts can succeed. Normal quotes do not send this column,
-- so they keep working whether or not this has been applied.
alter table public.quote_submissions add column if not exists spam_reason text;

comment on column public.quote_submissions.spam_reason is 'Why the submission was treated as spam, for example honeypot. Null for a normal quote.';
