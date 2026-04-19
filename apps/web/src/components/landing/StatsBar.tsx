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

function AnimatedNumber({ target, suffix, prefix = '' }: { target: number; suffix: string; prefix?: string }): React.ReactElement {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 1500;
    const start = performance.now();
    const animate = (now: number): void => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, target]);

  return (
    <span ref={ref} className="font-mono font-bold text-3xl sm:text-4xl text-white">
      {prefix}{count.toLocaleString('fr-FR')}{suffix}
    </span>
  );
}

export function StatsBar(): React.ReactElement {
  return (
    <section aria-label="Statistiques AfriBayit" className="bg-gradient-to-r from-gold-600 to-gold py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="flex flex-col items-center text-center gap-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <AnimatedNumber target={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
              <p className="text-sm text-white/80">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
