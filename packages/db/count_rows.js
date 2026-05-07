const { PrismaClient } = require('./generated/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.user.count();
    const props = await prisma.property.count();
    const courses = await prisma.course.count();
    const transactions = await prisma.transaction.count();
    const escrow = await prisma.escrow.count();
    const subs = await prisma.subscription.count();
    
    console.log(`Users: ${users}, Properties: ${props}, Courses: ${courses}, Transactions: ${transactions}, Escrow: ${escrow}, Subscriptions: ${subs}`);
  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
