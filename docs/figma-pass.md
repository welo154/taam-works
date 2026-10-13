# Figma pass checklist

**File:** https://www.figma.com/design/5bLFt80FrBMHNTd7s1Zu6B/TaamWorks?node-id=0-1&p=f&m=dev

Stages 1–4 shipped with brief-sampled tokens and TEMPORARY assets. This pass is blocked on Dev Mode access / exports in the local environment (public fetch only returns the file title).

## When exports are available

1. Replace `public/brand/*-temporary.svg` with original wordmark and small mark.
2. Add licensed webfonts; remove Syne temporary body font from `src/app/layout.tsx`.
3. Update CSS variables in `src/app/globals.css` from Figma color/type/spacing styles.
4. Refine `src/content/hero-states.ts` coordinates against hero frames.
5. Swap `public/placeholders/*` for production covers and gallery media; update fixtures or Supabase.
6. Compare `/`, `/works`, and `/works/[slug]` at 360 / 390 / 768 / 1024 / 1440 against Figma frames.

## Conflict rule

- Figma wins on visual detail.
- `docs/taamworks-build-brief.md` wins on architecture, English-only rules, and staging order.

## Status (this session)

- [x] Document Figma URL in rules and missing-assets
- [x] Token-driven structure ready for refinement
- [ ] Dev Mode measurements applied (needs access/exports)
- [ ] Original brand assets installed
- [ ] Pixel comparison at reference widths
