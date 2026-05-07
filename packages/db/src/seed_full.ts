import { prisma } from './index';
import {
  Country,
  Currency,
  BookingStatus,
  NotificationChannel,
  NotificationCategory,
} from '../generated/client';

async function main() {
  console.warn('Full seed — populating all empty tables...');

  // Fetch existing users
  const admin = await prisma.user.findFirstOrThrow({ where: { email: 'admin@afribayit.com' } });
  const buyer = await prisma.user.findFirstOrThrow({ where: { email: 'buyer@afribayit.com' } });
  const notaryUser = await prisma.user.findFirstOrThrow({
    where: { email: 'notaire@afribayit.com' },
  });
  const notary = await prisma.notary.findFirstOrThrow({ where: { userId: notaryUser.id } });
  const property = await prisma.property.findFirstOrThrow({
    where: { slug: 'terrain-geotrust-calavi' },
  });
  const course = await prisma.course.findFirstOrThrow({
    where: { slug: 'investissement-immobilier-afrique' },
  });
  const hotel = await prisma.hotel.findFirstOrThrow({
    where: { slug: 'residence-afribayit-cotonou' },
  });
  const hotelRoom = await prisma.hotelRoom.findFirstOrThrow({ where: { hotelId: hotel.id } });
  const artisan = await prisma.artisan.findFirst();
  if (!artisan) {
    console.error('CRITICAL: No artisan found in DB!');
    const count = await prisma.artisan.count();
    console.log('Artisan count:', count);
    throw new Error('Seeding aborted: No artisan found.');
  }
  console.log('Using artisan:', artisan.companyName);

  // 1. WALLETS
  await prisma.wallet.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      balanceAvailable: 5000000,
      totalTransacted: 15000000,
      currency: Currency.XOF,
    },
  });
  await prisma.wallet.upsert({
    where: { userId: buyer.id },
    update: {},
    create: { userId: buyer.id, balanceAvailable: 2000000, currency: Currency.XOF },
  });

  // 2. KYC DOCUMENTS
  await prisma.kycDocument.create({
    data: {
      userId: buyer.id,
      type: 'ID_CARD',
      fileUrl: 'https://example.com/kyc/cni_buyer.pdf',
      fileKey: 'kyc/cni_buyer.pdf',
      status: 'APPROVED',
      level: 'LEVEL_1',
      aiStatus: 'VALID',
      aiScore: 97.5,
    },
  });

  // 3. PROPERTY IMAGES
  for (const prop of await prisma.property.findMany()) {
    await prisma.propertyImage.create({
      data: {
        propertyId: prop.id,
        url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6',
        fileKey: `props/${prop.slug}/main.jpg`,
        isPrimary: true,
        order: 1,
      },
    });
  }

  // 4. VIRTUAL TOURS
  await prisma.virtualTour.create({
    data: {
      propertyId: property.id,
      title: 'Visite Virtuelle 360° — Terrain Calavi',
      url: 'https://kuula.co/share/sample-tour',
      type: 'IFRAME',
    },
  });

  // 5. LISTING AI SCORES
  await prisma.listingAIScore.upsert({
    where: { propertyId: property.id },
    update: {},
    create: {
      propertyId: property.id,
      totalScore: 92,
      completenessScore: 95,
      priceCoherenceScore: 88,
      certificationScore: 93,
      fraudFlags: [],
    },
  });

  // 6. HOTEL BOOKINGS
  const hotelBooking = await prisma.hotelBooking.create({
    data: {
      hotelId: hotel.id,
      roomId: hotelRoom.id,
      userId: buyer.id,
      checkIn: new Date('2025-08-15'),
      checkOut: new Date('2025-08-18'),
      guests: 2,
      totalPrice: 225000,
      currency: Currency.XOF,
      status: BookingStatus.CONFIRMED,
    },
  });

  // 7. ENROLLMENTS
  const enrollment = await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: buyer.id, courseId: course.id } },
    update: {},
    create: { userId: buyer.id, courseId: course.id, progress: 45 },
  });

  // 8. LESSON PROGRESS
  const lesson = await prisma.lesson.findFirst({ where: { courseId: course.id } });
  if (lesson) {
    await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId: buyer.id, lessonId: lesson.id } },
      update: {},
      create: { userId: buyer.id, lessonId: lesson.id, isCompleted: true },
    });
  }

  // 9. QUIZ
  const quiz = await prisma.quiz.upsert({
    where: { courseId: course.id },
    update: {},
    create: {
      courseId: course.id,
      title: 'Quiz Final — Titre Foncier',
      passingScore: 70,
      questions: {
        create: [
          {
            text: "Quel document prouve la propriété d'un terrain ?",
            options: ['Contrat privé', 'Titre Foncier', 'Reçu de paiement', 'Attestation'],
            answer: 1,
            order: 1,
          },
          {
            text: 'Qui délivre le Titre Foncier au Bénin ?',
            options: ['Mairie', 'Préfecture', 'ANDF', 'Notaire'],
            answer: 2,
            order: 2,
          },
        ],
      },
    },
  });

  // 10. QUIZ ATTEMPT & CERTIFICATE
  const attempt = await prisma.quizAttempt.create({
    data: {
      quizId: quiz.id,
      userId: buyer.id,
      answers: [1, 2],
      score: 100,
      passed: true,
    },
  });
  await prisma.certificate.upsert({
    where: { userId_courseId: { userId: buyer.id, courseId: course.id } },
    update: {},
    create: {
      userId: buyer.id,
      courseId: course.id,
      attemptId: attempt.id,
      score: 100,
    },
  });

  // 11. FOLLOWS & CONNECTIONS (Social)
  await prisma.follow.upsert({
    where: { followerId_followedId: { followerId: buyer.id, followedId: admin.id } },
    update: {},
    create: { followerId: buyer.id, followedId: admin.id },
  });
  await prisma.connection.upsert({
    where: { senderId_receiverId: { senderId: buyer.id, receiverId: admin.id } },
    update: {},
    create: { senderId: buyer.id, receiverId: admin.id, status: 'ACCEPTED' },
  });

  // 12. GROUP MEMBERS
  const group = await prisma.communityGroup.findFirstOrThrow();
  await prisma.groupMember.upsert({
    where: { userId_groupId: { userId: buyer.id, groupId: group.id } },
    update: {},
    create: { userId: buyer.id, groupId: group.id, role: 'MEMBER' },
  });

  // 13. POST LIKES & COMMENTS
  const post = await prisma.communityPost.findFirstOrThrow();
  await prisma.postLike.upsert({
    where: { postId_userId: { postId: post.id, userId: buyer.id } },
    update: {},
    create: { postId: post.id, userId: buyer.id },
  });
  await prisma.postComment.create({
    data: {
      postId: post.id,
      authorId: buyer.id,
      content: 'Très bon article, merci pour les conseils !',
    },
  });

  // 14. PROFILE VIEWS
  await prisma.profileView.create({ data: { viewedId: admin.id, viewerId: buyer.id } });

  // 15. SKILL ENDORSEMENTS
  await prisma.skillEndorsement.create({
    data: { targetId: admin.id, authorId: buyer.id, skill: 'Droit Foncier' },
  });

  // 16. NOTIFICATION PREFERENCES
  await prisma.notificationPreference.upsert({
    where: {
      userId_category_channel: {
        userId: buyer.id,
        category: NotificationCategory.TRANSACTION,
        channel: NotificationChannel.EMAIL,
      },
    },
    update: {},
    create: {
      userId: buyer.id,
      category: NotificationCategory.TRANSACTION,
      channel: NotificationChannel.EMAIL,
      isEnabled: true,
    },
  });

  // 17. NOTARY REVIEW
  await prisma.notaryReview.create({
    data: {
      notaryId: notary.id,
      userId: buyer.id,
      rating: 5,
      comment: 'Très professionnel et réactif.',
    },
  });

  // 18. ARTISAN PROJECT
  await prisma.artisanProject.create({
    data: {
      artisanId: artisan.id,
      title: 'Villa R+2 — Cotonou',
      description: "Construction complète d'une villa de 300m².",
      year: 2024,
    },
  });

  // 19. LEDGER ENTRIES
  const wallet = await prisma.wallet.findFirstOrThrow({ where: { userId: admin.id } });
  await prisma.ledgerEntry.create({
    data: {
      walletId: wallet.id,
      type: 'ESCROW_HOLD',
      debitAccount: 'buyer_wallet',
      creditAccount: 'escrow_vault',
      amount: 15000000,
      currency: Currency.XOF,
      checksum: 'sha256_dummy_checksum_001',
    },
  });

  // 20. COMMISSIONS
  const transaction = await prisma.transaction.findFirstOrThrow({ where: { buyerId: buyer.id } });
  await prisma.commission.create({
    data: {
      transactionId: transaction.id,
      userId: admin.id,
      amount: 750000,
      currency: 'XOF',
      status: 'PAID',
    },
  });

  // 21. PAYOUTS
  await prisma.payout.upsert({
    where: { transactionId: transaction.id },
    update: {},
    create: {
      transactionId: transaction.id,
      sellerId: admin.id,
      amount: 14250000,
      currency: Currency.XOF,
      phone: '+22997000001',
      operator: 'mtn_bj',
      status: 'COMPLETED',
    },
  });

  // 22. DISPUTES
  const escrowRec = await prisma.escrow.findFirstOrThrow({
    where: { transactionId: transaction.id },
  });
  await prisma.dispute.create({
    data: {
      escrowId: escrowRec.id,
      raisedById: buyer.id,
      reason: "Le vendeur n'a pas fourni tous les documents requis à temps.",
      status: 'RESOLVED',
      resolution: 'Le délai a été accordé au vendeur pour fournir les documents.',
    },
  });

  // 23. ESCROW ACCOUNT (separate from escrows table)
  const escrow = await prisma.escrow.findFirstOrThrow({ where: { transactionId: transaction.id } });
  await prisma.escrowAccount.upsert({
    where: { transactionId: transaction.id },
    update: {},
    create: { transactionId: transaction.id, balance: 15000000, currency: Currency.XOF },
  });

  // 24. GUESTHOUSE (Section 7C)
  const guesthouseOwner = await prisma.user.upsert({
    where: { email: 'guesthouse@afribayit.com' },
    update: {},
    create: {
      email: 'guesthouse@afribayit.com',
      firstName: 'Yemi',
      lastName: 'Propriétaire',
      role: 'GUESTHOUSE_OWNER',
      country: Country.TG,
    },
  });
  const guesthouse = await prisma.guesthouse.upsert({
    where: { slug: 'villa-lome-plage' },
    update: {},
    create: {
      ownerId: guesthouseOwner.id,
      name: 'Villa Lomé Plage',
      slug: 'villa-lome-plage',
      description: 'Villa au bord de mer à Lomé avec vue panoramique.',
      country: Country.TG,
      city: 'Lomé',
      address: 'Bord de mer, Tokoin',
    },
  });
  const gRoom = await prisma.guesthouseRoom.create({
    data: {
      guesthouseId: guesthouse.id,
      name: 'Suite Balnéaire',
      capacity: 2,
      priceBase: 85000,
      isAvailable: true,
    },
  });
  await prisma.guesthouseBooking.create({
    data: {
      guesthouseId: guesthouse.id,
      roomId: gRoom.id,
      userId: buyer.id,
      checkIn: new Date('2025-09-01'),
      checkOut: new Date('2025-09-05'),
      totalPrice: 340000,
    },
  });
  await prisma.guesthousePricingRule.create({
    data: {
      guesthouseId: guesthouse.id,
      periodStart: new Date('2025-12-20'),
      periodEnd: new Date('2026-01-05'),
      multiplier: 1.5,
      reason: "Fêtes de fin d'année",
    },
  });
  await prisma.guesthouseStaff.create({
    data: { guesthouseId: guesthouse.id, name: 'Admin Manager', role: 'MANAGER' },
  });

  // 25. AGENT
  await prisma.agent.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      licenseNumber: 'AGT-BJ-0001',
      agencyName: 'AfriBayit Immo',
      slug: 'afribayit-immo-admin',
    },
  });

  // 26. GEOMETER PROFILE & MISSION
  const geomUser = await prisma.user.upsert({
    where: { email: 'geometre2@afribayit.com' },
    update: {},
    create: {
      email: 'geometre2@afribayit.com',
      firstName: 'Pierre',
      lastName: 'Géomètre2',
      role: 'SURVEYOR',
      country: Country.CI,
    },
  });
  const geomProfile = await prisma.geometerProfile.upsert({
    where: { userId: geomUser.id },
    update: {},
    create: {
      userId: geomUser.id,
      orderNumber: 'GEO-CI-002',
      specialties: ['TOPO', 'DRONE'],
      isCertified: true,
    },
  });
  let mission = await prisma.geometerMission.findFirst({
    where: { propertyId: property.id, geometerId: geomProfile.id },
  });
  if (!mission) {
    mission = await prisma.geometerMission.create({
      data: {
        propertyId: property.id,
        geometerId: geomProfile.id,
        serviceCode: 'GEO_TOPO',
        status: 'COMPLETED',
        reportUrl: 'https://example.com/reports/mission-001.pdf',
      },
    });
  }

  // 27. GPS WAYPOINTS
  await prisma.gpsWaypoint.create({
    data: { missionId: mission.id, pointGeom: 'POINT(2.3508 6.4523)', altitude: 12.5 },
  });

  // 28. DRONE COVERAGE
  await prisma.droneCoverage.upsert({
    where: { missionId: mission.id },
    update: {},
    create: {
      missionId: mission.id,
      orthophotoUrl: 'https://example.com/ortho/prop001.tif',
      bboxPolygon:
        '{"type":"Polygon","coordinates":[[[2.35,6.45],[2.36,6.45],[2.36,6.46],[2.35,6.45]]]}',
      capturedAt: new Date(),
    },
  });

  // 29. CONFLICT ZONES
  await prisma.conflictZone.create({
    data: {
      propertyIdA: property.id,
      propertyIdB: (
        await prisma.property.findFirstOrThrow({ where: { slug: { not: property.slug } } })
      ).id,
      overlapPolygon:
        '{"type":"Polygon","coordinates":[[[2.355,6.452],[2.356,6.452],[2.356,6.453],[2.355,6.452]]]}',
      overlapArea: 25.5,
    },
  });

  // 30. AUDIT LOG
  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      actorRole: 'SUPER_ADMIN',
      action: 'USER_CREATED',
      resource: 'user',
      resourceId: buyer.id,
      result: 'SUCCESS',
    },
  });

  // 31. BLOCKCHAIN ANCHOR
  await prisma.blockchainAnchor.create({
    data: {
      documentId: property.id,
      documentType: 'TITRE_FONCIER',
      contentHash: 'sha256_0xabc123def456',
      txHash: '0xpolygon_tx_hash_afribayit_001',
      blockNumber: 48293014,
      verifyUrl: 'https://polygonscan.com/tx/0xpolygon_tx_hash_afribayit_001',
    },
  });

  // 32. DOCUMENT AUDIT LOG
  await prisma.documentAuditLog.create({
    data: {
      documentId: 'kyc_doc_001',
      documentType: 'TITRE_FONCIER',
      model: 'claude-3-5-sonnet-20241022',
      coherenceScore: 95,
      visualScore: 92,
      finalScore: 94,
      decision: 'AUTO_VALIDATED',
      mismatches: [],
    },
  });

  // 33. SECURITY INCIDENT
  await prisma.securityIncident.create({
    data: {
      type: 'AUTH_FAILURE',
      severity: 'LOW',
      description: 'Tentative de connexion échouée × 5 depuis IP inconnue.',
      affectedUsers: 1,
      actorIp: '192.168.1.100',
    },
  });

  console.warn('✅ Full seed completed — all tables populated!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
