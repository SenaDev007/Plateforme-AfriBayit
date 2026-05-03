'use client';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import {
  Compass,
  Map as MapIcon,
  UploadCloud,
  CheckCircle2,
  Zap,
  Maximize,
  Drone,
  Activity,
  Layers,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { Card, Badge, Button, Loader2 } from '@afribayit/ui';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { cn } from '@afribayit/ui/src/lib/cn';

export default function GeoTrustDashboard() {
  const { data: session } = useSession();
  const token = (session?.accessToken as string | undefined) ?? null;
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/geotrust/me/assignments`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAssignments(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-navy mb-2 text-[10px] font-bold uppercase tracking-[0.3em]">
              Expertise Géospatiale
            </p>
            <h1 className="text-charcoal font-serif text-3xl font-bold md:text-5xl">
              Portail GéoTrust
            </h1>
          </div>
          <div className="bg-navy flex items-center gap-4 rounded-2xl p-4 text-white shadow-xl">
            <Activity className="text-gold h-8 w-8 animate-pulse" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                Drone Status
              </p>
              <p className="text-sm font-bold">Prêt pour capture</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="border-charcoal-100 bg-white p-6">
            <div className="flex items-center gap-4">
              <div className="bg-navy/5 text-navy flex h-12 w-12 items-center justify-center rounded-xl">
                <Compass className="h-6 w-6" />
              </div>
              <div>
                <p className="text-charcoal font-serif text-2xl font-bold">{assignments.length}</p>
                <p className="text-charcoal-400 text-[10px] font-bold uppercase tracking-widest">
                  Missions Assignées
                </p>
              </div>
            </div>
          </Card>
          <Card className="border-charcoal-100 bg-white p-6">
            <div className="flex items-center gap-4">
              <div className="bg-gold/10 text-gold flex h-12 w-12 items-center justify-center rounded-xl">
                <Layers className="h-6 w-6" />
              </div>
              <div>
                <p className="text-charcoal font-serif text-2xl font-bold">85%</p>
                <p className="text-charcoal-400 text-[10px] font-bold uppercase tracking-widest">
                  Précision Moyenne
                </p>
              </div>
            </div>
          </Card>
          <Card className="border-charcoal-100 bg-white p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-charcoal font-serif text-2xl font-bold">12</p>
                <p className="text-charcoal-400 text-[10px] font-bold uppercase tracking-widest">
                  Certificats Délivrés
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Missions List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-charcoal font-serif text-2xl font-bold">Missions de Terrain</h2>
            <Button
              variant="outline"
              className="h-10 rounded-xl px-6 text-[10px] font-bold uppercase tracking-widest"
            >
              RAPPORT GLOBAL
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="text-navy h-10 w-10 animate-spin" />
            </div>
          ) : assignments.length > 0 ? (
            <div className="grid gap-6">
              {assignments.map((mission) => (
                <motion.div
                  key={mission.id}
                  className="border-charcoal-100 overflow-hidden rounded-[32px] border bg-white transition-all duration-500 hover:shadow-xl"
                >
                  <div className="flex flex-col items-center gap-10 p-8 lg:flex-row">
                    <div className="bg-charcoal-50 text-charcoal-300 border-charcoal-100 hover:border-navy hover:text-navy group flex h-40 w-40 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed transition-all">
                      <UploadCloud className="mb-2 h-8 w-8 transition-transform group-hover:-translate-y-1" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">
                        Upload Map
                      </span>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-3">
                        <Badge variant="sky">GEO-PENDING</Badge>
                        <span className="text-charcoal-400 text-xs font-bold uppercase tracking-widest">
                          Ref: {mission.property.id.slice(0, 8)}
                        </span>
                      </div>
                      <h3 className="text-charcoal font-serif text-2xl font-bold">
                        {mission.property.title}
                      </h3>
                      <div className="flex flex-wrap gap-4">
                        <div className="text-charcoal-400 flex items-center gap-2">
                          <MapIcon className="h-4 w-4" />
                          <span className="text-xs font-medium">
                            {mission.property.city}, {mission.property.country}
                          </span>
                        </div>
                        <div className="text-charcoal-400 flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span className="text-xs font-medium">
                            Proprio: {mission.property.owner.firstName}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex w-full flex-col gap-3 lg:w-auto">
                      <Button className="bg-navy flex h-14 items-center justify-center gap-2 rounded-2xl px-8 text-xs font-bold uppercase tracking-widest">
                        <Maximize className="h-4 w-4" />
                        VOIR SUR LE PLAN
                      </Button>
                      <Button
                        variant="outline"
                        className="h-12 rounded-2xl px-8 text-[10px] font-bold uppercase tracking-widest"
                      >
                        CONTACTER PROPRIO
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-charcoal-50/50 border-charcoal-200 rounded-[40px] border-2 border-dashed p-20 text-center">
              <div className="text-charcoal-200 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-sm">
                <Compass className="h-10 w-10" />
              </div>
              <h3 className="text-charcoal font-serif text-2xl font-bold">
                Aucune mission pour le moment
              </h3>
              <p className="text-charcoal-400 mx-auto max-w-sm text-sm">
                Toutes les propriétés de votre zone ont été vérifiées ou aucune nouvelle demande n'a
                été faite.
              </p>
            </div>
          )}
        </div>

        {/* Warning card for legal compliance */}
        <div className="flex items-start gap-6 rounded-[32px] border border-amber-100 bg-amber-50 p-8">
          <AlertTriangle className="h-8 w-8 shrink-0 text-amber-600" />
          <div>
            <h4 className="mb-1 text-xs font-bold uppercase tracking-widest text-amber-900">
              Avertissement Légal
            </h4>
            <p className="text-sm leading-relaxed text-amber-800">
              Toute vérification GeoTrust doit être effectuée par un géomètre expert agréé. Les
              données transmises sont ancrées sur la blockchain Polygon et feront foi lors du
              passage devant notaire. Toute fausse déclaration engage votre responsabilité
              professionnelle.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// Icon Drone mock if not imported
function Drone(props: any) {
  return (
    <svg
      {...props}
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
      <path d="m2 2 8 8" />
      <path d="m22 2-8 8" />
      <path d="m2 22 8-8" />
      <path d="m22 22-8-8" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v4" />
      <path d="M12 18v4" />
      <path d="M2 12h4" />
      <path d="M18 12h4" />
    </svg>
  );
}
