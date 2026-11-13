import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_REALM, isAdminAuthorized } from "@/lib/admin-auth";
import { isComingSoon } from "@/lib/coming-soon";

function adminChallenge() {
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${ADMIN_REALM}", charset="UTF-8"`,
      "Cache-Control": "no-store",
    },
  });
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (!isAdminAuthorized(request.headers.get("authorization"))) {
      return adminChallenge();
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
