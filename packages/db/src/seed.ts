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
  Currency,
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

  // --- ADDITIONAL PROPERTIES (CDC COMPLIANCE) ---
  const properties = [
    {
      slug: 'villa-moderne-cocody',
      title: "Villa d'Exception — Cocody Ambassades",
      description: 'Somptueuse villa de 6 pièces avec piscine et jardin paysager.',
      type: PropertyType.HOUSE,
      purpose: PropertyPurpose.SALE,
      price: 450000000,
      currency: Currency.XOF,
      surface: 800,
      country: Country.CI,
      city: 'Abidjan',
      district: 'Cocody',
      ownerId: admin.id,
      isVerified: true,
    },
    {
      slug: 'duplex-plateau-dakar',
      title: 'Duplex Vue Mer — Plateau Dakar',
      description: 'Haut standing au cœur de la capitale sénégalaise.',
      type: PropertyType.APARTMENT,
      purpose: PropertyPurpose.RENT,
      price: 2500000,
      currency: Currency.XOF,
      surface: 250,
      country: Country.SN,
      city: 'Dakar',
      district: 'Plateau',
      ownerId: admin.id,
      isVerified: true,
    },
    {
      slug: 'terrain-agricole-togo',
      title: 'Domaine Agricole — Région des Plateaux',
      description: '10 hectares fertiles avec accès eau et électricité.',
      type: PropertyType.LAND,
      purpose: PropertyPurpose.SALE,
      price: 25000000,
      currency: Currency.XOF,
      surface: 100000,
      country: Country.TG,
      city: 'Kpalimé',
      district: 'Agou',
      ownerId: admin.id,
      isVerified: true,
    },
  ];

  for (const p of properties) {
    await prisma.property.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
  }

  // --- ADDITIONAL ARTISANS ---
  const artisans = [
    {
      email: 'elect@afribayit.com',
      firstName: 'Moussa',
      lastName: 'Électricien',
      role: UserRole.ARTISAN,
      country: Country.SN,
      company: 'Dakar Énergie',
      slug: 'dakar-energie-moussa',
      category: 'ELECTRICIAN',
    },
    {
      email: 'archi@afribayit.com',
      firstName: 'Sarah',
      lastName: 'Architecte',
      role: UserRole.ARTISAN,
      country: Country.CI,
      company: 'Abidjan Design Studio',
      slug: 'abidjan-design-studio-sarah',
      category: 'ARCHITECT',
    },
  ];

  for (const a of artisans) {
    await prisma.user.upsert({
      where: { email: a.email },
      update: {},
      create: {
        email: a.email,
        firstName: a.firstName,
        lastName: a.lastName,
        role: a.role,
        country: a.country,
        artisanProfile: {
          create: {
            companyName: a.company,
            slug: a.slug,
            category: a.category as any,
            bio: `Expert ${a.category.toLowerCase()} avec 10 ans d'expérience.`,
            city: a.country === Country.SN ? 'Dakar' : 'Abidjan',
            country: a.country,
            isCertified: true,
            rating: 4.9,
            phone: '+2250102030405',
          },
        },
      },
    });
  }

  // --- COMMUNITY (LINKEDIN STYLE) ---
  const groups = await Promise.all([
    prisma.communityGroup.upsert({
      where: { slug: 'investisseurs-diaspora' },
      update: {},
      create: {
        name: 'Cercle des Investisseurs de la Diaspora',
        slug: 'investisseurs-diaspora',
        description: 'Échanges exclusifs sur les opportunités foncières pour la diaspora.',
        category: 'Investissement',
        creatorId: admin.id,
      },
    }),
    prisma.communityGroup.upsert({
      where: { slug: 'droit-foncier-benin' },
      update: {},
      create: {
        name: 'Droit Foncier & Urbanisme (Bénin)',
        slug: 'droit-foncier-benin',
        description: 'Discussions sur la législation et les procédures notariales.',
        category: 'Juridique',
        creatorId: admin.id,
      },
    }),
  ]);

  const posts = [
    {
      title: 'Comment sécuriser son achat de terrain à Fidjrossè ?',
      content: 'Voici les 5 étapes indispensables avant de verser le premier franc...',
      category: 'Conseils',
      slug: 'securiser-achat-terrain-fidjrosse',
    },
    {
      title: "Analyse : L'impact du nouveau pont de Cotonou sur l'immobilier",
      content: 'Les prix au m² dans la zone X ont grimpé de 15% en 6 mois...',
      category: 'Analyse de marché',
      slug: 'impact-nouveau-pont-cotonou',
    },
  ];

  for (const post of posts) {
    await prisma.communityPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        ...post,
        authorId: admin.id,
      },
    });
  }

  // --- ACADEMY (ADDITIONAL COURSES) ---
  await prisma.course.upsert({
    where: { slug: 'gestion-locative-moderne' },
    update: {},
    create: {
      slug: 'gestion-locative-moderne',
      title: 'Optimiser sa Gestion Locative à Dakar',
      description: 'Utilisez les outils digitaux pour gérer vos locataires à distance.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a',
      price: 35000,
      currency: 'XOF',
      isPublished: true,
      level: CourseLevel.INTERMEDIATE,
      instructorId: admin.id,
    },
  });

  // Create Transaction & Assignments (Keep original logic but ensure it links correctly)
  const existingTransaction = await prisma.transaction.findFirst({
    where: { propertyId: property.id, buyerId: buyer.id },
  });

  if (!existingTransaction) {
    await prisma.transaction.create({
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
  }

  // --- ESCROW & PAYMENTS ---
  const transaction = await prisma.transaction.findFirst({
    where: { propertyId: property.id, buyerId: buyer.id },
  });

  if (transaction) {
    await prisma.escrow.upsert({
      where: { transactionId: transaction.id },
      update: {},
      create: {
        transactionId: transaction.id,
        amount: 15000000,
        commission: 750000,
        status: 'FUNDED',
        conditions: { buyerConfirm: false, docsValid: true, inspectionValid: false },
      },
    });

    await prisma.payment.create({
      data: {
        transactionId: transaction.id,
        method: 'MOBILE_MONEY_FEDAPAY',
        amount: 15000000,
        currency: Currency.XOF,
        providerRef: 'FEDA_TEST_123',
        providerStatus: 'SUCCESS',
      },
    });
  }

  // --- REVIEWS & REPUTATION ---
  await prisma.review.create({
    data: {
      authorId: buyer.id,
      targetId: admin.id, // Assuming admin is the seller
      propertyId: property.id,
      rating: 5,
      comment: 'Transaction fluide et sécurisée. Je recommande vivement AfriBayit.',
    },
  });

  await prisma.review.create({
    data: {
      authorId: buyer.id,
      targetId: admin.id, // Using admin as a fallback target
      rating: 4,
      comment: 'Excellent travail sur le chantier de rénovation.',
    },
  });

  // --- NOTIFICATIONS ---
  await prisma.notification.create({
    data: {
      userId: buyer.id,
      type: 'TRANSACTION_UPDATE',
      title: 'Paiement Sécurisé',
      body: 'Votre fonds de 15,000,000 XOF a été sécurisé sur le compte Escrow.',
      isRead: false,
    },
  });

  // --- CONVERSATIONS & MESSAGES ---
  const conversation = await prisma.conversation.upsert({
    where: {
      participantA_participantB: {
        participantA: buyer.id,
        participantB: admin.id,
      },
    },
    update: { lastMessageAt: new Date() },
    create: {
      participantA: buyer.id,
      participantB: admin.id,
      lastMessageAt: new Date(),
    },
  });

  await prisma.directMessage.create({
    data: {
      conversationId: conversation.id,
      senderId: buyer.id,
      content: 'Bonjour, le terrain est-il toujours disponible ?',
    },
  });

  // --- SUBSCRIPTIONS / PREMIUM ---
  await prisma.subscription.create({
    data: {
      userId: admin.id, // Assuming admin has a Pro/Agency plan
      planId: 'PRO_ESSENTIAL',
      status: 'ACTIVE',
      priceXOF: 50000,
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // 1 year later
      autoRenew: true,
    },
  });

  // --- FAVORITES ---
  await prisma.favorite.upsert({
    where: { userId_propertyId: { userId: buyer.id, propertyId: property.id } },
    update: {},
    create: { userId: buyer.id, propertyId: property.id },
  });

  console.warn(
    'Seed completed successfully with test data for ALL platform tables (Properties, Escrow, Messages, Reviews, Notifications, Premium, etc.).',
  );
}

main()
  .catch(console.error)
  .finally(() => {
    void prisma.$disconnect();
  });
