import { useState } from 'react';
import { Card, Button, Input } from '@afribayit/ui';
import { Label } from '@/components/ui/label';
import { TrendingUp, Wallet, Percent } from 'lucide-react';
import { motion } from 'framer-motion';

interface ROICalculatorProps {
  price: number;
  currency: string;
}

export function ROICalculator({ price, currency }: ROICalculatorProps) {
  const [monthlyRent, setMonthlyRent] = useState<number>(0);
  const [annualExpenses, setAnnualExpenses] = useState<number>(0);

  const annualRent = monthlyRent * 12;
  const netAnnualIncome = annualRent - annualExpenses;
  const grossYield = price > 0 ? (annualRent / price) * 100 : 0;
  const netYield = price > 0 ? (netAnnualIncome / price) * 100 : 0;

  return (
    <Card className="border-navy/20 space-y-6 bg-white p-6 shadow-sm">
      <div className="text-navy flex items-center gap-2">
        <TrendingUp className="h-5 w-5" />
        <h3 className="font-serif text-lg font-bold">Calculateur de Rendement</h3>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-charcoal-400 text-xs font-semibold uppercase">
            Loyer Mensuel Estimé
          </Label>
          <div className="relative">
            <Input
              type="number"
              value={monthlyRent}
              onChange={(e) => setMonthlyRent(Number(e.target.value))}
              placeholder="0"
              className="pl-3 pr-12"
            />
            <span className="text-charcoal-400 absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium">
              {currency}
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-charcoal-400 text-xs font-semibold uppercase">
            Charges Annuelles
          </Label>
          <div className="relative">
            <Input
              type="number"
              value={annualExpenses}
              onChange={(e) => setAnnualExpenses(Number(e.target.value))}
              placeholder="0"
              className="pl-3 pr-12"
            />
            <span className="text-charcoal-400 absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium">
              {currency}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 pt-4 sm:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center rounded-xl border border-slate-100 bg-slate-50 p-4 text-center"
        >
          <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
            <Percent className="h-3 w-3" /> Rendement Brut
          </div>
          <span className="text-charcoal font-mono text-2xl font-bold">
            {grossYield.toFixed(2)}%
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-navy/5 border-navy/10 flex flex-col items-center rounded-xl border p-4 text-center"
        >
          <div className="text-navy mb-1 flex items-center gap-2 text-xs font-bold uppercase">
            <Wallet className="h-3 w-3" /> Rendement Net
          </div>
          <span className="text-navy font-mono text-2xl font-bold">{netYield.toFixed(2)}%</span>
        </motion.div>
      </div>

      <div className="border-t border-slate-100 pt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-charcoal-400">Revenu Net Annuel :</span>
          <span className="text-charcoal font-mono font-bold">
            {netAnnualIncome.toLocaleString('fr-FR')} {currency}
          </span>
        </div>
      </div>
    </Card>
  );
}
