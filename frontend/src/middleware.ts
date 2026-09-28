import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth-cookie";

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

function decodeBase64Url(value: string): ArrayBuffer {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
  const buffer = new ArrayBuffer(binary.length);
  const bytes = new Uint8Array(buffer);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return buffer;
}

async function isTokenValid(token: string | undefined): Promise<boolean> {
  if (!token || typeof token !== "string") return false;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    const secret = process.env.JWT_SECRET;
    if (!secret) return false;
    const header = JSON.parse(new TextDecoder().decode(decodeBase64Url(parts[0])));
    if (header.alg !== "HS256") return false;
    const payload = JSON.parse(new TextDecoder().decode(decodeBase64Url(parts[1])));
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );
    const validSignature = await crypto.subtle.verify(
      "HMAC",
      key,
      decodeBase64Url(parts[2]),
      new TextEncoder().encode(`${parts[0]}.${parts[1]}`),
    );
    if (!validSignature) return false;

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

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const isAuthenticated = await isTokenValid(token);

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
