import { createHash, timingSafeEqual } from "node:crypto";

/**
 * HTTP Basic auth for the studio dashboard.
 * Set ADMIN_USER and ADMIN_PASSWORD. Without them the dashboard is closed,
 * except under `next dev` so local work keeps running.
 */

export const ADMIN_REALM = "TAAM Works admin";

function digest(value: string) {
  return createHash("sha256").update(value).digest();
}

function safeEqual(a: string, b: string) {
  return timingSafeEqual(digest(a), digest(b));
}

function credentials() {
  const user = process.env.ADMIN_USER ?? "";
  const password = process.env.ADMIN_PASSWORD ?? "";
  if (!user || !password) return null;
  return { user, password };
}

export function isAdminAuthorized(authorization: string | null): boolean {
  const expected = credentials();
  if (!expected) return process.env.NODE_ENV === "development";

  if (!authorization?.startsWith("Basic ")) return false;
  let decoded: string;
  try {
    decoded = Buffer.from(authorization.slice(6), "base64").toString("utf8");
  } catch {
    return false;
  }
  const split = decoded.indexOf(":");
  if (split === -1) return false;
  const userOk = safeEqual(decoded.slice(0, split), expected.user);
  const passwordOk = safeEqual(decoded.slice(split + 1), expected.password);
  return userOk && passwordOk;
}
