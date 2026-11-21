import { db, publicMediaUrl, SupabaseError } from "@/lib/supabase/rest";
import type {
  CardHeight,
  MediaAsset,
  MediaKind,
  Project,
  ProjectLayout,
  ProjectMediaRow,
  ProjectStatus,
} from "@/lib/projects/types";

const CARD_HEIGHTS: CardHeight[] = ["short", "medium", "tall"];

function asCardHeight(value: string | null | undefined): CardHeight {
  return CARD_HEIGHTS.includes(value as CardHeight)
    ? (value as CardHeight)
    : "medium";
}

export type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  title_ar?: string;
  project_year: number | null;
  description: string;
  description_ar?: string;
  tags: string[];
  card_meta: string | null;
  cover_asset_id: string | null;
  status: ProjectStatus;
  works_order: number;
  works_layout: ProjectLayout;
  show_on_home: boolean;
  home_order: number;
  home_layout: ProjectLayout;
  seo_title: string | null;
  seo_description: string | null;
  coming_soon?: boolean;
  card_height?: string | null;
  updated_at: string;
};

export type AssetRow = {
  id: string;
  project_id: string;
  bucket: string;
  object_path: string;
  kind: MediaKind;
  mime_type: string;
  byte_size: number;
  width: number | null;
  height: number | null;
  alt_text: string;
  poster_asset_id: string | null;
};

export type MediaRowRow = {
  id: string;
  project_id: string;
  position: number;
  layout: "single" | "pair";
  primary_asset_id: string;
  secondary_asset_id: string | null;
  caption: string | null;
};

export type LoadedProject = {
  row: ProjectRow;
  assets: Map<string, AssetRow>;
  rows: MediaRowRow[];
};

let migrationProbe: { at: number; applied: boolean } | null = null;
let comingSoonProbe: { at: number; applied: boolean } | null = null;
let cardHeightProbe: { at: number; applied: boolean } | null = null;

/** True once supabase/migrations/20261113000001_bilingual_wide.sql has run. */
export async function migrationApplied(): Promise<boolean> {
  const now = Date.now();
  if (migrationProbe && (migrationProbe.applied || now - migrationProbe.at < 30_000)) {
    return migrationProbe.applied;
  }
  let applied = true;
  try {
    await db("projects?select=title_ar&limit=1");
  } catch (error) {
    if (error instanceof SupabaseError && error.status === 400) applied = false;
    else throw error;
  }
  migrationProbe = { at: now, applied };
  return applied;
}

/** True once supabase/migrations/20261119000001_coming_soon.sql has run. */
export async function comingSoonColumnApplied(): Promise<boolean> {
  const now = Date.now();
  if (
    comingSoonProbe &&
    (comingSoonProbe.applied || now - comingSoonProbe.at < 30_000)
  ) {
    return comingSoonProbe.applied;
  }
  let applied = true;
  try {
    await db("projects?select=coming_soon&limit=1");
  } catch (error) {
    if (error instanceof SupabaseError && error.status === 400) applied = false;
    else throw error;
  }
  comingSoonProbe = { at: now, applied };
  return applied;
}

/** True once supabase/migrations/20261121000001_card_height.sql has run. */
export async function cardHeightColumnApplied(): Promise<boolean> {
  const now = Date.now();
  if (
    cardHeightProbe &&
    (cardHeightProbe.applied || now - cardHeightProbe.at < 30_000)
  ) {
    return cardHeightProbe.applied;
  }
  let applied = true;
  try {
    await db("projects?select=card_height&limit=1");
  } catch (error) {
    if (error instanceof SupabaseError && error.status === 400) applied = false;
    else throw error;
  }
  cardHeightProbe = { at: now, applied };
  return applied;
}

function inList(ids: string[]) {
  return `in.(${ids.map((id) => `"${id}"`).join(",")})`;
}

/** Load projects matching a PostgREST filter, with their assets and stack. */
export async function loadProjects(filter: string): Promise<LoadedProject[]> {
  const projects = await db<ProjectRow[]>(`projects?select=*&${filter}`);
  if (projects.length === 0) return [];
  const ids = inList(projects.map((project) => project.id));
  const [assets, rows] = await Promise.all([
    db<AssetRow[]>(`media_assets?select=*&project_id=${ids}`),
    db<MediaRowRow[]>(`project_media?select=*&project_id=${ids}&order=position.asc`),
  ]);
  return projects.map((row) => ({
    row,
    assets: new Map(
      assets.filter((asset) => asset.project_id === row.id).map((a) => [a.id, a]),
    ),
    rows: rows.filter((item) => item.project_id === row.id),
  }));
}

export function assetToMedia(
  asset: AssetRow,
  all: Map<string, AssetRow>,
): MediaAsset {
  const poster = asset.poster_asset_id ? all.get(asset.poster_asset_id) : null;
  return {
    id: asset.id,
    kind: asset.kind,
    src: publicMediaUrl(asset.object_path, asset.bucket),
    alt: asset.alt_text,
    width: asset.width || 1600,
    height: asset.height || 1000,
    posterSrc: poster ? publicMediaUrl(poster.object_path, poster.bucket) : undefined,
  };
}

const FALLBACK_COVER: MediaAsset = {
  id: "cover-pending",
  kind: "image",
  src: "/placeholders/cover-featured.svg",
  alt: "Project cover forthcoming",
  width: 1600,
  height: 1000,
};

export function toProject({ row, assets, rows }: LoadedProject): Project {
  const coverRow = row.cover_asset_id ? assets.get(row.cover_asset_id) : null;
  const media: ProjectMediaRow[] = [];
  for (const item of rows) {
    const primary = assets.get(item.primary_asset_id);
    if (!primary) continue;
    const secondary = item.secondary_asset_id
      ? assets.get(item.secondary_asset_id)
      : null;
    if (item.layout === "pair" && secondary) {
      media.push({
        id: item.id,
        layout: "pair",
        primary: assetToMedia(primary, assets),
        secondary: assetToMedia(secondary, assets),
        caption: item.caption ?? undefined,
      });
    } else {
      media.push({
        id: item.id,
        layout: "single",
        primary: assetToMedia(primary, assets),
        caption: item.caption ?? undefined,
      });
    }
  }
  const labels = [row.title.toUpperCase()];
  // "EVENT, MALAYSIA, 2025" becomes three labels spread across the card.
  const meta = (row.card_meta ?? "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  if (meta.length > 0) labels.push(...meta);
  else if (row.project_year) labels.push(String(row.project_year));

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    titleAr: row.title_ar ?? "",
    descriptionAr: row.description_ar ?? "",
    projectYear: row.project_year,
    description: row.description ?? "",
    tags: row.tags ?? [],
    cardMeta: row.card_meta ?? undefined,
    homeLabels: labels,
    status: row.status,
    comingSoon: Boolean(row.coming_soon),
    cover: coverRow ? assetToMedia(coverRow, assets) : FALLBACK_COVER,
    media,
    worksOrder: row.works_order,
    worksLayout: row.works_layout,
    cardHeight: asCardHeight(row.card_height),
    showOnHome: row.show_on_home,
    homeOrder: row.home_order,
    homeLayout: row.home_layout,
    updatedAt: row.updated_at,
    seoTitle: row.seo_title ?? undefined,
    seoDescription: row.seo_description ?? undefined,
  };
}

export async function listPublished(placement: "home" | "works") {
  const filter =
    placement === "home"
      ? "status=eq.published&show_on_home=eq.true&order=home_order.asc,created_at.asc"
      : "status=eq.published&order=works_order.asc,created_at.asc";
  return (await loadProjects(filter)).filter(isReal).map(toProject);
}

/**
 * The original database seed left sample rows pointing at seed/ files
 * that were never uploaded. They stay in the dashboard but not on the site.
 */
function isReal({ row, assets }: LoadedProject) {
  const cover = row.cover_asset_id ? assets.get(row.cover_asset_id) : null;
  return !cover?.object_path.startsWith("seed/");
}

export async function getPublishedBySlug(slug: string) {
  const [loaded] = await loadProjects(
    `status=eq.published&slug=eq.${encodeURIComponent(slug)}&limit=1`,
  );
  if (!loaded || !isReal(loaded)) return null;
  const sequence = await db<{ slug: string; title: string }[]>(
    "projects?select=slug,title&status=eq.published&order=works_order.asc,created_at.asc",
  );
  const index = sequence.findIndex((item) => item.slug === slug);
  return {
    project: toProject(loaded),
    next: index === -1 ? null : (sequence[index + 1] ?? null),
  };
}
