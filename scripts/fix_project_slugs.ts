import { prisma } from '../lib/prisma';

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function main() {
  const projects = await prisma.project.findMany();
  for (const project of projects) {
    if (!project.slug) {
      const slug = slugify(project.title);
      await prisma.project.update({
        where: { id: project.id },
        data: { slug },
      });
      console.log(`Updated project ${project.id} with slug: ${slug}`);
    }
  }
  console.log('Done updating slugs.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 