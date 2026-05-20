const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 3
  });
  console.log(users.map(u => ({ email: u.email, role: u.role, createdAt: u.createdAt })));
}
main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
