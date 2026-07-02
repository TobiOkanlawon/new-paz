'use server';

import { uploadProfileImage } from '@/libs/cloudflare';
import { revalidatePath } from 'next/cache';

export type UploadProfileImageResult =
  | {
      success: true;
      imageUrl: string;
    }
  | {
      success: false;
      error: string;
    };

export async function uploadProfileImageAction(
  formData: FormData
): Promise<UploadProfileImageResult> {
  try {
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    if (!file) {
      throw new Error('No file provided');
    }

    if (!userId) {
      throw new Error('User ID is required');
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size must be less than 5MB');
    }

    const imageUrl = await uploadProfileImage(file, userId);

    // Revalidate the profile page to update cache
    revalidatePath('/dashboard');

    return {
      success: true,
      imageUrl,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      success: false,
      error: message,
    };
  }
}
