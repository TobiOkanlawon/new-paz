import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { BackendError } from "./errors";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

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

export function isInvalidTokenResponse(
  body: unknown,
): body is InvalidTokenResponse {
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
  options: FetchOptions = { isProtected: true },
): Promise<T> {
  const session = await getServerSession(authOptions);

  const isProtected = options.isProtected;

  const { body, headers: extraHeaders, ...rest } = options;

  const headers: any = {};

  if (!session?.accessToken && isProtected) {
    redirect("/api/auth/logout");
  }

  if (isProtected) {
    headers["Authorization"] = `Bearer ${session?.accessToken}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...extraHeaders,
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    cache: "no-store",
  }).catch((e) => {
    /* the request failed for some reason*/
    throw e;
  });

  return res.json().then((body) => {
    if (res.ok) return body;

    // if the backend's error is that the token is invalid
    if (isInvalidTokenResponse(body)) {
      redirect("/api/auth/logout");
    } else {
      if (body.responseCode !== "00") {
        /* Backend returns a 00 code on success*/
        throw new BackendError(body.responseMessage);
      }
      throw new BackendError("An error occurred")
    }
  });
}
