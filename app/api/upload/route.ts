import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '../../../lib/s3Client';
import { requireAuth } from '../auth/utils';

export async function POST(req: NextRequest) {
  const session = await requireAuth(req);
  if ((session as any).status === 401) return session;
  const formData = await req.formData();
  const file = formData.get('file') as File;
  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const fileName = `${Date.now()}-${file.name}`;
  // Ensure AWS_S3_BUCKET is set in your environment variables
  const bucket = process.env.AWS_S3_BUCKET!;
  await s3.send(new PutObjectCommand({
    Bucket: bucket,
    Key: fileName,
    Body: buffer,
    ContentType: file.type,
  }));
  const url = `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
  return NextResponse.json({ url });
} 