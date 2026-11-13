-- TAAM Works project system: projects, their stacked media, and storage.
-- Public visitors read published projects only. All writes go through the
-- site's server with the service role key (the /admin dashboard).

create type project_status as enum ('draft', 'published', 'archived');
create type project_layout as enum ('third', 'half', 'wide', 'full');
create type media_kind as enum ('image', 'video');

create table projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title_en text not null,
  title_ar text not null default '',
  project_year int check (project_year between 1990 and 2100),
  description_en text not null default '',
  description_ar text not null default '',
  tags text[] not null default '{}',
  status project_status not null default 'draft',

  -- Card shown on /works and the homepage.
  cover_kind media_kind not null default 'image',
  cover_path text,
  cover_poster_path text,
  cover_alt text not null default '',
  cover_width int,
  cover_height int,

  -- Placement. Lower order comes first.
  works_order int not null default 0,
  works_layout project_layout not null default 'third',
  show_on_home boolean not null default false,
  home_order int not null default 0,
  home_layout project_layout not null default 'third',

  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- The project page stack. Each row_position is one band down the page;
-- slot 0 alone is a full-width item, slots 0 and 1 together sit side by side.
create table project_media (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects (id) on delete cascade,
  row_position int not null,
  slot smallint not null default 0 check (slot in (0, 1)),
  kind media_kind not null,
  path text not null,
  poster_path text,
  alt text not null default '',
  width int not null check (width > 0),
  height int not null check (height > 0),
  caption text,
  created_at timestamptz not null default now(),
  unique (project_id, row_position, slot) deferrable initially deferred
);

create index project_media_stack on project_media (project_id, row_position, slot);
create index projects_works on projects (status, works_order);
create index projects_home on projects (status, show_on_home, home_order);

create function touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger projects_touch before update on projects
for each row execute function touch_updated_at();

alter table projects enable row level security;
alter table project_media enable row level security;

create policy "published projects are public" on projects
for select to anon, authenticated
using (status = 'published');

create policy "media of published projects is public" on project_media
for select to anon, authenticated
using (
  exists (
    select 1 from projects p
    where p.id = project_media.project_id and p.status = 'published'
  )
);

-- Public bucket for covers, photos and MP4s. Uploads use signed upload URLs
-- issued by the dashboard, so no storage write policy is granted to visitors.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'project-media',
  'project-media',
  true,
  209715200,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif',
        'video/mp4', 'video/webm', 'video/quicktime']
)
on conflict (id) do nothing;
