import type React from 'react';
import type { Metadata } from 'next';
import type { Route } from 'next';
import Link from 'next/link';
import { BookOpen, Clock, Users, Star, Play, Award, ArrowRight } from 'lucide-react';
import { Badge, Button } from '@afribayit/ui';
import { motion } from 'framer-motion';
import { cn } from '@afribayit/ui/src/lib/cn';
import { SiteNavbar } from '@/components/landing/SiteNavbar';
import { SiteFooter } from '@/components/landing/SiteFooter';

const API_URL = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:4000';

export const metadata: Metadata = {
  title: 'Académie AfriBayit | Formations Immobilières',
  description:
    "Formez-vous à l'investissement immobilier en Afrique avec les experts AfriBayit. Droit foncier, gestion locative, rendement — formations certifiantes en ligne.",
};

import { api } from '@/lib/api';

const LEVEL_CONFIG = {
  BEGINNER: { label: 'Débutant', variant: 'success' as const },
  INTERMEDIATE: { label: 'Intermédiaire', variant: 'sky' as const },
  ADVANCED: { label: 'Avancé', variant: 'gold' as const },
};

const CATEGORIES = ['Tous', 'Investissement', 'Financement', 'Gestion', 'Juridique', 'Promotion'];

function CourseCard({ course }: { course: any }): React.ReactElement {
  const level = LEVEL_CONFIG[course.level as keyof typeof LEVEL_CONFIG] || LEVEL_CONFIG.BEGINNER;
  return (
    <article className="border-charcoal-100 group flex flex-col overflow-hidden rounded-[32px] border bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
      <div className="relative h-56 overflow-hidden">
        <img
          src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa'}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors duration-500 group-hover:bg-black/40">
          <div className="flex h-14 w-14 translate-y-4 items-center justify-center rounded-full bg-white/90 opacity-0 backdrop-blur-md transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <Play className="text-navy fill-navy ml-1 h-6 w-6" />
          </div>
        </div>
        <div className="absolute left-4 top-4 flex gap-2">
          {course.isFeatured && (
            <Badge variant="gold" className="px-3 py-1 shadow-lg">
              Premium
            </Badge>
          )}
          <Badge variant={level.variant} className="px-3 py-1 shadow-lg">
            {level.label}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-5 p-6">
        <div className="space-y-2">
          <p className="text-gold text-[10px] font-bold uppercase tracking-[0.2em]">
            {course.category || 'ACADEMY'}
          </p>
          <h3 className="text-charcoal group-hover:text-navy font-serif text-xl font-bold leading-tight transition-colors">
            {course.title}
          </h3>
        </div>

        <div className="border-charcoal-50 flex items-center gap-3 border-t pt-2">
          <div className="bg-navy flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white">
            AF
          </div>
          <div>
            <p className="text-charcoal text-xs font-bold">Expert AfriBayit</p>
            <p className="text-charcoal-400 text-[10px] font-medium">Instructeur Certifié</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="text-charcoal-400 flex items-center gap-2 text-[11px] font-bold">
            <Clock className="text-navy h-3.5 w-3.5" />
            Flexible
          </div>
          <div className="text-charcoal-400 flex items-center gap-2 text-[11px] font-bold">
            <Users className="text-navy h-3.5 w-3.5" />
            Accès Illimité
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between pt-4">
          <p className="text-navy font-serif text-2xl font-bold">
            {(course.price || 0).toLocaleString('fr-FR')}{' '}
            <span className="text-charcoal-400 font-sans text-xs">FCFA</span>
          </p>
          <Link href={`/formation/${course.slug}` as Route}>
            <Button className="rounded-full px-6 text-xs font-bold">REJOINDRE</Button>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default async function FormationPage(): Promise<React.ReactElement> {
  let courses: any[] = [];
  try {
    const response = await api.courses.findAll();
    courses = response.data.data;
  } catch (error) {
    console.error('Failed to fetch courses', error);
  }

  return (
    <div className="selection:bg-gold selection:text-navy min-h-screen bg-white">
      <SiteNavbar />

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

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        {/* Categories */}
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <h2 className="text-charcoal font-serif text-3xl font-bold">Parcourir les cours</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className="bg-charcoal-50 text-charcoal-500 hover:bg-navy rounded-full px-5 py-2 text-xs font-bold shadow-sm transition-all duration-300 hover:text-white"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        {/* Instructor CTA */}
        <div className="bg-navy relative mt-32 overflow-hidden rounded-[48px] p-8 text-center md:p-20 md:text-left">
          <div className="bg-gold/10 absolute right-0 top-0 h-full w-1/3 translate-x-1/2 rounded-full blur-[100px]" />
          <div className="relative z-10 grid items-center gap-12 md:grid-cols-2">
            <div className="space-y-6">
              <h2 className="font-serif text-4xl font-bold text-white md:text-5xl">
                Partagez votre <span className="text-gold italic">expertise</span>
              </h2>
              <p className="text-lg font-light leading-relaxed text-white/60">
                Vous êtes avocat, promoteur, notaire ou investisseur aguerri ? Devenez formateur sur
                AfriBayit Academy et contribuez à bâtir l'immobilier de demain.
              </p>
              <Button
                variant="gold"
                className="shadow-gold/20 mx-auto flex h-14 items-center gap-2 rounded-full px-10 text-base font-bold shadow-xl md:mx-0"
              >
                POSTULER COMME FORMATEUR
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
            <div className="hidden justify-end md:flex">
              <div className="flex h-64 w-64 items-center justify-center rounded-full border-2 border-white/10 p-8">
                <Award className="text-gold h-32 w-32 opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
