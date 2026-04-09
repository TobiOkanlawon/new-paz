"use server";

import { apiFetch } from '@/libs/api';
import { ok, fail } from './shared';

export async function resetPassword(email: string): Promise<any> {
  try {
    const res = await apiFetch<{data: any}>(`/v1/users/user/forgot-password?email=${email}`, {isProtected: false})

    const data = res.data;

    return ok(data)
  } catch (e) {
    return fail(e);
  }
}
