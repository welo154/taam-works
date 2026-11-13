-- Additive changes on top of the existing TAAM Works schema.
-- Run once in the Supabase SQL Editor. Safe to re-run.

-- Arabic title and paragraph shown on the project page.
alter table public.projects
  add column if not exists title_ar text not null default '',
  add column if not exists description_ar text not null default '';

-- The 'wide' card size used by the homepage and Works grids.
alter type public.placement_layout add value if not exists 'wide';
