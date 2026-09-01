import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "vincent_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that do not require authentication.
  const publicRoutes = [
    "/login",
    "/api/auth/login",
    "/api/auth/logout",
  ];

  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  const session = request.cookies.get(SESSION_COOKIE)?.value;

  // If there is no session, send the user to login.
  if (!session) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Protect application pages and API routes,
     * while excluding Next.js internal assets.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
