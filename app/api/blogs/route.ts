
// Blog status enum for type-safe assignment
const BlogStatusEnum = { PUBLISHED: 'PUBLISHED', UNPUBLISHED: 'UNPUBLISHED' } as const;
// API route for blog CRUD operations with improved readability, error handling, and type safety
import { NextRequest, NextResponse } from 'next/server';


import { prisma } from '../../../lib/prisma';

import { s3, DeleteObjectCommand } from '../../../lib/s3Client';



// Helper: Validate blog input (basic example)
interface BlogInput {
  title: string;
  excerpt: string;
  content: string;
  categoryId: string;
  tagIds: string[];
  status: string;
  imageUrl: string;
  [key: string]: unknown;
}

function validateBlogInput(data: BlogInput): boolean {
  return (
    typeof data.title === 'string' && data.title.trim().length >= 5 &&
    typeof data.excerpt === 'string' && data.excerpt.trim().length >= 20 &&
    typeof data.content === 'string' && data.content.trim().length >= 50 &&
    typeof data.categoryId === 'string' && data.categoryId.trim().length > 0 &&
    Array.isArray(data.tagIds) && data.tagIds.length >= 1 &&
    typeof data.status === 'string' && ['PUBLISHED', 'UNPUBLISHED'].includes(data.status) &&
    typeof data.imageUrl === 'string' && data.imageUrl.trim().length > 0
  );
}

// Helper: Slugify a string
function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Helper: Generate a unique slug for a blog
async function generateUniqueSlug(title: string, excludeId?: number) {
  const baseSlug = slugify(title);
  let slug = baseSlug;
  let count = 1;
  // Check for existing slugs in the database
  while (true) {
    const existing = await prisma.blog.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    });
    if (!existing) break;
    slug = `${baseSlug}-${count++}`;
  }
  return slug;
}

/**
 * GET /api/blogs
 * Returns all blogs with tags and category
 */
export async function GET(req: NextRequest) {
  try {
    const url = req.url.startsWith('http') ? req.url : `http://localhost${req.url}`;
    const { searchParams } = new URL(url);
    const id = searchParams.get('id');
    if (id) {
      const blog = await prisma.blog.findUnique({
        where: { id: Number(id) },
        include: { tags: true, category: true },
      });
      if (!blog) {
        return NextResponse.json({ error: 'Blog not found.' }, { status: 404 });
      }
      return NextResponse.json(blog);
    }
    // Pagination
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;
    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        skip,
        take: limit,
        include: { tags: true, category: true },
      }),
      prisma.blog.count(),
    ]);
    const publishedBlogs = blogs.filter(blog => (blog.status || '').toUpperCase() === 'PUBLISHED').length;
    const unpublishedBlogs = blogs.filter(blog => (blog.status || '').toUpperCase() === 'UNPUBLISHED').length;
    return NextResponse.json({
      blogs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      publishedBlogs,
      unpublishedBlogs,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch blogs.' }, { status: 500 });
  }
}

/**
 * POST /api/blogs
 * Creates a new blog
 */
import { requireAuth } from '../auth/utils';

export async function POST(req: NextRequest) {
  const session = await requireAuth(req);
  if (session instanceof NextResponse) return session;
  try {
    const data: BlogInput = await req.json();
    if (!validateBlogInput(data)) {
      return NextResponse.json({ error: 'Invalid input.' }, { status: 400 });
    }
    // Prepare data for Prisma
    const { id, tagIds, categoryId, title, excerpt, status, ...rest } = data;
    const slug = await generateUniqueSlug(title);
    const BlogStatusEnum = { PUBLISHED: 'PUBLISHED', UNPUBLISHED: 'UNPUBLISHED' } as const;
    const createData = {
      ...rest,
      title,
      slug,
      excerpt,
      status: (status && BlogStatusEnum[status as keyof typeof BlogStatusEnum]) || BlogStatusEnum.UNPUBLISHED,
      ...(tagIds ? { tags: { connect: tagIds.map((tagId: string) => ({ id: Number(tagId) })) } } : {}),
    };
    if (categoryId) {
      (createData as any).categoryId = Number(categoryId);
    }
    const blog = await prisma.blog.create({ data: createData });
    return NextResponse.json(blog);
  } catch (err) {
    console.error('Prisma error:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

/**
 * PUT /api/blogs
 * Updates an existing blog
 */
export async function PUT(req: NextRequest) {
  const session = await requireAuth(req);
  if (session instanceof NextResponse) return session;
  try {
    const data: BlogInput & { id: number; imageUrl: string } = await req.json();
    if (!data.id || !validateBlogInput(data)) {
      return NextResponse.json({ error: 'Invalid input.' }, { status: 400 });
    }
    // Fetch the existing blog to compare imageUrl
    const existingBlog = await prisma.blog.findUnique({ where: { id: Number(data.id) } });
    // Prepare data for Prisma
    const { id: updateId, tagIds, categoryId, title, excerpt, imageUrl, ...rest } = data;
    const slug = await generateUniqueSlug(title, Number(updateId));
    const updateData = {
      ...rest,
      title,
      slug,
      excerpt,
      imageUrl,
      status: (data.status && BlogStatusEnum[data.status as keyof typeof BlogStatusEnum]) || BlogStatusEnum.UNPUBLISHED,
      ...(tagIds ? { tags: { set: tagIds.map((tagId: string) => ({ id: Number(tagId) })) } } : {}),
    };
    if (categoryId) {
      (updateData as any).categoryId = Number(categoryId);
    }
    const blog = await prisma.blog.update({ where: { id: Number(updateId) }, data: updateData });
    // If imageUrl changed, delete the old image from S3
    if (existingBlog && existingBlog.imageUrl && existingBlog.imageUrl !== imageUrl) {
      const bucket = process.env.AWS_S3_BUCKET!;
      const key = existingBlog.imageUrl.split(`/${bucket}/`)[1] || existingBlog.imageUrl.split('/').pop();
      if (key) {
        await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
      }
    }
    return NextResponse.json(blog);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update blog.' }, { status: 500 });
  }
}

/**
 * DELETE /api/blogs
 * Deletes a blog by id
 */
export async function DELETE(req: NextRequest) {
  const session = await requireAuth(req);
  if (session instanceof NextResponse) return session;
  try {
    const { id }: { id: number } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Missing id.' }, { status: 400 });
    }
    // Fetch the blog to get the imageUrl before deleting
    const blog = await prisma.blog.findUnique({ where: { id } });
    if (blog && blog.imageUrl) {
      const bucket = process.env.AWS_S3_BUCKET!;
      const key = blog.imageUrl.split(`/${bucket}/`)[1] || blog.imageUrl.split('/').pop();
      if (key) {
        await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
      }
    }
    await prisma.blog.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete blog.' }, { status: 500 });
  }
}