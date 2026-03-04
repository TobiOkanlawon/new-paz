"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";

type Props = {
  error: string | null; // pass the error.name from a server action catch block
  children: React.ReactNode;
};

/**
 * Drop this around any server component subtree that calls apiFetch.
 * When the server action propagates an InvalidTokenError, pass its
 * name here and the client will automatically sign the user out.
 *
 * Usage in a server component:
 *
 *   const result = await getSomeData();
 *   const tokenExpired = !result.success && result.errorName === "InvalidTokenError";
 *
 *   return (
 *     <SessionGuard error={tokenExpired ? "InvalidTokenError" : null}>
 *       <YourPage data={result} />
 *     </SessionGuard>
 *   );
 */
export function SessionGuard({ error, children }: Props) {
  useEffect(() => {
    if (error === "InvalidTokenError") {
      signOut({ callbackUrl: "/login" });
    }
  }, [error]);

  return <>{children}</>;
}
