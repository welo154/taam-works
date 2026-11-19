"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  adminConfigured,
  checkCredentials,
  createSessionToken,
  SESSION_COOKIE,
  SESSION_DAYS,
} from "@/lib/admin-auth";

export type SignInState = { error: string } | null;

const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 6;
// Best effort per server instance: slows down password guessing.
const attempts = new Map<string, number[]>();

function tooMany(ip: string) {
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter((at) => now - at < WINDOW_MS);
  attempts.set(ip, recent);
  return recent.length >= MAX_ATTEMPTS;
}

function recordFailure(ip: string) {
  attempts.set(ip, [...(attempts.get(ip) ?? []), Date.now()]);
}

export async function signIn(
  _previous: SignInState,
  formData: FormData,
): Promise<SignInState> {
  if (!adminConfigured()) {
    return {
      error:
        "No dashboard login is set up yet. Add ADMIN_USER and ADMIN_PASSWORD, then redeploy.",
    };
  }
  const requestHeaders = await headers();
  const ip =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    "unknown";
  if (tooMany(ip)) {
    return { error: "Too many attempts. Please wait ten minutes and try again." };
  }

  const user = String(formData.get("user") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!checkCredentials(user, password)) {
    recordFailure(ip);
    return { error: "That username or password is not right." };
  }

  const token = createSessionToken();
  if (!token) return { error: "Could not start a session. Try again." };
  attempts.delete(ip);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });

  const next = String(formData.get("next") ?? "");
  redirect(next.startsWith("/admin/") && !next.startsWith("/admin/login") ? next : "/admin");
}

export async function signOut() {
  const store = await cookies();
  store.set(SESSION_COOKIE, "", { path: "/admin", maxAge: 0 });
  redirect("/admin/login");
}
