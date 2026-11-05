import { NextResponse, type NextRequest } from "next/server";

function comingSoonEnabled() {
  const flag = process.env.NEXT_PUBLIC_COMING_SOON;
  if (flag === "1" || flag === "true") return true;
  if (flag === "0" || flag === "false") return false;
  return process.env.VERCEL_ENV === "production";
}

export function middleware(request: NextRequest) {
  if (!comingSoonEnabled()) return NextResponse.next();

  const { pathname } = request.nextUrl;
  if (
    pathname === "/" ||
    pathname.startsWith("/admin") ||
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
