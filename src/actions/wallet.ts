"use server";

import { getServerSession } from "next-auth";

import { ok, fail, ActionResult } from "@/actions/shared";
import { revalidatePath } from "next/cache";
import { apiFetch } from "@/libs/api";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

// snake_case (API shape) — /v1/wallet/fund nests its payload under
// `responseBody`, unlike the savings top-up endpoint's `virualAccountData`.
type WalletFundApiResponse = {
  responseCode: string;
  responseMessage: string;
  responseBody: {
    reference: string;
    status: string;
    display_text: string;
    account_number: string;
    account_name: string;
    bank: {
      slug: string;
      name: string;
      id: number;
    };
    amount: number;
    account_expires_at: string;
  };
};

// camelCase (frontend-safe)
export type WalletFundResponse = {
  reference: string;
  status: string;
  displayText: string;
  accountNumber: string;
  accountName: string;
  bank: {
    slug: string;
    name: string;
    id: number;
  };
  amount: number;
  accountExpiresAt: string;
};

export async function fundWallet(payload: {
  amount: number;
}): Promise<ActionResult<WalletFundResponse>> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      throw new Error("User not authenticated");
    }

    // session.user.walletAccount is captured once at login and never
    // refreshed (see applyForLoan/liquidateLoan in src/actions/loans.ts for
    // the full explanation) — fetch the current value instead of trusting
    // the session's, so a wallet linked after login is picked up.
    const updatedUser = await apiFetch<any>("/v1/users/fetch/user", {
      isProtected: true,
      method: "POST",
      body: { email: session.user.email },
    });

    const walletAcc = updatedUser?.user?.wallet_account;

    if (!walletAcc) {
      return fail("Wallet account is missing on your profile. Please complete account setup first.");
    }

    const res = await apiFetch<WalletFundApiResponse>("/v1/wallet/fund", {
      method: "POST",
      isProtected: true,
      body: {
        walletAcc,
        amount: payload.amount,
      },
    });

    const data = res?.responseBody;

    if (!data) {
      console.log(
        "fundWallet: unexpected response shape from /v1/wallet/fund:",
        JSON.stringify(res),
      );
      return fail(
        "Wallet funding could not be completed — the server returned an unexpected response. Please try again.",
      );
    }

    const transformed: WalletFundResponse = {
      reference: data.reference,
      status: data.status,
      displayText: data.display_text,
      accountNumber: data.account_number,
      accountName: data.account_name,
      bank: data.bank,
      amount: data.amount,
      accountExpiresAt: data.account_expires_at,
    };

    revalidatePath("/dashboard");

    return ok(transformed);
  } catch (e: any) {
    return fail(e);
  }
}
