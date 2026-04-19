import { prisma } from './index';
import { Country, UserRole, PropertyType, PropertyPurpose } from '../generated/client';

async function main(): Promise<void> {
  console.warn('Seeding database...');

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@afribayit.com' },
    update: {},
    create: {
      email: 'admin@afribayit.com',
      firstName: 'Admin',
      lastName: 'AfriBayit',
      role: UserRole.SUPER_ADMIN,
      country: Country.BJ,
    },
  });

  // Create sample property
  await prisma.property.upsert({
    where: { slug: 'villa-cocotiers-cotonou' },
    update: {},
    create: {
      slug: 'villa-cocotiers-cotonou',
      title: 'Villa Les Cocotiers — Cotonou Riviera',
      description:
        'Magnifique villa avec piscine en bord de mer. 4 chambres, salon spacieux, cuisine équipée. Accès direct à la plage.',
      type: PropertyType.VILLA,
      purpose: PropertyPurpose.SALE,
      price: 85000000,
      currency: 'XOF',
      surface: 350,
      rooms: 7,
      bedrooms: 4,
      bathrooms: 3,
      country: Country.BJ,
      city: 'Cotonou',
      district: 'Riviera',
      ownerId: admin.id,
    },
  });

  console.warn('Seed completed.');
}

main()
  .catch(console.error)
  .finally(() => {
    void prisma.$disconnect();
  });
