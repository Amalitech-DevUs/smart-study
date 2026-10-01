import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  return proxyAuthRequest(request, "/auth/login");
}

const RETRY_DELAYS_MS = [0, 3000, 6000]; // 0s, 3s, 6s between attempts

async function proxyAuthRequest(request: Request, endpoint: string) {
  const baseUrl =
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "http://localhost:5000";

  const body = await request.json().catch(() => ({}));

  let lastStatus = 502;
  let lastError = "Unable to reach authentication service.";

  for (let attempt = 0; attempt < RETRY_DELAYS_MS.length; attempt++) {
    if (RETRY_DELAYS_MS[attempt] > 0) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS_MS[attempt]));
    }

    try {
      const backendResponse = await fetch(
        `${baseUrl.replace(/\/$/, "")}${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          cache: "no-store",
          // Allow up to 15 seconds — Render cold-start can be slow
          signal: AbortSignal.timeout(15000),
        },
      );

      const data = await backendResponse.json().catch(() => ({}));

      // Propagate real auth errors (401, 400) immediately — no point retrying
      if (backendResponse.status === 401 || backendResponse.status === 400) {
        return NextResponse.json(
          { error: data.error?.message ?? data.error ?? "Invalid username or PIN." },
          { status: backendResponse.status },
        );
      }

      if (!backendResponse.ok) {
        lastStatus = backendResponse.status;
        lastError = data.error?.message ?? data.error ?? "Authentication failed.";
        // 502/503 = Render is waking up — retry
        if (backendResponse.status === 502 || backendResponse.status === 503) continue;
        return NextResponse.json({ error: lastError }, { status: lastStatus });
      }

      const token = data.token ?? data.jwt ?? data.accessToken ?? data.data?.token;
      if (typeof token !== "string") {
        return NextResponse.json(
          { error: "Authentication response did not include a token." },
          { status: 502 },
        );
      }

      const username = data.username ?? data.data?.user?.username;
      const response = NextResponse.json({ username });
      response.cookies.set(AUTH_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      return response;
    } catch {
      // Network error or timeout — server may still be booting
      lastError = "Service is starting up. Please try again in a moment.";
      lastStatus = 503;
    }
  }

  return NextResponse.json({ error: lastError, warming: true }, { status: lastStatus });
}
