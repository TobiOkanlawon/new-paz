"use server";

import { getServerSession } from "next-auth";

import { ok, fail, ActionResult } from "@/actions/shared";
import { revalidatePath } from "next/cache";
import { apiFetch } from "@/libs/api";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

// snake_case (API shape) — mirrors the savings top-up response, which comes
// from the same virtual-account-generation service on the backend.
type WalletFundApiResponse = {
  responseCode: string;
  responseMessage: string;
  virualAccountData: {
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

    const res = await apiFetch<WalletFundApiResponse>("/v1/wallet/fund", {
      method: "POST",
      isProtected: true,
      body: {
        walletAcc: session.user.walletAccount,
        amount: payload.amount,
      },
    });

    const data = res.virualAccountData;

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
