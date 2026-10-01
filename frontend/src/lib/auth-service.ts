const DEFAULT_AUTH_API_URL = "https://smart-study-auth.onrender.com";

function getAuthApiUrls(): string[] {
  const urls = [
    process.env.BACKEND_API_URL,
    process.env.NEXT_PUBLIC_API_BASE_URL,
  ];

  if (process.env.NODE_ENV !== "production") {
    urls.push("http://localhost:5000");
  }

  urls.push(process.env.AUTH_API_BASE_URL || DEFAULT_AUTH_API_URL);

  return [...new Set(urls.map((url) => url?.trim()).filter(Boolean))] as string[];
}

export async function fetchAuthEndpoint(
  endpoint: string,
  body: unknown,
): Promise<Response> {
  const urls = getAuthApiUrls();
  let lastError: unknown;

  for (const [index, baseUrl] of urls.entries()) {
    try {
      const response = await fetch(
        `${baseUrl.replace(/\/$/, "")}${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          cache: "no-store",
        },
      );

      if (index < urls.length - 1 && (response.status === 404 || response.status >= 500)) {
        continue;
      }

      return response;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("No authentication service is available.");
}