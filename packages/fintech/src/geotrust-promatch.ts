import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Section 7C.8 - ProMatch GeoTrust — Matching Intelligent Géomètre ↔ Bien
 */
export class GeoTrustProMatch {
  /**
   * Find the best geometer for a mission based on composite scoring (Section 7C.8.1)
   */
  static async findBestGeometer(propertyId: string, serviceCode: string) {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { latitude: true, longitude: true },
    });

    if (!property?.latitude || !property?.longitude) return null;

    // 1. Fetch available geometers with the required specialty (Section 7C.8.1)
    // Note: specialty filtering would happen in the query
    const candidates = await prisma.geometerProfile.findMany({
      where: {
        isVerified: true,
        specialties: { has: serviceCode },
      },
      include: { user: true },
    });

    // 2. Score and sort candidates (Section 7C.8.1)
    const scoredCandidates = candidates.map((geo) => {
      // Proximity (35%) - Mocking distance calculation
      const distance = this.calculateDistance(property.latitude!, property.longitude!, 6.36, 2.42);
      const proximityScore = Math.max(0, 100 - distance * 2);

      // Trust Score (15%)
      const trustScore = geo.trustScore || 0;

      // Final composite score
      const finalScore = proximityScore * 0.35 + trustScore * 0.15 + 50 * 0.5; // 50 is default for availability/specialty

      return { ...geo, score: finalScore };
    });

    return scoredCandidates.sort((a, b) => b.score - a.score)[0];
  }

  private static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    // Simple Haversine or Euclidean for the mock
    return Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2)) * 111; // Approx km
  }

  /**
   * Section 7C.4.2 - Auto-triggering rules
   */
  static async evaluateAutoTrigger(propertyId: string, amount: number, surface: number) {
    const rules = [];

    if (amount > 10_000_000) rules.push('GEO_SURF');
    if (surface > 500) rules.push('GEO_TOPO');

    // Return the list of required services
    return rules;
  }
}
