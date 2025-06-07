import { PrismaClient } from '../../src/generated/prisma/index.js';

// test script to update all start times to now
const prisma = new PrismaClient();

async function main() {
  // update all appointments to start now
  const result = await prisma.appointment.updateMany({
    data: { start: new Date(Date.now()) },
  });
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });