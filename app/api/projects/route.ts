import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { s3, DeleteObjectCommand } from '../../../lib/s3Client';

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
function validateProjectInput(data: any): boolean {
  return (
    typeof data.title === 'string' && data.title.trim().length >= 3 &&
    typeof data.description === 'string' && data.description.trim().length >= 20 &&
    Array.isArray(data.tagIds) && data.tagIds.length >= 1 && data.tagIds.every((t: any) => typeof t === 'number') &&
    Array.isArray(data.categoryIds) && data.categoryIds.length >= 1 && data.categoryIds.every((c: any) => typeof c === 'number') &&
    typeof data.status === 'string' && ['active', 'completed', 'archived'].includes(data.status) &&
    (typeof data.projectUrl === 'undefined' || (typeof data.projectUrl === 'string' && (data.projectUrl === '' || isValidUrl(data.projectUrl)))) &&
    (typeof data.githubUrl === 'undefined' || (typeof data.githubUrl === 'string' && (data.githubUrl === '' || isValidUrl(data.githubUrl)))) &&
    typeof data.imageUrl === 'string' && data.imageUrl.trim().length > 0
  );
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (id) {
    // Fetch a single project by id
    const projectId = typeof id === 'string' ? parseInt(id, 10) : id;
    if (isNaN(projectId)) {
      return NextResponse.json({ error: 'Invalid project id' }, { status: 400 });
    }
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        tags: { include: { tag: true } },
        categories: { include: { category: true } },
      },
    });
    if (project) {
      // Map tags and categories to { id, name }
      const tags = project.tags.map((pt: any) => ({ id: pt.tagId, name: pt.tag?.name }));
      const categories = project.categories.map((pc: any) => ({ id: pc.categoryId, name: pc.category?.name }));
      return NextResponse.json({ project: { ...project, tags, categories } });
    }
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const skip = (page - 1) * limit;
  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      skip,
      take: limit,
      include: {
        tags: { include: { tag: true } },
        categories: { include: { category: true } },
      },
    }),
    prisma.project.count(),
  ]);
  // Map tags and categories for each project
  const mappedProjects = projects.map((project: any) => ({
    ...project,
    tags: project.tags.map((pt: any) => ({ id: pt.tagId, name: pt.tag?.name })),
    categories: project.categories.map((pc: any) => ({ id: pc.categoryId, name: pc.category?.name })),
  }));
  return NextResponse.json({ projects: mappedProjects, total, page, totalPages: Math.ceil(total / limit) });
}
import { requireAuth } from '../auth/utils';

export async function POST(req: NextRequest) {
  const session = await requireAuth(req);
  if ((session as any).status === 401) return session;
  try {
    const data = await req.json();
    if (!validateProjectInput(data)) {
      return NextResponse.json({ error: 'Invalid input.' }, { status: 400 });
    }
    try {
      const { tagIds, categoryIds, ...rest } = data;
      if (!Array.isArray(tagIds) || tagIds.length === 0 || !Array.isArray(categoryIds) || categoryIds.length === 0) {
        return NextResponse.json({ error: 'At least one tag and one category are required.' }, { status: 400 });
      }
      const project = await prisma.project.create({
        data: {
          ...rest,
          tags: {
            create: tagIds.map((tagId: string | number) => ({ tagId: Number(tagId) }))
          },
          categories: {
            create: categoryIds.map((categoryId: string | number) => ({ categoryId: Number(categoryId) }))
          }
        },
        include: {
          tags: true
        }
      });
      return NextResponse.json(project);
    } catch (dbError) {
      console.error('Database error (create project):', dbError);
      return NextResponse.json({ error: 'Database error: ' + (dbError instanceof Error ? dbError.message : String(dbError)) }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create project.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await requireAuth(req);
  if ((session as any).status === 401) return session;
  try {
    const data = await req.json();
    if (!validateProjectInput(data)) {
      return NextResponse.json({ error: 'Invalid input.' }, { status: 400 });
    }
    try {
      const { tagIds, categoryIds, ...rest } = data;
      if (!Array.isArray(tagIds) || tagIds.length === 0 || !Array.isArray(categoryIds) || categoryIds.length === 0) {
        return NextResponse.json({ error: 'At least one tag and one category are required.' }, { status: 400 });
      }
      // Fetch the existing project to compare imageUrl
      const existingProject = await prisma.project.findUnique({ where: { id: data.id } });
      // Disconnect all tags and categories, then connect new ones
      const project = await prisma.project.update({
        where: { id: data.id },
        data: {
          ...rest,
          tags: {
            deleteMany: {},
            create: tagIds.map((tagId: string | number) => ({ tagId: Number(tagId) }))
          },
          categories: {
            deleteMany: {},
            create: categoryIds.map((categoryId: string | number) => ({ categoryId: Number(categoryId) }))
          }
        },
        include: {
          tags: true
        }
      });
      // If imageUrl changed, delete the old image from S3
      if (existingProject && existingProject.imageUrl && existingProject.imageUrl !== data.imageUrl) {
        const bucket = process.env.AWS_S3_BUCKET!;
        const key = existingProject.imageUrl.split(`/${bucket}/`)[1] || existingProject.imageUrl.split('/').pop();
        if (key) {
          await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
        }
      }
      return NextResponse.json(project);
    } catch (dbError) {
      console.error('Database error (update project):', dbError);
      return NextResponse.json({ error: 'Database error: ' + (dbError instanceof Error ? dbError.message : String(dbError)) }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update project.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await requireAuth(req);
  if ((session as any).status === 401) return session;
  const { id } = await req.json();
  // Fetch the project to get the imageUrl before deleting
  const project = await prisma.project.findUnique({ where: { id } });
  let imageDeleteWarning = null;
  if (project && project.imageUrl) {
    try {
      const bucket = process.env.AWS_S3_BUCKET!;
      let key = null;
      // Try to extract the key from different possible URL formats
      if (project.imageUrl.includes(`/${bucket}/`)) {
        key = project.imageUrl.split(`/${bucket}/`)[1];
      } else if (project.imageUrl.includes(`${bucket}.s3`)) {
        // e.g. https://mybucket.s3.amazonaws.com/key
        const url = new URL(project.imageUrl);
        key = url.pathname.startsWith('/') ? url.pathname.slice(1) : url.pathname;
      } else {
        // fallback: last segment
        key = project.imageUrl.split('/').pop();
      }
      if (key) {
        await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
      } else {
        imageDeleteWarning = 'Could not determine S3 key for image deletion.';
        console.warn(imageDeleteWarning, project.imageUrl);
      }
    } catch (err) {
      imageDeleteWarning = 'Failed to delete image from S3: ' + (err instanceof Error ? err.message : String(err));
      console.error(imageDeleteWarning);
    }
  }
  let dbDeleteError = null;
  try {
    // Delete related ProjectCategory and ProjectTag entries before deleting the project
    await prisma.projectCategory.deleteMany({ where: { projectId: id } });
    await prisma.projectTag.deleteMany({ where: { projectId: id } });
    // Now delete the project
    await prisma.project.delete({ where: { id } });
  } catch (err) {
    dbDeleteError = 'Failed to delete project from database: ' + (err instanceof Error ? err.message : String(err));
    console.error(dbDeleteError);
    return NextResponse.json({ success: false, imageDeleteWarning, dbDeleteError }, { status: 500 });
  }
  return NextResponse.json({ success: true, imageDeleteWarning });
} 