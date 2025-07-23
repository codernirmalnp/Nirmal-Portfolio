import { requireAuth } from '../auth/utils';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

interface TagInput {
  name: string;
  color: string;
}

function validateTagInput(data: TagInput) {
  return (
    typeof data.name === 'string' && data.name.trim().length >= 2 &&
    typeof data.color === 'string' && /^#[0-9A-F]{6}$/i.test(data.color)
  );
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const skip = (page - 1) * limit;
  const [tags, totalBlogs, totalTags] = await Promise.all([
    prisma.tag.findMany({ skip, take: limit, include: { blogs: true } }),
    prisma.blog.count(),
    prisma.tag.count()
  ]);
  const tagsWithBlogCount = tags.map(tag => ({
    ...tag,
    blogCount: tag.blogs.length
  }));
  return NextResponse.json({
    tags: tagsWithBlogCount,
    totalBlogs,
    totalTags,
    page,
    totalPages: Math.ceil(totalTags / limit)
  });
}

export async function POST(req: NextRequest) {
  const session = await requireAuth(req);
  if ((session as { status?: number })?.status === 401) return session;
  const data = await req.json();
  if (!validateTagInput(data)) {
    return NextResponse.json({ error: 'Invalid input.' }, { status: 400 });
  }
  const tag = await prisma.tag.create({ data });
  return NextResponse.json(tag);
}

export async function PUT(req: NextRequest) {
  const session = await requireAuth(req);
  if ((session as { status?: number })?.status === 401) return session;
  const data = await req.json();
  if (!validateTagInput(data)) {
    return NextResponse.json({ error: 'Invalid input.' }, { status: 400 });
  }
  const tag = await prisma.tag.update({ where: { id: data.id }, data });
  return NextResponse.json(tag);
}

export async function DELETE(req: NextRequest) {
  const session = await requireAuth(req);
  if ((session as { status?: number })?.status === 401) return session;
  const { id } = await req.json();
  await prisma.tag.delete({ where: { id } });
  return NextResponse.json({ success: true });
} 