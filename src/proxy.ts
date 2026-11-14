import { NextResponse, type NextRequest } from "next/server";
import { isValidSession, SESSION_COOKIE } from "@/lib/admin-auth";
import { isComingSoon } from "@/lib/coming-soon";

const LOGIN_PATH = "/admin/login";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const signedIn = isValidSession(request.cookies.get(SESSION_COOKIE)?.value);
    const onLogin = pathname === LOGIN_PATH;

    if (!signedIn && !onLogin) {
      const url = request.nextUrl.clone();
      url.pathname = LOGIN_PATH;
      url.search = "";
      if (request.method === "GET" && pathname !== "/admin") {
        url.searchParams.set("next", pathname);
      }
      return NextResponse.redirect(url);
    }
    if (signedIn && onLogin && request.method === "GET") {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      url.search = "";
      return NextResponse.redirect(url);
    }
    const response = NextResponse.next();
    response.headers.set("Cache-Control", "no-store");
    return response;
  }

  if (!isComingSoon()) return NextResponse.next();

  if (
    pathname === "/" ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
