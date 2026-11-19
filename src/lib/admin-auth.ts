import { createHash, createHmac, timingSafeEqual } from "node:crypto";

/**
 * Dashboard sign-in. One shared login (ADMIN_USER / ADMIN_PASSWORD) checked on
 * the sign-in page; after that a signed, http-only session cookie is used.
 * Without both values the dashboard is closed, except under `next dev` so
 * local work keeps running.
 */

export const SESSION_COOKIE = "taam_admin";
export const SESSION_DAYS = 7;

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

/** True when no login is configured and we are running locally. */
export function adminOpenInDev() {
  return !credentials() && process.env.NODE_ENV === "development";
}

export function adminConfigured() {
  return Boolean(credentials());
}

export function checkCredentials(user: string, password: string): boolean {
  const expected = credentials();
  if (!expected) return false;
  const userOk = safeEqual(user, expected.user);
  const passwordOk = safeEqual(password, expected.password);
  return userOk && passwordOk;
}

// The signing key changes whenever the login changes, which signs everyone out.
function sign(payload: string, expected: { user: string; password: string }) {
  const key = digest(`${expected.user}\n${expected.password}\ntaam-admin-session`);
  return createHmac("sha256", key).update(payload).digest("base64url");
}

export function createSessionToken(): string | null {
  const expected = credentials();
  if (!expected) return null;
  const expires = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = `v1.${expires}`;
  return `${payload}.${sign(payload, expected)}`;
}

export function isValidSession(token: string | null | undefined): boolean {
  if (adminOpenInDev()) return true;
  const expected = credentials();
  if (!expected || !token) return false;
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "v1") return false;
  const expires = Number(parts[1]);
  if (!Number.isFinite(expires) || expires < Date.now()) return false;
  return safeEqual(parts[2], sign(`v1.${parts[1]}`, expected));
}
