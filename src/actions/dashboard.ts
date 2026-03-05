"use server";

import { apiFetch } from "@/libs/api";
import { getServerSession } from "next-auth"
import { ActionResult, fail, ok } from "./shared";

// ─── Response Types ────────────────────────────────────────────────────────────

export type AccountSummary = {
  totalSavings: number;
  totalLoans: number;
  totalInvestments: number;
};

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

// ─── Action Result Wrapper ─────────────────────────────────────────────────────



// ─── Server Actions ────────────────────────────────────────────────────────────

/**
 * Fetches the user's account summary: total savings, loans, and investments.
 * Adjust the endpoint path to match your API spec.
 */
export async function getAccountSummary(email: string): Promise<ActionResult<AccountSummary>> {
  try {
    const res = await apiFetch(`/v1/users/user/account-details?email=${email}`);

    console.log("res", res)
    
    const data = res!.accountDetails;
    
    return ok(data);
  } catch (e) {
    return fail(e);
  }
}

/**
 * Fetches the N most recent transactions for the dashboard preview.
 * Pass `limit` to control how many rows are shown.
 */
export async function getRecentTransactions(
  limit = 5
): Promise<ActionResult<Transaction[]>> {
  try {
    const data = await apiFetch<Transaction[]>(
      `/transactions/recent?limit=${limit}`
    );
    return ok(data);
  } catch (e) {
    return fail(e);
  }
}

/**
 * Fetches the user's savings plans, optionally filtered by type.
 */
export async function getSavingsPlans(): Promise<
  ActionResult<{ solo: SavingsPlan[]; target: SavingsPlan[] }>
> {
  try {
    const data = await apiFetch<SavingsPlan[]>("/savings/plans");

    // Split by plan type for the two sections on the dashboard
    const solo = data.filter((p) => p.type === "solo");
    const target = data.filter((p) => p.type === "target");

    return ok({ solo, target });
  } catch (e) {
    return fail(e);
  }
}

/**
 * Fetches the user's instant savings accounts.
 */
export async function getInstantSavings(): Promise<
  ActionResult<InstantSavings[]>
> {
  try {
    const data = await apiFetch<InstantSavings[]>("/savings/instant");
    return ok(data);
  } catch (e) {
    return fail(e);
  }
}

/**
 * Convenience action: fetches all dashboard data in parallel.
 * Use this to avoid waterfall requests on initial page load.
 */
export async function getDashboardData(): Promise<{
  accountSummary: ActionResult<AccountSummary>;
  // recentTransactions: ActionResult<Transaction[]>;
  // savingsPlans: ActionResult<{ solo: SavingsPlan[]; target: SavingsPlan[] }>;
  // instantSavings: ActionResult<InstantSavings[]>;
}> {

  const session = await getServerSession();
  
  // const [accountSummary, recentTransactions, savingsPlans, instantSavings] =
  const [accountSummary] =
    await Promise.all([
      getAccountSummary(session?.user?.email as string),
      // getRecentTransactions(5),
      // getSavingsPlans(),
      // getInstantSavings(),
    ]);

  // return { accountSummary, recentTransactions, savingsPlans, instantSavings };
  return { accountSummary }
}
