'use client';
import type React from 'react';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Upload,
  MapPin,
  Home,
  DollarSign,
  X,
  Loader2,
} from 'lucide-react';
import { Input, Button, cn } from '@afribayit/ui';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import type { Route } from 'next';

const PROPERTY_TYPES = [
  { value: 'HOUSE', label: 'Maison', emoji: '🏠' },
  { value: 'APARTMENT', label: 'Appartement', emoji: '🏢' },
  { value: 'VILLA', label: 'Villa', emoji: '🏡' },
  { value: 'LAND', label: 'Terrain', emoji: '🌿' },
  { value: 'STUDIO', label: 'Studio', emoji: '🛏️' },
  { value: 'DUPLEX', label: 'Duplex', emoji: '🏘️' },
  { value: 'COMMERCIAL', label: 'Commercial', emoji: '🏪' },
];

const PURPOSES = [
  { value: 'SALE', label: 'Vente', desc: 'Céder la propriété définitivement' },
  { value: 'RENT', label: 'Location longue durée', desc: 'Bail de 6 mois ou plus' },
  { value: 'SHORT_TERM_RENT', label: 'Court séjour', desc: 'Location à la nuit / semaine' },
  { value: 'INVESTMENT', label: 'Investissement', desc: "Opportunité d'investissement" },
];

const FEATURES = [
  'Piscine',
  'Jardin',
  'Parking',
  'Gardien',
  'Groupe électrogène',
  'Climatisation',
  'Internet fibre',
  'Cuisine équipée',
  'Meublé',
  'Ascenseur',
  'Salle de sport',
  'Terrasse',
  'Vue mer',
  'Borehole',
];

const COUNTRIES = [
  { value: 'BJ', label: 'Bénin', cities: ['Cotonou', 'Porto-Novo', 'Parakou', 'Abomey-Calavi'] },
  {
    value: 'CI',
    label: "Côte d'Ivoire",
    cities: ['Abidjan', 'Bouaké', 'Yamoussoukro', 'San-Pédro'],
  },
  { value: 'BF', label: 'Burkina Faso', cities: ['Ouagadougou', 'Bobo-Dioulasso', 'Koudougou'] },
  { value: 'TG', label: 'Togo', cities: ['Lomé', 'Sokodé', 'Kpalimé', 'Atakpamé'] },
];

const step1Schema = z.object({
  type: z.string().min(1, 'Sélectionnez un type'),
  purpose: z.string().min(1, 'Sélectionnez un objectif'),
});

const step2Schema = z.object({
  title: z.string().min(5, 'Titre trop court (min 5 caractères)').max(100),
  description: z.string().min(30, 'Description trop courte (min 30 caractères)').max(2000),
  surface: z.coerce.number().min(1).optional(),
  bedrooms: z.coerce.number().min(0).max(20).optional(),
  bathrooms: z.coerce.number().min(0).max(10).optional(),
  floor: z.coerce.number().min(0).optional(),
  yearBuilt: z.coerce.number().min(1900).max(new Date().getFullYear()).optional(),
  features: z.array(z.string()).optional(),
});

const step3Schema = z.object({
  country: z.string().min(1, 'Sélectionnez un pays'),
  city: z.string().min(1, 'Entrez une ville'),
  district: z.string().optional(),
  address: z.string().optional(),
});

const step4Schema = z.object({
  price: z.coerce.number().min(1, 'Prix requis'),
  currency: z.string().default('XOF'),
  negotiable: z.boolean().optional(),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;
type Step3Data = z.infer<typeof step3Schema>;
type Step4Data = z.infer<typeof step4Schema>;

type FormData = Step1Data & Step2Data & Step3Data & Step4Data;

const STEPS = [
  { label: 'Type & objectif', icon: Home },
  { label: 'Détails', icon: CheckCircle2 },
  { label: 'Localisation', icon: MapPin },
  { label: 'Prix & publication', icon: DollarSign },
];

interface UploadedPhoto {
  preview: string;
  publicUrl: string;
  fileKey: string;
  uploading: boolean;
}

export function PublishPropertyForm(): React.ReactElement {
  const router = useRouter();
  const { data: session } = useSession();
  const token = (session?.accessToken as string | undefined) ?? null;
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form1 = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: { type: formData.type ?? '', purpose: formData.purpose ?? '' },
  });
  const form2 = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: { title: formData.title ?? '', description: formData.description ?? '' },
  });
  const form3 = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: { country: formData.country ?? '', city: formData.city ?? '' },
  });
  const form4 = useForm<Step4Data>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      ...(formData.price !== undefined ? { price: formData.price } : {}),
      currency: 'XOF',
    },
  });

  const selectedCountry = form3.watch('country');
  const cities = COUNTRIES.find((c) => c.value === selectedCountry)?.cities ?? [];

  const handlePhotoSelect = async (files: FileList | null) => {
    if (!files || !token) return;
    const allowed = Array.from(files).slice(0, 10 - photos.length);

    for (const file of allowed) {
      const preview = URL.createObjectURL(file);
      const placeholder: UploadedPhoto = { preview, publicUrl: '', fileKey: '', uploading: true };
      setPhotos((prev) => [...prev, placeholder]);

      try {
        const { data: presign } = await api.properties.presignUpload(file.type, token);
        await fetch(presign.uploadUrl, {
          method: 'PUT',
          body: file,
          headers: { 'Content-Type': file.type },
        });
        setPhotos((prev) =>
          prev.map((p) =>
            p.preview === preview
              ? {
                  preview,
                  publicUrl: presign.publicUrl,
                  fileKey: presign.fileKey,
                  uploading: false,
                }
              : p,
          ),
        );
      } catch {
        setPhotos((prev) => prev.filter((p) => p.preview !== preview));
        toast.error(`Impossible d'uploader ${file.name}`);
      }
    }
  };

  const handleStep1 = (data: Step1Data): void => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(1);
  };

  const handleStep2 = (data: Step2Data): void => {
    setFormData((prev) => ({ ...prev, ...data, features: selectedFeatures }));
    setStep(2);
  };

  const handleStep3 = (data: Step3Data): void => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(3);
  };

  const handleStep4 = async (data: Step4Data): Promise<void> => {
    if (!token) {
      toast.error('Session expirée. Reconnectez-vous.');
      return;
    }
    const pendingPhotos = photos.some((p) => p.uploading);
    if (pendingPhotos) {
      toast.error("Photos encore en cours d'upload. Patientez.");
      return;
    }

    const final = { ...formData, ...data, features: selectedFeatures };
    setIsSubmitting(true);
    try {
      const { data: created } = await api.properties.create(final, token);
      const property = created as { slug: string };

      // Associate uploaded photos with the property
      const readyPhotos = photos.filter((p) => p.publicUrl);
      for (let i = 0; i < readyPhotos.length; i++) {
        const photo = readyPhotos[i]!;
        await api.properties.addImage(
          property.slug,
          { url: photo.publicUrl, fileKey: photo.fileKey, isPrimary: i === 0 },
          token,
        );
      }

      toast.success('Annonce créée avec succès !');
      router.push('/dashboard/annonces' as Route);
    } catch {
      toast.error('Erreur lors de la création. Réessayez.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      {/* Step indicator */}
      <nav aria-label="Étapes du formulaire" className="mb-8">
        <ol className="flex items-center gap-0">
          {STEPS.map((s, i) => (
            <li key={s.label} className="flex flex-1 items-center">
              <div className="flex flex-1 flex-col items-center gap-1">
                <button
                  type="button"
                  onClick={() => i < step && setStep(i)}
                  disabled={i > step}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all',
                    i < step
                      ? 'border-navy bg-navy cursor-pointer text-white'
                      : i === step
                        ? 'border-navy text-navy bg-white'
                        : 'border-charcoal-200 text-charcoal-300 cursor-not-allowed bg-white',
                  )}
                  aria-current={i === step ? 'step' : undefined}
                  aria-label={s.label}
                >
                  {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                </button>
                <span
                  className={cn(
                    'hidden text-xs sm:block',
                    i === step ? 'text-navy font-medium' : 'text-charcoal-400',
                  )}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={cn(
                    'mt-[-1rem] h-0.5 flex-1',
                    i < step ? 'bg-navy' : 'bg-charcoal-200',
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          ))}
        </ol>
      </nav>

      <AnimatePresence mode="wait">
        {/* Step 0: Type & Purpose */}
        {step === 0 && (
          <motion.form
            key="step0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={form1.handleSubmit(handleStep1)}
            className="space-y-6"
          >
            <div>
              <h2 className="text-charcoal mb-1 font-serif text-xl font-semibold">Type de bien</h2>
              <p className="text-charcoal-400 text-sm">
                Quel type de propriété souhaitez-vous publier ?
              </p>
            </div>

            <fieldset>
              <legend className="sr-only">Type de propriété</legend>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {PROPERTY_TYPES.map((t) => {
                  const selected = form1.watch('type') === t.value;
                  return (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => form1.setValue('type', t.value, { shouldValidate: true })}
                      className={cn(
                        'flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-sm font-medium transition-all',
                        selected
                          ? 'border-navy bg-navy/5 text-navy'
                          : 'border-charcoal-100 hover:border-navy/30',
                      )}
                      aria-pressed={selected}
                    >
                      <span className="text-2xl" aria-hidden="true">
                        {t.emoji}
                      </span>
                      {t.label}
                    </button>
                  );
                })}
              </div>
              {form1.formState.errors.type && (
                <p className="text-danger mt-2 text-xs">{form1.formState.errors.type.message}</p>
              )}
            </fieldset>

            <fieldset>
              <legend className="text-charcoal mb-3 text-sm font-medium">Objectif</legend>
              <div className="flex flex-col gap-2">
                {PURPOSES.map((p) => {
                  const selected = form1.watch('purpose') === p.value;
                  return (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => form1.setValue('purpose', p.value, { shouldValidate: true })}
                      className={cn(
                        'flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all',
                        selected
                          ? 'border-navy bg-navy/5'
                          : 'border-charcoal-100 hover:border-navy/30',
                      )}
                      aria-pressed={selected}
                    >
                      <div
                        className={cn(
                          'h-4 w-4 flex-shrink-0 rounded-full border-2',
                          selected ? 'border-navy bg-navy' : 'border-charcoal-300',
                        )}
                        aria-hidden="true"
                      />
                      <div>
                        <p
                          className={cn(
                            'text-sm font-medium',
                            selected ? 'text-navy' : 'text-charcoal',
                          )}
                        >
                          {p.label}
                        </p>
                        <p className="text-charcoal-400 text-xs">{p.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
              {form1.formState.errors.purpose && (
                <p className="text-danger mt-2 text-xs">{form1.formState.errors.purpose.message}</p>
              )}
            </fieldset>

            <Button type="submit" fullWidth size="lg" className="gap-2">
              Suivant <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </motion.form>
        )}

        {/* Step 1: Details */}
        {step === 1 && (
          <motion.form
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={form2.handleSubmit(handleStep2)}
            className="space-y-5"
          >
            <div>
              <h2 className="text-charcoal mb-1 font-serif text-xl font-semibold">
                Détails de la propriété
              </h2>
              <p className="text-charcoal-400 text-sm">
                Ces informations apparaîtront dans votre annonce.
              </p>
            </div>

            <Input
              label="Titre de l'annonce *"
              {...form2.register('title')}
              error={form2.formState.errors.title?.message}
              placeholder="Ex: Villa moderne 4 chambres avec piscine"
            />

            <div>
              <label className="text-charcoal mb-1.5 block text-sm font-medium">
                Description *
              </label>
              <textarea
                {...form2.register('description')}
                rows={5}
                placeholder="Décrivez votre propriété en détail : environnement, état général, atouts…"
                className="border-charcoal-200 text-charcoal placeholder:text-charcoal-300 focus:ring-navy/30 focus:border-navy w-full resize-none rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
              />
              {form2.formState.errors.description && (
                <p className="text-danger mt-1 text-xs">
                  {form2.formState.errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Input
                label="Surface (m²)"
                type="number"
                {...form2.register('surface')}
                placeholder="120"
              />
              <Input
                label="Chambres"
                type="number"
                {...form2.register('bedrooms')}
                placeholder="3"
              />
              <Input
                label="Salles de bain"
                type="number"
                {...form2.register('bathrooms')}
                placeholder="2"
              />
              <Input label="Étage" type="number" {...form2.register('floor')} placeholder="0" />
            </div>

            <Input
              label="Année de construction"
              type="number"
              {...form2.register('yearBuilt')}
              placeholder="2020"
            />

            <fieldset>
              <legend className="text-charcoal mb-3 text-sm font-medium">
                Équipements & caractéristiques
              </legend>
              <div className="flex flex-wrap gap-2">
                {FEATURES.map((f) => {
                  const active = selectedFeatures.includes(f);
                  return (
                    <button
                      key={f}
                      type="button"
                      onClick={() =>
                        setSelectedFeatures((prev) =>
                          active ? prev.filter((x) => x !== f) : [...prev, f],
                        )
                      }
                      className={cn(
                        'rounded-pill border px-3 py-1.5 text-xs font-medium transition-colors',
                        active
                          ? 'bg-navy border-navy text-white'
                          : 'border-charcoal-200 text-charcoal hover:border-navy/40',
                      )}
                      aria-pressed={active}
                    >
                      {f}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* Photo upload */}
            <div>
              <p className="text-charcoal mb-2 text-sm font-medium">
                Photos <span className="text-charcoal-400 font-normal">({photos.length}/10)</span>
              </p>

              {/* Grid of uploaded photos */}
              {photos.length > 0 && (
                <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {photos.map((photo, i) => (
                    <div
                      key={photo.preview}
                      className="bg-charcoal-100 relative aspect-square overflow-hidden rounded-lg"
                    >
                      <img
                        src={photo.preview}
                        alt={`Photo ${i + 1}`}
                        className="h-full w-full object-cover"
                      />
                      {photo.uploading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <Loader2 className="h-5 w-5 animate-spin text-white" />
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setPhotos((prev) => prev.filter((_, j) => j !== i))}
                          className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white hover:bg-black/80"
                          aria-label="Supprimer la photo"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                      {i === 0 && !photo.uploading && (
                        <span className="bg-navy/80 absolute bottom-1 left-1 rounded px-1 text-xs text-white">
                          Principale
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {photos.length < 10 && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="sr-only"
                    onChange={(e) => void handlePhotoSelect(e.target.files)}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="border-charcoal-200 hover:border-navy/40 flex w-full cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition-colors"
                  >
                    <Upload className="text-charcoal-300 h-7 w-7" aria-hidden="true" />
                    <p className="text-charcoal-400 text-sm">Cliquez pour ajouter des photos</p>
                    <p className="text-charcoal-300 text-xs">
                      JPG, PNG, WebP — max 10 Mo — 10 photos
                    </p>
                  </button>
                </>
              )}
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="ghost" onClick={() => setStep(0)} className="gap-1.5">
                <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Retour
              </Button>
              <Button type="submit" fullWidth className="gap-2">
                Suivant <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </motion.form>
        )}

        {/* Step 2: Location */}
        {step === 2 && (
          <motion.form
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={form3.handleSubmit(handleStep3)}
            className="space-y-5"
          >
            <div>
              <h2 className="text-charcoal mb-1 font-serif text-xl font-semibold">Localisation</h2>
              <p className="text-charcoal-400 text-sm">Où se situe votre propriété ?</p>
            </div>

            <div>
              <label className="text-charcoal mb-1.5 block text-sm font-medium">Pays *</label>
              <select
                {...form3.register('country')}
                className="border-charcoal-200 text-charcoal focus:ring-navy/30 focus:border-navy w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
              >
                <option value="">Sélectionner un pays</option>
                {COUNTRIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              {form3.formState.errors.country && (
                <p className="text-danger mt-1 text-xs">{form3.formState.errors.country.message}</p>
              )}
            </div>

            {cities.length > 0 ? (
              <div>
                <label className="text-charcoal mb-1.5 block text-sm font-medium">Ville *</label>
                <select
                  {...form3.register('city')}
                  className="border-charcoal-200 text-charcoal focus:ring-navy/30 focus:border-navy w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
                >
                  <option value="">Sélectionner une ville</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {form3.formState.errors.city && (
                  <p className="text-danger mt-1 text-xs">{form3.formState.errors.city.message}</p>
                )}
              </div>
            ) : (
              <Input
                label="Ville *"
                {...form3.register('city')}
                error={form3.formState.errors.city?.message}
                placeholder="Entrez la ville"
              />
            )}

            <Input
              label="Quartier"
              {...form3.register('district')}
              placeholder="Ex: Cadjehoun, Cocody, Ouaga 2000…"
            />
            <Input
              label="Adresse complète"
              {...form3.register('address')}
              placeholder="Ex: Rue 123, Lot 45"
            />

            <div className="flex gap-3">
              <Button type="button" variant="ghost" onClick={() => setStep(1)} className="gap-1.5">
                <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Retour
              </Button>
              <Button type="submit" fullWidth className="gap-2">
                Suivant <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </motion.form>
        )}

        {/* Step 3: Price & Publish */}
        {step === 3 && (
          <motion.form
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={form4.handleSubmit(handleStep4)}
            className="space-y-5"
          >
            <div>
              <h2 className="text-charcoal mb-1 font-serif text-xl font-semibold">
                Prix & publication
              </h2>
              <p className="text-charcoal-400 text-sm">
                Définissez votre prix et publiez votre annonce.
              </p>
            </div>

            <div className="flex gap-3">
              <div className="w-28">
                <label className="text-charcoal mb-1.5 block text-sm font-medium">Devise</label>
                <select
                  {...form4.register('currency')}
                  className="border-charcoal-200 text-charcoal focus:ring-navy/30 focus:border-navy w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
                >
                  <option value="XOF">XOF (FCFA)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>
              <div className="flex-1">
                <Input
                  label="Prix *"
                  type="number"
                  {...form4.register('price')}
                  error={form4.formState.errors.price?.message}
                  placeholder="Ex: 85000000"
                />
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                {...form4.register('negotiable')}
                className="border-charcoal-300 accent-navy h-4 w-4 rounded"
              />
              <span className="text-charcoal text-sm">Prix négociable</span>
            </label>

            {/* Summary */}
            <div className="bg-charcoal-50 space-y-2 rounded-xl p-4 text-sm">
              <p className="text-charcoal mb-3 font-semibold">Récapitulatif</p>
              {[
                [
                  'Type',
                  PROPERTY_TYPES.find((t) => t.value === formData.type)?.label ?? formData.type,
                ],
                [
                  'Objectif',
                  PURPOSES.find((p) => p.value === formData.purpose)?.label ?? formData.purpose,
                ],
                ['Titre', formData.title],
                [
                  'Localisation',
                  [formData.city, COUNTRIES.find((c) => c.value === formData.country)?.label]
                    .filter(Boolean)
                    .join(', '),
                ],
                [
                  'Équipements',
                  selectedFeatures.length > 0 ? `${selectedFeatures.length} sélectionnés` : '—',
                ],
              ].map(([k, v]) =>
                v ? (
                  <div key={k} className="flex justify-between gap-2">
                    <span className="text-charcoal-400">{k}</span>
                    <span className="text-charcoal text-right font-medium">{v}</span>
                  </div>
                ) : null,
              )}
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="ghost" onClick={() => setStep(2)} className="gap-1.5">
                <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Retour
              </Button>
              <Button type="submit" fullWidth size="lg" disabled={isSubmitting}>
                {isSubmitting ? 'Publication en cours…' : "Publier l'annonce"}
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
