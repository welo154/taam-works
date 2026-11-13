export type NextProjectDto = { slug: string; title: string } | null;

export type NextProjectResult =
  | { kind: "project"; slug: string; title: string }
  | { kind: "all-work" };

export function toNextProject(next: NextProjectDto): NextProjectResult {
  if (!next) return { kind: "all-work" };
  return { kind: "project", slug: next.slug, title: next.title };
}
