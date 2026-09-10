import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session-cookie";

const publicApiPrefixes = ["/api/v1/auth/login", "/api/v1/reference-data"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (publicApiPrefixes.some((prefix) => pathname.startsWith(prefix)))
    return NextResponse.next();
  const needsAuth =
    pathname.startsWith("/dashboard") || pathname.startsWith("/api/");
  if (!needsAuth || request.cookies.get(SESSION_COOKIE_NAME)?.value)
    return NextResponse.next();
  if (pathname.startsWith("/api/"))
    return NextResponse.json(
      { error: { code: "UNAUTHENTICATED", message: "Login required" } },
      { status: 401 },
    );
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = { matcher: ["/dashboard/:path*", "/api/:path*"] };
