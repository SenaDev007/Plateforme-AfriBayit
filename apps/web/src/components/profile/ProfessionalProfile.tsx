'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BadgeCheck,
  MapPin,
  Calendar,
  Star,
  MessageSquare,
  Share2,
  ShieldCheck,
  Briefcase,
  Plus,
  Users,
  Award,
  TrendingUp,
  FileText,
  GraduationCap,
  ThumbsUp,
  MoreHorizontal,
  UserPlus,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { Card, Badge, Button, cn } from '@afribayit/ui';

interface ProfileProps {
  user: {
    name: string;
    role: string;
    location: string;
    bio: string;
    rating: number;
    reviews: number;
    isCertified: boolean;
    premiumTier?: string;
  };
  stats: {
    jobsDone: number;
    yearsExp: number;
    connections: number;
    score: number;
  };
  skills: { name: string; endorsements: number }[];
  experience: { title: string; company: string; period: string; description: string }[];
  education: { school: string; degree: string; year: string }[];
  portfolio: { title: string; image: string; type: string }[];
}

export function ProfessionalProfile({
  user,
  stats,
  skills,
  experience,
  education,
  portfolio,
}: ProfileProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<'ABOUT' | 'PORTFOLIO' | 'REVIEWS'>('ABOUT');

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 font-sans">
      {/* 5.4b.1 — Header (LinkedIn Style) */}
      <Card className="border-charcoal-100 overflow-hidden rounded-[48px] bg-white p-0 shadow-2xl">
        <div className="from-navy via-navy-800 to-charcoal relative h-56 bg-gradient-to-r">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
          <div className="absolute right-6 top-6 flex gap-3">
            <Button
              variant="ghost"
              className="h-12 w-12 rounded-full border border-white/20 bg-white/10 p-0 text-white backdrop-blur-md hover:bg-white/20"
            >
              <Share2 className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              className="h-12 w-12 rounded-full border border-white/20 bg-white/10 p-0 text-white backdrop-blur-md hover:bg-white/20"
            >
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="relative px-10 pb-10">
          <div className="-mt-24 flex flex-col items-start gap-8 md:flex-row md:items-end">
            <div className="group relative">
              <div className="bg-charcoal-50 ring-charcoal-100 h-44 w-44 overflow-hidden rounded-[44px] border-8 border-white shadow-2xl ring-1">
                <img
                  src={`https://ui-avatars.com/api/?name=${user.name}&background=0A2540&color=fff&size=200`}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              </div>
              {user.isCertified && (
                <div className="ring-charcoal-100 absolute -bottom-2 -right-2 rounded-full bg-white p-1 shadow-lg ring-1">
                  <BadgeCheck className="text-gold fill-gold/10 h-10 w-10" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-3 pb-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-charcoal font-serif text-4xl font-bold">{user.name}</h1>
                {user.premiumTier && user.premiumTier !== 'STARTER' && (
                  <Badge className="bg-gold border-none px-3 text-[10px] font-bold text-white">
                    PREMIUM
                  </Badge>
                )}
              </div>
              <p className="text-charcoal-600 text-xl font-medium">{user.role}</p>
              <div className="text-charcoal-500 flex flex-wrap items-center gap-6 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <MapPin className="text-navy h-4 w-4" />
                  <span>{user.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="text-navy h-4 w-4" />
                  <span>{stats.connections} connexions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="text-gold fill-gold h-4 w-4" />
                  <span className="text-charcoal font-bold">{user.rating}</span>
                  <span className="text-charcoal-400 font-normal">({user.reviews} avis)</span>
                </div>
              </div>
            </div>

            <div className="flex w-full gap-3 md:w-auto">
              <Button
                onClick={() => setIsFollowing(!isFollowing)}
                variant={isFollowing ? 'outline' : 'primary'}
                className={cn(
                  'h-14 flex-1 rounded-2xl px-8 font-bold shadow-lg transition-all md:flex-none',
                  isFollowing ? 'border-navy text-navy' : 'bg-navy shadow-navy/20 text-white',
                )}
              >
                {isFollowing ? 'SUIVI' : 'SUIVRE'}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-charcoal-200 h-14 flex-1 rounded-2xl px-6 md:flex-none"
              >
                <UserPlus className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="bg-charcoal-50 hover:bg-charcoal-100 h-14 flex-1 rounded-2xl px-6 md:flex-none"
              >
                <MessageSquare className="text-navy h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {/* Public Stats — 5.4b.1 */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { label: 'Projets livrés', value: stats.jobsDone, icon: TrendingUp },
              { label: 'Expérience', value: `${stats.yearsExp} ans`, icon: Clock },
              { label: 'Crédibilité', value: `${stats.score}%`, icon: Award },
              { label: 'Certificats', value: education.length, icon: FileText },
            ].map((s, i) => (
              <Card
                key={i}
                className="border-charcoal-100 hover:border-navy group flex flex-col items-center rounded-[24px] p-5 text-center transition-colors"
              >
                <div className="bg-navy/5 text-navy group-hover:bg-navy mb-3 flex h-10 w-10 items-center justify-center rounded-xl transition-colors group-hover:text-white">
                  <s.icon className="h-5 w-5" />
                </div>
                <p className="text-charcoal text-lg font-bold">{s.value}</p>
                <p className="text-charcoal-400 text-[9px] font-bold uppercase tracking-widest">
                  {s.label}
                </p>
              </Card>
            ))}
          </div>

          {/* About Section */}
          <Card className="border-charcoal-100 rounded-[40px] p-8">
            <h3 className="text-charcoal mb-6 font-serif text-2xl font-bold">À propos</h3>
            <p className="text-charcoal-600 text-sm leading-relaxed">{user.bio}</p>
          </Card>

          {/* Skills Section — 5.4b.1 */}
          <Card className="border-charcoal-100 rounded-[40px] p-8">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-charcoal font-serif text-2xl font-bold">Compétences</h3>
              <Plus className="text-navy h-5 w-5 cursor-pointer" />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {skills.map((skill) => (
                <div
                  key={skill.name}
                  className="bg-charcoal-50 ring-charcoal-200 group flex items-center justify-between rounded-2xl p-4 transition-all hover:bg-white hover:ring-1"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-navy/5 text-navy flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-bold">
                      {skill.name.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="text-charcoal text-sm font-bold">{skill.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-charcoal-400 text-xs font-bold">
                      {skill.endorsements}
                    </span>
                    <ThumbsUp className="text-charcoal-300 group-hover:text-navy h-4 w-4 cursor-pointer" />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Experience Section — 5.4b.1 */}
          <Card className="border-charcoal-100 rounded-[40px] p-8">
            <h3 className="text-charcoal mb-8 font-serif text-2xl font-bold">Expériences</h3>
            <div className="relative space-y-10">
              <div className="bg-charcoal-100 absolute bottom-0 left-6 top-0 w-0.5" />
              {experience.map((exp, i) => (
                <div key={i} className="relative pl-16">
                  <div className="border-charcoal-100 absolute left-0 z-10 flex h-12 w-12 items-center justify-center rounded-2xl border-2 bg-white shadow-sm">
                    <Briefcase className="text-navy h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-charcoal text-lg font-bold">{exp.title}</h4>
                    <p className="text-navy text-sm font-bold uppercase tracking-widest">
                      {exp.company}
                    </p>
                    <p className="text-charcoal-400 mb-3 text-xs">{exp.period}</p>
                    <p className="text-charcoal-500 text-sm leading-relaxed">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Portfolio Section — 5.1.2 */}
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
              {portfolio.map((item, i) => (
                <div
                  key={i}
                  className="bg-charcoal-50 border-charcoal-100 group relative aspect-video cursor-pointer overflow-hidden rounded-[24px] border"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="bg-navy/80 absolute inset-0 flex flex-col justify-end p-6 opacity-0 transition-opacity group-hover:opacity-100">
                    <p className="text-gold mb-1 text-[10px] font-bold uppercase tracking-widest">
                      {item.type}
                    </p>
                    <p className="text-sm font-bold text-white">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-8">
          {/* Score de Crédibilité — 5.4b.2 */}
          <Card className="bg-navy relative space-y-6 overflow-hidden rounded-[40px] border-none p-8 text-white shadow-2xl">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5 blur-3xl" />
            <h3 className="relative z-10 font-serif text-xl font-bold">Score de Crédibilité</h3>
            <div className="relative z-10 flex flex-col items-center justify-center space-y-4 py-6">
              <div className="relative h-32 w-32">
                <svg className="h-full w-full" viewBox="0 0 100 100">
                  <circle
                    className="stroke-current text-white/10"
                    strokeWidth="8"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-gold stroke-current transition-all duration-1000"
                    strokeWidth="8"
                    strokeDasharray={`${stats.score * 2.51} 251`}
                    strokeLinecap="round"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black">{stats.score}</span>
                  <span className="text-[10px] font-bold opacity-60">PDS</span>
                </div>
              </div>
              <p className="text-charcoal-300 text-center text-xs">
                Calculé sur votre activité, avis et certifications AfriBayit Academy.
              </p>
            </div>
          </Card>

          {/* Education & Certifications — 5.4b.1 */}
          <Card className="border-charcoal-100 rounded-[40px] p-8">
            <h3 className="text-charcoal mb-6 font-serif text-xl font-bold">
              Formation & Diplômes
            </h3>
            <div className="space-y-6">
              {education.map((edu, i) => (
                <div key={i} className="flex gap-4">
                  <div className="bg-gold/10 text-gold flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-charcoal text-sm font-bold">{edu.school}</h4>
                    <p className="text-charcoal-500 text-xs">{edu.degree}</p>
                    <p className="text-charcoal-400 mt-1 text-[10px] font-bold">{edu.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recommendations — 5.4b.1 */}
          <Card className="border-charcoal-100 space-y-6 rounded-[40px] p-8">
            <h3 className="text-charcoal font-serif text-xl font-bold">Recommandations</h3>
            <div className="space-y-6">
              {[
                {
                  name: 'Alice Tagbo',
                  comment:
                    "Un travail d'une précision rare. Je recommande pour tout projet à Cotonou.",
                  date: 'Avril 2026',
                },
                {
                  name: 'Marc Dupond',
                  comment: 'Expertise foncière impressionnante.',
                  date: 'Janvier 2026',
                },
              ].map((rec, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-charcoal-100 flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold">
                      {rec.name[0]}
                    </div>
                    <span className="text-charcoal text-xs font-bold">{rec.name}</span>
                  </div>
                  <p className="text-charcoal-500 text-xs italic leading-relaxed">
                    "{rec.comment}"
                  </p>
                  <p className="text-charcoal-400 text-[9px]">{rec.date}</p>
                </div>
              ))}
            </div>
            <Button
              variant="ghost"
              fullWidth
              className="text-navy border-charcoal-50 rounded-none border-t pt-4 text-[10px] font-bold tracking-widest"
            >
              VOIR TOUT
            </Button>
          </Card>

          {/* Verification Badge — 5.4b.2 */}
          <Card className="border-charcoal-100 bg-emerald/5 border-emerald/20 space-y-4 rounded-[40px] p-8 text-center">
            <ShieldCheck className="text-emerald mx-auto h-12 w-12" />
            <div>
              <h4 className="text-charcoal font-bold">Identité Vérifiée</h4>
              <p className="text-charcoal-500 text-xs">
                Ce professionnel a passé avec succès les tests de vérification IA et KYC
                d'AfriBayit.
              </p>
            </div>
            <Badge variant="success" className="bg-emerald border-none text-white">
              STATUT : ACTIF
            </Badge>
          </Card>
        </div>
      </div>
    </div>
  );
}
