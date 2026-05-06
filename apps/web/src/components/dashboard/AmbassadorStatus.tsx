'use client';

import React from 'react';
import { Award, CheckCircle2, TrendingUp, Info } from 'lucide-react';
import { Badge, Button, cn } from '@afribayit/ui';

interface AmbassadorProps {
  score: number;
  transactions: number;
  seniorityMonths: number;
  className?: string;
}

const TIERS = [
  {
    id: 'bronze',
    label: 'Bronze',
    minScore: 300,
    minTxs: 1,
    minMonths: 6,
    commission: '2%',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  {
    id: 'silver',
    label: 'Silver',
    minScore: 600,
    minTxs: 5,
    minMonths: 12,
    commission: '3%',
    color: 'text-slate-400',
    bgColor: 'bg-slate-400/10',
  },
  {
    id: 'gold',
    label: 'Gold',
    minScore: 900,
    minTxs: 10,
    minMonths: 18,
    commission: '4%',
    color: 'text-gold',
    bgColor: 'bg-gold/10',
  },
];

export function AmbassadorStatus({
  score,
  transactions,
  seniorityMonths,
  className,
}: AmbassadorProps) {
  const currentTier = [...TIERS]
    .reverse()
    .find((t) => score >= t.minScore && transactions >= t.minTxs && seniorityMonths >= t.minMonths);

  const nextTier = TIERS.find(
    (t) => score < t.minScore || transactions < t.minTxs || seniorityMonths < t.minMonths,
  );

  return (
    <div
      className={cn(
        'border-charcoal-100 overflow-hidden rounded-[32px] border bg-white shadow-sm',
        className,
      )}
    >
      <div className="bg-navy flex items-center justify-between p-8 text-white">
        <div>
          <p className="text-gold mb-1 text-[10px] font-bold uppercase tracking-[0.2em]">
            Programme Ambassadeurs (5.7.5)
          </p>
          <h3 className="font-serif text-2xl font-bold">
            Votre Statut:{' '}
            <span className={currentTier?.color || 'text-white/40'}>
              {currentTier?.label || 'Acteur'}
            </span>
          </h3>
        </div>
        <div
          className={cn(
            'flex h-14 w-14 items-center justify-center rounded-2xl',
            currentTier?.bgColor || 'bg-white/10',
          )}
        >
          <Award className={cn('h-8 w-8', currentTier?.color || 'text-white/40')} />
        </div>
      </div>

      <div className="space-y-8 p-8">
        {/* Progress Bars */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
              <span>Score de Réputation</span>
              <span className="text-navy">
                {score} / {nextTier?.minScore || 900}
              </span>
            </div>
            <div className="bg-charcoal-50 h-1.5 w-full overflow-hidden rounded-full">
              <div
                className="bg-navy h-full transition-all duration-1000"
                style={{ width: `${Math.min(100, (score / (nextTier?.minScore || 900)) * 100)}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-charcoal-50 rounded-2xl p-4">
              <p className="text-charcoal-400 mb-1 text-[9px] font-bold uppercase tracking-widest">
                Transactions
              </p>
              <p className="text-charcoal text-lg font-bold">
                {transactions}{' '}
                <span className="text-charcoal-300 text-xs font-medium">
                  / {nextTier?.minTxs || 10}
                </span>
              </p>
            </div>
            <div className="bg-charcoal-50 rounded-2xl p-4">
              <p className="text-charcoal-400 mb-1 text-[9px] font-bold uppercase tracking-widest">
                Ancienneté
              </p>
              <p className="text-charcoal text-lg font-bold">
                {seniorityMonths}m{' '}
                <span className="text-charcoal-300 text-xs font-medium">
                  / {nextTier?.minMonths || 18}m
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Advantages */}
        <div className="border-charcoal-50 bg-charcoal-50/30 rounded-2xl border p-6">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="text-gold h-4 w-4" />
            <h4 className="text-charcoal text-xs font-bold uppercase tracking-widest">
              Avantages Actuels
            </h4>
          </div>
          <ul className="space-y-3">
            <li className="text-charcoal-600 flex items-center gap-3 text-sm">
              <CheckCircle2 className="text-emerald h-4 w-4" />
              Commission filleul:{' '}
              <span className="text-navy ml-auto font-bold">{currentTier?.commission || '0%'}</span>
            </li>
            <li className="text-charcoal-600 flex items-center gap-3 text-sm">
              <CheckCircle2 className="text-emerald h-4 w-4" />
              Badge de confiance:{' '}
              <span className="text-navy ml-auto font-bold">{currentTier?.label || 'Acteur'}</span>
            </li>
          </ul>
        </div>

        <Button variant="outline" className="h-12 w-full gap-2 rounded-xl text-xs font-bold">
          <Info className="h-4 w-4" />
          VOIR TOUS LES AVANTAGES VIP
        </Button>
      </div>
    </div>
  );
}
