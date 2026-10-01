import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json(
      { success: false, error: "Authentication is required." },
      { status: 401 },
    );
  }

  const baseUrl =
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "http://localhost:5000";

  try {
    const response = await fetch(
      `${baseUrl.replace(/\/$/, "")}/auth/progress/sessions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(await request.json()),
        cache: "no-store",
      },
    );
    const data = await response
      .json()
      .catch(() => ({ success: false, error: "Invalid backend response." }));
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { success: false, error: "Unable to reach the progress service." },
      { status: 503 },
    );
  }
}
