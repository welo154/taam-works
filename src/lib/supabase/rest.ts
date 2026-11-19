/**
 * Minimal server-side Supabase client over fetch. Uses the secret key, so it
 * bypasses RLS: never import this from a client component.
 */

export const MEDIA_BUCKET = "public-media";

export class SupabaseError extends Error {
  status: number;
  code?: string;
  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "SupabaseError";
    this.status = status;
    this.code = code;
  }
}

export function supabaseUrl() {
  return (
    process.env.SUPABASE_URL ??
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    ""
  ).replace(/\/$/, "");
}

export function supabaseConfigured() {
  return Boolean(supabaseUrl() && process.env.SUPABASE_SECRET_KEY);
}

function authHeaders(): Record<string, string> {
  const key = process.env.SUPABASE_SECRET_KEY ?? "";
  return { apikey: key, Authorization: `Bearer ${key}` };
}

async function request<T>(url: string, init: RequestInit): Promise<T> {
  if (!supabaseConfigured()) {
    throw new SupabaseError("Supabase is not configured.", 503, "not_configured");
  }
  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      headers: {
        ...authHeaders(),
        "Content-Type": "application/json",
        ...init.headers,
      },
      cache: "no-store",
    });
  } catch {
    throw new SupabaseError("The database is unreachable.", 503, "unreachable");
  }
  const text = await response.text();
  let json: unknown = null;
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      json = null;
    }
  }
  if (!response.ok) {
    const body = (json ?? {}) as { message?: string; error?: string; code?: string };
    throw new SupabaseError(
      body.message ?? body.error ?? `Supabase request failed (${response.status}).`,
      response.status,
      body.code,
    );
  }
  return json as T;
}

/** PostgREST: `db("projects?select=*")`. */
export function db<T>(path: string, init: RequestInit = {}) {
  return request<T>(`${supabaseUrl()}/rest/v1/${path}`, init);
}

export function dbInsert<T>(table: string, rows: object | object[]) {
  return db<T[]>(table, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(rows),
  });
}

export function dbUpdate<T>(tableAndFilter: string, patch: object) {
  return db<T[]>(tableAndFilter, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(patch),
  });
}

export function dbDelete(tableAndFilter: string) {
  return db<null>(tableAndFilter, { method: "DELETE" });
}

export function rpc<T>(name: string, args: object) {
  return db<T>(`rpc/${name}`, { method: "POST", body: JSON.stringify(args) });
}

export function publicMediaUrl(path: string, bucket = MEDIA_BUCKET) {
  return `${supabaseUrl()}/storage/v1/object/public/${bucket}/${path}`;
}

/** A one-time URL the browser can PUT a file to, straight into Storage. */
export async function createSignedUpload(path: string) {
  const result = await request<{ url: string }>(
    `${supabaseUrl()}/storage/v1/object/upload/sign/${MEDIA_BUCKET}/${path}`,
    { method: "POST", body: "{}" },
  );
  return `${supabaseUrl()}/storage/v1${result.url}`;
}

export async function removeStorageObjects(paths: string[]) {
  if (paths.length === 0) return;
  await request<unknown>(`${supabaseUrl()}/storage/v1/object/${MEDIA_BUCKET}`, {
    method: "DELETE",
    body: JSON.stringify({ prefixes: paths }),
  });
}
