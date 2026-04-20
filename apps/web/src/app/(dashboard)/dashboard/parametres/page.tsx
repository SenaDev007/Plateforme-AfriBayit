'use client';
import type React from 'react';

import { useState } from 'react';
import { Bell, Shield, Globe, Smartphone, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button, Input, cn } from '@afribayit/ui';
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
        <h1 className="font-serif text-2xl font-bold text-charcoal">Paramètres</h1>
        <p className="text-sm text-charcoal-400 mt-0.5">Configurez votre compte et vos préférences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar nav */}
        <nav className="lg:w-52 flex lg:flex-col gap-1" aria-label="Sections des paramètres">
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-left transition-colors',
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
        <div className="flex-1 bg-white rounded-xl border border-charcoal-100 p-6">
          {/* Notifications */}
          {activeSection === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-semibold text-charcoal mb-1">Notifications</h2>
                <p className="text-sm text-charcoal-400">Choisissez comment vous souhaitez être notifié.</p>
              </div>

              {([
                { group: 'Email', items: [
                  { key: 'emailNewMessage', label: 'Nouveau message', desc: 'Quand un acheteur/locataire vous contacte' },
                  { key: 'emailTransaction', label: 'Transactions', desc: 'Mises à jour des transactions et escrow' },
                  { key: 'emailMarketing', label: 'Offres & actualités', desc: 'Newsletter et offres commerciales AfriBayit' },
                ]},
                { group: 'SMS', items: [
                  { key: 'smsTransaction', label: 'Transactions SMS', desc: 'Confirmations de paiement par SMS' },
                  { key: 'smsNewMessage', label: 'Messages SMS', desc: 'Alerte SMS pour les nouveaux messages' },
                ]},
                { group: 'Push', items: [
                  { key: 'pushAll', label: 'Notifications push', desc: 'Toutes les notifications en temps réel' },
                ]},
              ] as const).map(({ group, items }) => (
                <fieldset key={group}>
                  <legend className="text-sm font-medium text-charcoal mb-3 pb-2 border-b border-charcoal-100 w-full">{group}</legend>
                  <div className="space-y-3">
                    {items.map(({ key, label, desc }) => (
                      <label key={key} className="flex items-center justify-between gap-4 cursor-pointer">
                        <div>
                          <p className="text-sm font-medium text-charcoal">{label}</p>
                          <p className="text-xs text-charcoal-400">{desc}</p>
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={notifSettings[key as keyof typeof notifSettings]}
                          onClick={() => setNotifSettings((prev) => ({ ...prev, [key]: !prev[key as keyof typeof notifSettings] }))}
                          className={cn(
                            'relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors',
                            notifSettings[key as keyof typeof notifSettings] ? 'bg-navy' : 'bg-charcoal-200',
                          )}
                        >
                          <span
                            className={cn(
                              'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform',
                              notifSettings[key as keyof typeof notifSettings] ? 'translate-x-5' : 'translate-x-0',
                            )}
                          />
                        </button>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}

              <Button onClick={handleSaveNotifs}>Enregistrer les préférences</Button>
            </div>
          )}

          {/* Security */}
          {activeSection === 'security' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-semibold text-charcoal mb-1">Sécurité</h2>
                <p className="text-sm text-charcoal-400">Gérez votre mot de passe et l'authentification à deux facteurs.</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-charcoal">Changer le mot de passe</h3>
                <Input
                  label="Mot de passe actuel"
                  type={showCurrentPwd ? 'text' : 'password'}
                  rightElement={
                    <button type="button" onClick={() => setShowCurrentPwd((v) => !v)} aria-label={showCurrentPwd ? 'Masquer' : 'Afficher'}>
                      {showCurrentPwd ? <EyeOff className="h-4 w-4 text-charcoal-400" /> : <Eye className="h-4 w-4 text-charcoal-400" />}
                    </button>
                  }
                />
                <Input
                  label="Nouveau mot de passe"
                  type={showNewPwd ? 'text' : 'password'}
                  hint="Minimum 8 caractères, 1 majuscule, 1 chiffre"
                  rightElement={
                    <button type="button" onClick={() => setShowNewPwd((v) => !v)} aria-label={showNewPwd ? 'Masquer' : 'Afficher'}>
                      {showNewPwd ? <EyeOff className="h-4 w-4 text-charcoal-400" /> : <Eye className="h-4 w-4 text-charcoal-400" />}
                    </button>
                  }
                />
                <Input label="Confirmer le nouveau mot de passe" type="password" />
                <Button onClick={handleSavePassword}>Mettre à jour le mot de passe</Button>
              </div>

              <div className="border-t border-charcoal-100 pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-charcoal">Authentification à 2 facteurs (2FA)</p>
                    <p className="text-xs text-charcoal-400">Sécurisez votre compte avec un code TOTP (Google Authenticator, etc.)</p>
                  </div>
                  <Badge variant="outline">Non activé</Badge>
                </div>
                <Button variant="outline">Activer la 2FA</Button>
              </div>

              <div className="border-t border-charcoal-100 pt-6">
                <h3 className="text-sm font-medium text-charcoal mb-3">Sessions actives</h3>
                <div className="flex items-center justify-between p-3 bg-charcoal-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-charcoal">Chrome — Windows 11</p>
                    <p className="text-xs text-charcoal-400">Cotonou, Bénin · Session actuelle</p>
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
                <h2 className="font-semibold text-charcoal mb-1">Préférences</h2>
                <p className="text-sm text-charcoal-400">Personnalisez votre expérience sur AfriBayit.</p>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Langue', key: 'language', options: [{ value: 'fr', label: 'Français' }, { value: 'en', label: 'English' }] },
                  { label: 'Devise par défaut', key: 'currency', options: [{ value: 'XOF', label: 'XOF (FCFA)' }, { value: 'EUR', label: 'EUR (€)' }, { value: 'USD', label: 'USD ($)' }] },
                  { label: 'Pays par défaut', key: 'country', options: [{ value: 'BJ', label: 'Bénin' }, { value: 'CI', label: 'Côte d\'Ivoire' }, { value: 'BF', label: 'Burkina Faso' }, { value: 'TG', label: 'Togo' }] },
                  { label: 'Unité de distance', key: 'distanceUnit', options: [{ value: 'km', label: 'Kilomètres' }, { value: 'mi', label: 'Miles' }] },
                ].map(({ label, key, options }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">{label}</label>
                    <select
                      value={prefSettings[key as keyof typeof prefSettings]}
                      onChange={(e) => setPrefSettings((prev) => ({ ...prev, [key]: e.target.value }))}
                      className="w-full rounded-lg border border-charcoal-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30"
                    >
                      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
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
                <h2 className="font-semibold text-charcoal mb-1">Gestion du compte</h2>
                <p className="text-sm text-charcoal-400">Actions irréversibles sur votre compte.</p>
              </div>

              <div className="border border-charcoal-100 rounded-xl p-4 space-y-3">
                <p className="text-sm font-medium text-charcoal">Exporter mes données</p>
                <p className="text-xs text-charcoal-400">Téléchargez une copie de vos données personnelles (RGPD).</p>
                <Button variant="outline" size="sm">Exporter mes données</Button>
              </div>

              <div className="border border-danger/20 rounded-xl p-4 space-y-3 bg-danger/5">
                <div className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4 text-danger" aria-hidden="true" />
                  <p className="text-sm font-medium text-danger">Supprimer mon compte</p>
                </div>
                <p className="text-xs text-charcoal-400">
                  Cette action est irréversible. Toutes vos données, annonces et transactions seront supprimées définitivement.
                </p>
                <Button variant="danger" size="sm">Supprimer mon compte</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
