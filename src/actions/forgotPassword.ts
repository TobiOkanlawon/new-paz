"use server";

import { apiFetch } from '@/libs/api';
import { getServerSession } from 'next-auth';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { ok, fail } from './shared';

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; };

type ResetPasswordResponse = {
  
};

export async function resetPassword(email: string): Promise<ActionResult<ResetPasswordResponse>> {
  try {
    const res = await apiFetch(`/v1/users/user/forgot-password?email=${email}`, {isProtected: false})

    const data: ResetPasswordResponse = res!.data;

    return ok(data)
  } catch (e) {
    return fail(e);
  }
}

// 
