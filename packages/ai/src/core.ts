import { Anthropic } from '@anthropic-ai/sdk';
import { OpenAI } from 'openai';

/**
 * Section 8.1 - AfriBayit AI Core
 * Orchestration centralisée pour isoler le cœur applicatif des modèles LLM.
 */
export class AICore {
  private anthropic: Anthropic;
  private openai: OpenAI;

  constructor() {
    this.anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  /**
   * Section 8.1.3 - Routage intelligent par complexité/coût
   */
  async generateResponse(prompt: string, taskComplexity: 'SIMPLE' | 'COMPLEX' | 'VISION') {
    if (taskComplexity === 'COMPLEX') {
      // Claude 3.5 Sonnet (Section 8.1.1)
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      });
      return response.content[0].type === 'text' ? response.content[0].text : '';
    } else if (taskComplexity === 'VISION') {
      // Claude Vision (Section 8.1.1)
      return 'Vision analysis result (Mocked)';
    } else {
      // GPT-4o mini (Section 8.1.1)
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
      });
      return response.choices[0].message.content;
    }
  }

  /**
   * Section 8.1.2 - Génération d'embeddings pour RAG
   */
  async createEmbedding(text: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
      encoding_format: 'float',
    });
    return response.data[0].embedding;
  }
}

export const aiCore = new AICore();
