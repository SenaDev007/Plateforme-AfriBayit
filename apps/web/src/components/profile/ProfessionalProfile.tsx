'use client';
import { motion } from 'framer-motion';
import {
  BadgeCheck,
  MapPin,
  Calendar,
  Star,
  MessageSquare,
  Share2,
  ShieldCheck,
  Briefcase,
} from 'lucide-react';
import { Card, Badge, Button } from '@afribayit/ui';

interface ProfileProps {
  name: string;
  role: string;
  location: string;
  bio: string;
  rating: number;
  reviews: number;
  skills: string[];
  portfolio: string[];
  isCertified: boolean;
}

export function ProfessionalProfile({
  name,
  role,
  location,
  bio,
  rating,
  reviews,
  skills,
  portfolio,
  isCertified,
}: ProfileProps) {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10">
      {/* Header — Section 5.4b.1 */}
      <Card className="border-charcoal-100 overflow-hidden rounded-[48px] bg-white p-0 shadow-xl">
        <div className="from-navy via-navy-800 to-charcoal relative h-48 bg-gradient-to-r">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
          <Button
            variant="ghost"
            className="absolute right-6 top-6 h-12 w-12 rounded-full bg-white/10 p-0 text-white hover:bg-white/20"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
        <div className="relative px-10 pb-10">
          <div className="-mt-20 flex flex-col items-start gap-8 md:flex-row md:items-end">
            <div className="group relative">
              <div className="bg-charcoal-50 h-40 w-40 overflow-hidden rounded-[40px] border-8 border-white shadow-2xl">
                <img
                  src={`https://ui-avatars.com/api/?name=${name}&background=0A2540&color=fff&size=200`}
                  alt={name}
                  className="h-full w-full object-cover"
                />
              </div>
              {isCertified && (
                <div className="absolute -bottom-2 -right-2 rounded-full bg-white p-1 shadow-lg">
                  <BadgeCheck className="text-gold fill-gold/10 h-10 w-10" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-charcoal font-serif text-4xl font-bold">{name}</h1>
                {isCertified && (
                  <Badge variant="success" className="bg-emerald/10 text-emerald border-emerald/20">
                    VÉRIFIÉ AFRIBAYIT
                  </Badge>
                )}
              </div>
              <div className="text-charcoal-500 flex flex-wrap items-center gap-6 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Briefcase className="text-navy h-4 w-4" />
                  <span>{role}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="text-navy h-4 w-4" />
                  <span>{location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="text-gold fill-gold h-4 w-4" />
                  <span className="text-charcoal font-bold">{rating}</span>
                  <span className="text-charcoal-400 font-normal">({reviews} avis)</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                size="lg"
                className="bg-navy shadow-navy/20 h-14 rounded-2xl px-8 font-bold shadow-lg"
              >
                CONTACTER
              </Button>
              <Button variant="outline" size="lg" className="h-14 rounded-2xl px-6">
                <MessageSquare className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {/* Bio */}
          <Card className="border-charcoal-100 rounded-[40px] p-8">
            <h3 className="text-charcoal mb-6 font-serif text-2xl font-bold">À propos</h3>
            <p className="text-charcoal-500 text-sm leading-relaxed">{bio}</p>
          </Card>

          {/* Portfolio — Section 5.1.2 */}
          <Card className="border-charcoal-100 rounded-[40px] p-8">
            <div className="mb-8 flex items-center justify-between">
              <h3 className="text-charcoal font-serif text-2xl font-bold">
                Portfolio & Réalisations
              </h3>
              <Button variant="ghost" className="text-navy text-xs font-bold tracking-widest">
                VOIR TOUT
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {portfolio.map((img, i) => (
                <div
                  key={i}
                  className="bg-charcoal-50 border-charcoal-100 group relative aspect-square cursor-pointer overflow-hidden rounded-[24px] border"
                >
                  <img
                    src={img}
                    alt={`Réalisation ${i + 1}`}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="bg-navy/60 absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white">
                      Détails
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-8">
          {/* Skills */}
          <Card className="border-charcoal-100 rounded-[40px] p-8">
            <h3 className="text-charcoal mb-6 font-serif text-xl font-bold">Compétences</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="bg-charcoal-50 border-charcoal-100 text-charcoal-600 rounded-xl px-4 py-2 text-xs font-medium"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </Card>

          {/* Trust Box */}
          <Card className="bg-charcoal-900 space-y-6 rounded-[40px] border-none p-8 text-white shadow-2xl">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-emerald h-6 w-6" />
              <h3 className="font-serif text-xl font-bold">Confiance & Sécurité</h3>
            </div>
            <ul className="space-y-4">
              {[
                'Identité KYC vérifiée par IA',
                'Documents professionnels validés',
                'Zéro antécédent de fraude',
                'Compte actif depuis 2 ans',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="text-emerald mt-1 h-4 w-4 flex-shrink-0" />
                  <span className="text-charcoal-300 text-xs">{item}</span>
                </li>
              ))}
            </ul>
            <div className="border-charcoal-800 border-t pt-4">
              <p className="text-charcoal-500 mb-1 text-[10px] font-bold uppercase tracking-widest">
                Dernière Vérification
              </p>
              <p className="text-charcoal-300 text-xs">12 Mai 2026 — Équipe AfriBayit Bénin</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function CheckCircle2({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
