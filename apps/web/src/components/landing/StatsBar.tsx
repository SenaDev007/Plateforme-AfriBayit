'use client';
import type React from 'react';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface Stat {
  value: number;
  suffix: string;
  label: string;
  prefix?: string;
}

const STATS: Stat[] = [
  { value: 12500, suffix: '+', label: 'Utilisateurs actifs' },
  { value: 3200, suffix: '+', label: 'Propriétés listées' },
  { value: 850, suffix: 'M', label: 'FCFA en transactions', prefix: '' },
  { value: 4, suffix: '', label: 'Pays couverts' },
];

function AnimatedNumber({
  target,
  suffix,
  prefix = '',
}: {
  target: number;
  suffix: string;
  prefix?: string;
}): React.ReactElement {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const start = performance.now();
    const animate = (now: number): void => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out expo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString('fr-FR')}
      {suffix}
    </span>
  );
}

export function StatsBar(): React.ReactElement {
  return (
    <section aria-label="Statistiques AfriBayit" className="bg-navy relative overflow-hidden py-24">
      {/* Background decorative elements */}
      <div className="bg-gold/5 absolute right-0 top-0 h-full w-1/3 translate-x-1/2 rounded-full blur-[120px]" />
      <div className="bg-sky/5 absolute bottom-0 left-0 h-full w-1/4 -translate-x-1/2 rounded-full blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-y-16 lg:grid-cols-4 lg:gap-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="flex flex-col items-center gap-3 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="font-serif text-5xl font-bold text-white sm:text-6xl">
                <AnimatedNumber
                  target={stat.value}
                  suffix={stat.suffix}
                  {...(stat.prefix !== undefined ? { prefix: stat.prefix } : {})}
                />
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-gold mb-3 h-0.5 w-8 opacity-50" />
                <p className="text-gold text-xs font-medium uppercase tracking-[0.2em] sm:text-sm">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
