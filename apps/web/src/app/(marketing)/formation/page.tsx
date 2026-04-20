import type React from 'react';
import type { Metadata } from 'next';
import type { Route } from 'next';
import Link from 'next/link';
import { BookOpen, Clock, Users, Star, Play, Award } from 'lucide-react';
import { Badge, Button } from '@afribayit/ui';

export const metadata: Metadata = {
  title: 'Formation Immobilière',
  description: 'Formez-vous à l\'investissement immobilier en Afrique avec les experts AfriBayit.',
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
    id: '1', slug: 'investir-immobilier-afrique-debutant',
    title: 'Investir dans l\'immobilier africain : guide débutant',
    description: 'Apprenez les bases de l\'investissement immobilier en Afrique de l\'Ouest, les risques à éviter et les opportunités à saisir.',
    category: 'Investissement', level: 'BEGINNER', duration: '4h30', lessonCount: 18,
    enrolledCount: 1247, rating: 4.8, reviewCount: 312, price: 0, currency: 'XOF', isFree: true, isFeatured: true,
    instructor: { name: 'Dr. Aïssatou Diagne', title: 'Économiste & investisseur', avatar: 'AD' },
    thumbnail: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=600&q=80',
    tags: ['Débutant', 'Investissement', 'Bénin', 'Afrique'],
  },
  {
    id: '2', slug: 'negocier-financer-propriete',
    title: 'Négocier et financer votre propriété',
    description: 'Maîtrisez les techniques de négociation et les options de financement disponibles en Afrique francophone.',
    category: 'Financement', level: 'INTERMEDIATE', duration: '6h15', lessonCount: 24,
    enrolledCount: 843, rating: 4.7, reviewCount: 187, price: 25000, currency: 'XOF', isFree: false, isFeatured: true,
    instructor: { name: 'Kofi Asante', title: 'Courtier immobilier senior', avatar: 'KA' },
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80',
    tags: ['Financement', 'Négociation', 'Crédit immobilier'],
  },
  {
    id: '3', slug: 'gestion-locative-professionnelle',
    title: 'Gestion locative professionnelle',
    description: 'Gérez efficacement vos biens en location : sélection des locataires, contrats, entretien, fiscalité.',
    category: 'Gestion', level: 'INTERMEDIATE', duration: '5h00', lessonCount: 20,
    enrolledCount: 621, rating: 4.9, reviewCount: 143, price: 20000, currency: 'XOF', isFree: false, isFeatured: false,
    instructor: { name: 'Fatima Ouédraogo', title: 'Gestionnaire immobilier certifiée', avatar: 'FO' },
    thumbnail: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=600&q=80',
    tags: ['Gestion locative', 'Propriétaire', 'Contrat'],
  },
  {
    id: '4', slug: 'droit-immobilier-afrique-ouest',
    title: 'Droit immobilier en Afrique de l\'Ouest',
    description: 'Comprenez le cadre juridique de la propriété immobilière au Bénin, Côte d\'Ivoire, Burkina Faso et Togo.',
    category: 'Juridique', level: 'ADVANCED', duration: '8h00', lessonCount: 32,
    enrolledCount: 389, rating: 4.6, reviewCount: 98, price: 35000, currency: 'XOF', isFree: false, isFeatured: false,
    instructor: { name: 'Me. Rodrigue Adéchi', title: 'Avocat spécialisé immobilier', avatar: 'RA' },
    thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&q=80',
    tags: ['Droit', 'Juridique', 'Titre foncier', 'Notaire'],
  },
  {
    id: '5', slug: 'promotion-immobiliere-bases',
    title: 'Promotion immobilière : les bases',
    description: 'Lancez votre premier projet immobilier : de l\'étude de marché aux clés en mains.',
    category: 'Promotion', level: 'ADVANCED', duration: '10h30', lessonCount: 42,
    enrolledCount: 234, rating: 4.8, reviewCount: 67, price: 50000, currency: 'XOF', isFree: false, isFeatured: true,
    instructor: { name: 'Ibrahima Seck', title: 'Promoteur immobilier — 20 ans d\'exp.', avatar: 'IS' },
    thumbnail: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80',
    tags: ['Promotion', 'Développement', 'Construction'],
  },
  {
    id: '6', slug: 'photographie-immobiliere',
    title: 'Photographie immobilière : valorisez vos biens',
    description: 'Techniques photographiques pour présenter vos propriétés de manière professionnelle et attirer plus d\'acheteurs.',
    category: 'Marketing', level: 'BEGINNER', duration: '2h30', lessonCount: 10,
    enrolledCount: 1089, rating: 4.5, reviewCount: 221, price: 0, currency: 'XOF', isFree: true, isFeatured: false,
    instructor: { name: 'Amara Touré', title: 'Photographe immobilier professionnel', avatar: 'AT' },
    thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80',
    tags: ['Photographie', 'Marketing', 'Annonce'],
  },
];

const LEVEL_CONFIG = {
  BEGINNER: { label: 'Débutant', variant: 'success' as const },
  INTERMEDIATE: { label: 'Intermédiaire', variant: 'sky' as const },
  ADVANCED: { label: 'Avancé', variant: 'gold' as const },
};

const CATEGORIES = ['Tous', 'Investissement', 'Financement', 'Gestion', 'Juridique', 'Promotion', 'Marketing'];

function CourseCard({ course }: { course: Course }): React.ReactElement {
  const level = LEVEL_CONFIG[course.level];
  return (
    <article className="bg-white rounded-xl border border-charcoal-100 overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
      <div className="relative h-44 overflow-hidden">
        <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-charcoal/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90">
            <Play className="h-5 w-5 text-navy fill-navy" aria-hidden="true" />
          </div>
        </div>
        {course.isFeatured && <Badge variant="gold" className="absolute top-2 left-2 text-xs">⭐ Recommandé</Badge>}
        <Badge variant={level.variant} className="absolute top-2 right-2 text-xs">{level.label}</Badge>
      </div>

      <div className="flex-1 p-5 flex flex-col gap-3">
        <div>
          <p className="text-xs text-charcoal-400 font-medium mb-1">{course.category}</p>
          <h3 className="font-semibold text-charcoal leading-snug line-clamp-2 group-hover:text-navy transition-colors">{course.title}</h3>
        </div>

        <p className="text-sm text-charcoal-400 line-clamp-2">{course.description}</p>

        {/* Instructor */}
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-navy text-white text-xs font-semibold" aria-hidden="true">
            {course.instructor.avatar}
          </div>
          <div>
            <p className="text-xs font-medium text-charcoal">{course.instructor.name}</p>
            <p className="text-[10px] text-charcoal-400">{course.instructor.title}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-charcoal-400">
          <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-gold text-gold" />{course.rating} ({course.reviewCount})</span>
          <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{course.enrolledCount.toLocaleString()}</span>
          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{course.duration}</span>
          <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" />{course.lessonCount} leçons</span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-charcoal-50">
          {course.isFree ? (
            <span className="text-lg font-bold text-emerald-700">Gratuit</span>
          ) : (
            <p className="font-mono font-bold text-navy">{course.price.toLocaleString('fr-FR')} <span className="text-sm font-normal text-charcoal-400">FCFA</span></p>
          )}
          <Link href={`/formation/${course.slug}` as Route}>
            <Button size="sm">{course.isFree ? 'Commencer' : 'S\'inscrire'}</Button>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function FormationPage(): React.ReactElement {
  return (
    <div className="min-h-screen bg-charcoal-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-sky/90 to-navy py-16 px-4">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm font-medium text-gold uppercase tracking-widest mb-3">Formation</p>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white mb-4">
            Maîtrisez l'immobilier africain
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
            Des formations pratiques dispensées par des experts du marché immobilier en Afrique de l'Ouest.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-white/80 text-sm">
            {[
              { icon: BookOpen, label: '24 formations disponibles' },
              { icon: Users, label: '5 000+ apprenants' },
              { icon: Award, label: 'Certificats reconnus' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-gold" aria-hidden="true" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Featured */}
        <div className="mb-10">
          <h2 className="font-serif text-2xl font-bold text-charcoal mb-6">Formations recommandées</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COURSES.filter((c) => c.isFeatured).map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>

        {/* All courses */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="font-serif text-2xl font-bold text-charcoal">Toutes les formations</h2>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button key={cat} className="rounded-pill px-3 py-1.5 text-xs font-medium bg-charcoal-50 text-charcoal hover:bg-navy/10 hover:text-navy transition-colors">
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COURSES.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 bg-navy rounded-2xl p-8 sm:p-12 text-center">
          <Award className="h-10 w-10 text-gold mx-auto mb-4" aria-hidden="true" />
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-3">Devenez formateur AfriBayit</h2>
          <p className="text-white/70 max-w-lg mx-auto mb-6">
            Vous êtes expert en immobilier ? Partagez vos connaissances et générez des revenus en créant vos formations.
          </p>
          <Button variant="gold" size="lg">Proposer une formation</Button>
        </div>
      </div>
    </div>
  );
}
