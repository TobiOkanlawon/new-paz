"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function verifyBvnAction({
  bvn,
  dob,
}: {
  bvn: string;
  dob: string;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return { success: false, message: "Unauthorized" };
  }

  const res = await fetch(
    `${process.env.API_BASE_URL}/v1/users/user/verify-bvn?email=${session.user.email}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        bvn,
        dob,
      }),
      cache: "no-store",
    }
  );

  const data = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: data.responseMessage || "Verification failed",
    };
  }

  return {
    success: true,
    message: data.responseMessage,
  };
}
