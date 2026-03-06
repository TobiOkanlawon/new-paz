"use server";

import { apiFetch } from "@/libs/api";
import { getServerSession } from "next-auth";
import { ok, fail, ActionResult } from "./shared";

// response body shape
// {
//   "accountName": "Tobi Okanlawon",
//   "accountNo": "1100449265",
//   "bankName": "Kuda Bank",
//   "walletId": "0516549872"
// }

export async function addAccount(
  accountName: string,
  accountNo: string,
  bankName: string,
): Promise<ActionResult<TAddAccountResponse>> {
  try {
    const session = await getServerSession();

    const walletId = session?.user.walletAccount;

    const res = await fetch(`${process.env.API_BASE_URL}/v1/users/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
	Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({accountName, accountNo, bankName, walletId}),
      cache: "no-store",
    });

    const json = await res.json()

    const data: TAddAccountResponse = json.data;

    return ok(data);
  } catch (e) {
    return fail(e);
  }
}
