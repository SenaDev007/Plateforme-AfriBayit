'use client';
import { motion } from 'framer-motion';
import { Bed, Users, Utensils, TrendingUp, Calendar, Plus, Star, ShieldCheck } from 'lucide-react';
import { Card, Badge, Button } from '@afribayit/ui';

export default function GuesthouseDashboard() {
  return (
    <div className="space-y-10 py-10">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-gold mb-2 text-[10px] font-bold uppercase tracking-[0.3em]">
            Hébergement Touristique — Guesthouse
          </p>
          <h1 className="text-charcoal font-serif text-4xl font-bold">Ma Guesthouse</h1>
        </div>
        <div className="flex gap-4">
          <Badge
            variant="outline"
            className="border-gold text-gold rounded-full px-4 py-1.5 font-bold"
          >
            GUESTHOUSE CERTIFIÉE
          </Badge>
          <Button className="bg-navy h-12 rounded-full px-8 text-xs font-bold uppercase tracking-widest">
            NOUVELLE CHAMBRE
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {[
          { label: "Taux d'Occupation", value: '82%', icon: TrendingUp, color: 'navy' },
          { label: 'Chambres Actives', value: '12', icon: Bed, color: 'gold' },
          { label: 'Voyageurs ce soir', value: '18', icon: Users, color: 'navy' },
          { label: 'Score Hygiène', value: '4.9/5', icon: ShieldCheck, color: 'gold' },
        ].map((stat, i) => (
          <Card key={i} className="border-charcoal-100 rounded-[32px] p-6">
            <div
              className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${
                stat.color === 'navy' ? 'bg-navy/5 text-navy' : 'bg-gold/10 text-gold'
              }`}
            >
              <stat.icon className="h-6 w-6" />
            </div>
            <p className="text-charcoal text-3xl font-bold">{stat.value}</p>
            <p className="text-charcoal-400 text-[10px] font-bold uppercase tracking-widest">
              {stat.label}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <Card className="space-y-8 rounded-[40px] p-8 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-charcoal font-serif text-2xl font-bold">Gestion des Chambres</h3>
            <Button
              variant="ghost"
              className="text-navy text-xs font-bold uppercase tracking-widest"
            >
              Voir tout
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {[
              {
                name: 'Suite Royale Benin',
                price: '45 000 FCFA',
                status: 'OCCUPIED',
                guest: 'Jean Dupont',
                breakfast: true,
              },
              {
                name: 'Chambre Deluxe Ouidah',
                price: '25 000 FCFA',
                status: 'AVAILABLE',
                guest: null,
                breakfast: false,
              },
            ].map((room, i) => (
              <div
                key={i}
                className="bg-charcoal-50 border-charcoal-100 space-y-4 rounded-[32px] border p-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-charcoal font-bold">{room.name}</p>
                    <p className="text-charcoal-400 text-xs">{room.price} / nuit</p>
                  </div>
                  <Badge variant={room.status === 'AVAILABLE' ? 'success' : 'warning'}>
                    {room.status}
                  </Badge>
                </div>

                <div className="border-charcoal-200 flex items-center justify-between border-t pt-4">
                  <div className="flex items-center gap-2">
                    <Utensils
                      className={`h-4 w-4 ${room.breakfast ? 'text-emerald' : 'text-charcoal-300'}`}
                    />
                    <span className="text-charcoal-400 text-[10px] font-bold uppercase">
                      Petit-Déjeuner
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0">
                    <Calendar className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-8">
          <Card className="bg-gold/5 border-gold/20 space-y-6 rounded-[40px] p-8">
            <div className="flex items-center gap-3">
              <TrendingUp className="text-gold h-6 w-6" />
              <h3 className="text-charcoal font-serif text-xl font-bold">
                Tarification Saisonnière
              </h3>
            </div>
            <p className="text-charcoal-500 text-xs leading-relaxed">
              La Fête de la Gaba à Ouidah approche (15-20 Août). L'IA recommande un boost de +25%
              sur vos tarifs.
            </p>
            <Button
              fullWidth
              className="bg-gold hover:bg-gold-600 h-14 rounded-2xl border-none font-bold text-white"
            >
              APPLIQUER LE BOOST
            </Button>
          </Card>

          <Card className="border-charcoal-100 space-y-6 rounded-[40px] p-8">
            <div className="flex items-center justify-between">
              <h3 className="text-charcoal font-serif text-xl font-bold">Personnel</h3>
              <Plus className="text-navy h-5 w-5 cursor-pointer" />
            </div>
            <div className="space-y-4">
              {[
                { name: 'Awa Diallo', role: 'Réceptionniste', status: 'ON_DUTY' },
                { name: 'Moussa Bakayoko', role: 'Entretien', status: 'OFF_DUTY' },
              ].map((staff, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-navy/10 text-navy flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold">
                      {staff.name[0]}
                    </div>
                    <div>
                      <p className="text-charcoal text-xs font-bold">{staff.name}</p>
                      <p className="text-charcoal-400 text-[10px]">{staff.role}</p>
                    </div>
                  </div>
                  <div
                    className={`h-2 w-2 rounded-full ${staff.status === 'ON_DUTY' ? 'bg-emerald' : 'bg-charcoal-300'}`}
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
