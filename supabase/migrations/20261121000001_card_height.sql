-- One-third card height presets used on Home and Works (short / medium / tall).
-- Run once in the Supabase SQL Editor. Safe to re-run.

alter table public.projects
  add column if not exists card_height text not null default 'medium';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'projects_card_height_check'
  ) then
    alter table public.projects
      add constraint projects_card_height_check
      check (card_height in ('short', 'medium', 'tall'));
  end if;
end $$;
