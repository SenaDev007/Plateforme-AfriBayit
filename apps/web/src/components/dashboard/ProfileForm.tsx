'use client';
import type React from 'react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input, Button, Card, Badge } from '@afribayit/ui';
import toast from 'react-hot-toast';
import { CheckCircle2, AlertCircle, Upload } from 'lucide-react';

const profileSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string().min(8),
  city: z.string().optional(),
  bio: z.string().max(300).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const KYC_STEPS = [
  { level: 1, label: 'Niveau 1 — Identité', desc: 'CNI + Selfie', status: 'APPROVED' },
  { level: 2, label: 'Niveau 2 — Adresse', desc: 'Justificatif de domicile', status: 'PENDING' },
  { level: 3, label: 'Niveau 3 — Revenus', desc: 'Relevé bancaire', status: 'NONE' },
];

export function ProfileForm(): React.ReactElement {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: 'Aminata',
      lastName: 'Koné',
      phone: '+229 97 00 00 00',
      city: 'Cotonou',
      bio: '',
    },
  });

  const onSubmit = async (_data: ProfileFormData): Promise<void> => {
    await new Promise((r) => setTimeout(r, 800));
    toast.success('Profil mis à jour !');
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Profile card */}
      <Card>
        <h2 className="font-serif text-lg font-semibold text-charcoal mb-5">Informations personnelles</h2>
        <form onSubmit={(e) => { void handleSubmit(onSubmit)(e); }} noValidate className="flex flex-col gap-4">
          <div className="flex items-center gap-4 mb-2">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-navy text-white text-2xl font-semibold">
              AK
            </div>
            <div>
              <p className="text-sm font-medium text-charcoal">Aminata Koné</p>
              <p className="text-xs text-charcoal-400">Acheteur · Cotonou, Bénin</p>
              <Badge variant="success" className="mt-1">KYC Niveau 1</Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input label="Prénom" required error={errors.firstName?.message} {...register('firstName')} />
            <Input label="Nom" required error={errors.lastName?.message} {...register('lastName')} />
          </div>
          <Input label="Téléphone" type="tel" error={errors.phone?.message} {...register('phone')} />
          <Input label="Ville" {...register('city')} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-charcoal">Bio (optionnel)</label>
            <textarea
              {...register('bio')}
              rows={3}
              className="rounded-md border border-charcoal-200 px-3 py-2.5 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy resize-none"
              placeholder="Quelques mots sur vous…"
            />
            {errors.bio && <p className="text-xs text-danger">{errors.bio.message}</p>}
          </div>
          <Button type="submit" loading={isSubmitting}>Sauvegarder</Button>
        </form>
      </Card>

      {/* KYC Status */}
      <Card>
        <h2 className="font-serif text-lg font-semibold text-charcoal mb-5">Vérification KYC</h2>
        <div className="space-y-4">
          {KYC_STEPS.map((step) => (
            <div key={step.level} className="flex items-start gap-4 p-4 rounded-lg border border-charcoal-100">
              <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                step.status === 'APPROVED' ? 'bg-emerald text-white' :
                step.status === 'PENDING' ? 'bg-gold/20 text-gold-600' : 'bg-charcoal-100 text-charcoal-400'
              }`}>
                {step.status === 'APPROVED' ? (
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-charcoal">{step.label}</p>
                  <Badge variant={step.status === 'APPROVED' ? 'success' : step.status === 'PENDING' ? 'gold' : 'default'}>
                    {step.status === 'APPROVED' ? 'Approuvé' : step.status === 'PENDING' ? 'En cours' : 'Non commencé'}
                  </Badge>
                </div>
                <p className="text-xs text-charcoal-400 mt-0.5">{step.desc}</p>
              </div>
              {step.status === 'NONE' && (
                <button
                  className="flex items-center gap-1.5 rounded-pill border border-navy px-3 py-1.5 text-xs font-medium text-navy hover:bg-navy/5 transition-colors"
                  aria-label={`Commencer ${step.label}`}
                >
                  <Upload className="h-3 w-3" aria-hidden="true" />
                  Commencer
                </button>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
