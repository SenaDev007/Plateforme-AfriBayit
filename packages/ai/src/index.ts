// Section 8 — Barrel export for all AI modules
export { AICore, aiCore } from './core';
export { RebeccaAgent, rebecca } from './rebecca';
export { RAGPipeline } from './rag-pipeline';
export { CostRouter } from './cost-router';
export type { TaskType } from './cost-router';
export { AntiFraudeEngine } from './anti-fraude';
export { DocumentAIPipeline } from './document-pipeline';
export { MarketAnalysisService } from './market-analysis';
export { RebeccaProactiveTriggers, ArtisanPortfolioVerifier } from './proactive-triggers';
export { WhatsAppAdapter, SMSFallbackAdapter } from './channels';
export { BlockchainService, RAGService, ImmersiveService } from './innovation';
