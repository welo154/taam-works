import type { MediaKind, ProjectLayout, ProjectStatus } from "@/lib/projects/types";

export type PublicMediaAssetDto = {
  id: string;
  kind: MediaKind;
  src: string;
  alt: string;
  width: number;
  height: number;
  posterSrc?: string | null;
};

export type PublicMediaRowDto =
  | {
      id: string;
      layout: "single";
      primary: PublicMediaAssetDto;
      caption?: string | null;
    }
  | {
      id: string;
      layout: "pair";
      primary: PublicMediaAssetDto;
      secondary: PublicMediaAssetDto;
      caption?: string | null;
    };

export type PublicProjectCardDto = {
  id: string;
  slug: string;
  title: string;
  projectYear: number | null;
  description: string;
  tags: string[];
  cardMeta?: string | null;
  status: ProjectStatus;
  cover: PublicMediaAssetDto | null;
  worksOrder: number;
  worksLayout: ProjectLayout;
  showOnHome: boolean;
  homeOrder: number;
  homeLayout: ProjectLayout;
  layout: ProjectLayout;
};

export type PublicProjectDetailDto = Omit<PublicProjectCardDto, "layout"> & {
  media: PublicMediaRowDto[];
  seoTitle?: string | null;
  seoDescription?: string | null;
};

export type NextProjectDto = { slug: string; title: string } | null;

export type PaginationMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};
