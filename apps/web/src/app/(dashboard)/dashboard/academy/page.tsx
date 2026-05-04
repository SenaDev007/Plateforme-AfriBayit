'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  PlayCircle,
  Award,
  Users,
  Search,
  TrendingUp,
  Clock,
  Star,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  PlusCircle,
  GraduationCap,
} from 'lucide-react';
import { Card, Badge, Button, Input, cn } from '@afribayit/ui';

const CATEGORIES = [
  'Tout',
  'Investissement',
  'Droit Foncier',
  'Gestion Locative',
  'Vente & Négociation',
  'BTP & Rénovation',
];

export default function AcademyPage() {
  const [activeCat, setActiveCat] = useState('Tout');

  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 py-10 font-sans">
      <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <GraduationCap className="text-gold h-6 w-6" />
            <p className="text-gold text-[10px] font-bold uppercase tracking-[0.3em]">
              AfriBayit Academy — Apprendre & Investir
            </p>
          </div>
          <h1 className="text-charcoal font-serif text-5xl font-bold">Mon Académie</h1>
          <p className="text-charcoal-400 max-w-2xl text-lg">
            Développez vos compétences avec les meilleurs experts de l'immobilier africain.
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="border-charcoal-200 h-14 rounded-[20px] px-8 font-bold"
          >
            MON ESPACE APPRENANT
          </Button>
          <Button className="bg-navy shadow-navy/20 h-14 rounded-[20px] px-8 font-bold shadow-xl">
            DEVENIR FORMATEUR
          </Button>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {[
          { label: 'Cours disponibles', value: '128', icon: BookOpen, color: 'navy' },
          { label: 'Apprenants actifs', value: '4.5k', icon: Users, color: 'gold' },
          { label: 'Certificats délivrés', value: '1.2k', icon: Award, color: 'navy' },
          { label: 'Note moyenne', value: '4.9/5', icon: Star, color: 'gold' },
        ].map((stat, i) => (
          <Card
            key={i}
            className="border-charcoal-100 hover:border-navy group flex items-center gap-6 rounded-[32px] p-6 transition-all"
          >
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-colors ${
                stat.color === 'navy'
                  ? 'bg-navy/5 text-navy group-hover:bg-navy group-hover:text-white'
                  : 'bg-gold/10 text-gold group-hover:bg-gold group-hover:text-white'
              }`}
            >
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-charcoal text-2xl font-black">{stat.value}</p>
              <p className="text-charcoal-400 text-[10px] font-bold uppercase tracking-widest">
                {stat.label}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
        {/* Sidebar Filters */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-charcoal font-serif text-xl font-bold">Catégories</h3>
            <div className="flex flex-col gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCat(cat)}
                  className={cn(
                    'flex items-center justify-between rounded-2xl px-5 py-4 text-left text-sm font-medium transition-all',
                    activeCat === cat
                      ? 'bg-navy text-white shadow-lg'
                      : 'text-charcoal-500 hover:bg-charcoal-50',
                  )}
                >
                  {cat}
                  {activeCat === cat && <CheckCircle2 className="h-4 w-4" />}
                </button>
              ))}
            </div>
          </div>

          <Card className="bg-charcoal-900 relative space-y-6 overflow-hidden rounded-[40px] border-none p-8 text-white shadow-2xl">
            <div className="bg-gold/10 absolute -bottom-10 -right-10 h-40 w-40 rounded-full blur-3xl" />
            <div className="relative z-10 space-y-2">
              <Badge className="bg-gold border-none text-[8px] font-bold text-white">
                OFFRE PREMIUM
              </Badge>
              <h3 className="font-serif text-xl font-bold">Accès Illimité</h3>
              <p className="text-charcoal-300 text-xs leading-relaxed">
                Débloquez tous les cours, les webinaires live et les certificats pro pour 15 000
                FCFA/mois.
              </p>
            </div>
            <Button
              fullWidth
              className="text-navy hover:bg-gold relative z-10 h-12 rounded-xl border-none bg-white font-bold transition-all hover:text-white"
            >
              PASSER AU PREMIUM
            </Button>
          </Card>
        </div>

        {/* Course Grid */}
        <div className="space-y-8 lg:col-span-3">
          <div className="flex items-center justify-between">
            <h3 className="text-charcoal font-serif text-2xl font-bold">Cours à la une</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-charcoal-100 h-10 w-10 rounded-full p-0"
              >
                <Search className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-charcoal-100 h-10 w-10 rounded-full p-0"
              >
                <TrendingUp className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {[
              {
                title: 'Calcul de Rentabilité Immobilière au Bénin',
                expert: 'Kofi Mensah',
                duration: '4h 20min',
                rating: 4.9,
                price: '25 000 FCFA',
                level: 'Intermédiaire',
                category: 'Investissement',
                img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80',
              },
              {
                title: 'Droit Foncier & Réforme du Code 2023',
                expert: 'Me. Sarah Kone',
                duration: '6h 45min',
                rating: 5.0,
                price: 'Gratuit',
                level: 'Tous niveaux',
                category: 'Droit Foncier',
                img: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&q=80',
              },
              {
                title: 'Optimiser sa Guesthouse : Guide Complet',
                expert: 'Alice Tagbo',
                duration: '3h 15min',
                rating: 4.8,
                price: '15 000 FCFA',
                level: 'Débutant',
                category: 'Gestion Locative',
                img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
              },
              {
                title: 'Vendre un bien en 30 jours : Stratégies Pro',
                expert: 'Marc Dupond',
                duration: '5h 10min',
                rating: 4.7,
                price: '35 000 FCFA',
                level: 'Avancé',
                category: 'Vente & Négociation',
                img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80',
              },
            ].map((course, i) => (
              <Card
                key={i}
                className="border-charcoal-100 ring-charcoal-100 group overflow-hidden rounded-[40px] border-none p-0 ring-1 transition-all hover:shadow-2xl"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={course.img}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute left-4 top-4 flex gap-2">
                    <Badge className="text-navy border-none bg-white/90 text-[8px] font-bold uppercase backdrop-blur-md">
                      {course.category}
                    </Badge>
                    <Badge className="bg-navy border-none text-[8px] font-bold text-white">
                      {course.level}
                    </Badge>
                  </div>
                  <div className="bg-navy absolute bottom-4 right-4 rounded-xl px-4 py-2 text-sm font-black text-white shadow-lg">
                    {course.price}
                  </div>
                </div>
                <div className="space-y-4 p-8">
                  <div className="text-gold flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                    <Star className="fill-gold h-3 w-3" />
                    <span>{course.rating} / 5.0</span>
                    <span className="text-charcoal-300 ml-2">• 128 avis</span>
                  </div>
                  <h4 className="text-charcoal group-hover:text-navy font-serif text-xl font-bold leading-tight transition-colors">
                    {course.title}
                  </h4>
                  <div className="border-charcoal-50 flex items-center justify-between border-t pt-4">
                    <div className="flex items-center gap-2">
                      <div className="bg-charcoal-100 flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold">
                        {course.expert[0]}
                      </div>
                      <span className="text-charcoal-500 text-xs font-bold">{course.expert}</span>
                    </div>
                    <div className="text-charcoal-400 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span className="text-xs">{course.duration}</span>
                    </div>
                  </div>
                  <Button
                    fullWidth
                    className="group-hover:bg-gold h-14 rounded-2xl font-bold transition-colors"
                  >
                    S'INSCRIRE <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
