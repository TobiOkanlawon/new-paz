import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const BASE_URL = process.env.API_BASE_URL ?? "";

type FetchOptions = Omit<RequestInit, "body"> & {
  body?: Record<string, unknown>;
  /* isProtected controls whether to send a token with the request */
  isProtected?: boolean;
};

type InvalidTokenResponse = {
  responseCode: 400;
  responseMessage: "Invalid token provided";
};

function isInvalidTokenResponse(body: unknown): body is InvalidTokenResponse {
  return (
    typeof body === "object" &&
    body !== null &&
    (body as InvalidTokenResponse).responseCode === 400 &&
    (body as InvalidTokenResponse).responseMessage
      ?.toLowerCase()
      .includes("invalid token")
  );
}

/**
 * Authenticated fetch wrapper for server actions / server components.
 * - Injects the JWT from the NextAuth session automatically.
 * - Throws InvalidTokenError when the API signals the token is expired,
 *   so a client boundary can call signOut() in response.
 */
export async function apiFetch<T = unknown>(
  path: string,
  options: FetchOptions = {isProtected: true}
): Promise<T> {
  const session = await getServerSession(authOptions);

  // if (!session?.accessToken) {
  //   throw new InvalidTokenError();
  // }

  const { body, headers: extraHeaders, ...rest } = options;

  let headers: any = {};
  
  if (options.isProtected) {
    headers["Authorization"] = `Bearer ${session.accessToken}`
  } 
  
  const response = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...extraHeaders,
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    cache: "no-store",
  });

  // Parse the body once — we need it for both the token check and normal errors
  const responseBody = await response.json().catch(() => null);

  // Detect expired/invalid token and immediately redirect to the logout route,
  // which clears the session cookie and sends the user to /login
  if (isInvalidTokenResponse(responseBody)) {
    redirect("/api/auth/logout");
  }

  if (!response.ok) {
    throw new Error(
      `API error [${response.status}] on ${path}: ${JSON.stringify(responseBody)}`
    );
  }

  return responseBody as T;
}
