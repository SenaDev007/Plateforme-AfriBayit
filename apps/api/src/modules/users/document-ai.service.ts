import { Injectable, Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import type { PrismaClient } from '@afribayit/db';

export interface AiDocumentAnalysis {
  status: 'VALID' | 'SUSPICIOUS' | 'INVALID' | 'ERROR';
  score: number; // 0–100
  recommendation: 'APPROVE' | 'MANUAL_REVIEW' | 'REJECT';
  documentType: string;
  extractedData: {
    fullName?: string;
    documentNumber?: string;
    expiryDate?: string;
    nationality?: string;
    dateOfBirth?: string;
  };
  fraudIndicators: string[];
  summary: string;
}

const SYSTEM_PROMPT = `Tu es un expert en vérification de documents d'identité pour une plateforme immobilière africaine (AfriBayit).
Tu analyses des documents KYC soumis par des utilisateurs (CNI, passeports, justificatifs de domicile).

Réponds UNIQUEMENT avec un objet JSON valide, sans markdown, sans explication autour. Format exact :
{
  "status": "VALID" | "SUSPICIOUS" | "INVALID",
  "score": <nombre 0-100>,
  "recommendation": "APPROVE" | "MANUAL_REVIEW" | "REJECT",
  "documentType": "<type détecté>",
  "extractedData": {
    "fullName": "<nom complet ou null>",
    "documentNumber": "<numéro document ou null>",
    "expiryDate": "<date expiration YYYY-MM-DD ou null>",
    "nationality": "<nationalité ou null>",
    "dateOfBirth": "<date naissance YYYY-MM-DD ou null>"
  },
  "fraudIndicators": ["<indicateur 1>", ...],
  "summary": "<synthèse en 1-2 phrases>"
}

Critères :
- VALID (score 80-100) : document lisible, authentique, non expiré, données cohérentes
- SUSPICIOUS (score 40-79) : document partiellement lisible, données incohérentes, ou éléments inhabituels
- INVALID (score 0-39) : document illisible, falsifié, expiré, ou image incorrecte
- fraudIndicators : liste vide si aucun problème, sinon liste les anomalies détectées`;

@Injectable()
export class DocumentAIService {
  private readonly logger = new Logger(DocumentAIService.name);
  private readonly client: Anthropic;

  constructor(
    @Inject('PRISMA') private readonly prisma: PrismaClient,
    private readonly config: ConfigService,
  ) {
    this.client = new Anthropic({
      apiKey: this.config.getOrThrow<string>('ANTHROPIC_API_KEY'),
    });
  }

  /**
   * Analyze a KYC document using Claude Vision.
   * Updates the KycDocument record with AI results.
   * Fire-and-forget safe — errors are logged, not thrown.
   */
  async analyzeKycDocument(documentId: string): Promise<void> {
    const doc = await this.prisma.kycDocument.findUnique({ where: { id: documentId } });
    if (!doc) {
      this.logger.warn(`DocumentAI: document ${documentId} not found`);
      return;
    }

    try {
      const analysis = await this.analyzeImage(doc.fileUrl, doc.type);

      await this.prisma.kycDocument.update({
        where: { id: documentId },
        data: {
          aiStatus: analysis.status,
          aiScore: analysis.score,
          aiAnalysis: analysis as object,
          aiValidatedAt: new Date(),
        },
      });

      this.logger.log(
        `DocumentAI: doc ${documentId} → ${analysis.status} (score: ${analysis.score}, rec: ${analysis.recommendation})`,
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(`DocumentAI: analysis failed for ${documentId}: ${msg}`);

      await this.prisma.kycDocument.update({
        where: { id: documentId },
        data: {
          aiStatus: 'ERROR',
          aiScore: null,
          aiAnalysis: { error: msg },
          aiValidatedAt: new Date(),
        },
      });
    }
  }

  private async analyzeImage(imageUrl: string, docType: string): Promise<AiDocumentAnalysis> {
    const message = await this.client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'url', url: imageUrl },
            },
            {
              type: 'text',
              text: `Analyse ce document de type "${docType}". Retourne uniquement le JSON demandé.`,
            },
          ],
        },
      ],
    });

    const raw = message.content[0];
    if (raw?.type !== 'text') throw new Error('Unexpected response type from Claude');

    const parsed = JSON.parse(raw.text) as AiDocumentAnalysis;

    // Ensure score is in range
    parsed.score = Math.max(0, Math.min(100, parsed.score));
    if (!['VALID', 'SUSPICIOUS', 'INVALID'].includes(parsed.status)) {
      parsed.status = 'SUSPICIOUS';
    }

    return parsed;
  }
}
