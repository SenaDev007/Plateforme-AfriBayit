'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import {
  MapPin,
  BedDouble,
  Bath,
  Expand,
  Calendar,
  CheckCircle2,
  Share2,
  Heart,
  Phone,
  Mail,
  Shield,
  Star,
  ChevronLeft,
  ChevronRight,
  X,
  Lock,
  ShieldCheck,
  Copy,
  MessageCircle,
} from 'lucide-react';
import { Badge, Button, Card } from '@afribayit/ui';
import { cn } from '@afribayit/ui/src/lib/cn';
import { TaxCalculator } from './TaxCalculator';
import GeoTrustMapViewer from '../geotrust/GeoTrustMapViewer';

interface PropertyImage {
  url: string;
  alt: string;
}
interface Agent {
  name: string;
  avatar: string | null;
  phone: string;
  email: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
}
interface PropertyDetailData {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: string;
  purpose: 'SALE' | 'RENT' | 'SHORT_TERM_RENT' | 'INVESTMENT';
  price: number;
  currency: string;
  surface?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  floor?: number | null;
  yearBuilt?: number | null;
  country: string;
  city: string;
  district?: string;
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
  features?: string[];
  isVerified: boolean;
  isFeatured: boolean;
  images: PropertyImage[];
  agent: Agent;
  droneMapping?: { orthophotoUrl: string; polygonData: any; area: number } | null;
  blockchainProof?: { hash: string; txHash: string; network: string; timestamp: string } | null;
}

function formatPrice(amount: number, currency: string): string {
  if (currency === 'XOF') {
    if (amount >= 1_000_000) return `${(amount / 1_000_000).toLocaleString('fr-FR')} M FCFA`;
    return `${amount.toLocaleString('fr-FR')} FCFA`;
  }
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(amount);
}

export function PropertyDetail({ property }: { property: PropertyDetailData }): React.ReactElement {
  const router = useRouter();
  const { data: session } = useSession();
  const [activeImage, setActiveImage] = useState(0);
  const [favorited, setFavorited] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleStartPurchase = () => {
    if (!session) {
      toast.error("Veuillez vous connecter pour initier l'achat.");
      router.push('/connexion');
      return;
    }

    // Check KYC status (Simulated via reputation or flag)
    const isKYCVerified = (session.user as any)?.reputationScore >= 50;

    if (!isKYCVerified) {
      toast("Une vérification d'identité est requise pour les transactions Escrow.", {
        icon: '🛡️',
        duration: 5000,
      });
      router.push('/verifier-identite' as any);
      return;
    }

    toast.success('Initialisation du moteur SecureTrade...');
    router.push(`/dashboard/payer/${property.id}`);
  };

  const purposeLabel: Record<string, string> = {
    SALE: 'À vendre',
    RENT: 'À louer',
    SHORT_TERM_RENT: 'Court séjour',
    INVESTMENT: 'Investissement',
  };

  const next = () => setActiveImage((p) => (p + 1) % property.images.length);
  const prev = () =>
    setActiveImage((p) => (p - 1 + property.images.length) % property.images.length);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article aria-label={property.title} className="bg-white pb-24 lg:pb-32">
      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute right-6 top-6 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </button>
            <button
              onClick={prev}
              className="absolute left-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <motion.img
              key={activeImage}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              src={property.images[activeImage]?.url}
              alt={property.images[activeImage]?.alt}
              className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
            />
            <button
              onClick={next}
              className="absolute right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            <div className="absolute bottom-6 text-sm font-bold text-white/50">
              {activeImage + 1} / {property.images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SHARE MODAL */}
      <AnimatePresence>
        {shareOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center"
            onClick={() => setShareOpen(false)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-t-[32px] bg-white p-8 shadow-2xl sm:rounded-[32px]"
            >
              <h3 className="text-navy mb-6 font-serif text-2xl font-bold">Partager ce bien</h3>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleCopy}
                  className="border-charcoal-100 hover:bg-charcoal-50 flex items-center gap-4 rounded-2xl border p-4 transition-all"
                >
                  <div className="bg-navy/5 flex h-10 w-10 items-center justify-center rounded-xl">
                    <Copy className="text-navy h-5 w-5" />
                  </div>
                  <span className="text-charcoal font-bold">
                    {copied ? '✓ Lien copié !' : 'Copier le lien'}
                  </span>
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(property.title + ' - ' + (typeof window !== 'undefined' ? window.location.href : ''))}`}
                  target="_blank"
                  rel="noreferrer"
                  className="border-charcoal-100 hover:bg-charcoal-50 flex items-center gap-4 rounded-2xl border p-4 transition-all"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
                    <MessageCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="text-charcoal font-bold">WhatsApp</span>
                </a>
              </div>
              <button
                onClick={() => setShareOpen(false)}
                className="border-charcoal-200 text-charcoal-500 hover:bg-charcoal-50 mt-6 w-full rounded-full border py-3 text-sm font-bold"
              >
                Fermer
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <div className="bg-charcoal-900 relative overflow-hidden pb-8 pt-24 md:pt-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="bg-gold/10 absolute right-0 top-0 h-96 w-96 -translate-y-1/3 translate-x-1/3 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="space-y-4">
              {/* Trust badges */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="gold" className="px-4 py-1.5 font-bold uppercase tracking-wider">
                  {property.type}
                </Badge>
                <Badge variant="outline" className="border-white/20 px-4 py-1.5 text-white">
                  {purposeLabel[property.purpose]}
                </Badge>
                {property.isVerified && (
                  <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-400">
                    <ShieldCheck className="h-3.5 w-3.5" /> VÉRIFIÉ AFRIBAYIT
                  </div>
                )}
                {property.droneMapping && (
                  <div className="border-gold/30 bg-gold/10 text-gold flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-bold">
                    <Shield className="h-3.5 w-3.5" /> GÉOTRUST DRONE
                  </div>
                )}
              </div>
              <h1 className="font-serif text-2xl font-bold leading-tight text-white sm:text-3xl md:text-5xl">
                {property.title}
              </h1>
              <p className="flex items-center gap-2 text-base text-white/50">
                <MapPin className="text-gold h-5 w-5" />
                {property.address ??
                  `${property.district ?? ''} ${property.city}, ${property.country}`.trim()}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setFavorited(!favorited)}
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-full border border-white/10 transition-all',
                  favorited
                    ? 'border-red-400/40 bg-red-500/20 text-red-400'
                    : 'text-white/60 hover:bg-white/5',
                )}
              >
                <Heart className={cn('h-5 w-5', favorited && 'fill-current')} />
              </button>
              <button
                onClick={() => setShareOpen(true)}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 text-white/60 transition-all hover:bg-white/5"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* GALLERY */}
      <section className="bg-charcoal-900 pb-16">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <div className="grid aspect-[21/9] min-h-[300px] grid-cols-1 gap-4 sm:min-h-[500px] md:grid-cols-4">
            <div
              className="group relative cursor-pointer overflow-hidden rounded-3xl md:col-span-3"
              onClick={() => setLightboxOpen(true)}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  src={property.images[activeImage]?.url}
                  alt={property.images[activeImage]?.alt}
                  className="h-full w-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute inset-x-4 top-1/2 flex -translate-y-1/2 justify-between opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prev();
                  }}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black/70"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    next();
                  }}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black/70"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>
              <div className="absolute bottom-6 right-6">
                <span className="rounded-full bg-black/60 px-4 py-2 text-xs font-bold text-white backdrop-blur-md">
                  {activeImage + 1} / {property.images.length} · Cliquer pour agrandir
                </span>
              </div>
            </div>
            <div className="custom-scrollbar hidden flex-col gap-4 overflow-y-auto pr-2 md:flex">
              {property.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={cn(
                    'relative aspect-video flex-shrink-0 overflow-hidden rounded-2xl transition-all duration-300',
                    idx === activeImage
                      ? 'ring-gold ring-offset-charcoal-900 ring-4 ring-offset-4'
                      : 'opacity-40 hover:opacity-100',
                  )}
                >
                  <img src={img.url} alt={img.alt} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className="border-charcoal-100 bg-charcoal-50 border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 py-5 md:justify-start">
            {[
              { icon: ShieldCheck, label: 'Titre foncier vérifié IA', color: 'text-emerald-600' },
              { icon: Lock, label: 'Transaction escrow sécurisée', color: 'text-navy' },
              { icon: Shield, label: 'KYC propriétaire validé', color: 'text-gold' },
            ].map((t) => (
              <div
                key={t.label}
                className="text-charcoal-600 flex items-center gap-2 text-sm font-medium"
              >
                <t.icon className={cn('h-4 w-4', t.color)} />
                {t.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT LAYOUT */}
      <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-3">
          {/* MAIN */}
          <div className="space-y-12 lg:col-span-2">
            {/* Specs */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                {
                  label: 'Surface',
                  value: property.surface ? `${property.surface} m²` : null,
                  icon: Expand,
                },
                { label: 'Chambres', value: property.bedrooms, icon: BedDouble },
                { label: 'Douches', value: property.bathrooms, icon: Bath },
                { label: 'Construction', value: property.yearBuilt ?? 'Récent', icon: Calendar },
              ].map((spec, i) => (
                <div
                  key={i}
                  className="bg-charcoal-50 border-charcoal-100/50 flex flex-col items-center gap-2 rounded-3xl border p-6 text-center"
                >
                  <spec.icon className="text-navy mb-1 h-6 w-6" />
                  <span className="text-charcoal text-xl font-bold">{spec.value || '-'}</span>
                  <span className="text-charcoal-400 text-xs font-bold uppercase tracking-widest">
                    {spec.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="space-y-6">
              <h2 className="text-charcoal flex items-center gap-3 font-serif text-3xl font-bold">
                <div className="bg-gold h-8 w-1.5 rounded-full" />
                Présentation du bien
              </h2>
              <div className="prose prose-lg text-charcoal-600 max-w-none whitespace-pre-line font-light leading-relaxed">
                {property.description}
              </div>
            </div>

            {/* Features */}
            {property.features && property.features.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-charcoal font-serif text-3xl font-bold">
                  Équipements d'exception
                </h2>
                <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                  {property.features.map((feature) => (
                    <div key={feature} className="group flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 transition-all group-hover:bg-emerald-500 group-hover:text-white">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 group-hover:text-white" />
                      </div>
                      <span className="text-charcoal-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* GeoTrust */}
            {(property.droneMapping || property.latitude) && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-charcoal flex items-center gap-3 font-serif text-3xl font-bold">
                    <div className="bg-navy h-8 w-1.5 rounded-full" />
                    Expertise GeoTrust
                  </h2>
                  {property.droneMapping && (
                    <Badge
                      variant="gold"
                      className="gap-2 px-4 py-1.5 font-bold uppercase tracking-widest"
                    >
                      <Shield className="h-4 w-4" /> VÉRIFIÉ PAR DRONE
                    </Badge>
                  )}
                </div>
                <GeoTrustMapViewer
                  title={property.title}
                  latitude={property.latitude ?? null}
                  longitude={property.longitude ?? null}
                  orthophotoUrl={property.droneMapping?.orthophotoUrl ?? null}
                  polygonData={property.droneMapping?.polygonData ?? null}
                />
                {(property.droneMapping || property.blockchainProof) && (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {property.droneMapping && (
                      <Card className="bg-charcoal-50 border-charcoal-100/50 flex items-center gap-4 p-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                          <Expand className="text-navy h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-charcoal-400 text-[10px] font-bold uppercase tracking-widest">
                            Surface Certifiée
                          </p>
                          <p className="text-charcoal text-lg font-bold">
                            {property.droneMapping.area.toLocaleString()} m²
                          </p>
                        </div>
                      </Card>
                    )}
                    {property.blockchainProof && (
                      <Card className="bg-navy flex items-center gap-4 border-none p-6 text-white">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                          <Shield className="text-gold h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                            Ancrage Blockchain
                          </p>
                          <p className="max-w-[150px] truncate font-mono text-xs">
                            {property.blockchainProof.txHash}
                          </p>
                        </div>
                      </Card>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-8">
            <div className="sticky top-24 space-y-6">
              {/* Price & Escrow Box */}
              <motion.div
                className="border-charcoal-100 shadow-navy/5 relative overflow-hidden rounded-[32px] border bg-white p-8 shadow-2xl"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <div className="bg-gold/5 absolute right-0 top-0 h-32 w-32 rounded-full blur-3xl" />
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-charcoal-400 text-xs font-bold uppercase tracking-[0.2em]">
                      PRIX DIRECT PROPRIÉTAIRE
                    </span>
                    {property.isVerified && (
                      <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
                        <Lock className="h-3 w-3" /> Escrow prêt
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-navy font-serif text-4xl font-bold">
                      {formatPrice(property.price, property.currency)}
                    </p>
                    <p className="text-charcoal-400 text-xs font-medium">
                      Taxes et frais de mutation non inclus*
                    </p>
                  </div>

                  {/* Escrow workflow mini */}
                  <div className="bg-navy/5 space-y-2 rounded-2xl p-4">
                    <p className="text-navy/60 text-[10px] font-bold uppercase tracking-widest">
                      Processus SecureTrade
                    </p>
                    <div className="text-charcoal-500 flex items-center gap-2 text-xs">
                      {['Dépôt fonds', 'Vérif. titre', 'Libération'].map((step, i) => (
                        <React.Fragment key={step}>
                          <span className="flex items-center gap-1">
                            <ShieldCheck className="h-3 w-3 text-emerald-500" />
                            {step}
                          </span>
                          {i < 2 && (
                            <ChevronRight className="text-charcoal-300 h-3 w-3 flex-shrink-0" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button
                      size="lg"
                      className="shadow-navy/20 h-14 rounded-full text-base font-bold shadow-lg"
                      onClick={handleStartPurchase}
                    >
                      INITIER L&apos;ACHAT SÉCURISÉ
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-charcoal-200 h-14 rounded-full"
                    >
                      FAIRE UNE OFFRE
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* Tax Calculator */}
              {(property.purpose === 'SALE' || property.purpose === 'INVESTMENT') && (
                <TaxCalculator
                  price={property.price}
                  currency={property.currency}
                  country={property.country}
                />
              )}

              {/* Agent Card */}
              <div className="bg-charcoal-50 border-charcoal-100/50 space-y-6 rounded-[32px] border p-8">
                <h3 className="text-charcoal flex items-center gap-2 font-bold">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                  Conseiller Dédié
                </h3>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {property.agent.avatar ? (
                      <img
                        src={property.agent.avatar}
                        alt=""
                        className="h-16 w-16 rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="bg-navy flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-bold text-white">
                        {property.agent.name.charAt(0)}
                      </div>
                    )}
                    {property.agent.isVerified && (
                      <div className="border-charcoal-50 absolute -bottom-2 -right-2 rounded-full border-2 bg-emerald-500 p-1 text-white">
                        <CheckCircle2 className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-charcoal text-lg font-bold">{property.agent.name}</p>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <Star className="fill-gold text-gold h-3.5 w-3.5" />
                      <span className="text-charcoal text-xs font-bold">
                        {property.agent.rating}
                      </span>
                      <span className="text-charcoal-400 text-[10px] font-bold uppercase tracking-wider">
                        ({property.agent.reviewCount} avis)
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={`tel:${property.agent.phone}`}
                    className="border-charcoal-200 hover:border-navy group flex flex-col items-center gap-1 rounded-2xl border bg-white p-3 transition-all"
                  >
                    <Phone className="text-charcoal-400 group-hover:text-navy h-4 w-4" />
                    <span className="text-charcoal text-[10px] font-bold uppercase">Appeler</span>
                  </a>
                  <a
                    href={`mailto:${property.agent.email}`}
                    className="border-charcoal-200 hover:border-navy group flex flex-col items-center gap-1 rounded-2xl border bg-white p-3 transition-all"
                  >
                    <Mail className="text-charcoal-400 group-hover:text-navy h-4 w-4" />
                    <span className="text-charcoal text-[10px] font-bold uppercase">Message</span>
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* MOBILE CTA BAR */}
      <div className="border-charcoal-100 fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t bg-white/95 p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] backdrop-blur-md lg:hidden">
        <div>
          <p className="text-navy text-2xl font-bold">
            {formatPrice(property.price, property.currency)}
          </p>
          <p className="text-charcoal-400 text-[10px] font-bold uppercase">
            {purposeLabel[property.purpose]}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShareOpen(true)}
            className="border-charcoal-200 flex h-12 w-12 items-center justify-center rounded-full border"
          >
            <Share2 className="text-charcoal-500 h-5 w-5" />
          </button>
          <Button className="h-12 rounded-full px-8 font-bold">CONTACTER</Button>
        </div>
      </div>
    </article>
  );
}
