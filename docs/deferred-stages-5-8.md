# Deferred stages (Prompts 5–8)

Intentionally **not implemented** in the fixture frontend workstream. Resume after Stages 1–4 (and ideally the Figma pass) are reviewable.

| Stage | Prompt | Deliverable |
| --- | --- | --- |
| 5 | Supabase and public data | Tables, RLS, storage, typed reads replacing fixtures |
| 6 | Dashboard and publishing | Admin auth, project CRUD, preview, publish/archive |
| 7 | Connect and consultation | Real `/connect` flow per chosen booking mode |
| 8 | Review and release | Visual QA, access checks, release README, preview deploy |

Public components already consume the stable `Project` type in `src/lib/projects/types.ts` so Stage 5 can swap the query layer without rebuilding UI.
