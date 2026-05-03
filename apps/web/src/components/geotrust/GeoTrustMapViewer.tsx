'use client';
import React, { useState, useMemo } from 'react';
import Map, { Source, Layer, NavigationControl, FullscreenControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Badge } from '@afribayit/ui';
import { Maximize2, ShieldCheck, Info } from 'lucide-react';

interface GeoTrustMapViewerProps {
  orthophotoUrl?: string;
  polygonData?: any; // GeoJSON
  latitude?: number;
  longitude?: number;
  zoom?: number;
  title?: string;
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

export default function GeoTrustMapViewer({
  orthophotoUrl,
  polygonData,
  latitude = 6.366, // Cotonou default
  longitude = 2.418,
  zoom = 16,
  title,
}: GeoTrustMapViewerProps) {
  const [viewState, setViewState] = useState({
    latitude,
    longitude,
    zoom,
  });

  // Layer Styles
  const polygonLayer: any = {
    id: 'property-boundary',
    type: 'fill',
    paint: {
      'fill-color': '#D4AF37',
      'fill-opacity': 0.2,
      'fill-outline-color': '#D4AF37',
    },
  };

  const lineLayer: any = {
    id: 'boundary-line',
    type: 'line',
    paint: {
      'line-color': '#D4AF37',
      'line-width': 3,
      'line-dasharray': [2, 1],
    },
  };

  return (
    <div className="border-charcoal-100 group relative h-[500px] w-full overflow-hidden rounded-[32px] border shadow-xl">
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/satellite-v9"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <NavigationControl position="top-right" />
        <FullscreenControl position="top-right" />

        {/* Boundary Polygon */}
        {polygonData && (
          <Source id="boundary-data" type="geojson" data={polygonData}>
            <Layer {...polygonLayer} />
            <Layer {...lineLayer} />
          </Source>
        )}

        {/* Orthophoto Overlay (Simulation via image source) */}
        {orthophotoUrl && (
          <Source
            id="drone-orthophoto"
            type="image"
            url={orthophotoUrl}
            coordinates={[
              [longitude - 0.001, latitude + 0.001],
              [longitude + 0.001, latitude + 0.001],
              [longitude + 0.001, latitude - 0.001],
              [longitude - 0.001, latitude - 0.001],
            ]}
          >
            <Layer id="drone-layer" type="raster" paint={{ 'raster-opacity': 0.8 }} />
          </Source>
        )}
      </Map>

      {/* Floating UI Overlays */}
      <div className="pointer-events-none absolute left-6 top-6 flex flex-col gap-3">
        <Badge
          variant="gold"
          className="bg-gold/80 text-navy pointer-events-auto flex items-center gap-2 rounded-xl px-4 py-2 font-bold backdrop-blur-md"
        >
          <ShieldCheck className="h-4 w-4" />
          GÉO-VÉRIFIÉ PAR DRONE
        </Badge>
        {title && (
          <div className="bg-charcoal/80 pointer-events-auto rounded-2xl border border-white/10 p-4 text-white backdrop-blur-md">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-white/50">
              PROPRIÉTÉ
            </p>
            <h3 className="text-sm font-bold">{title}</h3>
          </div>
        )}
      </div>

      <div className="pointer-events-none absolute bottom-6 left-6 right-6 flex items-center justify-between">
        <div className="border-charcoal-50 pointer-events-auto flex items-center gap-2 rounded-xl border bg-white/90 p-3 shadow-lg backdrop-blur-md">
          <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          <span className="text-charcoal text-[10px] font-bold uppercase tracking-widest">
            Coordonnées GPS Actives
          </span>
        </div>
        <button className="bg-navy pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full text-white shadow-2xl transition-transform hover:scale-110">
          <Maximize2 className="h-5 w-5" />
        </button>
      </div>

      {/* Warning if no token */}
      {!MAPBOX_TOKEN && (
        <div className="bg-charcoal/90 absolute inset-0 flex flex-col items-center justify-center p-10 text-center text-white">
          <Info className="text-gold mb-4 h-10 w-10" />
          <p className="font-bold">Configuration Mapbox Manquante</p>
          <p className="mt-2 text-xs text-white/50">
            Veuillez configurer NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN pour voir les données GeoTrust.
          </p>
        </div>
      )}
    </div>
  );
}
