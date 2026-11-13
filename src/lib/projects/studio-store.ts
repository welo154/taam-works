/** Shapes the IDEA-style project page (ProjectCase) renders. */

export type StudioAsset = {
  kind: "image" | "video";
  src: string;
  alt: string;
  width: number;
  height: number;
  posterSrc?: string;
};

export type StudioRow =
  | { id: string; layout: "single"; asset: StudioAsset }
  | { id: string; layout: "pair"; left: StudioAsset; right: StudioAsset };

export type StudioProject = {
  id: string;
  slug: string;
  titleEn: string;
  titleAr: string;
  year: number;
  descriptionEn: string;
  descriptionAr: string;
  tags: string[];
  cover: StudioAsset;
  rows: StudioRow[];
  showOnHome: boolean;
  worksOrder: number;
  homeOrder: number;
  createdAt: string;
};
