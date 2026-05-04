import { aiCore } from './core';
import { CostRouter } from './cost-router';

/**
 * Section 8.2.2 — Déclencheurs Proactifs de Rebecca
 * 6 scénarios clés avec logique de détection et actions automatiques.
 */
export class RebeccaProactiveTriggers {
  /**
   * SCÉNARIO 1 — Primo-visiteur sans compte (Section 8.2.2)
   * Popup après 30s, accueil + discovery need
   */
  static shouldShowWelcomePopup(sessionData: {
    isFirstVisit: boolean;
    secondsOnSite: number;
    hasAccount: boolean;
  }): boolean {
    return sessionData.isFirstVisit && sessionData.secondsOnSite >= 30 && !sessionData.hasAccount;
  }

  static async generateWelcomeMessage(detectedCity?: string): Promise<string> {
    const prompt = `Tu es Rebecca d'AfriBayit. Génère un message d'accueil chaleureux et court (2-3 phrases max) 
    pour un primo-visiteur${detectedCity ? ` depuis ${detectedCity}` : ''}. 
    Pose une question sur son projet (achat, location, investissement) pour démarrer la découverte du besoin.`;
    const { result } = await CostRouter.execute('REBECCA_SIMPLE', prompt);
    return result || 'Bonjour ! Je suis Rebecca. Quel est votre projet immobilier ?';
  }

  /**
   * SCÉNARIO 2 — Acheteur qualifié shortlist (Section 8.2.2)
   * Utilisateur connecté avec 5+ biens en favoris
   */
  static async detectShortlistBehavior(
    userId: string,
    favoritesCount: number,
  ): Promise<{
    shouldTrigger: boolean;
    message?: string;
  }> {
    if (favoritesCount < 5) return { shouldTrigger: false };

    const prompt = `Génère un message proactif court pour un acheteur qui a mis ${favoritesCount} biens en favoris. 
    Propose de planifier des visites ou de comparer ses favoris. Ton Rebecca professionnel.`;
    const { result } = await CostRouter.execute('REBECCA_SIMPLE', prompt);
    return { shouldTrigger: true, message: result || '' };
  }

  /**
   * SCÉNARIO 3 — Suivi transaction escrow bloquée > 72h (Section 8.2.2)
   * Notification statut + action requise
   */
  static async checkStaleEscrow(
    transactions: {
      id: string;
      status: string;
      updatedAt: Date;
      missingDocs?: string[];
    }[],
  ): Promise<{ transactionId: string; notification: string }[]> {
    const threshold = 72 * 60 * 60 * 1000; // 72h in ms
    const now = Date.now();

    return transactions
      .filter((tx) => tx.status === 'IN_PROGRESS' && now - tx.updatedAt.getTime() > threshold)
      .map((tx) => ({
        transactionId: tx.id,
        notification: tx.missingDocs?.length
          ? `Votre transaction est en attente depuis 72h. Documents manquants : ${tx.missingDocs.join(', ')}.`
          : `Votre transaction #${tx.id.slice(-6)} nécessite votre confirmation pour avancer.`,
      }));
  }

  /**
   * SCÉNARIO 4 — Question juridique complexe (Section 8.2.2)
   * Réponse + disclaimer + recommandation avocat partenaire
   */
  static async handleLegalQuestion(country: string, question: string): Promise<string> {
    const prompt = `Tu es Rebecca d'AfriBayit. Réponds à cette question juridique sur l'immobilier en ${country}: "${question}".
    RÈGLES ABSOLUES:
    1. Réponds sur les principes généraux uniquement.
    2. Ajoute TOUJOURS: "Je ne suis pas juriste — consultez un professionnel du droit."
    3. Recommande de consulter un avocat partenaire AfriBayit.`;
    const { result } = await CostRouter.execute('REBECCA_COMPLEX', prompt);
    return result || '';
  }

  /**
   * SCÉNARIO 5 — Hôte location courte durée (Section 8.2.2)
   * Onboarding guidé : réduit 45min → 12min
   */
  static getHostOnboardingSteps(): {
    step: number;
    title: string;
    action: string;
    aiAssisted: boolean;
  }[] {
    return [
      { step: 1, title: 'Photos de qualité', action: 'upload_photos', aiAssisted: true },
      { step: 2, title: 'Description IA', action: 'generate_description', aiAssisted: true },
      { step: 3, title: 'Tarification suggérée', action: 'suggest_pricing', aiAssisted: true },
      {
        step: 4,
        title: 'Calendrier de disponibilité',
        action: 'set_availability',
        aiAssisted: false,
      },
      { step: 5, title: 'Documents légaux', action: 'upload_docs', aiAssisted: false },
    ];
  }

  /**
   * SCÉNARIO 6 — Investisseur diaspora (Section 8.2.2)
   * Budget > 50M XOF → package investisseur
   */
  static async detectDiasporaInvestor(userProfile: {
    country: string;
    budget?: number;
    currency?: string;
  }): Promise<{ isInvestor: boolean; packageMessage?: string }> {
    const diasporaCountries = ['FR', 'US', 'CA', 'GB', 'IT', 'DE', 'BE', 'NL'];
    const isDiaspora = diasporaCountries.includes(userProfile.country);
    const highBudget = (userProfile.budget || 0) >= 50_000_000; // 50M XOF

    if (!isDiaspora || !highBudget) return { isInvestor: false };

    return {
      isInvestor: true,
      packageMessage:
        "Bienvenue ! En tant qu'investisseur diaspora, je vous propose notre package Premium : visite terrain GeoTrust certifiée + agent dédié + escrow sécurisé. Commençons ?",
    };
  }

  /**
   * Section 8.2.1 — Détection handoff humain automatique
   */
  static shouldHandoffToHuman(context: {
    hasActiveDispute: boolean;
    escrowBlockedHours: number;
    sentimentScore: number; // -1 (très négatif) à 1 (très positif)
  }): { handoff: boolean; reason?: string } {
    if (context.hasActiveDispute) return { handoff: true, reason: 'LITIGE_ACTIF' };
    if (context.escrowBlockedHours > 48) return { handoff: true, reason: 'TRANSACTION_BLOQUEE' };
    if (context.sentimentScore < -0.6) return { handoff: true, reason: 'UTILISATEUR_FRUSTRE' };
    return { handoff: false };
  }
}

/**
 * Section 8.3.2 — Artisan Portfolio Verification via Claude Vision
 */
export class ArtisanPortfolioVerifier {
  static async verifyPortfolio(
    imageUrls: string[],
    declaredSpecialty: string,
  ): Promise<{
    isConsistent: boolean;
    qualityScore: number;
    flags: string[];
  }> {
    // Production: Claude Vision analyzes each photo
    const flags: string[] = [];
    const qualityScore = 85; // Simulated

    return {
      isConsistent: flags.length === 0,
      qualityScore,
      flags,
    };
  }
}
