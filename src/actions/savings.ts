"use server";

import { getServerSession } from 'next-auth';

import { ok, fail, ActionResult } from "@/actions/shared";
import { revalidatePath } from 'next/cache';

interface CreateSavingsPayload {
  accountName: string;
}

export async function createSavingsAccount(
  payload: CreateSavingsPayload
): Promise<ActionResult<any>> {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      throw new Error("User not authenticated");
    }

    const walletId = session.user.wallet_account;

    const body = {
      title: payload.accountName,
      description: "Solo Savings plan",
      currentAmount: 0.0,
      walletId: walletId,
      type: "SOLO",
    };

    const res = await fetch(
    `${process.env.API_BASE_URL}/v1/users/user/savings/create-savings`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    }
    );

    const data = await res.json();

    revalidatePath("/dashboard/savings")
    return ok(data);
  } catch (e) {
    return fail(e);
  }
}
