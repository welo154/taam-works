# TAAM Works — Design Specification, Architecture, and Cursor Prompts

Version 0.2 · 13 October 2026 · Updated from the supplied designs and video

This version replaces the provisional 0.1 brief. It incorporates the user's confirmed English-only requirement and the actual project-page design. It is an implementation specification, not a claim that the website has been built or deployed.

## 1. Confirmed direction

Build an English-only studio portfolio in Next.js and Supabase. The homepage's studio copy, service descriptions, navigation, and animation are code-managed. The project dashboard manages portfolio content. The same project records feed the Works listing, individual project pages, and selected-work placements on the homepage.

Use the supplied design: black background, warm cream typography, colored navigation labels, a large custom TAAM wordmark, generous negative space, and image-led work. Preserve the layout and brand character.

English-only means English interface, navigation, forms, metadata, and editorial body copy. Preserve Arabic lettering within supplied project artwork and logos. The sample project's separate Arabic paragraph is not part of the English-only implementation. Use an English display title such as “IDEA” unless the owner explicitly approves an official bilingual project name.

Do not add a language switcher, translation tables, visitor accounts, or a general-purpose page builder.

## 2. Source review and evidence

The four images were visually inspected. The 77.41-second video was sampled across its full duration, with additional half-second frames from the first eight seconds to inspect the hero.

| Supplied reference | Observed content |
| --- | --- |
| `image.png` | Studio introduction, three project covers, a full-width featured project, beginning of services |
| `image(1).png` | Four service groups, large “LET TAAM WORK!” closing line, yellow “LET'S CONNECT” button, footer |
| `image(2).png` | Three arrangements of the same TAAM hero with five colored navigation labels |
| `image(3).png` | Project page: text left, media right, Next Project row, contact CTA, footer |
| `taam.mp4` | Hero movement, homepage scroll, Works listing, project navigation and scrolling |

The narrow screenshots are scaled views of desktop designs, not evidence of a mobile layout. No authored mobile frames, exact font names, vector logos, original media exports, or Figma easing curves were supplied.

### Video landmarks

Times are approximate reference points, not animation source-code specifications.

| Time | Observation |
| --- | --- |
| 0–8 seconds | Hero enters; labels move through three arrangements around the wordmark |
| 9–12 seconds | Studio introduction, blue taamworks label, paragraph |
| 12–19 seconds | Three-column project row followed by a large featured image |
| 20–43 seconds | Design, Tech, Events, and Space & Objects service sections |
| Around 44 seconds | “LET TAAM WORK!”, contact CTA, footer |
| 48–54 seconds | Separate Works view with image-led project groups |
| 56–67 seconds | Project description remains visible while the right-hand media advances |
| 68–70 seconds | Project section gives way to Next Project, contact CTA, and footer |
| Around 76 seconds | Return to the hero |

The project behavior is consistent with a sticky description bounded by the gallery section. The recording does not reveal the original CSS or prove independent scrolling containers.

Do not reproduce browser bars, Figma controls, selection outlines, artboard titles, adjacent frames, or the gray editor canvas.

## 3. Site map and navigation

Use a long homepage plus Works and project routes. Separate Studio and Services pages are not required by these references.

| Destination | Proposed URL | Source of content |
| --- | --- | --- |
| Home | `/` | Static structure and animation; selected project data |
| About | `/#about` | Static studio introduction |
| Services | `/#services` | Static service groups |
| Works | `/works` | Published project records |
| Project detail | `/works/[slug]` | One project and its ordered media |
| Contact / Let's connect | `/connect` | Contact/consultation flow |
| Initiatives | Not yet assigned | Label is visible, but destination/content is not demonstrated |
| Admin sign-in | `/admin/login` | Supabase Auth |
| Project dashboard | `/admin/projects` | Authorized project editing |
| New/edit project | `/admin/projects/new`, `/admin/projects/[id]` | Drafts, media, preview, publication |

Keep the Initiatives destination in one navigation configuration. In the development preview, preserve its appearance as a non-navigating label until a real destination is provided. Do not publish a dead link or silently turn it into an invented service.

Contact uses the existing yellow visual language. Preserve “LET'S CONNECT” in the supplied placements. “Book a free consultation” can describe the next action on the contact page when actual scheduling is configured.

## 4. Visual system

### Palette

These values were sampled from flat areas of the supplied PNGs. They are useful starting tokens, not a substitute for original Figma variables.

| Token | Value | Use |
| --- | --- | --- |
| Background | `#000000` | Website page background |
| Cream | `#FBF5D5` | Large wordmark and primary text |
| Pink | `#FF7DFF` | Services label and numbered service headings |
| Blue | `#0064FF` | About label and studio-name highlight |
| Red | `#F72528` | Works label |
| Yellow | `#F5E600` | Contact label, CTA, next-project arrow |
| Gray | `#AFAFAF` | Initiatives label |

The `#1E1E1E` surrounding the screenshot artwork is the editor surface; the actual website is black.

Use the original TAAM vector wordmark and small taamworks logo when available. The large wordmark is a brand asset, not a heading to recreate with a guessed script font.

Keep public components custom. General-purpose admin UI components may be used in the dashboard without influencing the public design.

### Core components

`SiteHeader`, `AnimatedHero`, `HeroBadge`, `StudioIntro`, `ProjectGrid`,
`ProjectCard`, `ServiceGroup`, `ConnectSection`, `SiteFooter`,
`ProjectSidebar`, `ProjectMediaStack`, and `NextProjectLink`.

The header has the small logo on the left and copyright/year on the right. The footer has email/phone, Behance/Instagram, and copyright. Keep destinations and contact information in one typed configuration; use verified addresses and links before launch.

## 5. Homepage specification

### Section order

1. Small header and animated TAAM hero.
2. Studio introduction, anchored as `about`.
3. Selected projects: initial row of three, then a prominent full-width project.
4. Four service groups, anchored as `services`.
5. Large “LET TAAM WORK!” closing line.
6. Yellow “LET'S CONNECT” CTA.
7. Footer.

The initial project images visible in the references include Tech Valley, IDEA, an Events image, and the large calligraphy-event photograph. Treat these as supplied example content, not permission to fabricate project facts.

The introduction and service content remain in a typed source file. The home project cards come from published projects flagged for home display.

### Service content

The four confirmed groups are:

| Number | Group | Visible examples |
| --- | --- | --- |
| 01 | Design | Brand Identity, Brand Strategy |
| 02 | Tech | UI/UX Design, Web Design & Development |
| 03 | Events | Event Strategy, Concept & Creative Direction; Curation & Programming |
| 04 | Space & Objects | Interior Design, Spatial Design |

The video shows additional items in the longer service lists, including Creative Direction, Communication Design, Type Design & Lettering, Digital Design, Product Design, Furniture & Object Design, and Wayfinding & Environmental Graphics. The screenshots contain shorter lists. Keep the copy editable in code and record this content difference rather than claiming the sources match word-for-word.

Use a narrow left column for numbered pink labels and a wider right column for descriptions. The references do not establish accordion behavior; implement normal content sections initially.

### Project grids

Preserve different image proportions. Do not force every project into an identical square card.

Use a six-column desktop grid to support these controlled placements:

- Third width: span 2.
- Half width: span 3.
- Full width: span 6.

Home and Works can have different orders and placements, using the same project records. Suggested named layout values are `third`, `half`, and `full`; do not let editors enter arbitrary CSS.

On narrower screens, collapse the grid to two columns and then one, with all full-width items spanning the available columns. These are proposed responsive rules because mobile designs were not supplied.

No portfolio filter UI is demonstrated. Keep tags in the data model, but do not add filter controls unless requested.

## 6. Homepage hero and motion

**There is one hero. The three stacked compositions in image(2).png are animation states, not three separate sections.**

The hero contains one cream wordmark and five real navigation labels:

| Label | Color | Destination |
| --- | --- | --- |
| About | Blue | `/#about` |
| Works | Red | `/works` |
| Services | Pink | `/#services` |
| Contact | Yellow | `/connect` |
| Initiatives | Gray | To be supplied |

### Observed states

| State | Arrangement | Approximate video evidence |
| --- | --- | --- |
| A | Services upper-left; About lower-left; Works near center; Contact right; Initiatives lower-right | Around 1–2.5 seconds |
| B | Works above the wordmark; Services left; About lower-middle; Contact right-middle; Initiatives below | Around 3.5–5 seconds |
| C | Works upper-left; About upper-right; Contact lower-left; Initiatives lower-middle; Services lower-right | Around 6–8 seconds |

The opening sequence moves A → B → C. The recording does not demonstrate an endless C → A loop. Default to a single entrance sequence that settles at C.

Implementation proposal:

- Keep the wordmark as an SVG/image and the labels as HTML links over a bounded relative stage.
- Store the three arrangements in `hero-states.ts`, with coordinates relative to the stage, not the viewport.
- Animate the existing five labels between states. Do not remount them, change their DOM order, or create duplicated interactive links.
- Use deterministic keyframes/transforms. Random drifting, physics simulation, logo distortion, and cursor-following behavior are not demonstrated.
- Keep timing in named configuration values. Exact easing cannot be recovered from the screenshots.
- Use a short, finite entrance sequence, then keep navigation stable. If longer or looping motion is chosen later, provide an accessible pause mechanism.
- Freeze movement during keyboard focus or pointer interaction so users can target links.
- For `prefers-reduced-motion`, render the final state immediately.
- On mobile, use a separate collision-free arrangement or stable label layout with readable text and useful touch targets.
- Absolute positioning is appropriate inside this bounded hero, not for laying out the entire site.
- Do not use the full walkthrough video as the hero background: its navigation would not be interactive.

CSS motion preference reference: [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion).

## 7. Works and the project template

### Works page

Use the shared header, a project grid, the yellow contact CTA, and the footer. The recording shows a three-image group, a large full-width image, and a later two-image group. Model this through project order and named placement values.

### Desktop project page

1. Shared header.
2. Two-column project section.
3. Full-width Next Project row with the yellow circular arrow.
4. Contact CTA and footer.

The left side contains project title, a dotted or fine leader to the displayed year, description paragraphs, and small discipline tags. The right side contains the ordered project media.

A starting proportion of roughly 42% text / 58% media, excluding the gutter, is appropriate for matching this reference; tune against the supplied composition.

Use a sticky text column inside the project section, with a top offset that clears the header. Let the media remain in normal document flow. End sticky behavior with the parent section so the text does not cover Next Project or the footer.

If a long description cannot fit in the viewport, let it scroll normally or otherwise keep all text reachable. Disable sticky positioning on narrow/mobile layouts, where text appears above the media. Avoid nested page-height scroll panels.

CSS positioning reference: [MDN position](https://developer.mozilla.org/en-US/docs/Web/CSS/position).

### Media structure

Use a controlled media stack: single image, two-image row, or video. Exported artwork/collages may remain one image. Text on the left remains real HTML.

This design does not require the generic text/quote/metrics block builder proposed in version 0.1. Only add new content types when a real case study needs them.

### Next Project

Compute the next eligible item from the published Works order. Never link to the current project or a draft/archived record. Proposed end-of-list behavior is an “All work” link to `/works`; keep this behavior in one helper.

### Copy issue in the sample

The IDEA description repeats the studio introduction. Treat that as placeholder copy, not an actual project description. The dashboard must support project-specific English content: client/context, work delivered, approach, and real outcomes where available. Do not invent outcomes.

## 8. Supabase model tailored to this design

Use Next.js App Router, TypeScript, Tailwind/CSS variables, Supabase Postgres, Supabase Auth, and Supabase Storage. Use server components for public content, with client components for the hero and interactive forms. A normal Next.js server deployment is required for the protected mutations and optional inquiry endpoint.

Four core tables are sufficient for the portfolio scope:

| Table | Purpose |
| --- | --- |
| `projects` | Project information, publication state, cover, and placements |
| `media_assets` | Uploaded files and their metadata |
| `project_media` | Ordered media rows for each project |
| `admin_memberships` | Administrator authorization |

An `inquiries` table is optional when the consultation flow includes a site-hosted form. It is operational data, not another editable public page.

### projects

| Field | Suggested type / rule |
| --- | --- |
| `id` | UUID primary key |
| `slug` | Unique normalized text |
| `title` | Required English display title |
| `project_year` | Integer; format as '24 in the UI if matching the reference |
| `client_name` | Optional; do not display unless needed |
| `description` | English text with paragraph breaks |
| `tags` | Text array, e.g. Branding and Exhibition |
| `card_meta` | Optional short card-side label where shown |
| `cover_asset_id` | Reference to this project's cover file |
| `status` | `draft`, `published`, or `archived` |
| `works_order` | Explicit ordering |
| `works_layout` | `third`, `half`, or `full` |
| `show_on_home` | Boolean |
| `home_order` | Independent selected-work ordering |
| `home_layout` | `third`, `half`, or `full` |
| `seo_title`, `seo_description` | Optional overrides |
| `published_at`, `created_at`, `updated_at` | Timezone-aware timestamps |
| `created_by` | Administrator identifier |

Use stable order tie-breakers such as ID. Validate layout values. Keep slug changes controlled after publication, with redirects if changes are allowed.

### media_assets

Store ID, project ID, bucket, object path, kind (image/video), MIME type, byte size, dimensions, default alt text, optional poster-asset reference, uploader, and timestamps.

Store file paths, not file bytes or expiring signed URLs. Keep original assets separate from display metadata. Validate cover, gallery, and poster references belong to the correct project.

### project_media

Store ID, project ID, position, layout (`single` or `pair`), primary asset ID, optional secondary asset ID, and optional caption/alt overrides.

Require a secondary image for a pair; single rows may contain an image or video. Do not allow arbitrary HTML embeds or unrestricted iframe URLs. If a provider video is needed later, add a validated provider-specific field.

For collages already supplied as one composed artwork, use a single image row rather than reconstructing the artwork from screenshots.

### admin_memberships

Store `user_id`, `active`, and timestamps. Start with one permission level and invited administrators only. No public signup or client-editable admin role.

### Data flow

One project record serves all public appearances:

- `/works`: published projects, ordered by `works_order`.
- Homepage: published projects with `show_on_home = true`, ordered by `home_order`.
- `/works/[slug]`: published project plus its ordered media.
- Dashboard: authorized access to drafts and published/archived projects.

There is no need to maintain three copies of the same project.

## 9. Dashboard and publication

### Dashboard sections

1. Projects list: title, status, cover, year, placement.
2. Basic information: title, slug, year, English description, tags.
3. Cover and media: uploads, previews, captions/alt text, reorder controls.
4. Website placement: show on home, home order/layout, Works order/layout.
5. Preview and publication controls.

Prefer clear move-up/down controls initially; drag-and-drop can be added if useful. The admin UI has not been designed in the supplied references, so keep it functional and simple.

### Publication sequence

1. Create a draft.
2. Upload originals to a private draft area.
3. Enter content and order media.
4. Preview with the actual project renderer behind authorization.
5. Validate required content, slug, cover, media ownership, and row order.
6. Prepare approved public delivery assets.
7. Commit project and media-row changes consistently in a database transaction.
8. Invalidate the Works page, project page, homepage when applicable, Next Project dependencies, metadata, and sitemap.

Storage operations and database commits are not one atomic operation. Preserve a recoverable unpublished state on failure and clean up unreferenced prepared files safely.

Public queries must read only published content using public access. Use separate authorized queries for the dashboard and previews. Keep preview responses out of shared caches.

RLS should protect every exposed application table. Child records follow project visibility. Public asset metadata should be limited to files referenced by published content, not unused draft uploads attached to a published project. Draft-bucket downloads remain administrator-only.

Normal admin mutations use the verified user session and RLS. Verify current administrator membership on each protected mutation. Privileged server credentials, if needed, stay in isolated server-only modules.

For existing published projects, use an explicit **Update live** commit. The initial model does not support saving an unfinished private revision while the previous version remains live; add revisions if that workflow is requested.

Archive removes the project from public pages. A previously published public asset can remain reachable by URL until it is removed and caches expire/purge. Do not describe archive as immediate revocation of public files.

Technical references: [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [SSR authentication](https://supabase.com/docs/guides/auth/server-side/creating-a-client?framework=nextjs), [Storage access](https://supabase.com/docs/guides/storage/buckets/fundamentals), [Next.js revalidation](https://nextjs.org/docs/app/api-reference/functions/revalidatePath).

## 10. Contact and consultation

Preserve the visual “LET'S CONNECT” CTA. The booking mode is still undecided.

| Chosen mode | Implementation |
| --- | --- |
| Consultation request | Short English form; validated server insertion into private inquiries; confirmation of a request |
| Immediate booking | Real provider booking link/embed with available slots |
| Request plus booking | Save a brief, then offer the scheduler |

Do not label a submitted request as a confirmed booking. If booking state is mirrored into Supabase, use authenticated provider events with deduplication, reschedule/cancellation handling, and timezone-aware timestamps. Do not rely on a browser thank-you event as proof.

For a site-hosted form, validate name, email, service interest, and brief. Company/budget/timeline can be optional. Keep inquiry reads private, prevent direct anonymous database writes that bypass the endpoint, and use persistent anti-spam/rate limits. Do not let notification failure lose a saved request.

The supplied references do not include a complete contact form design. Extend the black/cream/yellow system modestly and label that layout as a proposed addition.

## 11. Build sequence

| Stage | Deliverable |
| --- | --- |
| 1 | Project setup, tokens, shared header/footer, typed content fixtures |
| 2 | Hero states and accessible finite animation |
| 3 | Homepage and Works grid using fixtures |
| 4 | Project template using fixtures |
| 5 | Supabase schema, policies, storage, and typed reads |
| 6 | Project dashboard and publication flow |
| 7 | Contact/consultation integration |
| 8 | Visual comparison, access checks, and release preparation |

This order makes the design reviewable before database details are connected. Keep public components using a stable Project type so data can change from fixtures to Supabase without rebuilding the UI.

Suggested locations:

| Location | Responsibility |
| --- | --- |
| `src/app/(public)/` | Home, Works, project detail, connect |
| `src/app/admin/` | Sign-in and dashboard |
| `src/components/hero/` | AnimatedHero and navigation labels |
| `src/components/projects/` | Grid, cards, sidebar, media stack, Next Project |
| `src/components/site/` | Header, services, CTA, footer |
| `src/content/site.ts` | Static English copy, contact links, navigation |
| `src/content/hero-states.ts` | Motion states and timings |
| `src/lib/projects/` | Public/admin queries and publication services |
| `src/lib/supabase/` | Separate browser/session/public/privileged clients |
| `src/lib/validation/` | Shared field and media schemas |
| `supabase/migrations/` | Versioned schema and policies |
| `docs/taamworks-build-brief.md` | This document |

## 12. Cursor prompts

Copy this document into the repository as `docs/taamworks-build-brief.md`. Add the source references under `design-reference/` for inspection; do not ship the walkthrough video or screenshots as site artwork. Use one prompt at a time.

### Prompt 1 — Foundation and design rules

```text
Read docs/taamworks-build-brief.md version 0.2 and inspect this repository.
We are implementing the supplied TAAM Works portfolio, English only.

Set up a supported stable Next.js App Router application with TypeScript and
Tailwind/CSS variables, preserving any existing working setup. Record actual
dependency versions and use their current APIs.

Create the public routes /, /works, /works/[slug], and /connect, plus the admin
route area. About and Services are homepage anchors. Initiatives has no
confirmed destination; do not invent one.

Create shared tokens, header, footer, navigation config, static English copy,
and a typed Project/media model with clearly marked local fixtures.
Use the sampled palette in the brief until original tokens are available.

Create .cursor/rules/taamworks.mdc stating:
- Preserve supplied layouts and original branding.
- English interface/body copy; preserve lettering inside artwork.
- Homepage animation/copy are code-managed; portfolio content is data-driven.
- Three hero references are states of one hero.
- Do not fabricate project outcomes or copy inaccessible sources.
- Keep public and admin data access separate.
- Do not expose secrets or draft/private content.

Inspect supplied assets. List missing original wordmarks, fonts, and project
media. Use explicit temporary assets where necessary, not a guessed brand
logo presented as final. Do not crop production art out of small screenshots.
Implement this foundation stage and report the checks actually run.
```

### Prompt 2 — Implement the actual hero

```text
Implement AnimatedHero from image(2).png and the first 8 seconds of taam.mp4.
Follow the hero specification in docs/taamworks-build-brief.md.

Render one original cream TAAM wordmark with five HTML navigation labels:
About blue, Works red, Services pink, Contact yellow, Initiatives gray.

Create three deterministic arrangements matching states A, B, and C.
Animate the same labels through A -> B -> C, then settle. Keep coordinates
relative to a bounded hero stage and timings in a named configuration.
Do not build three stacked heroes, random floating particles, logo morphing,
physics, or a background video.

Use real links for known destinations, stable DOM/tab order, clear focus,
and stable targeting during pointer/keyboard interaction. Render a static
final state for reduced motion. Adapt mobile positions to prevent collisions
and preserve readable labels and touch targets.

Exclude Figma/browser chrome and editor background. Compare at least the
three settled states with the reference. Report remaining asset or visual
differences. Implement this stage only.
```

### Prompt 3 — Homepage and Works

```text
Implement the rest of the homepage and /works using the typed fixtures.

Homepage order:
hero, blue studio-name label with introduction, three selected project cards,
full-width featured project, four numbered service sections, LET TAAM WORK!,
yellow LET'S CONNECT button, footer.

Use the supplied black/cream visual system and the actual image proportions.
Build a shared six-column desktop ProjectGrid supporting third, half, and
full placements. Allow different home/Works order and placement.
Create responsive two-column and single-column fallbacks.

Service groups are 01 Design, 02 Tech, 03 Events, 04 Space & Objects.
Use static editable English copy and retain the provided hierarchy.
Record the shorter screenshot versus longer video service-copy difference.
Do not introduce accordions, filter bars, decorative card containers, or
new marketing claims absent from the brief.

Works uses the same project cards and shared footer. Every card opens its
project route. Wire About/Services anchors and the connect destination.
Verify page flow, spacing, image ratios, readable type, keyboard navigation,
and overflow at desktop and mobile sizes.
```

### Prompt 4 — The project template

```text
Implement /works/[slug] using image(3).png and taam.mp4 around 56–70 seconds.

Use one reusable template:
- Left: English title/year row, project description, small tags.
- Right: ordered media stack.
- Below the complete project section: NEXT PROJECT and yellow arrow,
  LET'S CONNECT, footer.

Keep the left description sticky within the gallery section on suitable
desktop viewports. Right-hand media stays in normal page flow. Let the text
release before the Next Project/footer area. Avoid independent scroll panels.
For mobile or descriptions taller than the viewport, keep all text reachable
with a normal-flow layout.

Support single images, image pairs, and video rows through the typed model.
Preserve artwork and natural ratios. The separate Arabic paragraph in the
mockup is omitted from English body copy; Arabic in artwork stays intact.
The sample studio introduction is placeholder project copy.

Compute the next eligible project from Works order, excluding the current
project; use All work at the end. Implement unknown-slug behavior, metadata,
alt text, loading/errors, and stable image dimensions.
Use fixtures for now. Verify the complete scroll and navigation behavior.
```

### Prompt 5 — Supabase and public data

```text
Implement the four core tables in version 0.2 of the brief:
projects, media_assets, project_media, admin_memberships.

Use versioned SQL migrations with constraints, foreign keys, timestamps,
indexes, grants, and RLS. Generate TypeScript database types.
Use projects.tags as a display text array; static services do not need a CMS.

Support explicit home/Works order and third/half/full placements, draft/
published/archived status, project-owned cover/gallery/poster references,
and validated single/pair media rows.

Create private draft storage and restricted uploads. Public reads expose only
published content and its referenced media metadata. No client may grant
itself admin membership. Ordinary signed-in users are not administrators.

Set up verified Supabase SSR authentication with the appropriate current
Next.js proxy/middleware convention. Keep public and session queries separate.

Replace fixtures with Supabase reads on home, Works, and project detail.
Keep the components unchanged. Add publication-aware metadata/sitemap and
a shared cache invalidation strategy for all affected views and Next Project.

Use local/development data. Verify anonymous, non-admin, and admin behavior,
including direct API attempts. Never claim migrations were applied if not run.
```

### Prompt 6 — Dashboard and project publishing

```text
Implement invited-admin access and the TAAM Works project dashboard.

Provide project listing, draft creation, English metadata/description/tags,
cover upload, ordered single/pair/video media rows, preview, home placement,
Works placement, Publish, Update live, and Archive.

Use the actual public template for protected previews. Keep the admin UI
functional; no dashboard design was supplied. Validate each server mutation,
check current active admin membership, and retain database/storage policies.

Prepare approved delivery media and commit project/media-row edits
consistently. Handle upload and publication failures without reporting false
success. Do not delete referenced assets. Keep uploaded draft material private.
Invalidate home, Works, project detail, neighboring Next Project links, and
sitemap after successful changes.

Save draft applies to unpublished projects. Published updates are explicit
Update live commits; unfinished saved revisions require the separate revision
feature and must not be silently implemented as edits to public rows.

Verify create -> upload -> reorder -> preview -> publish -> public appearance
-> update -> archive. Report real remaining setup.
```

### Prompt 7 — Connect and consultation

```text
Implement /connect as a modest extension of the supplied black/cream/yellow
design. Preserve LET'S CONNECT on the existing homepage/project buttons.

Read the selected contact mode from the brief/configuration. If no real
scheduler is configured, implement a consultation request flow and confirm
a request, not a booked meeting. Do not simulate availability.

For a site-hosted form, validate name, email, service interest, and brief.
Save inquiries privately through a validated server endpoint with persistent
rate limits and the chosen anti-spam mechanism. Deny anonymous direct writes
that bypass that endpoint. Optional notifications must not lose saved leads.

For immediate booking, integrate the real configured provider link/embed
using current official documentation. If syncing bookings into Supabase,
verify provider events, deduplicate retries, and handle approval state,
cancellation, rescheduling, and timezones.

Do not request secret credentials in chat or expose them in browser code.
State which external configuration remains necessary.
```

### Prompt 8 — Review and release preparation

```text
Review the implementation against the four supplied screenshots, the video,
and docs/taamworks-build-brief.md version 0.2.

Check:
- One hero with three correct arrangements, usable navigation, and reduced motion.
- Homepage section order, image proportions, palette, and service layout.
- English interface/body copy with original artwork preserved.
- Works placement and shared project records across all public views.
- Bounded sticky project description, normal mobile flow, and Next Project.
- Draft/public/admin boundaries, direct API attempts, and private inquiry data.
- Upload failures, publication commits, media references, and cache freshness.
- Contact requests versus real booking confirmations.
- Accessible focus, headings, alt text, image stability, and keyboard use.
- Type checks and production build.

Compare rendered pages at matching reference sizes when possible, then check
360/390, 768, 1024, and 1440 widths as practical responsive test targets.
Fix observed failures; report unavailable visual verification honestly.

Create a release README covering environment variable names, migrations,
initial admin, Supabase redirect URLs, media storage, contact configuration,
and deployment steps. Use placeholders for secrets.

Prepare a preview release. Do not alter an existing production domain unless
requested. Report actual checks and remaining blockers, not assumed success.
```

## 13. Remaining inputs

Useful for implementation accuracy, without blocking the architecture:

1. Original TAAM wordmark and small taamworks logo, preferably SVG.
2. Font family names and licensed webfont files where applicable.
3. Original project covers and ordered project media.
4. Actual English project descriptions and confirmed service copy.
5. The destination/content of the Initiatives navigation label.
6. Contact mode: request, immediate booking, or both.

Mobile layouts are proposed adaptations until authored frames are supplied.
The reviewed references are sufficient to begin the frontend structure and
fixture-based project template now.
