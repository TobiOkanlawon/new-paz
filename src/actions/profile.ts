"use server";

import { getServerSession } from 'next-auth';
import { apiFetch } from '@/libs/api';

import { ok, fail, ActionResult } from "@/actions/shared";

export async function getProfile(): Promise<ActionResult<TProfile>>  {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      throw new Error("User not authenticated")
    }

    const email = session.user.email

    const res = await apiFetch(`/v1/users/user/get-profile?email=${email}`, {
      method: 'POST',
    })

    const data: TProfile = res.data.profile;
    return ok(data)
  } catch(e) {
    return fail(e)
  }

}
