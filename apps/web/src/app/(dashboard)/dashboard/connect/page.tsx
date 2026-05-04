'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  MessageSquare,
  Globe,
  Flag,
  Shield,
  TrendingUp,
  Award,
  Star,
  Share2,
  Plus,
  Search,
  Bell,
  ArrowRight,
  Heart,
  Hash,
} from 'lucide-react';
import { Card, Badge, Button, Input, cn } from '@afribayit/ui';

const FORUMS = [
  { name: 'Bénin', code: 'BJ', posts: 1240, color: 'emerald' },
  { name: "Côte d'Ivoire", code: 'CI', posts: 3100, color: 'orange' },
  { name: 'Burkina Faso', code: 'BF', posts: 850, color: 'rose' },
  { name: 'Togo', code: 'TG', posts: 620, color: 'navy' },
];

export default function ConnectPage() {
  const [activeForum, setActiveForum] = useState('BJ');

  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 py-10 font-sans">
      <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Globe className="text-navy h-6 w-6" />
            <p className="text-navy text-[10px] font-bold uppercase tracking-[0.3em]">
              AfriBayit Connect — Le Réseau des Investisseurs
            </p>
          </div>
          <h1 className="text-charcoal font-serif text-5xl font-bold">Communauté</h1>
          <p className="text-charcoal-400 max-w-2xl text-lg">
            Échangez avec des milliers de membres, investisseurs et experts africains.
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="border-charcoal-200 h-14 rounded-[20px] px-8 font-bold"
          >
            MES GROUPES
          </Button>
          <Button className="bg-navy shadow-navy/20 flex h-14 gap-2 rounded-[20px] px-8 font-bold shadow-xl">
            <Plus className="h-5 w-5" /> NOUVEAU POST
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
        {/* Left Sidebar — User Reputation (5.7.2) */}
        <div className="space-y-8">
          <Card className="from-navy to-charcoal relative space-y-6 overflow-hidden rounded-[40px] border-none bg-gradient-to-br p-8 text-white shadow-2xl">
            <div className="bg-gold/10 absolute -right-20 -top-20 h-64 w-64 rounded-full blur-3xl" />
            <div className="relative z-10 flex items-center gap-4">
              <div className="h-16 w-16 overflow-hidden rounded-[24px] border-4 border-white/20 shadow-xl">
                <img
                  src="https://ui-avatars.com/api/?name=You&background=random"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold">Votre Réputation</h3>
                <Badge className="bg-gold border-none text-[8px] font-black uppercase text-white">
                  Ambassadeur Bronze
                </Badge>
              </div>
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex items-end justify-between">
                <span className="text-4xl font-black">642</span>
                <span className="text-xs font-bold opacity-60">/ 1000 Pts</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div className="bg-gold h-full w-[64%] shadow-[0_0_10px_rgba(255,191,0,0.5)]" />
              </div>
              <p className="text-charcoal-300 text-[10px] italic">
                Prochain niveau : Silver (+358 pts)
              </p>
            </div>

            <div className="relative z-10 space-y-4 border-t border-white/10 pt-6">
              <div className="flex items-center justify-between text-xs">
                <span className="text-charcoal-400">Transactions</span>
                <span className="text-emerald font-bold">+250 pts</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-charcoal-400">Avis reçus</span>
                <span className="text-emerald font-bold">+120 pts</span>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <h3 className="text-charcoal flex items-center gap-3 font-serif text-xl font-bold">
              <Flag className="text-navy h-5 w-5" /> Forums Pays
            </h3>
            <div className="flex flex-col gap-2">
              {FORUMS.map((forum) => (
                <button
                  key={forum.code}
                  onClick={() => setActiveForum(forum.code)}
                  className={cn(
                    'group flex items-center justify-between rounded-2xl px-5 py-4 text-sm font-medium transition-all',
                    activeForum === forum.code
                      ? 'bg-navy text-white shadow-lg'
                      : 'border-charcoal-100 text-charcoal-500 hover:border-navy border bg-white',
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'h-2 w-2 rounded-full',
                        forum.color === 'emerald'
                          ? 'bg-emerald'
                          : forum.color === 'orange'
                            ? 'bg-orange-500'
                            : 'bg-rose-500',
                      )}
                    />
                    <span>{forum.name}</span>
                  </div>
                  <span
                    className={cn(
                      'text-[10px] font-bold',
                      activeForum === forum.code ? 'text-gold' : 'text-charcoal-300',
                    )}
                  >
                    {forum.posts} posts
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center — Feed (5.7.1) */}
        <div className="space-y-8 lg:col-span-2">
          <div className="flex gap-4">
            <button className="text-navy border-navy border-b-2 px-2 pb-2 text-sm font-bold">
              À la une
            </button>
            <button className="text-charcoal-400 hover:text-navy px-2 pb-2 text-sm font-bold transition-colors">
              Récent
            </button>
            <button className="text-charcoal-400 hover:text-navy px-2 pb-2 text-sm font-bold transition-colors">
              Mes Groupes
            </button>
          </div>

          <div className="space-y-6">
            {[
              {
                user: 'Mamadou Diallo',
                role: 'Investisseur Diaspora',
                content:
                  "Quel est votre retour d'expérience sur la nouvelle loi foncière au Bénin ? Je prévois d'acheter à Ouidah le mois prochain.",
                likes: 42,
                comments: 15,
                time: '2h',
                tags: ['Foncier', 'Bénin', 'Ouidah'],
              },
              {
                user: 'Rebecca AI',
                role: 'Conseillère IA',
                content:
                  "Tendance : Les prix de l'immobilier à Abidjan-Sud ont augmenté de 8% en 3 mois. Découvrez les quartiers avec le meilleur ROI locatif.",
                likes: 128,
                comments: 34,
                time: '5h',
                tags: ['Marché', 'Abidjan', 'Stats'],
                isAi: true,
              },
              {
                user: 'Alice Tagbo',
                role: 'Agent Certifié',
                content:
                  'Superbe opportunité à Cotonou : 2 terrains avec titre foncier validé GeoTrust. Contactez-moi pour une visite virtuelle live.',
                likes: 85,
                comments: 21,
                time: '8h',
                tags: ['Opportunité', 'Cotonou', 'Vente'],
              },
            ].map((post, i) => (
              <Card
                key={i}
                className="border-charcoal-100 space-y-6 rounded-[40px] p-8 transition-all hover:shadow-xl"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div
                      className={cn(
                        'h-12 w-12 overflow-hidden rounded-2xl shadow-sm',
                        post.isAi ? 'bg-navy flex items-center justify-center' : 'bg-charcoal-100',
                      )}
                    >
                      {post.isAi ? (
                        <Users className="text-gold h-6 w-6" />
                      ) : (
                        <img
                          src={`https://ui-avatars.com/api/?name=${post.user}&background=random`}
                        />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-charcoal font-bold">{post.user}</h4>
                        {post.isAi && (
                          <Badge className="bg-navy/10 text-navy border-none text-[8px] font-black">
                            AI AGENT
                          </Badge>
                        )}
                      </div>
                      <p className="text-charcoal-400 text-[10px] font-bold uppercase tracking-widest">
                        {post.role}
                      </p>
                    </div>
                  </div>
                  <span className="text-charcoal-300 text-xs font-medium">{post.time}</span>
                </div>

                <p className="text-charcoal-600 leading-relaxed">{post.content}</p>

                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-navy bg-navy/5 rounded-full px-3 py-1 text-[10px] font-bold"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="border-charcoal-50 flex items-center justify-between border-t pt-6">
                  <div className="flex gap-6">
                    <button className="text-charcoal-400 group flex items-center gap-2 transition-colors hover:text-rose-500">
                      <Heart className="h-4 w-4 group-hover:fill-rose-500" />
                      <span className="text-xs font-bold">{post.likes}</span>
                    </button>
                    <button className="text-charcoal-400 hover:text-navy flex items-center gap-2 transition-colors">
                      <MessageSquare className="h-4 w-4" />
                      <span className="text-xs font-bold">{post.comments}</span>
                    </button>
                  </div>
                  <button className="text-charcoal-400 hover:text-navy transition-colors">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Sidebar — Networking & Groups (5.7.3) */}
        <div className="space-y-8">
          <Card className="border-charcoal-100 space-y-6 rounded-[40px] p-8">
            <h3 className="text-charcoal font-serif text-xl font-bold">Groupes Populaires</h3>
            <div className="space-y-4">
              {[
                { name: 'Investisseurs Diaspora', members: '1.2k', icon: Globe },
                { name: 'Propriétaires Ouidah', members: '450', icon: Hash },
                { name: 'Experts Foncier BJ', members: '180', icon: Shield },
              ].map((group, i) => (
                <div key={i} className="group flex cursor-pointer items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-charcoal-50 text-navy group-hover:bg-navy flex h-10 w-10 items-center justify-center rounded-xl transition-all group-hover:text-white">
                      <group.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-charcoal text-xs font-bold">{group.name}</p>
                      <p className="text-charcoal-400 text-[10px]">{group.members} membres</p>
                    </div>
                  </div>
                  <Plus className="text-charcoal-300 group-hover:text-navy h-4 w-4" />
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

          <Card className="bg-gold/5 border-gold/20 space-y-6 rounded-[40px] p-8">
            <h3 className="text-charcoal font-serif text-xl font-bold">Événements Live</h3>
            <div className="space-y-4">
              <div className="border-gold/10 rounded-2xl border bg-white p-4 shadow-sm">
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-rose-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-rose-500">
                    Webinaire LIVE
                  </span>
                </div>
                <h4 className="text-charcoal mb-1 text-sm font-bold">
                  Impact de la Blockchain sur le Foncier
                </h4>
                <p className="text-charcoal-400 mb-3 text-[10px]">Aujourd'hui à 18:00 (GMT+1)</p>
                <Button
                  fullWidth
                  size="sm"
                  className="bg-navy h-10 rounded-xl text-[10px] font-bold"
                >
                  REJOINDRE
                </Button>
              </div>
            </div>
          </Card>

          <Card className="border-charcoal-100 space-y-6 rounded-[40px] p-8">
            <h3 className="text-charcoal font-serif text-xl font-bold">Acteurs à suivre</h3>
            <div className="space-y-4">
              {[
                { name: 'Jean Dupont', role: 'Investisseur', followers: '1.2k' },
                { name: 'Sarah Kone', role: 'Notaire', followers: '850' },
              ].map((user, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-charcoal-50 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold">
                      {user.name[0]}
                    </div>
                    <div>
                      <p className="text-charcoal text-xs font-bold">{user.name}</p>
                      <p className="text-charcoal-400 text-[9px]">{user.followers} followers</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-navy border-navy/10 hover:bg-navy/5 h-8 rounded-lg border text-[10px] font-bold"
                  >
                    SUIVRE
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
