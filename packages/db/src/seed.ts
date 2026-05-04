import { prisma } from './index';
import {
  Country,
  UserRole,
  PropertyType,
  PropertyPurpose,
  KycLevel,
  CourseLevel,
  HotelRoomType,
  TransactionType,
  TransactionStatus,
} from '../generated/client';

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

  // Create Notary
  const notary = await prisma.user.upsert({
    where: { email: 'notaire@afribayit.com' },
    update: {},
    create: {
      email: 'notaire@afribayit.com',
      firstName: 'Jean',
      lastName: 'Notaire',
      role: UserRole.NOTARY,
      country: Country.BJ,
      kycLevel: KycLevel.LEVEL_3,
      notaryProfile: {
        create: {
          chamberId: 'CHB-BJ-001',
          jurisdiction: Country.BJ,
          city: 'Cotonou',
          isAvailable: true,
        },
      },
    },
    include: { notaryProfile: true },
  });

  // Create Surveyor
  const surveyor = await prisma.user.upsert({
    where: { email: 'geometre@afribayit.com' },
    update: {},
    create: {
      email: 'geometre@afribayit.com',
      firstName: 'Marc',
      lastName: 'Géomètre',
      role: UserRole.SURVEYOR,
      country: Country.BJ,
      kycLevel: KycLevel.LEVEL_2,
      surveyorProfile: {
        create: {
          licenseNumber: 'GEO-BJ-001',
          jurisdiction: Country.BJ,
          city: 'Cotonou',
        },
      },
    },
    include: { surveyorProfile: true },
  });

  // Create Ambassador
  await prisma.user.upsert({
    where: { email: 'ambassadeur@afribayit.com' },
    update: {},
    create: {
      email: 'ambassadeur@afribayit.com',
      firstName: 'Awa',
      lastName: 'Ambassadrice',
      role: UserRole.INVESTOR,
      country: Country.CI,
      referralCode: 'AWA2025',
      points: 450,
    },
  });

  // Create GeoTrust Property with DroneMapping
  const property = await prisma.property.upsert({
    where: { slug: 'terrain-geotrust-calavi' },
    update: {},
    create: {
      slug: 'terrain-geotrust-calavi',
      title: 'Terrain Sécurisé avec Titre Foncier — Abomey-Calavi',
      description:
        'Superbe parcelle de 500m2 avec titre foncier vérifié. Idéal pour construction immédiate.',
      type: PropertyType.LAND,
      purpose: PropertyPurpose.SALE,
      price: 15000000,
      currency: 'XOF',
      surface: 500,
      country: Country.BJ,
      city: 'Abomey-Calavi',
      district: 'Zoca',
      ownerId: admin.id,
      isVerified: true,
      droneData: {
        create: {
          orthophotoUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
          polygonData: {
            type: 'Polygon',
            coordinates: [
              [
                [2.35, 6.45],
                [2.36, 6.45],
                [2.36, 6.46],
                [2.35, 6.46],
                [2.35, 6.45],
              ],
            ],
          },
          area: 500,
          capturedAt: new Date(),
          surveyorId: surveyor.surveyorProfile!.id,
        },
      },
    },
  });

  // Create Academy Course
  await prisma.course.upsert({
    where: { slug: 'investissement-immobilier-afrique' },
    update: {},
    create: {
      slug: 'investissement-immobilier-afrique',
      title: "Maîtriser l'Investissement Immobilier en Afrique",
      description: 'Apprenez les bases pour sécuriser vos achats fonciers.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa',
      price: 50000,
      currency: 'XOF',
      isPublished: true,
      level: CourseLevel.BEGINNER,
      instructorId: admin.id,
      lessons: {
        create: [
          {
            title: '1. Comprendre le Titre Foncier',
            content: 'Le titre foncier est le document ultime...',
            order: 1,
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          },
          {
            title: '2. Les pièges à éviter',
            content: 'Ne jamais acheter sans vérification géomètre...',
            order: 2,
          },
        ],
      },
    },
  });

  // Create Artisan
  await prisma.user.upsert({
    where: { email: 'artisan@afribayit.com' },
    update: {},
    create: {
      email: 'artisan@afribayit.com',
      firstName: 'Koffi',
      lastName: 'Maçon',
      role: UserRole.ARTISAN,
      country: Country.BJ,
      artisanProfile: {
        create: {
          companyName: 'Koffi BTP Services',
          slug: 'koffi-btp-services-cotonou',
          category: 'MASON',
          bio: 'Expert en construction de villas et rénovation.',
          city: 'Cotonou',
          country: Country.BJ,
          isCertified: true,
          rating: 4.8,
          phone: '+22997000001',
          services: {
            create: [
              { name: 'Gros Œuvre', price: 50000, priceUnit: 'PROJECT' },
              { name: 'Rénovation Façade', price: 5000, priceUnit: 'SQMETER' },
            ],
          },
        },
      },
    },
  });

  // Create Rental Property
  await prisma.property.upsert({
    where: { slug: 'appartement-chic-fidjrosse' },
    update: {},
    create: {
      slug: 'appartement-chic-fidjrosse',
      title: 'Appartement de Luxe — Fidjrossè Plage',
      description: 'Appartement 3 chambres tout confort avec vue sur mer.',
      type: PropertyType.APARTMENT,
      purpose: PropertyPurpose.RENT,
      price: 500000,
      currency: 'XOF',
      bedrooms: 3,
      bathrooms: 2,
      surface: 120,
      country: Country.BJ,
      city: 'Cotonou',
      district: 'Fidjrossè',
      ownerId: admin.id,
      isVerified: true,
    },
  });

  // Create Hotel
  await prisma.hotel.upsert({
    where: { slug: 'residence-afribayit-cotonou' },
    update: {},
    create: {
      slug: 'residence-afribayit-cotonou',
      name: 'Résidence AfriBayit Prestige',
      description: 'Hôtel de standing au cœur de Cotonou.',
      starRating: 4,
      country: Country.BJ,
      city: 'Cotonou',
      address: 'Haie Vive',
      isPublished: true,
      rooms: {
        create: [
          {
            type: HotelRoomType.DELUXE,
            name: 'Chambre Executive',
            pricePerNight: 75000,
            capacity: 2,
            isAvailable: true,
          },
        ],
      },
    },
  });

  // Create Test Buyer
  const buyer = await prisma.user.upsert({
    where: { email: 'buyer@afribayit.com' },
    update: {},
    create: {
      email: 'buyer@afribayit.com',
      firstName: 'Alain',
      lastName: 'Acheteur',
      role: UserRole.BUYER,
      country: Country.BJ,
      passwordHash: await require('bcryptjs').hash('AfriBayit2025!', 12),
    },
  });

  // Create Transaction & Assignments
  const transaction = await prisma.transaction.create({
    data: {
      type: TransactionType.PROPERTY_PURCHASE,
      status: TransactionStatus.INITIATED,
      amount: 15000000,
      currency: 'XOF',
      buyerId: buyer.id,
      sellerId: admin.id,
      propertyId: property.id,
      notaryAssignment: {
        create: {
          notaryId: notary.notaryProfile!.id,
          status: 'ASSIGNED',
        },
      },
      surveyAssignment: {
        create: {
          surveyorId: surveyor.surveyorProfile!.id,
          propertyId: property.id,
          status: 'PENDING',
        },
      },
    },
  });

  console.warn(
    'Seed completed successfully with test data for all modules (Properties, Hotels, Academy, Artisans, GeoTrust, Notary, Surveyor).',
  );
}

main()
  .catch(console.error)
  .finally(() => {
    void prisma.$disconnect();
  });
