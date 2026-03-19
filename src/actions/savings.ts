"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { ok, fail, ActionResult } from "@/actions/shared";
import { revalidatePath } from "next/cache";
import { apiFetch } from "@/libs/api";

interface CreateSavingsPayload {
  accountName: string;
  description: string;
}

export async function createSoloSavingsAccount(
  payload: CreateSavingsPayload,
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

    const res = await apiFetch("/v1/users/user/savings/create-savings", {
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
  payload: CreateTargetSavingsPayload): Promise<ActionResult<any>> {
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

    const res = await apiFetch("/v1/users/user/savings/create-savings", {
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
