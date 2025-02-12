import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

interface UploadResult {
  imageUrls: string[];
}

export class UploadService {
  private serverAddress: string;
  private s3Client: S3Client;

  constructor(serverAddress: string) {
    this.serverAddress = serverAddress;
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  async generateUploadUrl(filename: string) {
    const key = `uploads/${Date.now()}-${filename}`;
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });

    const uploadUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
    const imageUrl = `${process.env.CLOUDFRONT_URL}/${key}`;

    return { uploadUrl, imageUrl };
  }
}
