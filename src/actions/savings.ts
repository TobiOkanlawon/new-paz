"use server";

import { getServerSession } from "next-auth";

import { ok, fail, ActionResult } from "@/actions/shared";
import { revalidatePath } from "next/cache";
import { apiFetch } from "@/libs/api";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

interface CreateSavingsPayload {
  accountName: string;
  description: string;
}

// snake_case (API shape)
type SavingTopupApiResponse = {
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
export type SavingTopupResponse = {
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

export async function createSoloSavingsAccount(
  payload: any,
): Promise<ActionResult<any>> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      throw new Error("User not authenticated");
    }
    
    const walletId = session.user.walletAccount;

    const body = {
      title: payload.accountName,
      description: "Solo Savings plan",
      currentAmount: 0.0,
      walletId: walletId,
      type: "SOLO",
    };

    const res = await apiFetch<any>("/v1/users/user/savings/create-savings", {
      method: "POST",
      isProtected: true,
      body,
    });

    revalidatePath("/dashboard/savings");
    return ok({success: true, data: res});
  } catch (e) {
    return fail({success: false, error: e});
  }
}

export async function createTargetSavingsAccount(
  payload: any): Promise<ActionResult<any>> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      throw new Error("User not authenticated");
    }

    // Map the incoming payload to the API's required structure
    const body = {
      title: payload.accountName, // e.g., "PERSONAL"
      description: payload.description,
      currentAmount: 0.0,
      walletId: session.user.walletAccount,
      duration: payload.targetDate,
      targetAmount: payload.targetAmount,
      frequency: payload.contributionFrequency,
      type: "TARGETSAVINGS",
    };

    const res = await apiFetch<any>("/v1/users/user/savings/create-savings", {
      method: "POST",
      isProtected: true,
      body,
    });

    revalidatePath("/dashboard/savings");
    return ok(res.data);
  } catch (e: any) {
    return fail(e);
  }
}

export async function createSavingsTopup(payload: {
  savingsWallet: string;
  amount: number;
}): Promise<ActionResult<SavingTopupResponse>> {
  try {
    const res = await apiFetch<SavingTopupApiResponse>(
      "/v1/users/user/savings/saving-topup",
      {
        method: "POST",
        isProtected: true,
        body: {
          savingsWallet: payload.savingsWallet,
          amount: payload.amount,
        },
      }
    );

    const data = res.virualAccountData;

    const transformed: SavingTopupResponse = {
      reference: data.reference,
      status: data.status,
      displayText: data.display_text,
      accountNumber: data.account_number,
      accountName: data.account_name,
      bank: data.bank,
      amount: data.amount,
      accountExpiresAt: data.account_expires_at,
    };

    // Optional: refresh savings page
    revalidatePath("/dashboard/savings");

    return ok(transformed);
  } catch (e: any) {
    return fail(e);
  }
}
