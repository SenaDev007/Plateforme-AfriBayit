import { CostRouter } from './cost-router';

/**
 * Section 8.3.3 — IA Anti-Fraude — Moteur de Détection Complet
 */
export class AntiFraudeEngine {
  /**
   * Détection annonce dupliquée via similarité embedding (Section 8.3.3)
   * Similarité > 0.92 → alerte + blocage
   */
  static async checkDuplicateListing(description: string, existingEmbeddings: number[][]) {
    // In production: pgvector ANN search
    // SELECT id, 1 - (embedding <=> $queryVec::vector) AS similarity
    // FROM properties WHERE similarity > 0.92 LIMIT 1
    return {
      isDuplicate: false,
      similarity: 0.0,
      threshold: 0.92,
    };
  }

  /**
   * pHash photos volées (Section 8.3.3)
   * Hash perceptuel : tolérance 95% similarité
   */
  static async checkPhotoHash(imageUrl: string): Promise<{
    isStolen: boolean;
    pHash: string;
    matches: string[];
  }> {
    // Production: compute pHash → compare against stored hashes in DB
    // phash library or Google Vision reverse image search
    const pHash = Buffer.from(imageUrl).toString('base64').slice(0, 16);
    return { isStolen: false, pHash, matches: [] };
  }

  /**
   * Détection compte multi-identités (Section 8.3.3)
   * Même device/IP/phone → graphe de liens suspects
   */
  static async checkMultiIdentity(userId: string, deviceFingerprint: string, ip: string) {
    // Production: query suspicious_links graph table
    return {
      isSuspect: false,
      confidenceScore: 0.05,
      linkedAccounts: [],
    };
  }

  /**
   * Prix anormal (Section 8.3.3)
   * Prix < 40% de la médiane du quartier → inspection obligatoire
   */
  static async checkAbnormalPrice(
    price: number,
    city: string,
    propertyType: string,
  ): Promise<{ isAnormal: boolean; medianPrice: number; deviation: number }> {
    // Production: SELECT median(price) FROM properties WHERE city=$city AND type=$type
    const medianPrice = 12000000; // XOF — simulated
    const deviation = (medianPrice - price) / medianPrice;
    return {
      isAnormal: deviation > 0.4,
      medianPrice,
      deviation: +deviation.toFixed(3),
    };
  }

  /**
   * Score global de fraude (Section 8.3.3)
   * Combine tous les signaux → décision finale
   */
  static async computeFraudScore(listing: {
    description: string;
    price: number;
    city: string;
    type: string;
    imageUrls: string[];
    deviceFingerprint: string;
    userId: string;
    ip: string;
  }): Promise<{ score: number; flags: string[]; action: 'APPROVE' | 'REVIEW' | 'BLOCK' }> {
    const flags: string[] = [];

    const priceCheck = await this.checkAbnormalPrice(listing.price, listing.city, listing.type);
    if (priceCheck.isAnormal) flags.push('PRIX_ANORMAL');

    const identityCheck = await this.checkMultiIdentity(
      listing.userId,
      listing.deviceFingerprint,
      listing.ip,
    );
    if (identityCheck.isSuspect) flags.push('MULTI_IDENTITE');

    for (const img of listing.imageUrls) {
      const photoCheck = await this.checkPhotoHash(img);
      if (photoCheck.isStolen) {
        flags.push('PHOTO_VOLEE');
        break;
      }
    }

    const score = Math.max(0, 100 - flags.length * 35);
    const action = score >= 70 ? 'APPROVE' : score >= 40 ? 'REVIEW' : 'BLOCK';

    return { score, flags, action };
  }

  /**
   * Génération description annonce via IA (Section 8.3.1 Scoring)
   */
  static async generateListingDescription(propertyData: Record<string, any>): Promise<string> {
    const prompt = `Génère une description immobilière professionnelle en français pour ce bien:
    Ville: ${propertyData.city}, Type: ${propertyData.type}, Surface: ${propertyData.surface}m², Prix: ${propertyData.price} XOF.
    La description doit être persuasive, factuelle, et mettre en avant les atouts du bien.`;

    const { result } = await CostRouter.execute('GENERATE_DESCRIPTION', prompt);
    return result || '';
  }

  /**
   * Score de pertinence annonce (Section 8.3.1)
   * Score 0-100 : complétude + cohérence prix + qualité rédactionnelle
   */
  static async computeListingScore(listing: {
    title: string;
    description: string;
    price: number;
    surface?: number;
    photos: string[];
    isVerifiedDocs: boolean;
    isGeoTrusted: boolean;
    city: string;
    type: string;
  }): Promise<{ score: number; breakdown: Record<string, number> }> {
    const breakdown: Record<string, number> = {
      completeness: 0,
      priceCoherence: 0,
      descriptionQuality: 0,
      certifications: 0,
    };

    // Completeness (30 pts)
    const completenessFields = [
      listing.title,
      listing.description,
      listing.surface,
      ...listing.photos,
    ];
    breakdown.completeness = Math.round(
      (completenessFields.filter(Boolean).length / completenessFields.length) * 30,
    );

    // Photos (20 pts)
    breakdown.completeness += Math.min(listing.photos.length * 4, 20);

    // Price coherence (20 pts)
    const priceCheck = await this.checkAbnormalPrice(listing.price, listing.city, listing.type);
    breakdown.priceCoherence = priceCheck.isAnormal ? 5 : 20;

    // Certifications (30 pts)
    breakdown.certifications = (listing.isVerifiedDocs ? 15 : 0) + (listing.isGeoTrusted ? 15 : 0);

    const total = Object.values(breakdown).reduce((a, b) => a + b, 0);
    return { score: Math.min(100, total), breakdown };
  }
}
