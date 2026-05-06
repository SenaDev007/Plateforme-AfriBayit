'use client';
import { motion } from 'framer-motion';
import { BookOpen, Award, Users, Play } from 'lucide-react';
import { Badge } from '@afribayit/ui';

export function FormationHeader() {
  return (
    <header className="bg-navy relative flex min-h-[70vh] flex-col justify-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-gold/15 absolute right-[-5%] top-[-10%] h-[700px] w-[700px] animate-pulse rounded-full blur-[140px]" />
        <div className="absolute bottom-[-5%] left-[-5%] h-[500px] w-[500px] rounded-full bg-white/5 blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] opacity-[0.05] [background-size:40px_40px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-10"
        >
          <div className="flex items-center gap-4">
            <div className="text-gold border-gold/30 bg-gold/5 inline-flex items-center gap-3 rounded-full border px-6 py-2 text-[10px] font-black uppercase tracking-[0.4em] backdrop-blur-xl">
              <BookOpen className="h-3.5 w-3.5" />
              Académie V3.0 (Masterclass)
            </div>
            <Badge variant="outline" className="border-white/20 px-4 font-bold text-white/40">
              CERTIFIÉ AFRIBAYIT
            </Badge>
          </div>

          <h1 className="max-w-6xl font-serif text-6xl font-bold leading-[1.05] tracking-tight text-white md:text-[100px] lg:text-[120px]">
            Maîtrisez l'immobilier.
            <br />
            Bâtissez votre <span className="text-gold italic">empire</span>.
          </h1>

          <div className="flex flex-col justify-between gap-12 lg:flex-row lg:items-end">
            <p className="border-gold/30 max-w-2xl border-l pl-8 text-xl font-light leading-relaxed text-white/50">
              Apprenez des meilleurs experts du continent. Une plateforme d'éducation de nouvelle
              génération pour sécuriser vos investissements en Afrique de l'Ouest.
            </p>
            <div className="flex flex-wrap gap-4">
              {[
                { icon: Award, label: 'Certification Blockchain' },
                { icon: Users, label: 'Mentorat Privé' },
                { icon: Play, label: 'Accès Illimité' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-xs font-bold text-white/80 backdrop-blur-md"
                >
                  <item.icon className="text-gold h-4 w-4" />
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
