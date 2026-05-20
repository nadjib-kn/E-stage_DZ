const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany({ where: { role: 'student' } });
  console.log(users);
}
main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
