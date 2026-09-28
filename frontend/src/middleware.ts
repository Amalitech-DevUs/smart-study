import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth";

// Protected route prefixes that require an active session
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/chat",
  "/profile",
  "/flashcards",
  "/articles",
];

// Routes intended for unauthenticated users only
const AUTH_PAGES = ["/login", "/signup", "/register"];

function isTokenValid(token: string | undefined): boolean {
  if (!token || typeof token !== "string") return false;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    // Decode JWT payload (safe for Edge runtime)
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const jsonString = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const payload = JSON.parse(jsonString);

    // Check expiration if present
    if (payload.exp && typeof payload.exp === "number") {
      if (Date.now() >= payload.exp * 1000) {
        return false;
      }
    }

    return Boolean(payload.username || payload.userId || payload.id || payload.sub);
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const isAuthenticated = isTokenValid(token);

  // Alias /register to /signup
  if (pathname === "/register") {
    const signupUrl = new URL("/signup", request.url);
    signupUrl.search = search;
    return NextResponse.redirect(signupUrl);
  }

  // 1. Authenticated user attempting to visit public landing page or auth pages
  if (isAuthenticated) {
    if (pathname === "/" || AUTH_PAGES.includes(pathname)) {
      const dashboardUrl = new URL("/dashboard", request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  // 2. Unauthenticated user attempting to access protected routes
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    const destination = pathname + (search || "");
    loginUrl.searchParams.set("redirect", destination);

    // If an invalid token cookie existed, clear it to avoid stale client states
    const response = NextResponse.redirect(loginUrl);
    if (token) {
      response.cookies.delete(AUTH_COOKIE_NAME);
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (/api/*)
     * - static files (_next/static/*)
     * - images (_next/image/*)
     * - favicon.ico and static assets (.png, .jpg, .svg, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
