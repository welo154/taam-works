import { cookies } from "next/headers";
import { isValidSession, SESSION_COOKIE } from "@/lib/admin-auth";

/**
 * Every dashboard Server Action and page calls this: actions are reachable by
 * direct POST, so the proxy check on /admin is not enough on its own.
 */
export async function isAdmin() {
  const store = await cookies();
  return isValidSession(store.get(SESSION_COOKIE)?.value);
}
