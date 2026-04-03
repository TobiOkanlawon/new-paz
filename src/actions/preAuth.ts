"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ok, fail, ActionResult } from "./shared";
import { apiFetch } from "@/libs/api";

export async function addAccount(
  accountName: string,
  accountNo: string,
  bankName: string,
): Promise<ActionResult<TAddAccountResponse>> {
  try {
    const session = await getServerSession(authOptions);

    const updatedUser = await apiFetch(`/v1/users/fetch/user`, {
      isProtected: true,
      method: "POST",
      body: {
        email: session?.user.email,
      },
    });

    if (!updatedUser) {
      return fail("Failed to fetch user object");
    }
    
    const walletAccount = updatedUser.user.wallet_account;

    // const walletAccount = updatedUser.

    if (!session?.accessToken) {
      return fail("You are not authenticated. Please log in again.");
    }

    if (!walletAccount) {
      return fail("Wallet account is missing on your profile.");
    }

    // TODO: there's a bug where, if the user is doing the flow from registration and does the kyc right after, they won't have a "walletAccount". The only way that this gets resolved properly is if the user object can be fetched from an enpoint and we fetch the user object right after every important change so that it syncs with the backend.

    const token = session.accessToken;

    const body = {
      accountName,
      accountNo,
      bankName,
      walletId: walletAccount,
    };

    const res = await fetch(
      `${process.env.API_BASE_URL}/v1/users/user/add-account`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
        cache: "no-store",
      },
    );

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
