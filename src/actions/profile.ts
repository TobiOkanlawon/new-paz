"use server";

import { getServerSession } from 'next-auth';
import { apiFetch } from '@/libs/api';
import { formatBirthdayToBackendFormat } from '@/libs/helpers';

import { ok, fail, ActionResult } from "@/actions/shared";

export async function getProfile(): Promise<ActionResult<TProfile>> {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      throw new Error("User not authenticated")
    }

    const email = session.user.email

    const res = await apiFetch<any>(`/v1/users/user/get-profile?email=${email}`, {
      isProtected: true,
      method: 'POST',
    })


    const profileImage =
      res.profile["profile-image"] ||
      res.profile.profileImage ||
      res.profile.profile_image ||
      "";

    delete res.profile["profile-image"];

    const data: TProfile = { ...res.profile, profileImage };
    return ok(data)
  } catch (e) {
    return fail(e)
  }

}

export async function saveProfile(payload: any): Promise<ActionResult<any>> {

  try {
    const session = await getServerSession();

    const user = session?.user;

    if (!user) {
      throw new Error("User is not authenticated")
    }

    const res = await apiFetch<any>(`/v1/users/user/set-profile?email=${user.email}`, {
      isProtected: true,
      method: "POST",
      body: {
        "profile-image": payload.profileImage,
        address: payload.postalAddress,
        gender: payload.gender,
        email: payload.emailAddress,
        birthday: formatBirthdayToBackendFormat(payload.birthday),
        phoneNumber: payload.phoneNumber,
        nextOfKinFirstName: payload.nextOfKinFirstName,
        nextOfKinLastName: payload.nextOfKinLastName,
        nextOfKinEmail: payload.nextOfKinEmail,
        nextOfKinRelationship: payload.relationship,
        nextOfKinPhoneNumber: payload.nextOfKinPhoneNumber,
      },
    });

    return ok(res);
  } catch (e) {
    return fail(e)
  }
};
