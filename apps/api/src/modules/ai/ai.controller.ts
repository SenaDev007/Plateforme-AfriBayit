import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { RebeccaService } from './rebecca.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DocumentAIPipeline } from '@afribayit/ai/src/document-pipeline';
import { MarketAnalysisService } from '@afribayit/ai/src/market-analysis';
import { AntiFraudeEngine } from '@afribayit/ai/src/anti-fraude';
import { BlockchainService } from '@afribayit/ai/src/innovation';
import { RebeccaProactiveTriggers } from '@afribayit/ai/src/proactive-triggers';
import { RAGPipeline } from '@afribayit/ai/src/rag-pipeline';
import { WhatsAppAdapter } from '@afribayit/ai/src/channels';

@Controller('v1/ai')
export class AiController {
  private readonly whatsApp = new WhatsAppAdapter();

  constructor(private readonly rebeccaService: RebeccaService) {}

  /**
   * Section 8.2 — Rebecca chat (web)
   */
  @Post('rebecca/chat')
  async chat(@Body() body: { message: string; propertyId?: string }, @Request() req: any) {
    const userId = req.user?.id;
    return this.rebeccaService.chat(body.message, body.propertyId, userId);
  }

  /**
   * Section 8.2.3 — WhatsApp webhook handler
   */
  @Post('whatsapp/webhook')
  async whatsappWebhook(@Body() body: any) {
    const parsed = this.whatsApp.parseIncomingWebhook(body);
    if (!parsed) return { status: 'ignored' };

    const result = await this.rebeccaService.chat(parsed.message, undefined, undefined);
    await this.whatsApp.sendMessage(parsed.from, result.reply);
    return { status: 'sent' };
  }

  /**
   * Section 8.1.2 — RAG feedback loop
   */
  @Post('rag/feedback')
  @UseGuards(JwtAuthGuard)
  async recordFeedback(@Body() body: { propertyId: string; query: string }, @Request() req: any) {
    return RAGPipeline.recordClickFeedback(req.user.id, body.propertyId, body.query);
  }

  /**
   * Section 8.3.4 — Analyze document (titre foncier, acte notarié)
   */
  @Post('analyze-document')
  @UseGuards(JwtAuthGuard)
  async analyzeDocument(
    @Body()
    body: {
      documentUrl: string;
      documentId: string;
      ownerName: string;
      surface: number;
      gpsLat: number;
      gpsLng: number;
    },
  ) {
    return DocumentAIPipeline.runFullPipeline({
      documentUrl: body.documentUrl,
      documentId: body.documentId,
      declared: {
        owner: body.ownerName,
        surface: body.surface,
        gpsLat: body.gpsLat,
        gpsLng: body.gpsLng,
      },
    });
  }

  /**
   * Section 8.3.1 — AVM price estimation
   */
  @Post('estimate-price')
  async estimatePrice(
    @Body()
    body: {
      surface: number;
      city: string;
      district?: string;
      type: string;
      condition: 'NEW' | 'GOOD' | 'RENOVATE';
    },
  ) {
    return MarketAnalysisService.estimatePrice(body);
  }

  /**
   * Section 8.3.1 — Market trends by city/type
   */
  @Get('market-trends/:city/:type')
  async getMarketTrends(@Param('city') city: string, @Param('type') type: string) {
    return MarketAnalysisService.getMarketTrends(city, type);
  }

  /**
   * Section 8.3.1 — Compute listing AI score
   */
  @Post('score-listing')
  @UseGuards(JwtAuthGuard)
  async scoreListing(@Body() body: any) {
    return AntiFraudeEngine.computeListingScore(body);
  }

  /**
   * Section 8.3.3 — Fraud check
   */
  @Post('fraud-check')
  @UseGuards(JwtAuthGuard)
  async fraudCheck(@Body() body: any, @Request() req: any) {
    return AntiFraudeEngine.computeFraudScore({
      ...body,
      userId: req.user?.id,
      ip: req.ip,
    });
  }

  /**
   * Section 8.5 — Anchor document hash on-chain
   */
  @Post('blockchain/anchor')
  @UseGuards(JwtAuthGuard)
  async anchorOnChain(@Body() body: { documentId: string; content: string }) {
    return BlockchainService.anchorDocument(body.documentId, body.content);
  }

  /**
   * Section 8.2.2 — Check proactive triggers for a user
   */
  @Get('proactive/:userId')
  @UseGuards(JwtAuthGuard)
  async getProactiveTriggers(@Param('userId') userId: string, @Request() req: any) {
    const triggers: any[] = [];

    // Check stale escrows (Section 8.2.2 — Scénario 3)
    const escrowAlerts = await RebeccaProactiveTriggers.checkStaleEscrow(
      req.user?.activeTransactions || [],
    );
    if (escrowAlerts.length) triggers.push({ type: 'ESCROW_STALE', alerts: escrowAlerts });

    return { userId, triggers };
  }
}
