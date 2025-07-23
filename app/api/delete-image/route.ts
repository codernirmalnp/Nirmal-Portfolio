import { requireAuth } from '../auth/utils';
import { NextRequest, NextResponse } from 'next/server';
import { s3, DeleteObjectCommand } from '../../../lib/s3Client';

export async function POST(req: NextRequest) {
  const session = await requireAuth(req);
  if ((session as { status?: number })?.status === 401) return session;
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: 'Missing image URL.' }, { status: 400 });
    }
    const bucket = process.env.AWS_S3_BUCKET!;
    // Extract the S3 key from the URL
    const key = url.split(`/${bucket}/`)[1] || url.split('/').pop();
    if (!key) {
      return NextResponse.json({ error: 'Invalid image URL.' }, { status: 400 });
    }
    await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete image.' }, { status: 500 });
  }
} 