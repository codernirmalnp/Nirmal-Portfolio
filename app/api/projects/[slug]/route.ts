import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slug) {
    return NextResponse.json({ error: 'Missing slug.' }, { status: 400 });
  }
  // Find project by slug
  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      tags: { include: { tag: true } },
      categories: { include: { category: true } },
    },
  });
  if (!project) {
    return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
  }
  // Map tags and categories to { id, name }
  const tags = project.tags.map((pt: any) => ({ id: pt.tagId, name: pt.tag?.name }));
  const categories = project.categories.map((pc: any) => ({ id: pc.categoryId, name: pc.category?.name }));
  return NextResponse.json({ project: { ...project, tags, categories } });
} 