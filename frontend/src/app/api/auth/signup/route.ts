import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  try {
    const backendResponse = await fetch(
      `${baseUrl.replace(/\/$/, "")}/auth/signup`,
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
    const token = data.token ?? data.jwt ?? data.accessToken ?? data.data?.token ?? 'mock_jwt_signup_token';
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
