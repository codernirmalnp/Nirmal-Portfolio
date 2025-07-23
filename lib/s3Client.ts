// AWS S3 client setup with environment variable validation
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

// Validate required environment variables
const requiredEnv = ['AWS_REGION', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_S3_BUCKET'];
for (const env of requiredEnv) {
  if (!process.env[env]) {
    throw new Error(`Missing required environment variable: ${env}`);
  }
}

/**
 * Exported S3 client instance
 */
export const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export { DeleteObjectCommand }; 