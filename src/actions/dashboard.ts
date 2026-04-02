"use server";

import { apiFetch } from "@/libs/api";
import { getServerSession } from "next-auth";
import { ActionResult, fail, ok } from "./shared";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getProfile } from "./profile";

// ─── Response Types ────────────────────────────────────────────────────────────

export async function getAccountSummary(): Promise<
  ActionResult<TAccountDetails>
> {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    throw new Error("user not authenticated")
  }
  
  try {
    const data: {accountDetails: TAccountDetails} = await apiFetch(
      `/v1/users/user/account-details?email=${session?.user.email}`,
      {
	isProtected: true,
	method: "GET",
      },
    );
    
    return ok(data.accountDetails);
  } catch (e) {
    return fail(e);
  }
}

/**
 * Convenience action: fetches all dashboard data in parallel.
 * Use this to avoid waterfall requests on initial page load.
 */
export async function getDashboardData(): Promise<any> {
  const [accountSummary, profileData] = await Promise.all([
    getAccountSummary(),
    getProfile(),
  ]);

  return { accountSummary, profileData };
}
