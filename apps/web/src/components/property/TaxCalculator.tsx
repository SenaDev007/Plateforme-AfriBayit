'use client';

import { Calculator, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { useState } from 'react';

interface TaxRule {
  mutationRate: number;
  registrationRate: number;
  notaryRate: number;
  platformRate: number;
  label: string;
}

const TAX_RULES: Record<string, TaxRule> = {
  BJ: {
    label: 'Bénin',
    mutationRate: 0.1,
    registrationRate: 0.01,
    notaryRate: 0.025,
    platformRate: 0.02,
  },
  CI: {
    label: "Côte d'Ivoire",
    mutationRate: 0.04,
    registrationRate: 0.015,
    notaryRate: 0.02,
    platformRate: 0.02,
  },
  BF: {
    label: 'Burkina Faso',
    mutationRate: 0.08,
    registrationRate: 0.01,
    notaryRate: 0.02,
    platformRate: 0.02,
  },
  TG: {
    label: 'Togo',
    mutationRate: 0.08,
    registrationRate: 0.01,
    notaryRate: 0.02,
    platformRate: 0.02,
  },
};

interface TaxCalculatorProps {
  price: number;
  currency: string;
  country: string;
}

function fmt(n: number, currency: string): string {
  if (currency === 'XOF') {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)} M FCFA`;
    return `${Math.round(n).toLocaleString('fr-FR')} FCFA`;
  }
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(n);
}

export function TaxCalculator({ price, currency, country }: TaxCalculatorProps) {
  const [expanded, setExpanded] = useState(false);

  const rules = TAX_RULES[country];
  if (!rules || price <= 0) return null;

  const mutation = price * rules.mutationRate;
  const registration = price * rules.registrationRate;
  const notary = price * rules.notaryRate;
  const platform = price * rules.platformRate;
  const totalFees = mutation + registration + notary + platform;
  const totalAcquisition = price + totalFees;

  const lines = [
    { label: 'Droits de mutation', rate: rules.mutationRate, amount: mutation },
    { label: "Frais d'enregistrement", rate: rules.registrationRate, amount: registration },
    { label: 'Honoraires notaire (estimés)', rate: rules.notaryRate, amount: notary },
    { label: 'Commission AfriBayit', rate: rules.platformRate, amount: platform },
  ];

  return (
    <div className="border-charcoal-100 shadow-card overflow-hidden rounded-xl border bg-white">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="hover:bg-charcoal-50 flex w-full items-center justify-between px-5 py-4 text-left transition-colors"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-2.5">
          <div className="bg-navy/10 flex h-8 w-8 items-center justify-center rounded-lg">
            <Calculator className="text-navy h-4 w-4" />
          </div>
          <div>
            <p className="text-charcoal text-sm font-semibold">Frais d'acquisition</p>
            <p className="text-charcoal-400 text-xs">{rules.label}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-danger text-sm font-bold">+{fmt(totalFees, currency)}</p>
            <p className="text-charcoal-400 text-xs">
              {((totalFees / price) * 100).toFixed(1)}% du prix
            </p>
          </div>
          {expanded ? (
            <ChevronUp className="text-charcoal-300 h-4 w-4 flex-shrink-0" />
          ) : (
            <ChevronDown className="text-charcoal-300 h-4 w-4 flex-shrink-0" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-charcoal-100 border-t">
          <div className="space-y-2.5 px-5 py-4">
            {lines.map(({ label, rate, amount }) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <span className="text-charcoal-400">
                  {label}{' '}
                  <span className="text-charcoal-300 font-mono text-xs">
                    ({(rate * 100).toFixed(1)}%)
                  </span>
                </span>
                <span className="text-charcoal font-mono font-medium">{fmt(amount, currency)}</span>
              </div>
            ))}

            <div className="border-charcoal-100 border-t pt-2.5">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span className="text-charcoal">Total des frais</span>
                <span className="text-danger font-mono">{fmt(totalFees, currency)}</span>
              </div>
            </div>

            <div className="bg-navy/5 border-navy/10 rounded-lg border px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-navy text-sm font-bold">Coût total d'acquisition</span>
                <span className="text-navy font-mono text-base font-bold">
                  {fmt(totalAcquisition, currency)}
                </span>
              </div>
            </div>

            <p className="text-charcoal-400 flex items-start gap-1.5 text-xs">
              <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
              Estimation indicative. Les honoraires de notaire peuvent varier. Consultez un notaire
              agréé pour un calcul précis.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
