export type ProjectLayout = "third" | "half" | "full";

export type MediaKind = "image" | "video";

export type MediaAsset = {
  id: string;
  kind: MediaKind;
  src: string;
  alt: string;
  width: number;
  height: number;
  posterSrc?: string;
};

export type ProjectMediaRow =
  | {
      id: string;
      layout: "single";
      primary: MediaAsset;
      caption?: string;
    }
  | {
      id: string;
      layout: "pair";
      primary: MediaAsset;
      secondary: MediaAsset;
      caption?: string;
    };

export type ProjectStatus = "draft" | "published" | "archived";

/**
 * Stable public project shape. Published records come from the
 * admin-backed API; UI components should keep using this type.
 */
export type Project = {
  id: string;
  slug: string;
  title: string;
  projectYear: number | null;
  description: string;
  tags: string[];
  cardMeta?: string;
  /** Caption chips above a home/works card, matching Figma metadata rows. */
  homeLabels?: string[];
  status: ProjectStatus;
  cover: MediaAsset;
  media: ProjectMediaRow[];
  worksOrder: number;
  worksLayout: ProjectLayout;
  showOnHome: boolean;
  homeOrder: number;
  homeLayout: ProjectLayout;
  seoTitle?: string;
  seoDescription?: string;
};

export type ProjectCardPlacement = {
  project: Project;
  layout: ProjectLayout;
};
