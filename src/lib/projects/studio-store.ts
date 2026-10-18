import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fixtureProjects } from "@/content/fixtures/projects";

export type StudioAsset = {
  kind: "image" | "video";
  src: string;
  alt: string;
  width: number;
  height: number;
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

type StoreFile = { projects: StudioProject[] };

const storePath = path.join(process.cwd(), "data", "studio-projects.json");

function emptyStore(): StoreFile {
  return { projects: [] };
}

export async function readStudioProjects(): Promise<StudioProject[]> {
  try {
    const raw = await readFile(storePath, "utf8");
    const parsed = JSON.parse(raw) as StoreFile;
    return Array.isArray(parsed.projects) ? parsed.projects : [];
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return [];
    }
    throw error;
  }
}

export async function writeStudioProjects(projects: StudioProject[]) {
  await mkdir(path.dirname(storePath), { recursive: true });
  const temporary = `${storePath}.${randomUUID()}.tmp`;
  await writeFile(
    temporary,
    JSON.stringify({ projects } satisfies StoreFile, null, 2),
    "utf8",
  );
  await rename(temporary, storePath);
}

export async function getStudioProject(slug: string) {
  const projects = await readStudioProjects();
  return projects.find((project) => project.slug === slug) ?? null;
}

export function fixtureSlugs() {
  return new Set(fixtureProjects.map((project) => project.slug));
}

export async function nextOrders() {
  const projects = await readStudioProjects();
  const worksOrders = [
    ...fixtureProjects.map((project) => project.worksOrder),
    ...projects.map((project) => project.worksOrder),
  ];
  const homeOrders = [
    ...fixtureProjects.map((project) => project.homeOrder),
    ...projects.map((project) => project.homeOrder),
  ];
  return {
    worksOrder: Math.max(0, ...worksOrders) + 1,
    homeOrder: Math.max(0, ...homeOrders) + 1,
  };
}

export async function listWorksSequence() {
  const studio = await readStudioProjects();
  const items = new Map<
    string,
    { slug: string; title: string; order: number }
  >();
  for (const project of fixtureProjects) {
    if (project.status !== "published") continue;
    items.set(project.slug, {
      slug: project.slug,
      title: project.title,
      order: project.worksOrder,
    });
  }
  for (const project of studio) {
    if (items.has(project.slug)) continue;
    items.set(project.slug, {
      slug: project.slug,
      title: project.titleEn,
      order: project.worksOrder,
    });
  }
  return [...items.values()].sort(
    (a, b) => a.order - b.order || a.slug.localeCompare(b.slug),
  );
}

export async function nextProjectAfter(slug: string) {
  const sequence = await listWorksSequence();
  const index = sequence.findIndex((item) => item.slug === slug);
  if (index === -1) return null;
  return sequence[index + 1] ?? null;
}
