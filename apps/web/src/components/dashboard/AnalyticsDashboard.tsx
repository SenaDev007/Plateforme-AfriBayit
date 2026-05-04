'use client';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  Search,
  Award,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Zap,
  BarChart3,
  PieChart,
  Activity,
  Info,
} from 'lucide-react';
import { Card, Badge, Button, cn } from '@afribayit/ui';

export function AnalyticsDashboard({
  role = 'AGENT',
}: {
  role?: 'AGENT' | 'ARTISAN' | 'EXPERT' | 'INVESTOR';
}) {
  return (
    <div className="animate-in fade-in space-y-8 duration-700">
      {/* 5.9.1 — Common Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {[
          { label: 'Vues du profil', value: '1,240', trend: '+12%', icon: Users },
          { label: 'Apparitions recherche', value: '452', trend: '+5%', icon: Search },
          { label: 'Score Complétude', value: '92%', trend: 'Optimisé', icon: Award },
          { label: 'Taux Engagement', value: '4.8%', trend: '-2%', icon: Activity },
        ].map((stat, i) => (
          <Card
            key={i}
            className="border-charcoal-100 hover:border-navy group flex flex-col justify-between rounded-[32px] p-6 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="bg-navy/5 text-navy group-hover:bg-navy flex h-10 w-10 items-center justify-center rounded-xl transition-colors group-hover:text-white">
                <stat.icon className="h-5 w-5" />
              </div>
              <Badge
                variant={
                  stat.trend.includes('+')
                    ? 'success'
                    : stat.trend === 'Optimisé'
                      ? 'outline'
                      : 'warning'
                }
                className="text-[8px] font-black"
              >
                {stat.trend}
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-charcoal text-2xl font-black">{stat.value}</p>
              <p className="text-charcoal-400 text-[10px] font-bold uppercase tracking-widest">
                {stat.label}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Performance Chart — 5.9.3 */}
        <Card className="border-charcoal-100 space-y-8 rounded-[40px] p-8 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-charcoal font-serif text-2xl font-bold">Performance Mensuelle</h3>
              <p className="text-charcoal-400 text-xs">
                Vues vs Contacts générés (30 derniers jours)
              </p>
            </div>
            <select className="bg-charcoal-50 rounded-xl border-none px-4 py-2 text-xs font-bold outline-none">
              <option>30 derniers jours</option>
              <option>90 derniers jours</option>
            </select>
          </div>

          <div className="flex h-64 items-end gap-2 px-2">
            {[40, 65, 45, 90, 60, 80, 55, 70, 85, 40, 60, 95].map((h, i) => (
              <div key={i} className="group flex flex-1 cursor-pointer flex-col items-center gap-2">
                <div className="relative w-full">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: i * 0.05, duration: 1 }}
                    className={cn(
                      'w-full rounded-t-lg transition-all',
                      h > 70 ? 'bg-navy' : 'bg-navy/40 group-hover:bg-navy/60',
                    )}
                  />
                </div>
                <span className="text-charcoal-300 text-[8px] font-bold">J{i + 1}</span>
              </div>
            ))}
          </div>

          <div className="border-charcoal-50 grid grid-cols-2 gap-4 border-t pt-4 md:grid-cols-4">
            <div className="space-y-1">
              <p className="text-charcoal-400 text-[10px] font-bold uppercase">Conversion</p>
              <p className="text-navy text-lg font-bold">18.5%</p>
            </div>
            <div className="space-y-1">
              <p className="text-charcoal-400 text-[10px] font-bold uppercase">Market Avg.</p>
              <p className="text-charcoal-300 text-lg font-bold">12.2%</p>
            </div>
            <div className="space-y-1">
              <p className="text-charcoal-400 text-[10px] font-bold uppercase">Favoris</p>
              <p className="text-gold text-lg font-bold">142</p>
            </div>
            <div className="space-y-1">
              <p className="text-charcoal-400 text-[10px] font-bold uppercase">Partages</p>
              <p className="text-emerald text-lg font-bold">28</p>
            </div>
          </div>
        </Card>

        {/* Rebecca Insights — 5.9.2 */}
        <div className="space-y-8">
          <Card className="bg-navy relative space-y-6 overflow-hidden rounded-[40px] border-none p-8 text-white shadow-2xl">
            <div className="bg-gold/10 absolute -bottom-10 -right-10 h-40 w-40 rounded-full blur-3xl" />
            <div className="relative z-10 flex items-center gap-3">
              <Zap className="text-gold fill-gold/20 h-6 w-6" />
              <h3 className="font-serif text-xl font-bold">Rebecca Insights</h3>
            </div>
            <div className="relative z-10 space-y-4">
              <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-gold text-xs font-bold">Opportunité</p>
                <p className="text-charcoal-300 text-[11px] italic leading-relaxed">
                  "Votre annonce du Plateau a 3x moins de vues que similaires. Ajoutez une visite VR
                  pour améliorer votre classement."
                </p>
              </div>
              <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-emerald text-xs font-bold">Tendance Locale</p>
                <p className="text-charcoal-300 text-[11px] italic leading-relaxed">
                  "La demande pour les studios à Cotonou-Sud a bondi de 15%. C'est le moment idéal
                  pour booster vos offres."
                </p>
              </div>
            </div>
            <Button
              fullWidth
              className="bg-gold hover:bg-gold-600 relative z-10 h-12 rounded-xl border-none font-bold text-white transition-all"
            >
              OPTIMISER AVEC REBECCA
            </Button>
          </Card>

          {/* Ranking Stats — 5.9.2 */}
          <Card className="border-charcoal-100 space-y-6 rounded-[40px] p-8">
            <div className="flex items-center gap-3">
              <Globe className="text-navy h-5 w-5" />
              <h3 className="text-charcoal font-serif text-xl font-bold">Classement Local</h3>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-charcoal text-xs font-bold">Top Agents Cotonou</p>
                  <p className="text-charcoal-400 text-[10px]">Basé sur les ventes & avis</p>
                </div>
                <div className="text-right">
                  <p className="text-navy text-xl font-black">#12</p>
                  <p className="text-emerald text-[8px] font-bold uppercase tracking-widest">
                    Top 5%
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-charcoal-400 flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span>Satisfaction</span>
                  <span>4.9/5.0</span>
                </div>
                <div className="bg-charcoal-50 h-1.5 w-full overflow-hidden rounded-full">
                  <div className="bg-gold h-full w-[98%]" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-charcoal-400 flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span>Réactivité</span>
                  <span>14 min</span>
                </div>
                <div className="bg-charcoal-50 h-1.5 w-full overflow-hidden rounded-full">
                  <div className="bg-navy h-full w-[85%]" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
