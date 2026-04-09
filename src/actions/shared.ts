import { isRedirectError } from "next/dist/client/components/redirect-error";

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; };

export function ok<T>(data: T): ActionResult<T> {
  return { success: true, data };
}

export function fail<T>(error: unknown): ActionResult<T> {
  if (isRedirectError(error)) throw error;

  /* I want it to always log the reson for the error if it's a backend returned error response, because there's this intermittent failure thing that happens and it is shady */

  console.log("data fetching failure: ", error)

  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : typeof error === "object" && error !== null
          ? ((error as { responseMessage?: string; message?: string })
              .responseMessage ??
            (error as { responseMessage?: string; message?: string }).message ??
            "An unexpected error occurred.")
          : "An unexpected error occurred.";
  return { success: false, error: message };
}
