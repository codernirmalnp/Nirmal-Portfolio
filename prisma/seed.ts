const { prisma } = require('../lib/prisma');
const bcrypt = require('bcryptjs');

async function main() {
  const password = await bcrypt.hash('Dopamin@2025', 10);
  const email = 'admin@admin.com';

  // Upsert: create if not exists, update if exists
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name: 'Admin',
      email,
      password,
    },
  });

  console.log('Default admin user created/ensured.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 