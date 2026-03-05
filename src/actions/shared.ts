import { isRedirectError } from "next/dist/client/components/redirect-error";

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; };

export function ok<T>(data: T): ActionResult<T> {
  return { success: true, data };
}

export function fail<T>(error: unknown): ActionResult<T> {
  if (isRedirectError(error)) throw error;

  const message =
    error instanceof Error ? error.message : "An unexpected error occurred.";
  console.error("[Server Action Error]", message);
  return { success: false, error: message };
}
