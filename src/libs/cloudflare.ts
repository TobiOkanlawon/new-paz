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

type LoanDocumentMeta = {
  loanType: string;
  nextId: string;
  fieldName: string;
};

export async function uploadLoanDocument(
  file: File,
  meta: LoanDocumentMeta
): Promise<string> {
  try {
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const fileName = `loan-documents/${meta.loanType}/${meta.nextId}/${meta.fieldName}-${Date.now()}-${sanitizedFileName}`;

    const arrayBuffer = await file.arrayBuffer();

    const command = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: fileName,
      Body: new Uint8Array(arrayBuffer),
      ContentType: file.type,
      Metadata: {
        'uploaded-at': new Date().toISOString(),
        'loan-type': meta.loanType,
        'next-id': meta.nextId,
        'field-name': meta.fieldName,
      },
    });

    await s3Client.send(command);

    return `${process.env.NEXT_PUBLIC_CLOUDFLARE_R2_URL}/${fileName}`;
  } catch (error) {
    console.error('Error uploading loan document:', error);
    throw new Error('Failed to upload loan document');
  }
}
