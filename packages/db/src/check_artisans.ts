import { prisma } from './index';

async function main() {
  const count = await prisma.artisan.count();
  console.log('Artisan count:', count);
  if (count > 0) {
    const all = await prisma.artisan.findMany({ take: 5 });
    console.log('Artisans found:', all.length);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
