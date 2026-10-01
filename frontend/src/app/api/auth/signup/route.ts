import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth";
import { fetchAuthEndpoint } from "@/lib/auth-service";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const submittedUsername = typeof body?.username === "string" ? body.username.trim() : "";
    const pin = typeof body?.pin === "string" ? body.pin.trim() : "";

    if (submittedUsername.length < 3 || submittedUsername.length > 30) {
      return NextResponse.json(
        { error: "Username must be between 3 and 30 characters." },
        { status: 400 },
      );
    }

    if (!/^\d{4,6}$/.test(pin)) {
      return NextResponse.json(
        { error: "PIN must be a 4 to 6 digit numeric code." },
        { status: 400 },
      );
    }

    const backendResponse = await fetchAuthEndpoint(
      "/auth/signup",
      { username: submittedUsername, pin },
    );
    const data = await backendResponse.json().catch(() => ({}));
    if (!backendResponse.ok)
      return NextResponse.json(
        { error: data.error?.message ?? data.error ?? "Authentication failed." },
        { status: backendResponse.status },
      );
    const token = data.token ?? data.jwt ?? data.accessToken ?? data.data?.token;
    if (typeof token !== "string") {
      // In PHP auth, signup may only return user/message without auto-login token, or with token
      // If no token returned, just return username without cookie so they can log in
      const username = data.username ?? data.user?.username ?? data.data?.user?.username;
      return NextResponse.json({ username });
    }
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
