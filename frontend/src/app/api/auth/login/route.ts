import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth";
import { fetchAuthEndpoint } from "@/lib/auth-service";

export async function POST(request: Request) {
  return proxyAuthRequest(request, "/auth/login");
}

async function proxyAuthRequest(request: Request, endpoint: string) {
  try {
    const body = await request.json().catch(() => null);
    const submittedUsername = typeof body?.username === "string" ? body.username.trim() : "";
    const pin = typeof body?.pin === "string" ? body.pin.trim() : "";

    if (!submittedUsername || !pin) {
      return NextResponse.json(
        { error: "Username and PIN are required." },
        { status: 400 },
      );
    }

    const backendResponse = await fetchAuthEndpoint(
      endpoint,
      { username: submittedUsername, pin },
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

    const username = data.username ?? data.user?.username ?? data.data?.user?.username;
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
