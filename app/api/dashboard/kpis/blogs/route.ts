import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const [totalBlogs, publishedBlogs, draftBlogs] = await Promise.all([
    prisma.blog.count(),
    prisma.blog.count({ where: { status: 'published' } }),
    prisma.blog.count({ where: { status: 'draft' } })
  ]);
  return NextResponse.json({
    totalBlogs,
    publishedBlogs,
    draftBlogs
  });
} 