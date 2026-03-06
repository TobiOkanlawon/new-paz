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

    const res = await apiFetch(`/v1/users/user/add-account`, {
      isProtected: false,
      method: "POST",
      body: {
        accountName,
        accountNo,
        bankName,
        walletId,
      },
    });

    const data: TAddAccountResponse = res!.data;

    return ok(data);
  } catch (e) {
    return fail(e);
  }
}
