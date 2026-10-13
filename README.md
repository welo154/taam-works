# TAAM Works

English-only studio portfolio (Next.js App Router). Frontend Stages 1–4 use typed local fixtures. Supabase, admin, and consultation follow later.

## Design sources

- Figma: https://www.figma.com/design/5bLFt80FrBMHNTd7s1Zu6B/TaamWorks?node-id=0-1&p=f&m=dev
- Brief: `docs/taamworks-build-brief.md`
- Missing originals: `docs/missing-assets.md`
- Walkthrough (inspection only): `design-reference/taam.mp4`

## Stack

See `docs/versions.md` for recorded package versions (Next 16, React 19, Tailwind 4, TypeScript 5).

## Develop

```bash
npm install
npm run dev
```

Routes: `/`, `/works`, `/works/[slug]`, `/connect`, `/admin` (stub).

## Notes

- Brand SVGs and project images under `public/` are **TEMPORARY** placeholders.
- About → `/#about`, Services → `/#services`. Initiatives is a non-navigating label until a destination exists.
