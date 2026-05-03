import { Injectable, Inject } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import type { PrismaClient } from '@afribayit/db';

@Injectable()
export class RebeccaService {
  private anthropic: Anthropic;

  constructor(@Inject('PRISMA') private readonly prisma: PrismaClient) {
    this.anthropic = new Anthropic({
      apiKey: process.env['ANTHROPIC_API_KEY'] || 'dummy_key',
    });
  }

  /** Chat with Rebecca about a specific property or general real estate in Africa */
  async chat(message: string, propertyId?: string, userId?: string) {
    let context =
      "Tu es Rebecca, l'assistante experte d'AfriBayit. Tu aides les utilisateurs à comprendre le marché immobilier en Afrique de l'Ouest (Bénin, Côte d'Ivoire, Burkina Faso, Togo). Tu es professionnelle, rassurante et experte en droit foncier local.";

    if (propertyId) {
      const property = await this.prisma.property.findUnique({
        where: { id: propertyId },
      });
      if (property) {
        context += `\nL'utilisateur pose une question sur cette propriété : "${property.title}" située à ${property.city}, ${property.country}. Son prix est de ${property.price} ${property.currency}.`;
      }
    }

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        system: context,
        messages: [{ role: 'user', content: message }],
      });

      const textContent = response.content[0];
      return {
        reply:
          textContent.type === 'text'
            ? textContent.text
            : "Désolée, je n'ai pas pu traiter votre demande.",
        model: response.model,
      };
    } catch (error) {
      console.error('[RebeccaAI] Error:', error);
      return {
        reply:
          'Désolée, je rencontre une difficulté technique pour vous répondre. Je reste à votre disposition pour toute autre question.',
        error: true,
      };
    }
  }
}
