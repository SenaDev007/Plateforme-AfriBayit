'use client';
import type React from 'react';
import type { Route } from 'next';
import Link from 'next/link';
import { ArrowRight, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { PropertyCard } from '@afribayit/ui';
import type { PropertyCardData } from '@afribayit/ui';
import { useEffect, useState, useRef } from 'react';

interface ApiProperty {
  id: string;
  slug: string;
  title: string;
  city: string;
  country: string;
  price: unknown;
  currency: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  surface?: number | null;
  purpose: string;
  type: string;
  isVerified: boolean;
  isFeatured: boolean;
  images?: Array<{ url: string; isPrimary?: boolean }>;
}

function toCardData(p: ApiProperty): PropertyCardData {
  const primaryImage = p.images?.find((img) => img.isPrimary) ?? p.images?.[0];
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    city: p.city,
    country: p.country,
    price: Number(p.price),
    currency: p.currency,
    ...(p.bedrooms ? { bedrooms: p.bedrooms } : {}),
    ...(p.bathrooms ? { bathrooms: p.bathrooms } : {}),
    ...(p.surface ? { surface: p.surface } : {}),
    purpose: p.purpose as PropertyCardData['purpose'],
    type: p.type,
    ...(primaryImage?.url
      ? { imageUrl: primaryImage.url }
      : { imageUrl: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=800' }),
    isVerified: p.isVerified,
    isFeatured: p.isFeatured,
  };
}

export function RecentListings(): React.ReactElement | null {
  const [listings, setListings] = useState<PropertyCardData[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const apiUrl = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:4000';
        const res = await fetch(`${apiUrl}/api/v1/properties?limit=8`);
        if (res.ok) {
          const data = (await res.json()) as { data: ApiProperty[]; total: number };
          setListings((data.data ?? []).map(toCardData));
        } else {
          // Fallback data for demo if API fails
          setListings([
            {
              id: '1',
              slug: 'villa-moderne-cotonou',
              title: 'Villa Contemporaine Fidjrossè',
              city: 'Cotonou',
              country: 'Bénin',
              price: 125000000,
              currency: 'XOF',
              bedrooms: 5,
              bathrooms: 4,
              surface: 450,
              purpose: 'SALE',
              type: 'VILLA',
              imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800',
              isVerified: true,
              isFeatured: true,
            },
            {
              id: '2',
              slug: 'appartement-luxe-abidjan',
              title: 'Appartement Haut Standing Cocody',
              city: 'Abidjan',
              country: 'CI',
              price: 1500000,
              currency: 'XOF',
              bedrooms: 3,
              bathrooms: 3,
              surface: 180,
              purpose: 'RENT',
              type: 'APARTMENT',
              imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800',
              isVerified: true,
            },
            {
              id: '3',
              slug: 'terrain-bord-mer',
              title: 'Terrain Exceptionnel Bord de Mer',
              city: 'Grand-Popo',
              country: 'Bénin',
              price: 45000000,
              currency: 'XOF',
              surface: 1000,
              purpose: 'SALE',
              type: 'LAND',
              imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800',
              isVerified: true,
            },
            {
              id: '4',
              slug: 'residence-ouaga',
              title: 'Résidence de Prestige Ouaga 2000',
              city: 'Ouagadougou',
              country: 'Burkina',
              price: 250000000,
              currency: 'XOF',
              bedrooms: 6,
              bathrooms: 5,
              surface: 600,
              purpose: 'SALE',
              type: 'VILLA',
              imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6199f7a096?q=80&w=800',
              isVerified: true,
              isFeatured: true,
            },
          ]);
        }
      } catch {
        // Fallback already handled
      }
    }
    fetchData();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (listings.length === 0) return null;

  return (
    <section aria-labelledby="recent-listings-title" className="overflow-hidden bg-white py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 flex items-end justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-gold mb-3 text-sm font-bold uppercase tracking-[0.2em]">
              Sélection Exclusive
            </p>
            <h2
              id="recent-listings-title"
              className="text-charcoal font-serif text-4xl font-bold leading-tight sm:text-5xl"
            >
              Propriétés <span className="text-navy italic">d'exception</span>
            </h2>
          </motion.div>

          <div className="flex items-center gap-4">
            {/* Navigation Buttons */}
            <div className="hidden items-center gap-2 sm:flex">
              <button
                onClick={() => scroll('left')}
                className="border-charcoal-100 hover:bg-navy hover:border-navy rounded-full border p-3 transition-all duration-300 hover:text-white"
                aria-label="Précédent"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="border-charcoal-100 hover:bg-navy hover:border-navy rounded-full border p-3 transition-all duration-300 hover:text-white"
                aria-label="Suivant"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <Link
              href="/recherche"
              className="text-navy hover:text-navy-600 bg-navy/5 group hidden items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all duration-300 sm:flex"
            >
              Voir tout
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>

        {/* Horizontal Scroll Container */}
        <div
          ref={scrollRef}
          className="scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-8 overflow-x-auto px-4 pb-12 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {listings.map((property) => (
            <div key={property.id} className="min-w-[300px] snap-start sm:min-w-[400px]">
              <Link href={`/proprietes/${property.slug}` as Route} className="block">
                <PropertyCard property={property} />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center sm:hidden">
          <Link
            href="/recherche"
            className="bg-navy hover:bg-navy-600 inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-bold text-white shadow-lg transition-all"
          >
            Explorer tout le catalogue
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
