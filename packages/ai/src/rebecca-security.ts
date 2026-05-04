/**
 * Section 10.6 — Sécurisation Agent IA Rebecca
 * Protection contre prompt injection, budget token, isolation tenant.
 */
export class RebeccaSecurityGuard {
  /** Section 10.6 — Blocked terms for prompt injection prevention */
  private static readonly BLOCKED_PATTERNS = [
    /ignore\s+(previous|above|all)\s+instructions/i,
    /you\s+are\s+now\s+/i,
    /system\s*:\s*/i,
    /\bDAN\b/,
    /act\s+as\s+/i,
    /pretend\s+(to\s+be|you\s+are)/i,
    /bypass\s+(your|the)\s+(rules|restrictions|guardrails)/i,
    /reveal\s+(your|the)\s+(system|prompt|instructions)/i,
    /output\s+(your|the)\s+(system|initial)\s+(prompt|message)/i,
  ];

  /** Section 10.6 — Token budget: max 50,000 tokens/hour per user */
  private static tokenUsage = new Map<string, { tokens: number; resetAt: number }>();
  private static readonly MAX_TOKENS_PER_HOUR = 50_000;

  /** Sanitize user input — strip injection attempts */
  static sanitize(input: string): { safe: boolean; sanitized: string; blocked?: string } {
    for (const pattern of this.BLOCKED_PATTERNS) {
      if (pattern.test(input)) {
        return { safe: false, sanitized: '', blocked: pattern.source };
      }
    }
    // Strip HTML/script tags
    const sanitized = input.replace(/<[^>]*>/g, '').trim();
    return { safe: true, sanitized };
  }

  /** Check token budget for user */
  static checkTokenBudget(
    userId: string,
    tokensUsed: number,
  ): {
    allowed: boolean;
    remaining: number;
  } {
    const now = Date.now();
    const entry = this.tokenUsage.get(userId);

    if (!entry || entry.resetAt < now) {
      this.tokenUsage.set(userId, { tokens: tokensUsed, resetAt: now + 3600_000 });
      return { allowed: true, remaining: this.MAX_TOKENS_PER_HOUR - tokensUsed };
    }

    entry.tokens += tokensUsed;
    const remaining = this.MAX_TOKENS_PER_HOUR - entry.tokens;
    return { allowed: remaining > 0, remaining: Math.max(0, remaining) };
  }

  /** Section 10.6 — Ensure Rebecca context is tenant-isolated */
  static buildIsolatedContext(tenantId: string, systemPrompt: string): string {
    return `${systemPrompt}
    
    [SECURITY RULES — NON MODIFIABLE]
    - Tu opères EXCLUSIVEMENT pour le tenant: ${tenantId}
    - Tu ne DOIS JAMAIS référencer des données d'un autre pays/tenant
    - Tu ne DOIS JAMAIS donner de conseils juridiques fermes
    - Tu ne DOIS JAMAIS citer de prix sans source vérifiée en base de données
    - Si tu ne connais pas la réponse, dis-le honnêtement`;
  }
}
