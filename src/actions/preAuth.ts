"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
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
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return fail("You are not authenticated. Please log in again.");
    }

    if (!session.user?.walletAccount) {
      return fail("Wallet account is missing on your profile.");
    }

    const walletId = session.user.walletAccount;
    const token = session.accessToken;

    console.log("[addAccount] token present:", !!token);
    console.log("[addAccount] walletId:", walletId);

    const body = {
      accountName,
      accountNo,
      bankName,
      walletId,
    };

    console.log("[addAccount] request body:", JSON.stringify(body));

    const res = await fetch(`${process.env.API_BASE_URL}/v1/users/user/add-account`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const json = await res.json().catch(() => null);

    console.log("[addAccount] response status:", res.status);
    console.log("[addAccount] response body:", JSON.stringify(json));

    if (!res.ok) {
      return fail(json?.responseMessage ?? "Failed to add account details.");
    }

    if (json?.responseCode && json.responseCode !== "00") {
      return fail(json?.responseMessage ?? "Failed to add account details.");
    }

    const data: TAddAccountResponse = json.data ?? json;

    return ok(data);
  } catch (e) {
    return fail(e);
  }
}
