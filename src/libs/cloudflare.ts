import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: 'auto',
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_KEY!,
  },
  endpoint: `https://${process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
});

export async function uploadProfileImage(
  file: File,
  userId: string
): Promise<string> {
  try {
    const fileName = `profiles/${userId}-${Date.now()}-${file.name}`;

    const arrayBuffer = await file.arrayBuffer();

    const command = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: fileName,
      Body: new Uint8Array(arrayBuffer),
      ContentType: file.type,
      CacheControl: 'max-age=31536000, immutable', // 1 year cache for profile images
      Metadata: {
        'uploaded-at': new Date().toISOString(),
        'user-id': userId,
      },
    });

    await s3Client.send(command);

    const imageUrl = `${process.env.NEXT_PUBLIC_CLOUDFLARE_R2_URL}/${fileName}`;
    return imageUrl;
  } catch (error) {
    console.error('Error uploading profile image:', error);
    throw new Error('Failed to upload profile image');
  }
}
