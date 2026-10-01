import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth";

const RETRY_DELAYS_MS = [0, 3000, 6000];

export async function POST(request: Request) {
  const baseUrl =
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "http://localhost:5000";

  const body = await request.json().catch(() => ({}));

  let lastError = "Unable to reach authentication service.";
  let lastStatus = 502;

  for (let attempt = 0; attempt < RETRY_DELAYS_MS.length; attempt++) {
    if (RETRY_DELAYS_MS[attempt] > 0) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS_MS[attempt]));
    }

    try {
      const backendResponse = await fetch(
        `${baseUrl.replace(/\/$/, "")}/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          cache: "no-store",
          signal: AbortSignal.timeout(15000),
        },
      );
      const data = await backendResponse.json().catch(() => ({}));

      // Real validation errors — don't retry
      if (backendResponse.status === 400 || backendResponse.status === 409) {
        return NextResponse.json(
          { error: data.error?.message ?? data.error ?? "Registration failed." },
          { status: backendResponse.status },
        );
      }

      if (!backendResponse.ok) {
        lastStatus = backendResponse.status;
        lastError = data.error?.message ?? data.error ?? "Authentication failed.";
        if (backendResponse.status === 502 || backendResponse.status === 503) continue;
        return NextResponse.json({ error: lastError }, { status: lastStatus });
      }

      const token = data.token ?? data.jwt ?? data.accessToken ?? data.data?.token;
      if (typeof token !== "string") {
        const username = data.username ?? data.data?.user?.username;
        return NextResponse.json({ username });
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
      lastError = "Service is starting up. Please try again in a moment.";
      lastStatus = 503;
    }
  }

  return NextResponse.json({ error: lastError, warming: true }, { status: lastStatus });
}
