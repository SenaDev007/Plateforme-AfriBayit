'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Map as MapIcon,
  Navigation,
  Layers,
  Maximize,
  FileCheck,
  Aperture as Drone,
  Box,
  ShieldCheck,
  AlertOctagon,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Card, Badge, Button, cn } from '@afribayit/ui';

const MISSIONS = [
  {
    id: 'GEO-7721',
    property: 'Terrain Cadjehoun - 850m²',
    service: 'Levé Topographique Complet',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    client: 'M. Koffi Mensah',
    deadline: '18 Août 2025',
  },
  {
    id: 'GEO-8842',
    property: 'Villa Cocody Riviéra',
    service: 'Drone Mapping & 3D',
    status: 'PENDING',
    priority: 'MEDIUM',
    client: 'Agence ImmoTrust',
    deadline: '20 Août 2025',
  },
];

export default function GeoTrustDashboard() {
  return (
    <div className="space-y-10 py-10">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="text-emerald mb-2 text-[10px] font-bold uppercase tracking-[0.3em]">
            Infrastructure Géospatiale — GeoTrust
          </p>
          <h1 className="text-charcoal font-serif text-4xl font-bold">Expertise Terrain</h1>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="rounded-full px-8">
            MES ÉQUIPEMENTS
          </Button>
          <Button className="bg-emerald rounded-full px-8">NOUVELLE MISSION</Button>
        </div>
      </div>

      {/* Stats Summary - Section 7C.10.2 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {[
          { label: 'Missions Validées', value: '128', icon: FileCheck, color: 'emerald' },
          { label: 'Surface Certifiée', value: '14.5 Ha', icon: Maximize, color: 'navy' },
          { label: 'Anomalies Détectées', value: '12', icon: AlertOctagon, color: 'gold' },
          { label: 'Score de Précision', value: '99.8%', icon: ShieldCheck, color: 'emerald' },
        ].map((stat, i) => (
          <Card
            key={i}
            className="border-charcoal-100 group rounded-[32px] bg-white p-6 transition-all hover:shadow-xl"
          >
            <div
              className={cn(
                'mb-4 flex h-12 w-12 items-center justify-center rounded-2xl transition-transform group-hover:rotate-6',
                stat.color === 'emerald'
                  ? 'bg-emerald/10 text-emerald'
                  : stat.color === 'navy'
                    ? 'bg-navy/5 text-navy'
                    : 'bg-gold/10 text-gold',
              )}
            >
              <stat.icon className="h-6 w-6" />
            </div>
            <p className="text-charcoal mb-1 text-2xl font-bold">{stat.value}</p>
            <p className="text-charcoal-400 text-[10px] font-bold uppercase tracking-widest">
              {stat.label}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Interactive Map Feed - Section 7C.7 */}
        <Card className="border-charcoal-100 space-y-6 rounded-[40px] p-8 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-charcoal font-serif text-2xl font-bold">
              Cartographie en Temps Réel
            </h3>
            <div className="flex gap-2">
              <Badge variant="outline" className="gap-1.5">
                <Layers className="h-3 w-3" /> CADASTRE
              </Badge>
              <Badge variant="outline" className="gap-1.5">
                <Drone className="h-3 w-3" /> DRONE
              </Badge>
            </div>
          </div>

          <div className="bg-charcoal-50 group relative aspect-video cursor-crosshair overflow-hidden rounded-[32px]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-charcoal-300 flex flex-col items-center gap-3">
                <MapIcon className="h-12 w-12 animate-pulse" />
                <p className="text-xs font-bold uppercase tracking-widest">
                  Initialisation de la stack Mapbox PostGIS...
                </p>
              </div>
            </div>
            {/* Mock Overlay UI */}
            <div className="absolute left-6 top-6 space-y-2">
              <div className="space-y-2 rounded-2xl border border-white bg-white/90 p-3 shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald h-2 w-2 animate-pulse rounded-full" />
                  <span className="text-charcoal text-[10px] font-bold">
                    GPS RTK CONNECTÉ (0.2cm precision)
                  </span>
                </div>
                <p className="text-charcoal-400 font-mono text-[9px] font-bold">
                  6.3676° N, 2.4253° E
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="bg-charcoal-50 border-charcoal-100 rounded-2xl border p-4">
              <p className="text-charcoal-400 mb-2 text-[10px] font-bold uppercase">
                Superficie Mesurée
              </p>
              <p className="text-navy text-xl font-bold">848.50 m²</p>
              <p className="text-emerald mt-1 text-[9px] font-bold">CONFORME (Ecart 0.17%)</p>
            </div>
            <div className="bg-charcoal-50 border-charcoal-100 rounded-2xl border p-4">
              <p className="text-charcoal-400 mb-2 text-[10px] font-bold uppercase">
                Points de Bornage
              </p>
              <p className="text-navy text-xl font-bold">12 Points</p>
              <p className="text-charcoal-400 mt-1 text-[9px] font-bold">4 BORNES POSÉES</p>
            </div>
            <div className="bg-charcoal-50 border-charcoal-100 rounded-2xl border p-4">
              <p className="text-charcoal-400 mb-2 text-[10px] font-bold uppercase">
                Risque Littoral
              </p>
              <p className="text-navy text-xl font-bold">Zone Verte</p>
              <p className="text-emerald mt-1 text-[9px] font-bold">STABILITÉ ÉLEVÉE</p>
            </div>
          </div>
        </Card>

        {/* Missions Feed - Section 7C.4.1 */}
        <div className="space-y-8">
          <Card className="border-charcoal-100 space-y-6 rounded-[40px] p-8">
            <h3 className="text-charcoal font-serif text-xl font-bold">Missions GeoTrust</h3>
            <div className="space-y-4">
              {MISSIONS.map((mission) => (
                <div
                  key={mission.id}
                  className="border-charcoal-50 hover:bg-charcoal-50/50 cursor-pointer rounded-3xl border p-5 transition-all"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <Badge variant={mission.priority === 'HIGH' ? 'danger' : 'gold'}>
                      {mission.priority}
                    </Badge>
                    <span className="text-charcoal-400 text-[10px] font-bold">{mission.id}</span>
                  </div>
                  <p className="text-charcoal mb-1 text-sm font-bold">{mission.property}</p>
                  <p className="text-navy mb-4 text-[10px] font-bold uppercase tracking-wider">
                    {mission.service}
                  </p>

                  <div className="border-charcoal-50 flex items-center justify-between border-t pt-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="text-charcoal-300 h-3 w-3" />
                      <span className="text-charcoal-400 text-[9px] font-bold">
                        {mission.deadline}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0">
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button
              fullWidth
              variant="outline"
              className="h-12 rounded-2xl text-xs font-bold uppercase"
            >
              VOIR TOUTES LES MISSIONS
            </Button>
          </Card>

          {/* Advanced Services - Section 7C.3 */}
          <Card className="bg-navy relative space-y-6 overflow-hidden rounded-[40px] p-8 text-white">
            <div className="bg-emerald/10 absolute bottom-0 right-0 h-32 w-32 translate-x-1/4 translate-y-1/4 rounded-full blur-3xl" />
            <div className="flex items-center gap-3">
              <Drone className="text-emerald h-6 w-6" />
              <h4 className="font-serif text-lg font-bold">Drone & 3D Engine</h4>
            </div>
            <p className="text-charcoal-300 text-xs leading-relaxed">
              Générez des orthophotoplans haute résolution et des modèles numériques de terrain
              (MNT) directement depuis le terrain.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-3">
                <Box className="text-emerald h-4 w-4" />
                <span className="text-[9px] font-bold">MODE 3D</span>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-3">
                <Navigation className="text-emerald h-4 w-4" />
                <span className="text-[9px] font-bold">BIM/CAD</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
