"use server";

import { apiFetch } from "@/libs/api";
import { getServerSession } from "next-auth";
import { ActionResult, fail, ok } from "./shared";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getProfile } from "./profile";

// ─── Response Types ────────────────────────────────────────────────────────────

export type Transaction = {
  id: string;
  title: string;
  subTitle: string;
  status: "inbound" | "outbound";
  amount: string;
  date: string;
};

export type SavingsPlan = {
  id: string;
  name: string;
  type: "solo" | "target" | "group";
  description: string;
  imageUrl?: string;
};

export type InstantSavings = {
  id: string;
  title: string;
  accountNumber: string;
  label: string;
  backgroundColor: string;
};

export async function getAccountSummary(): Promise<
  ActionResult<TAccountDetails>
> {
  const session = await getServerSession(authOptions);
  
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
