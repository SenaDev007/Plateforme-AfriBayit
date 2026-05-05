'use client';

import React from 'react';
import { BookOpen, Clock, Award, ArrowRight } from 'lucide-react';

const COURSES = [
  {
    title: 'Comprendre le marché immobilier au Bénin',
    duration: '4h',
    type: 'Gratuit',
    icon: BookOpen,
  },
  {
    title: "Investir dans l'immobilier africain sans se tromper",
    duration: '12h',
    type: 'Certifiante',
    icon: Award,
  },
  {
    title: 'Gérer une location longue durée : droits, contrats, litiges',
    duration: '6h',
    type: 'Certifiante',
    icon: Clock,
  },
];

export function AcademySection() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-16 flex flex-col justify-between gap-12 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <h2 className="text-navy mb-6 font-serif text-3xl font-bold tracking-tight sm:text-5xl lg:leading-tight">
              L'immobilier africain s'apprend. <br />
              <span className="text-gold italic">Nous vous l'enseignons.</span>
            </h2>
            <p className="text-charcoal-600 text-lg leading-relaxed">
              Droit foncier. Gestion locative. Calcul de rendement. Négociation.{' '}
              <br className="hidden sm:block" />
              Des formations courtes, certifiantes, pensées pour le contexte africain.
            </p>
          </div>
          <div className="shrink-0">
            <a
              href="/academie"
              className="border-charcoal-200 text-navy hover:border-gold hover:text-gold inline-flex items-center gap-2 rounded-full border bg-white px-6 py-3 text-sm font-bold shadow-sm transition-all"
            >
              Voir toutes les formations
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {COURSES.map((course) => (
            <div
              key={course.title}
              className="border-charcoal-100 bg-charcoal-50 hover:bg-navy group flex flex-col justify-between rounded-3xl border p-8 transition-all hover:shadow-xl"
            >
              <div>
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm group-hover:bg-white/10">
                    <course.icon className="text-gold h-6 w-6" />
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
                      course.type === 'Gratuit'
                        ? 'bg-green-100 text-green-800 group-hover:bg-green-500/20 group-hover:text-green-300'
                        : 'bg-gold/10 text-gold group-hover:bg-gold/20'
                    }`}
                  >
                    {course.type}
                  </span>
                </div>
                <h3 className="text-navy mb-6 text-xl font-bold group-hover:text-white">
                  {course.title}
                </h3>
              </div>
              <div className="text-charcoal-500 flex items-center gap-2 text-sm font-medium group-hover:text-white/60">
                <Clock className="h-4 w-4" />
                {course.duration} de formation
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
