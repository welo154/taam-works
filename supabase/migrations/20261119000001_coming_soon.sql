-- Mark projects that should show a Coming soon project page (cover only for now).
-- Run once in the Supabase SQL Editor. Safe to re-run.

alter table public.projects
  add column if not exists coming_soon boolean not null default false;
