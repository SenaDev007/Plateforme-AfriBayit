import type React from 'react';
import type { Metadata } from 'next';
import type { Route } from 'next';
import Link from 'next/link';
import { BookOpen, Clock, Users, Star, Play, Award, ArrowRight } from 'lucide-react';
import { Badge, Button } from '@afribayit/ui';
import { motion } from 'framer-motion';
import { cn } from '@afribayit/ui/src/lib/cn';

const API_URL = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:4000';

export const metadata: Metadata = {
  title: 'Formation Immobilière',
  description: "Formez-vous à l'investissement immobilier en Afrique avec les experts AfriBayit.",
};

interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  duration: string;
  lessonCount: number;
  enrolledCount: number;
  rating: number;
  reviewCount: number;
  price: number;
  currency: string;
  isFree: boolean;
  isFeatured: boolean;
  instructor: { name: string; title: string; avatar: string };
  thumbnail: string;
  tags: string[];
}

const COURSES: Course[] = [
  {
    id: '1',
    slug: 'investir-immobilier-afrique-debutant',
    title: "Investir dans l'immobilier africain : guide débutant",
    description:
      "Apprenez les bases de l'investissement immobilier en Afrique de l'Ouest, les risques à éviter.",
    category: 'Investissement',
    level: 'BEGINNER',
    duration: '4h30',
    lessonCount: 18,
    enrolledCount: 1247,
    rating: 4.8,
    reviewCount: 312,
    price: 0,
    currency: 'XOF',
    isFree: true,
    isFeatured: true,
    instructor: { name: 'Dr. Aïssatou Diagne', title: 'Économiste & investisseur', avatar: 'AD' },
    thumbnail: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=800&q=80',
    tags: ['Débutant', 'Investissement'],
  },
  {
    id: '2',
    slug: 'negocier-financer-propriete',
    title: 'Négocier et financer votre propriété',
    description:
      'Maîtrisez les techniques de négociation et les options de financement disponibles.',
    category: 'Financement',
    level: 'INTERMEDIATE',
    duration: '6h15',
    lessonCount: 24,
    enrolledCount: 843,
    rating: 4.7,
    reviewCount: 187,
    price: 25000,
    currency: 'XOF',
    isFree: false,
    isFeatured: true,
    instructor: { name: 'Kofi Asante', title: 'Courtier immobilier senior', avatar: 'KA' },
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
    tags: ['Financement', 'Négociation'],
  },
  {
    id: '3',
    slug: 'gestion-locative-professionnelle',
    title: 'Gestion locative professionnelle',
    description:
      'Gérez efficacement vos biens en location : sélection des locataires, contrats, fiscalité.',
    category: 'Gestion',
    level: 'INTERMEDIATE',
    duration: '5h00',
    lessonCount: 20,
    enrolledCount: 621,
    rating: 4.9,
    reviewCount: 143,
    price: 20000,
    currency: 'XOF',
    isFree: false,
    isFeatured: false,
    instructor: {
      name: 'Fatima Ouédraogo',
      title: 'Gestionnaire immobilier certifiée',
      avatar: 'FO',
    },
    thumbnail: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800&q=80',
    tags: ['Gestion locative'],
  },
];

const LEVEL_CONFIG = {
  BEGINNER: { label: 'Débutant', variant: 'success' as const },
  INTERMEDIATE: { label: 'Intermédiaire', variant: 'sky' as const },
  ADVANCED: { label: 'Avancé', variant: 'gold' as const },
};

const CATEGORIES = ['Tous', 'Investissement', 'Financement', 'Gestion', 'Juridique', 'Promotion'];

function CourseCard({ course }: { course: Course }): React.ReactElement {
  const level = LEVEL_CONFIG[course.level];
  return (
    <article className="border-charcoal-100 group flex flex-col overflow-hidden rounded-[32px] border bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
      <div className="relative h-56 overflow-hidden">
        <img
          src={course.thumbnail}
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
            {course.category}
          </p>
          <h3 className="text-charcoal group-hover:text-navy font-serif text-xl font-bold leading-tight transition-colors">
            {course.title}
          </h3>
        </div>

        <div className="border-charcoal-50 flex items-center gap-3 border-t pt-2">
          <div className="bg-navy flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white">
            {course.instructor.avatar}
          </div>
          <div>
            <p className="text-charcoal text-xs font-bold">{course.instructor.name}</p>
            <p className="text-charcoal-400 text-[10px] font-medium">{course.instructor.title}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="text-charcoal-400 flex items-center gap-2 text-[11px] font-bold">
            <Clock className="text-navy h-3.5 w-3.5" />
            {course.duration}
          </div>
          <div className="text-charcoal-400 flex items-center gap-2 text-[11px] font-bold">
            <Users className="text-navy h-3.5 w-3.5" />
            {course.enrolledCount.toLocaleString()}
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between pt-4">
          {course.isFree ? (
            <span className="font-serif text-xl font-bold italic text-emerald-600 underline decoration-emerald-200 underline-offset-4">
              Gratuit
            </span>
          ) : (
            <p className="text-navy font-serif text-2xl font-bold">
              {course.price.toLocaleString('fr-FR')}{' '}
              <span className="text-charcoal-400 font-sans text-xs">FCFA</span>
            </p>
          )}
          <Link href={`/formation/${course.slug}` as Route}>
            <Button className="rounded-full px-6 text-xs font-bold">
              {course.isFree ? 'REJOINDRE' : "S'INSCRIRE"}
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function FormationPage(): React.ReactElement {
  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <header className="bg-navy pb-20 pt-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 text-center md:text-left">
            <p className="text-gold text-sm font-bold uppercase tracking-[0.2em]">
              AfriBayit Academy
            </p>
            <h1 className="font-serif text-4xl font-bold leading-tight text-white md:text-6xl">
              Devenez un expert de <br />
              <span className="text-gold italic">l'immobilier africain</span>
            </h1>
            <p className="max-w-2xl text-base font-light text-white/60 md:text-lg">
              Des formations pratiques dispensées par les meilleurs experts du marché pour sécuriser
              vos investissements et développer votre patrimoine sur le continent.
            </p>

            <div className="mt-4 flex flex-wrap justify-center gap-8 md:justify-start">
              {[
                { label: '24+ Formations', icon: BookOpen },
                { label: 'Certificats de réussite', icon: Award },
                { label: 'Support experts', icon: Users },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80"
                >
                  <item.icon className="text-gold h-4 w-4" />
                  {item.label}
                </div>
              ))}
            </div>
          </div>
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
          {COURSES.map((course) => (
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
    </div>
  );
}
