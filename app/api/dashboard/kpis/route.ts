import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const [totalBlogs, totalCategories, totalTags] = await Promise.all([
    prisma.blog.count(),
    prisma.category.count(),
    prisma.tag.count(),
  ]);
  return NextResponse.json({
    totalBlogs,
    totalCategories,
    totalTags,
  });
} 