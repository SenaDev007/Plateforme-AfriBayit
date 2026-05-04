import { aiCore } from './core';

/**
 * Section 8.1.3 — Gestion des Coûts d'Inférence
 * Routeur par complexité : objectif < 2% du revenu par transaction.
 */

export type TaskType =
  | 'CLASSIFY_LISTING' // GPT-4o mini  ~0.002€
  | 'GENERATE_DESCRIPTION' // Claude Sonnet ~0.05€
  | 'REBECCA_SIMPLE' // GPT-4o mini  ~0.005€
  | 'REBECCA_COMPLEX' // Claude Sonnet ~0.08€
  | 'ANALYZE_LEGAL_DOCUMENT' // Claude Sonnet ~0.20€
  | 'ANALYZE_IMAGE' // Claude Vision ~0.03€
  | 'GENERATE_GEOTRUST_REPORT' // Claude Sonnet ~0.15€
  | 'PREDICT_PRICE'; // XGBoost local ~0.0001€

interface RoutingDecision {
  model: 'SIMPLE' | 'COMPLEX' | 'VISION' | 'LOCAL_ML';
  estimatedCost: number; // €
  taskType: TaskType;
}

/**
 * Section 8.1.3 cost routing table
 */
const ROUTING_TABLE: Record<TaskType, RoutingDecision> = {
  CLASSIFY_LISTING: { model: 'SIMPLE', estimatedCost: 0.002, taskType: 'CLASSIFY_LISTING' },
  GENERATE_DESCRIPTION: { model: 'COMPLEX', estimatedCost: 0.05, taskType: 'GENERATE_DESCRIPTION' },
  REBECCA_SIMPLE: { model: 'SIMPLE', estimatedCost: 0.005, taskType: 'REBECCA_SIMPLE' },
  REBECCA_COMPLEX: { model: 'COMPLEX', estimatedCost: 0.08, taskType: 'REBECCA_COMPLEX' },
  ANALYZE_LEGAL_DOCUMENT: {
    model: 'COMPLEX',
    estimatedCost: 0.2,
    taskType: 'ANALYZE_LEGAL_DOCUMENT',
  },
  ANALYZE_IMAGE: { model: 'VISION', estimatedCost: 0.03, taskType: 'ANALYZE_IMAGE' },
  GENERATE_GEOTRUST_REPORT: {
    model: 'COMPLEX',
    estimatedCost: 0.15,
    taskType: 'GENERATE_GEOTRUST_REPORT',
  },
  PREDICT_PRICE: { model: 'LOCAL_ML', estimatedCost: 0.0001, taskType: 'PREDICT_PRICE' },
};

export class CostRouter {
  /**
   * Execute a task with the optimal model based on complexity/cost
   */
  static async execute(
    taskType: TaskType,
    prompt: string,
  ): Promise<{
    result: string | null;
    cost: RoutingDecision;
  }> {
    const routing = ROUTING_TABLE[taskType];

    if (routing.model === 'LOCAL_ML') {
      // Call local XGBoost microservice (Fly.io worker)
      return { result: '[XGBoost prediction: local model]', cost: routing };
    }

    const result = await aiCore.generateResponse(prompt, routing.model);
    return { result, cost: routing };
  }

  /**
   * Estimate daily AI cost based on volume
   */
  static estimateDailyCost(): Record<TaskType, number> {
    const volumes: Record<TaskType, number> = {
      CLASSIFY_LISTING: 500,
      GENERATE_DESCRIPTION: 200,
      REBECCA_SIMPLE: 10000,
      REBECCA_COMPLEX: 1000,
      ANALYZE_LEGAL_DOCUMENT: 100,
      ANALYZE_IMAGE: 1000,
      GENERATE_GEOTRUST_REPORT: 50,
      PREDICT_PRICE: 5000,
    };

    return Object.fromEntries(
      Object.entries(ROUTING_TABLE).map(([key, val]) => [
        key,
        +(val.estimatedCost * volumes[key as TaskType]).toFixed(2),
      ]),
    ) as Record<TaskType, number>;
  }
}
