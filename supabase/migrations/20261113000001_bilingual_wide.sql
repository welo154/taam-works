-- Additive changes on top of the existing TAAM Works schema.
-- Run once in the Supabase SQL Editor. Safe to re-run.

-- Arabic title and paragraph shown on the project page.
alter table public.projects
  add column if not exists title_ar text not null default '',
  add column if not exists description_ar text not null default '';

-- The 'wide' card size used by the homepage and Works grids.
alter type public.placement_layout add value if not exists 'wide';

-- Consultation bookings collect a phone number and a preferred slot, not an
-- email. (The email format check already allows an empty value once the
-- column is optional.)
alter table public.inquiries
  add column if not exists phone text,
  add column if not exists preferred_date date,
  add column if not exists preferred_time text;
alter table public.inquiries alter column email drop not null;
