'use client';
import type React from 'react';

import { useEffect, useRef, useState, useCallback } from 'react';
import { MapPin, ZoomIn, ZoomOut, Crosshair } from 'lucide-react';
import { cn } from '@afribayit/ui';

interface MapProperty {
  id: string;
  slug: string;
  title: string;
  price: number;
  currency: string;
  latitude: number;
  longitude: number;
  type: string;
  purpose: string;
}

interface MapViewProps {
  properties?: MapProperty[];
  center?: [number, number];
  zoom?: number;
  className?: string;
}

const MOCK_PROPERTIES: MapProperty[] = [
  { id: '1', slug: 'villa-prestige-cotonou', title: 'Villa Prestige', price: 85000000, currency: 'XOF', latitude: 6.3654, longitude: 2.4183, type: 'VILLA', purpose: 'SALE' },
  { id: '2', slug: 'appartement-t3-cotonou', title: 'Appartement T3', price: 280000, currency: 'XOF', latitude: 6.3702, longitude: 2.4298, type: 'APARTMENT', purpose: 'RENT' },
  { id: '3', slug: 'terrain-calavi', title: 'Terrain 500m²', price: 12000000, currency: 'XOF', latitude: 6.4101, longitude: 2.3457, type: 'LAND', purpose: 'SALE' },
  { id: '4', slug: 'duplex-fidjrosse', title: 'Duplex moderne', price: 45000000, currency: 'XOF', latitude: 6.3521, longitude: 2.3968, type: 'DUPLEX', purpose: 'SALE' },
  { id: '5', slug: 'studio-meuble-akpakpa', title: 'Studio meublé', price: 85000, currency: 'XOF', latitude: 6.3774, longitude: 2.4412, type: 'STUDIO', purpose: 'RENT' },
];

function formatPrice(amount: number, currency: string): string {
  if (currency === 'XOF') {
    if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M FCFA`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K FCFA`;
    return `${amount} FCFA`;
  }
  return `${amount}`;
}

const PURPOSE_COLORS: Record<string, string> = {
  SALE: 'bg-navy text-white',
  RENT: 'bg-sky text-white',
  SHORT_TERM_RENT: 'bg-emerald text-white',
  INVESTMENT: 'bg-gold text-charcoal',
};

export function MapView({ properties = MOCK_PROPERTIES, center = [6.3702, 2.3912], zoom: _zoom = 12, className }: MapViewProps): React.ReactElement {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapInstanceRef = useRef<unknown>(null);

  const selectedProperty = properties.find((p) => p.id === selectedId);

  const initMap = useCallback(async () => {
    if (!mapRef.current || mapInstanceRef.current) return;
    try {
      const mapboxgl = (await import('mapbox-gl')).default;
      await import('mapbox-gl/dist/mapbox-gl.css');

      const token = process.env['NEXT_PUBLIC_MAPBOX_TOKEN'];
      if (!token) { setMapLoaded(true); return; }

      mapboxgl.accessToken = token;
      const map = new mapboxgl.Map({
        container: mapRef.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [center[1], center[0]],
        zoom: 12,
      });

      map.addControl(new mapboxgl.NavigationControl(), 'top-right');
      map.addControl(new mapboxgl.GeolocateControl({ positionOptions: { enableHighAccuracy: true }, trackUserLocation: false }), 'top-right');

      map.on('load', () => {
        properties.forEach((prop) => {
          const el = document.createElement('div');
          el.className = 'cursor-pointer';
          el.innerHTML = `
            <div class="flex items-center gap-1 rounded-full px-2 py-1 shadow-lg border border-white text-xs font-bold whitespace-nowrap transition-transform hover:scale-110 ${PURPOSE_COLORS[prop.purpose] ?? 'bg-navy text-white'}">
              ${formatPrice(prop.price, prop.currency)}
            </div>
          `;
          el.addEventListener('click', () => setSelectedId(prop.id));

          new mapboxgl.Marker({ element: el })
            .setLngLat([prop.longitude, prop.latitude])
            .addTo(map);
        });
        setMapLoaded(true);
      });

      mapInstanceRef.current = map;
    } catch {
      setMapLoaded(true);
    }
  }, [center, properties]);

  useEffect(() => {
    void initMap();
    return () => {
      if (mapInstanceRef.current) {
        (mapInstanceRef.current as { remove: () => void }).remove();
        mapInstanceRef.current = null;
      }
    };
  }, [initMap]);

  return (
    <div className={cn('relative rounded-xl overflow-hidden border border-charcoal-100', className ?? 'h-[600px]')}>
      {/* Map container */}
      <div ref={mapRef} className="absolute inset-0" aria-label="Carte des propriétés" role="img" />

      {/* Fallback when Mapbox token is not configured */}
      {!process.env['NEXT_PUBLIC_MAPBOX_TOKEN'] && mapLoaded && (
        <div className="absolute inset-0 bg-charcoal-100 flex flex-col items-center justify-center gap-3">
          <MapPin className="h-10 w-10 text-charcoal-300" aria-hidden="true" />
          <p className="text-sm font-medium text-charcoal-400">Carte indisponible</p>
          <p className="text-xs text-charcoal-300">Configurez NEXT_PUBLIC_MAPBOX_TOKEN pour activer la carte</p>
        </div>
      )}

      {/* Loading */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-charcoal-100 flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-navy border-t-transparent animate-spin" aria-label="Chargement de la carte" />
        </div>
      )}

      {/* Property count badge */}
      {mapLoaded && (
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur rounded-lg px-3 py-1.5 text-xs font-medium text-charcoal shadow-sm">
          {properties.length} propriété{properties.length !== 1 ? 's' : ''} sur la carte
        </div>
      )}

      {/* Selected property popup */}
      {selectedProperty && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-72 bg-white rounded-xl shadow-xl border border-charcoal-100 overflow-hidden">
          <button
            onClick={() => setSelectedId(null)}
            className="absolute top-2 right-2 h-6 w-6 flex items-center justify-center rounded-full bg-charcoal-100 text-charcoal hover:bg-charcoal-200 text-xs"
            aria-label="Fermer"
          >✕</button>
          <div className="p-4">
            <div className={cn('inline-block rounded-full px-2 py-0.5 text-xs font-medium mb-2', PURPOSE_COLORS[selectedProperty.purpose] ?? 'bg-navy text-white')}>
              {selectedProperty.purpose === 'SALE' ? 'À vendre' : selectedProperty.purpose === 'RENT' ? 'À louer' : 'Court séjour'}
            </div>
            <p className="font-semibold text-charcoal leading-snug">{selectedProperty.title}</p>
            <p className="font-mono font-bold text-navy mt-1">{formatPrice(selectedProperty.price, selectedProperty.currency)}</p>
            <a
              href={`/proprietes/${selectedProperty.slug}`}
              className="mt-3 flex items-center justify-center gap-1.5 bg-navy text-white text-sm font-medium rounded-lg py-2 hover:bg-navy/90 transition-colors"
            >
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> Voir l'annonce
            </a>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 sm:bottom-4 sm:left-4 flex gap-2 flex-wrap">
        {selectedProperty ? null : (
          <>
            {[
              { color: 'bg-navy', label: 'Vente' },
              { color: 'bg-sky', label: 'Location' },
              { color: 'bg-emerald', label: 'Court séjour' },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1 bg-white/90 backdrop-blur rounded-full px-2 py-1 text-xs text-charcoal shadow-sm">
                <span className={cn('h-2 w-2 rounded-full', color)} aria-hidden="true" />
                {label}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
