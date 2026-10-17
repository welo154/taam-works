import { getPublicSupabaseUrl } from "@/lib/backend/env";
import type {
  PublicMediaAssetDto,
  PublicMediaRowDto,
  PublicProjectCardDto,
  PublicProjectDetailDto,
} from "@/lib/projects/api-types";
import type { MediaAsset, Project, ProjectMediaRow } from "@/lib/projects/types";

const FALLBACK_COVER: MediaAsset = {
  id: "cover-pending",
  kind: "image",
  src: "/placeholders/cover-featured.svg",
  alt: "Project cover forthcoming",
  width: 1600,
  height: 1000,
};

export function resolvePublicMediaUrl(src: string | null | undefined): string {
  if (!src) return "";
  if (/^(https?:\/\/|data:|blob:|\/placeholders\/|\/work\/)/i.test(src)) {
    return src;
  }
  const base = getPublicSupabaseUrl();
  if (!base) return src;
  if (src.startsWith("/")) return `${base}${src}`;
  return `${base}/${src}`;
}

function mapAsset(asset: PublicMediaAssetDto): MediaAsset {
  return {
    id: asset.id,
    kind: asset.kind,
    src: resolvePublicMediaUrl(asset.src),
    alt: asset.alt,
    width: asset.width || 1600,
    height: asset.height || 1000,
    posterSrc: asset.posterSrc
      ? resolvePublicMediaUrl(asset.posterSrc)
      : undefined,
  };
}

function mapMedia(rows: PublicMediaRowDto[] | undefined): ProjectMediaRow[] {
  return (rows ?? []).map((row) => {
    if (row.layout === "pair") {
      return {
        id: row.id,
        layout: "pair",
        primary: mapAsset(row.primary),
        secondary: mapAsset(row.secondary),
        caption: row.caption ?? undefined,
      };
    }
    return {
      id: row.id,
      layout: "single",
      primary: mapAsset(row.primary),
      caption: row.caption ?? undefined,
    };
  });
}

function homeLabels(title: string, cardMeta?: string | null, year?: number | null) {
  const labels = [title.toUpperCase()];
  if (cardMeta) labels.push(cardMeta);
  else if (year) labels.push(String(year));
  return labels;
}

function toProjectBase(
  dto: PublicProjectCardDto | PublicProjectDetailDto,
  media: ProjectMediaRow[],
): Project {
  return {
    id: dto.id,
    slug: dto.slug,
    title: dto.title,
    projectYear: dto.projectYear,
    description: dto.description ?? "",
    tags: dto.tags ?? [],
    cardMeta: dto.cardMeta ?? undefined,
    homeLabels: homeLabels(dto.title, dto.cardMeta, dto.projectYear),
    status: dto.status,
    cover: dto.cover ? mapAsset(dto.cover) : FALLBACK_COVER,
    media,
    worksOrder: dto.worksOrder,
    worksLayout: dto.worksLayout,
    showOnHome: dto.showOnHome,
    homeOrder: dto.homeOrder,
    homeLayout: dto.homeLayout,
    seoTitle: "seoTitle" in dto ? (dto.seoTitle ?? undefined) : undefined,
    seoDescription:
      "seoDescription" in dto ? (dto.seoDescription ?? undefined) : undefined,
  };
}

export function mapCardToProject(dto: PublicProjectCardDto): Project {
  return toProjectBase(dto, []);
}

export function mapDetailToProject(dto: PublicProjectDetailDto): Project {
  return toProjectBase(dto, mapMedia(dto.media));
}
