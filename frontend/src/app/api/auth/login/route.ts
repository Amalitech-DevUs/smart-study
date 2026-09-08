import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  return proxyAuthRequest(request, "/auth/login");
}

async function proxyAuthRequest(request: Request, endpoint: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  try {
    const backendResponse = await fetch(
      `${baseUrl.replace(/\/$/, "")}${endpoint}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(await request.json()),
        cache: "no-store",
      },
    );
    const data = await backendResponse.json().catch(() => ({}));
    if (!backendResponse.ok)
      return NextResponse.json(
        { error: data.error?.message ?? data.error ?? "Authentication failed." },
        { status: backendResponse.status },
      );

    const token = data.token ?? data.jwt ?? data.accessToken ?? data.data?.token;
    if (typeof token !== "string")
      return NextResponse.json(
        { error: "Authentication response did not include a token." },
        { status: 502 },
      );

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
    return NextResponse.json(
      { error: "Unable to reach authentication service." },
      { status: 502 },
    );
  }
}
