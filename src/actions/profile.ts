"use server";

import { getServerSession } from 'next-auth';
import { apiFetch } from '@/libs/api';

import { ok, fail, ActionResult } from "@/actions/shared";
import { TProfileFormValues } from '@/app/(private)/dashboard/profile/Profile';

export async function getProfile(): Promise<ActionResult<TProfile>>  {
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

    
    const profileImage = res.profile["profile-image"] || "";

    delete res.profile["profile-image"];
    
    const data: TProfile = {...res.profile, profileImage};
    return ok(data)
  } catch(e) {
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
	address: payload.postalAddress,
	gender: payload.gender,
	email: payload.emailAddress,
	birthday: payload.birthday,
	phoneNumber: payload.phoneNumber,
	nextOfKinFirstName: payload.nextOfKinFirstName,
	nextOfKinLastName: payload.nextOfKinLastName,
	nextOfKinEmail: payload.nextOfKinEmail,
	nextOfKinRelationship: payload.relationship,
	nextOfKinPhoneNumber: payload.nextOfKinPhoneNumber,
      },
    });
  
    return ok({success: true});
  } catch(e) {
    return fail(e)
  }
};

export async function uploadProfileImage(formData: FormData) {
  try {
    const file = formData.get("file") as File;

    if (!file) {
      return {
        success: false,
        error: "No file provided",
      };
    }

    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID!;
    const apiToken = process.env.CLOUDFLARE_IMAGES_TOKEN!;

    const cloudflareForm = new FormData();
    cloudflareForm.append("file", file);

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
        body: cloudflareForm,
      }
    );

    const result = await response.json();

    if (!result.success) {
      return {
        success: false,
        error: result.errors?.[0]?.message || "Upload failed",
      };
    }

    return {
      success: true,
      imageId: result.result.id,
      imageUrl: result.result.variants[0], // public image url
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: "Image upload failed",
    };
  }
}
