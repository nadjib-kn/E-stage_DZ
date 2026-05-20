const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const updatedUser = await prisma.user.update({
    where: { email: 'adminppppp@gmail.com' },
    data: { role: 'admin' }
  });
  console.log('Promoted to Admin:', updatedUser.email);
}
main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
