import type React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Play, BookOpen, Clock, Users, Star, Award, CheckCircle2, Lock } from 'lucide-react';
import { Badge, Button } from '@afribayit/ui';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Formation — ${slug}`, description: 'Formation immobilière AfriBayit' };
}

const MOCK_COURSE = {
  id: '1',
  slug: 'investir-immobilier-afrique-debutant',
  title: 'Investir dans l\'immobilier africain : guide débutant',
  description: `Cette formation complète vous guide pas à pas dans les fondamentaux de l'investissement immobilier en Afrique de l'Ouest. Que vous souhaitiez acheter votre résidence principale ou constituer un patrimoine locatif, vous y trouverez les clés pour réussir.

Après cette formation, vous saurez évaluer une opportunité d'investissement, négocier efficacement, sécuriser votre transaction et optimiser votre rendement locatif.`,
  category: 'Investissement',
  level: 'BEGINNER' as const,
  duration: '4h30',
  lessonCount: 18,
  enrolledCount: 1247,
  rating: 4.8,
  reviewCount: 312,
  price: 0,
  currency: 'XOF',
  isFree: true,
  isFeatured: true,
  thumbnail: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=1200&q=85',
  instructor: { name: 'Dr. Aïssatou Diagne', title: 'Économiste & investisseur immobilier', avatar: 'AD', bio: 'Docteure en économie, investisseur depuis 15 ans en Afrique de l\'Ouest. Auteure de "L\'immobilier africain pour tous".' },
  objectives: [
    'Comprendre le marché immobilier en Afrique de l\'Ouest',
    'Identifier les meilleures opportunités d\'investissement',
    'Maîtriser les outils d\'évaluation d\'un bien',
    'Sécuriser votre achat avec l\'escrow AfriBayit',
    'Calculer la rentabilité locative nette',
    'Éviter les pièges et arnaques fréquents',
  ],
  modules: [
    {
      id: '1', title: 'Introduction au marché immobilier africain', lessons: [
        { id: '1', title: 'Panorama des marchés — Bénin, CI, BF, Togo', duration: '12 min', isFree: true },
        { id: '2', title: 'Tendances prix 2024-2026', duration: '18 min', isFree: true },
        { id: '3', title: 'Qui achète, qui loue, qui investit ?', duration: '15 min', isFree: false },
      ],
    },
    {
      id: '2', title: 'Trouver et évaluer un bien', lessons: [
        { id: '4', title: 'Les meilleures sources d\'annonces', duration: '10 min', isFree: false },
        { id: '5', title: 'Visite physique : les points de contrôle', duration: '22 min', isFree: false },
        { id: '6', title: 'Estimer la valeur réelle d\'un bien', duration: '20 min', isFree: false },
        { id: '7', title: 'Red flags : les signaux d\'alarme', duration: '18 min', isFree: false },
      ],
    },
    {
      id: '3', title: 'Financement et négociation', lessons: [
        { id: '8', title: 'Financement personnel vs crédit', duration: '15 min', isFree: false },
        { id: '9', title: 'Techniques de négociation', duration: '25 min', isFree: false },
        { id: '10', title: 'Les coûts cachés d\'un achat', duration: '12 min', isFree: false },
      ],
    },
    {
      id: '4', title: 'Sécuriser sa transaction', lessons: [
        { id: '11', title: 'Le titre foncier : essentiel absolu', duration: '20 min', isFree: false },
        { id: '12', title: 'L\'escrow AfriBayit expliqué', duration: '15 min', isFree: false },
        { id: '13', title: 'Le rôle du notaire', duration: '18 min', isFree: false },
      ],
    },
    {
      id: '5', title: 'Rentabilité et gestion locative', lessons: [
        { id: '14', title: 'Calculer son rendement brut et net', duration: '22 min', isFree: false },
        { id: '15', title: 'Fixer le bon loyer', duration: '15 min', isFree: false },
        { id: '16', title: 'Sélectionner ses locataires', duration: '18 min', isFree: false },
        { id: '17', title: 'Fiscalité des revenus locatifs', duration: '20 min', isFree: false },
        { id: '18', title: 'Bilan et prochaines étapes', duration: '10 min', isFree: false },
      ],
    },
  ],
  tags: ['Débutant', 'Investissement', 'Bénin', 'Afrique', 'Immobilier'],
};

const LEVEL_CONFIG = {
  BEGINNER: { label: 'Débutant', variant: 'success' as const },
  INTERMEDIATE: { label: 'Intermédiaire', variant: 'sky' as const },
  ADVANCED: { label: 'Avancé', variant: 'gold' as const },
};

export default async function FormationDetailPage({ params }: Props): Promise<React.ReactElement> {
  const { slug } = await params;
  if (!slug) notFound();

  const course = MOCK_COURSE;
  const level = LEVEL_CONFIG[course.level];
  const totalLessons = course.modules.reduce((s, m) => s + m.lessons.length, 0);

  return (
    <div className="min-h-screen bg-charcoal-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-navy to-navy/80 py-12 px-4">
        <div className="mx-auto max-w-5xl">
          <Link href="/formation" className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white mb-6 transition-colors">
            <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Retour aux formations
          </Link>
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant={level.variant}>{level.label}</Badge>
                <Badge variant="sky">{course.category}</Badge>
                {course.isFree && <Badge variant="success">Gratuit</Badge>}
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">{course.title}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-white/70">
                <span className="flex items-center gap-1.5"><Star className="h-4 w-4 fill-gold text-gold" />{course.rating} ({course.reviewCount} avis)</span>
                <span className="flex items-center gap-1.5"><Users className="h-4 w-4" />{course.enrolledCount.toLocaleString()} apprenants</span>
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{course.duration}</span>
                <span className="flex items-center gap-1.5"><BookOpen className="h-4 w-4" />{totalLessons} leçons</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold text-navy font-bold text-sm" aria-hidden="true">{course.instructor.avatar}</div>
                <div>
                  <p className="text-sm font-medium text-white">{course.instructor.name}</p>
                  <p className="text-xs text-white/60">{course.instructor.title}</p>
                </div>
              </div>
            </div>

            {/* CTA card (desktop) */}
            <div className="hidden lg:block bg-white rounded-xl overflow-hidden shadow-xl">
              <img src={course.thumbnail} alt={course.title} className="h-40 w-full object-cover" />
              <div className="p-5 flex flex-col gap-4">
                {course.isFree ? (
                  <p className="text-2xl font-bold text-emerald-700">Gratuit</p>
                ) : (
                  <p className="font-mono text-2xl font-bold text-navy">{course.price.toLocaleString('fr-FR')} FCFA</p>
                )}
                <Button fullWidth size="lg" className="gap-2">
                  <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                  {course.isFree ? 'Commencer gratuitement' : 'S\'inscrire'}
                </Button>
                <p className="text-center text-xs text-charcoal-400">Accès illimité à vie · Certificat inclus</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Description */}
            <div className="bg-white rounded-xl border border-charcoal-100 p-6">
              <h2 className="font-serif text-lg font-semibold text-charcoal mb-3">À propos de cette formation</h2>
              <p className="text-charcoal-600 leading-relaxed whitespace-pre-line">{course.description}</p>
            </div>

            {/* Objectives */}
            <div className="bg-white rounded-xl border border-charcoal-100 p-6">
              <h2 className="font-serif text-lg font-semibold text-charcoal mb-4">Ce que vous allez apprendre</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {course.objectives.map((obj) => (
                  <li key={obj} className="flex items-start gap-2 text-sm text-charcoal-600">
                    <CheckCircle2 className="h-4 w-4 text-emerald flex-shrink-0 mt-0.5" aria-hidden="true" />
                    {obj}
                  </li>
                ))}
              </ul>
            </div>

            {/* Curriculum */}
            <div className="bg-white rounded-xl border border-charcoal-100 p-6">
              <h2 className="font-serif text-lg font-semibold text-charcoal mb-4">
                Programme ({course.modules.length} modules · {totalLessons} leçons · {course.duration})
              </h2>
              <div className="flex flex-col gap-3">
                {course.modules.map((module, mi) => (
                  <details key={module.id} open={mi === 0} className="group">
                    <summary className="flex items-center justify-between cursor-pointer rounded-lg p-3 bg-charcoal-50 hover:bg-charcoal-100 transition-colors list-none">
                      <div className="flex items-center gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-navy/10 text-navy text-xs font-bold">{mi + 1}</span>
                        <span className="font-medium text-charcoal text-sm">{module.title}</span>
                      </div>
                      <span className="text-xs text-charcoal-400">{module.lessons.length} leçons</span>
                    </summary>
                    <div className="mt-1 ml-3 border-l-2 border-charcoal-100 pl-4 flex flex-col gap-1 py-2">
                      {module.lessons.map((lesson) => (
                        <div key={lesson.id} className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${lesson.isFree ? 'hover:bg-charcoal-50 cursor-pointer' : 'opacity-60 cursor-not-allowed'}`}>
                          <div className="flex items-center gap-2">
                            {lesson.isFree ? (
                              <Play className="h-3.5 w-3.5 text-navy flex-shrink-0" aria-hidden="true" />
                            ) : (
                              <Lock className="h-3.5 w-3.5 text-charcoal-300 flex-shrink-0" aria-hidden="true" />
                            )}
                            <span className={lesson.isFree ? 'text-navy font-medium' : 'text-charcoal-400'}>{lesson.title}</span>
                            {lesson.isFree && <Badge variant="success" className="text-[10px]">Gratuit</Badge>}
                          </div>
                          <span className="text-xs text-charcoal-400 flex-shrink-0">{lesson.duration}</span>
                        </div>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            </div>

            {/* Instructor */}
            <div className="bg-white rounded-xl border border-charcoal-100 p-6">
              <h2 className="font-serif text-lg font-semibold text-charcoal mb-4">Votre formateur</h2>
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-navy text-white font-bold text-lg flex-shrink-0" aria-hidden="true">
                  {course.instructor.avatar}
                </div>
                <div>
                  <p className="font-semibold text-charcoal">{course.instructor.name}</p>
                  <p className="text-sm text-charcoal-400 mb-2">{course.instructor.title}</p>
                  <p className="text-sm text-charcoal-600">{course.instructor.bio}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar — mobile CTA */}
          <div className="lg:hidden bg-white rounded-xl border border-charcoal-100 p-5 flex flex-col gap-4">
            {course.isFree ? (
              <p className="text-2xl font-bold text-emerald-700">Gratuit</p>
            ) : (
              <p className="font-mono text-2xl font-bold text-navy">{course.price.toLocaleString('fr-FR')} FCFA</p>
            )}
            <Button fullWidth size="lg" className="gap-2">
              <Play className="h-4 w-4 fill-current" aria-hidden="true" />
              {course.isFree ? 'Commencer gratuitement' : 'S\'inscrire'}
            </Button>
          </div>

          {/* Desktop sticky sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-24 bg-white rounded-xl border border-charcoal-100 p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-2 text-sm text-charcoal-600">
                {[
                  { icon: BookOpen, text: `${totalLessons} leçons vidéo` },
                  { icon: Clock, text: `${course.duration} de contenu` },
                  { icon: Users, text: `${course.enrolledCount.toLocaleString()} apprenants` },
                  { icon: Award, text: 'Certificat de complétion' },
                  { icon: CheckCircle2, text: 'Accès illimité à vie' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-navy flex-shrink-0" aria-hidden="true" />
                    {text}
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-1 pt-2 border-t border-charcoal-50">
                {course.tags.map((tag) => (
                  <span key={tag} className="text-xs text-charcoal-400 bg-charcoal-50 rounded-full px-2 py-0.5">#{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
