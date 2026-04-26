'use client';
import type React from 'react';

import { useState } from 'react';
import { Bell, Shield, Globe, Smartphone, Trash2, Eye, EyeOff, MessageCircle } from 'lucide-react';
import { Button, Input, Badge, cn } from '@afribayit/ui';
import toast from 'react-hot-toast';

const SECTIONS = [
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Sécurité', icon: Shield },
  { id: 'preferences', label: 'Préférences', icon: Globe },
  { id: 'account', label: 'Compte', icon: Smartphone },
];

export default function ParametresPage(): React.ReactElement {
  const [activeSection, setActiveSection] = useState('notifications');
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);

  const [notifSettings, setNotifSettings] = useState({
    emailNewMessage: true,
    emailTransaction: true,
    emailMarketing: false,
    smsTransaction: true,
    smsNewMessage: false,
    pushAll: true,
    whatsappTransaction: true,
    whatsappKyc: true,
    whatsappNewMessage: false,
    whatsappPayout: true,
  });

  const [prefSettings, setPrefSettings] = useState({
    language: 'fr',
    currency: 'XOF',
    country: 'BJ',
    distanceUnit: 'km',
  });

  const handleSaveNotifs = (): void => {
    toast.success('Préférences de notification sauvegardées');
  };

  const handleSavePassword = (): void => {
    toast.success('Mot de passe mis à jour');
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-charcoal font-serif text-2xl font-bold">Paramètres</h1>
        <p className="text-charcoal-400 mt-0.5 text-sm">
          Configurez votre compte et vos préférences
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar nav */}
        <nav className="flex gap-1 lg:w-52 lg:flex-col" aria-label="Sections des paramètres">
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors',
                activeSection === id
                  ? 'bg-navy/10 text-navy'
                  : 'text-charcoal-400 hover:bg-charcoal-50 hover:text-charcoal',
              )}
              aria-current={activeSection === id ? 'page' : undefined}
            >
              <Icon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
              {label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="border-charcoal-100 flex-1 rounded-xl border bg-white p-6">
          {/* Notifications */}
          {activeSection === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-charcoal mb-1 font-semibold">Notifications</h2>
                <p className="text-charcoal-400 text-sm">
                  Choisissez comment vous souhaitez être notifié.
                </p>
              </div>

              {(
                [
                  {
                    group: 'Email',
                    items: [
                      {
                        key: 'emailNewMessage',
                        label: 'Nouveau message',
                        desc: 'Quand un acheteur/locataire vous contacte',
                      },
                      {
                        key: 'emailTransaction',
                        label: 'Transactions',
                        desc: 'Mises à jour des transactions et escrow',
                      },
                      {
                        key: 'emailMarketing',
                        label: 'Offres & actualités',
                        desc: 'Newsletter et offres commerciales AfriBayit',
                      },
                    ],
                  },
                  {
                    group: 'SMS',
                    items: [
                      {
                        key: 'smsTransaction',
                        label: 'Transactions SMS',
                        desc: 'Confirmations de paiement par SMS',
                      },
                      {
                        key: 'smsNewMessage',
                        label: 'Messages SMS',
                        desc: 'Alerte SMS pour les nouveaux messages',
                      },
                    ],
                  },
                  {
                    group: 'Push',
                    items: [
                      {
                        key: 'pushAll',
                        label: 'Notifications push',
                        desc: 'Toutes les notifications en temps réel',
                      },
                    ],
                  },
                ] as const
              ).map(({ group, items }) => (
                <fieldset key={group}>
                  <legend className="text-charcoal border-charcoal-100 mb-3 w-full border-b pb-2 text-sm font-medium">
                    {group}
                  </legend>
                  <div className="space-y-3">
                    {items.map(({ key, label, desc }) => (
                      <label
                        key={key}
                        className="flex cursor-pointer items-center justify-between gap-4"
                      >
                        <div>
                          <p className="text-charcoal text-sm font-medium">{label}</p>
                          <p className="text-charcoal-400 text-xs">{desc}</p>
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={notifSettings[key as keyof typeof notifSettings]}
                          onClick={() =>
                            setNotifSettings((prev) => ({
                              ...prev,
                              [key]: !prev[key as keyof typeof notifSettings],
                            }))
                          }
                          className={cn(
                            'relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors',
                            notifSettings[key as keyof typeof notifSettings]
                              ? 'bg-navy'
                              : 'bg-charcoal-200',
                          )}
                        >
                          <span
                            className={cn(
                              'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform',
                              notifSettings[key as keyof typeof notifSettings]
                                ? 'translate-x-5'
                                : 'translate-x-0',
                            )}
                          />
                        </button>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}

              {/* WhatsApp section */}
              <fieldset className="border-charcoal-100 space-y-4 rounded-xl border p-4">
                <legend className="px-1">
                  <span className="text-charcoal flex items-center gap-2 text-sm font-medium">
                    <MessageCircle className="h-4 w-4 text-[#25D366]" aria-hidden="true" />
                    WhatsApp Business
                  </span>
                </legend>
                <p className="text-charcoal-400 -mt-2 text-xs">
                  Recevez des alertes directement sur WhatsApp. Votre numéro de téléphone doit être
                  renseigné dans votre profil.
                </p>
                <div className="space-y-3">
                  {(
                    [
                      {
                        key: 'whatsappTransaction',
                        label: 'Mises à jour de transaction',
                        desc: 'Financement, validation, libération des fonds',
                      },
                      {
                        key: 'whatsappPayout',
                        label: 'Virements Mobile Money',
                        desc: 'Confirmation de virement vers votre compte',
                      },
                      {
                        key: 'whatsappKyc',
                        label: "Vérification d'identité (KYC)",
                        desc: "Résultat de l'examen de vos documents",
                      },
                      {
                        key: 'whatsappNewMessage',
                        label: 'Nouveaux messages',
                        desc: 'Quand un utilisateur vous envoie un message',
                      },
                    ] as const
                  ).map(({ key, label, desc }) => (
                    <label
                      key={key}
                      className="flex cursor-pointer items-center justify-between gap-4"
                    >
                      <div>
                        <p className="text-charcoal text-sm font-medium">{label}</p>
                        <p className="text-charcoal-400 text-xs">{desc}</p>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={notifSettings[key]}
                        onClick={() => setNotifSettings((prev) => ({ ...prev, [key]: !prev[key] }))}
                        className={cn(
                          'relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors',
                          notifSettings[key] ? 'bg-[#25D366]' : 'bg-charcoal-200',
                        )}
                      >
                        <span
                          className={cn(
                            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform',
                            notifSettings[key] ? 'translate-x-5' : 'translate-x-0',
                          )}
                        />
                      </button>
                    </label>
                  ))}
                </div>
              </fieldset>

              <Button onClick={handleSaveNotifs}>Enregistrer les préférences</Button>
            </div>
          )}

          {/* Security */}
          {activeSection === 'security' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-charcoal mb-1 font-semibold">Sécurité</h2>
                <p className="text-charcoal-400 text-sm">
                  Gérez votre mot de passe et l'authentification à deux facteurs.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-charcoal text-sm font-medium">Changer le mot de passe</h3>
                <Input
                  label="Mot de passe actuel"
                  type={showCurrentPwd ? 'text' : 'password'}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowCurrentPwd((v) => !v)}
                      aria-label={showCurrentPwd ? 'Masquer' : 'Afficher'}
                    >
                      {showCurrentPwd ? (
                        <EyeOff className="text-charcoal-400 h-4 w-4" />
                      ) : (
                        <Eye className="text-charcoal-400 h-4 w-4" />
                      )}
                    </button>
                  }
                />
                <Input
                  label="Nouveau mot de passe"
                  type={showNewPwd ? 'text' : 'password'}
                  hint="Minimum 8 caractères, 1 majuscule, 1 chiffre"
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowNewPwd((v) => !v)}
                      aria-label={showNewPwd ? 'Masquer' : 'Afficher'}
                    >
                      {showNewPwd ? (
                        <EyeOff className="text-charcoal-400 h-4 w-4" />
                      ) : (
                        <Eye className="text-charcoal-400 h-4 w-4" />
                      )}
                    </button>
                  }
                />
                <Input label="Confirmer le nouveau mot de passe" type="password" />
                <Button onClick={handleSavePassword}>Mettre à jour le mot de passe</Button>
              </div>

              <div className="border-charcoal-100 space-y-4 border-t pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-charcoal text-sm font-medium">
                      Authentification à 2 facteurs (2FA)
                    </p>
                    <p className="text-charcoal-400 text-xs">
                      Sécurisez votre compte avec un code TOTP (Google Authenticator, etc.)
                    </p>
                  </div>
                  <Badge variant="outline">Non activé</Badge>
                </div>
                <Button variant="outline">Activer la 2FA</Button>
              </div>

              <div className="border-charcoal-100 border-t pt-6">
                <h3 className="text-charcoal mb-3 text-sm font-medium">Sessions actives</h3>
                <div className="bg-charcoal-50 flex items-center justify-between rounded-lg p-3">
                  <div>
                    <p className="text-charcoal text-sm font-medium">Chrome — Windows 11</p>
                    <p className="text-charcoal-400 text-xs">Cotonou, Bénin · Session actuelle</p>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
              </div>
            </div>
          )}

          {/* Preferences */}
          {activeSection === 'preferences' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-charcoal mb-1 font-semibold">Préférences</h2>
                <p className="text-charcoal-400 text-sm">
                  Personnalisez votre expérience sur AfriBayit.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    label: 'Langue',
                    key: 'language',
                    options: [
                      { value: 'fr', label: 'Français' },
                      { value: 'en', label: 'English' },
                    ],
                  },
                  {
                    label: 'Devise par défaut',
                    key: 'currency',
                    options: [
                      { value: 'XOF', label: 'XOF (FCFA)' },
                      { value: 'EUR', label: 'EUR (€)' },
                      { value: 'USD', label: 'USD ($)' },
                    ],
                  },
                  {
                    label: 'Pays par défaut',
                    key: 'country',
                    options: [
                      { value: 'BJ', label: 'Bénin' },
                      { value: 'CI', label: "Côte d'Ivoire" },
                      { value: 'BF', label: 'Burkina Faso' },
                      { value: 'TG', label: 'Togo' },
                    ],
                  },
                  {
                    label: 'Unité de distance',
                    key: 'distanceUnit',
                    options: [
                      { value: 'km', label: 'Kilomètres' },
                      { value: 'mi', label: 'Miles' },
                    ],
                  },
                ].map(({ label, key, options }) => (
                  <div key={key}>
                    <label className="text-charcoal mb-1.5 block text-sm font-medium">
                      {label}
                    </label>
                    <select
                      value={prefSettings[key as keyof typeof prefSettings]}
                      onChange={(e) =>
                        setPrefSettings((prev) => ({ ...prev, [key]: e.target.value }))
                      }
                      className="border-charcoal-200 focus:ring-navy/30 w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
                    >
                      {options.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              <Button onClick={() => toast.success('Préférences sauvegardées')}>Enregistrer</Button>
            </div>
          )}

          {/* Account */}
          {activeSection === 'account' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-charcoal mb-1 font-semibold">Gestion du compte</h2>
                <p className="text-charcoal-400 text-sm">Actions irréversibles sur votre compte.</p>
              </div>

              <div className="border-charcoal-100 space-y-3 rounded-xl border p-4">
                <p className="text-charcoal text-sm font-medium">Exporter mes données</p>
                <p className="text-charcoal-400 text-xs">
                  Téléchargez une copie de vos données personnelles (RGPD).
                </p>
                <Button variant="outline" size="sm">
                  Exporter mes données
                </Button>
              </div>

              <div className="border-danger/20 bg-danger/5 space-y-3 rounded-xl border p-4">
                <div className="flex items-center gap-2">
                  <Trash2 className="text-danger h-4 w-4" aria-hidden="true" />
                  <p className="text-danger text-sm font-medium">Supprimer mon compte</p>
                </div>
                <p className="text-charcoal-400 text-xs">
                  Cette action est irréversible. Toutes vos données, annonces et transactions seront
                  supprimées définitivement.
                </p>
                <Button variant="danger" size="sm">
                  Supprimer mon compte
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
