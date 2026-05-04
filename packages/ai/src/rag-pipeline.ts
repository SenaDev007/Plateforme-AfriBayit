import { aiCore } from './core';

/**
 * Section 8.1.2 - Architecture RAG — Données Immobilières Contextuelles
 * Pipeline complet en 6 étapes pour enrichir chaque réponse LLM.
 */
export class RAGPipeline {
  /**
   * STEP 1 — Ingestion : Embedding d'une nouvelle annonce publiée
   * Déclenché à chaque publication de bien.
   */
  static async ingestListing(listingId: string, text: string, metadata: Record<string, any>) {
    // Generate 1536-dimension embedding
    const embedding = await aiCore.createEmbedding(text);

    // Store in pgvector via raw SQL (production):
    // await prisma.$executeRaw`
    //   UPDATE properties SET embedding = ${embedding}::vector WHERE id = ${listingId}
    // `
    console.log(`[RAG] Ingested listing ${listingId} — ${embedding.length}d embedding stored`);
    return { listingId, dimensions: embedding.length, metadata };
  }

  /**
   * STEP 2 — Retrieval : ANN search top-k=10 résultats
   */
  static async retrieveContext(userQuery: string, topK = 10) {
    const queryEmbedding = await aiCore.createEmbedding(userQuery);

    // Production SQL (pgvector HNSW index):
    // const results = await prisma.$queryRaw`
    //   SELECT id, title, price, city, surface
    //   FROM properties
    //   WHERE status = 'PUBLISHED'
    //   ORDER BY embedding <=> ${queryEmbedding}::vector
    //   LIMIT ${topK}
    // `

    // Simulated results for development
    const results = [
      {
        id: 'p1',
        title: 'Terrain 500m² Cadjehoun',
        price: 15000000,
        city: 'Cotonou',
        surface: 500,
      },
      { id: 'p2', title: 'Villa F4 Fidjrossè', price: 45000000, city: 'Cotonou', surface: 200 },
    ];

    return { results, queryEmbedding };
  }

  /**
   * STEP 3 — Prompt Construction : Assemblage du contexte enrichi
   */
  static buildRAGPrompt(
    systemPrompt: string,
    ragContext: any[],
    sessionHistory: any[],
    userMessage: string,
  ) {
    const contextBlock = ragContext
      .map(
        (p, i) =>
          `[${i + 1}] ID:${p.id} — "${p.title}" — ${p.price.toLocaleString()} XOF — ${p.city}`,
      )
      .join('\n');

    return `${systemPrompt}

--- CONTEXTE IMMOBILIER TEMPS RÉEL (Section 8.1.2) ---
${contextBlock}
--- FIN CONTEXTE ---

Historique conversation:
${sessionHistory.map((m) => `${m.role}: ${m.content}`).join('\n')}

Utilisateur: ${userMessage}`;
  }

  /**
   * STEPS 4+5 — Generation + Post-traitement
   */
  static async generateGroundedResponse(prompt: string): Promise<{
    text: string;
    referencedIds: string[];
  }> {
    const response = await aiCore.generateResponse(prompt, 'COMPLEX');
    const text = response || '';

    // Extract property IDs cited in response (pattern: ID:p1, p2, etc.)
    const idMatches = text.match(/ID:([\w]+)/g) || [];
    const referencedIds = idMatches.map((m) => m.replace('ID:', ''));

    return { text, referencedIds };
  }

  /**
   * STEP 6 — Feedback Loop : Signal positif sur recommandation cliquée
   * Re-rankage des embeddings sans réentraînement
   */
  static async recordClickFeedback(userId: string, propertyId: string, query: string) {
    // In production: increment a feedback_score column / update embedding weights
    console.log(`[RAG Feedback] User ${userId} clicked on ${propertyId} for query: "${query}"`);
    return { recorded: true, userId, propertyId };
  }
}
