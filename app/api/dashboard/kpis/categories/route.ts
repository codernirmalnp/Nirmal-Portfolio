import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const [totalCategories, totalBlogs] = await Promise.all([
    prisma.category.count(),
    prisma.blog.count()
  ]);
  return NextResponse.json({
    totalCategories,
    totalBlogs
  });
} 