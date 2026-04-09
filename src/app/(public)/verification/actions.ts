"use server";

import { apiFetch } from "@/libs/api";
import { ok, fail, ActionResult } from "@/actions/shared";

export const verifyEmail = async (otp: string, email: string) => {
  
  try {
    const res = await apiFetch<any>(`/v1/users/verify-otp`, {
      isProtected: false,
      body: {
        otp,
        userIdentifier: email,
      },
      method: "POST",
    });

    const data: any = res!.data!;

    return ok(data);
  } catch (e) {
    return fail(e);
  }
};

/* target describes where the OTP is going to */
export async function resendCode(
  type: "email" | "phone",
  target: string,
): Promise<ActionResult<any>> {
  let body: Record<"userIdentifier", string> = {userIdentifier: ""};

  if (type == "email") {
    body = { userIdentifier: target };
  } else if (type == "phone") {
    body = { userIdentifier: target };
  }

  console.log(body);
  
  try {
    const res = await apiFetch<any>(`/v1/users/send-otp?email=${target}`, {
      isProtected: false,
      body,
      method: "POST",
    });

    const data: any = res!.data;
    return ok(data);
  } catch (e) {
    return fail(e);
  }
}
