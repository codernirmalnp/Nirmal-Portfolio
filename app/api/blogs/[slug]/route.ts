import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// Use Prisma singleton

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slug) {
    return NextResponse.json({ error: 'Missing slug.' }, { status: 400 });
  }
  const blog = await prisma.blog.findUnique({
    where: { slug },
    include: { tags: true, category: true },
  });
  if (!blog) {
    return NextResponse.json({ error: 'Blog not found.' }, { status: 404 });
  }
  return NextResponse.json(blog);
} 