import { cookies } from "next/headers";

export const AUTH_COOKIE_NAME = "smart-study-token";

type CurrentUser = {
  loggedIn: boolean;
  username?: string;
};

function decodeUsername(token: string): string | undefined {
  try {
    const payload = token.split(".")[1];
    if (!payload) return undefined;
    const decoded = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    );
    return typeof decoded.username === "string" ? decoded.username : undefined;
  } catch {
    return undefined;
  }
}

export async function getCurrentUser(): Promise<CurrentUser> {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  return token
    ? { loggedIn: true, username: decodeUsername(token) }
    : { loggedIn: false };
}
