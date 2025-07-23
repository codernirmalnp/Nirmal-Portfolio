import { requireAuth } from '../auth/utils';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

interface CategoryInput {
  name: string;
  description: string;
}

function validateCategoryInput(data: CategoryInput) {
  return (
    typeof data.name === 'string' && data.name.trim().length >= 2 &&
    typeof data.description === 'string' && data.description.trim().length >= 10
  );
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const skip = (page - 1) * limit;
  const [categories, totalBlogs, totalCategories] = await Promise.all([
    prisma.category.findMany({ skip, take: limit, include: { blogs: true } }),
    prisma.blog.count(),
    prisma.category.count()
  ]);
  const categoriesWithBlogCount = categories.map(category => ({
    ...category,
    blogCount: category.blogs.length
  }));
  return NextResponse.json({
    categories: categoriesWithBlogCount,
    totalBlogs,
    totalCategories,
    page,
    totalPages: Math.ceil(totalCategories / limit)
  });
}

export async function POST(req: NextRequest) {
  const session = await requireAuth(req);
  if (session instanceof NextResponse) return session;
  const data = await req.json();
  if (!validateCategoryInput(data)) {
    return NextResponse.json({ error: 'Invalid input.' }, { status: 400 });
  }
  const category = await prisma.category.create({ data });
  return NextResponse.json(category);
}

export async function PUT(req: NextRequest) {
  const session = await requireAuth(req);
  if (session instanceof NextResponse) return session;
  const data = await req.json();
  if (!validateCategoryInput(data)) {
    return NextResponse.json({ error: 'Invalid input.' }, { status: 400 });
  }
  const category = await prisma.category.update({ where: { id: data.id }, data });
  return NextResponse.json(category);
}

export async function DELETE(req: NextRequest) {
  const session = await requireAuth(req);
  if (session instanceof NextResponse) return session;
  const { id } = await req.json();
  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ success: true });
} 