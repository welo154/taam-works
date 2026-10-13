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
 * Stable public project shape. Fixtures today; Supabase reads later
 * should map into this type without rebuilding UI components.
 */
export type Project = {
  id: string;
  slug: string;
  title: string;
  projectYear: number;
  description: string;
  tags: string[];
  cardMeta?: string;
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
