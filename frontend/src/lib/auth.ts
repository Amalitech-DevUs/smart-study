import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";
import { AUTH_COOKIE_NAME } from "@/lib/auth-cookie";

export { AUTH_COOKIE_NAME } from "@/lib/auth-cookie";

type CurrentUser = {
  loggedIn: boolean;
  username?: string;
};

function decodeUsername(token: string): string | undefined {
  try {
    const secret = process.env.JWT_SECRET || "super_secret_dev_key_bece_2026_production_key_32bytes";
    if (!headerPart || !payloadPart || !signaturePart || !secret) return undefined;

    const header = JSON.parse(Buffer.from(headerPart, "base64url").toString("utf8"));
    if (header.alg !== "HS256") return undefined;
    const expected = createHmac("sha256", secret).update(`${headerPart}.${payloadPart}`).digest();
    const actual = Buffer.from(signaturePart, "base64url");
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return undefined;

    const decoded = JSON.parse(Buffer.from(payloadPart, "base64url").toString("utf8"));
    if (typeof decoded.exp === "number" && Date.now() >= decoded.exp * 1000) return undefined;
    return typeof decoded.username === "string" ? decoded.username : undefined;
  } catch {
    return undefined;
  }
}

export async function getCurrentUser(): Promise<CurrentUser> {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  const username = token ? decodeUsername(token) : undefined;
  return username ? { loggedIn: true, username } : { loggedIn: false };
}
