"use server";

import { getServerSession } from 'next-auth';
import { apiFetch } from '@/libs/api';

import { ok, fail, ActionResult } from "@/actions/shared";

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

    const res = await apiFetch("/v1/users/user/savings/create-savings", {
      method: "POST",
      body: JSON.stringify(body),
    });

    return ok(res);
  } catch (e) {
    return fail(e);
  }
}
