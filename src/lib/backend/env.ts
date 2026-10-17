const DEFAULT_API_URL = "http://localhost:3100";

export function getBackendApiUrl() {
  return (process.env.TAAM_API_URL ?? DEFAULT_API_URL).replace(/\/$/, "");
}

export function getPublicSupabaseUrl() {
  return (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");
}

export function getAdminDashboardUrl() {
  return (
    process.env.TAAM_ADMIN_URL ?? `${getBackendApiUrl()}/admin`
  ).replace(/\/$/, "");
}
