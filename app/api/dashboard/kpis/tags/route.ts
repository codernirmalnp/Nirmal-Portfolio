import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const [totalTags, totalBlogs] = await Promise.all([
    prisma.tag.count(),
    prisma.blog.count()
  ]);
  return NextResponse.json({
    totalTags,
    totalBlogs
  });
} 