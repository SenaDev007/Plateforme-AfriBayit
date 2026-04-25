import type React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiteNavbar } from '@/components/landing/SiteNavbar';
import { PropertyDetail } from '@/components/property/PropertyDetail';

interface PropertyPageProps {
  params: Promise<{ slug: string }>;
}

interface ApiProperty {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: string;
  purpose: 'SALE' | 'RENT' | 'SHORT_TERM_RENT' | 'INVESTMENT';
  price: unknown;
  currency: string;
  surface?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  floor?: number | null;
  yearBuilt?: number | null;
  country: string;
  city: string;
  district?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  features?: unknown;
  isVerified: boolean;
  isFeatured: boolean;
  images: Array<{ url: string; alt?: string | null; isPrimary?: boolean }>;
  owner?: {
    id: string;
    firstName: string;
    lastName: string;
    reputationScore?: number;
    kycLevel?: string;
  } | null;
}

async function fetchProperty(slug: string): Promise<ApiProperty | null> {
  try {
    const apiUrl = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:4000';
    const res = await fetch(`${apiUrl}/api/v1/properties/${slug}`, { next: { revalidate: 120 } });
    if (!res.ok) return null;
    return (await res.json()) as ApiProperty;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await fetchProperty(slug);
  if (!property) return { title: 'Propriété introuvable' };
  return {
    title: property.title,
    description: property.description.substring(0, 160),
    openGraph: {
      title: property.title,
      description: property.description.substring(0, 160),
      images: [{ url: property.images[0]?.url ?? '' }],
    },
  };
}

export default async function PropertyPage({
  params,
}: PropertyPageProps): Promise<React.ReactElement> {
  const { slug } = await params;
  const property = await fetchProperty(slug);

  if (!property) notFound();

  const features = Array.isArray(property.features) ? (property.features as string[]) : [];

  const detailData = {
    id: property.id,
    slug: property.slug,
    title: property.title,
    description: property.description,
    type: property.type,
    purpose: property.purpose,
    price: Number(property.price),
    currency: property.currency,
    ...(property.surface != null ? { surface: property.surface } : {}),
    ...(property.bedrooms != null ? { bedrooms: property.bedrooms } : {}),
    ...(property.bathrooms != null ? { bathrooms: property.bathrooms } : {}),
    ...(property.floor != null ? { floor: property.floor } : {}),
    ...(property.yearBuilt != null ? { yearBuilt: property.yearBuilt } : {}),
    country: property.country,
    city: property.city,
    ...(property.district ? { district: property.district } : {}),
    ...(property.address ? { address: property.address } : {}),
    ...(property.latitude != null ? { latitude: property.latitude } : {}),
    ...(property.longitude != null ? { longitude: property.longitude } : {}),
    features,
    isVerified: property.isVerified,
    isFeatured: property.isFeatured,
    images: property.images.map((img) => ({
      url: img.url,
      alt: img.alt ?? property.title,
    })),
    agent: {
      name: property.owner ? `${property.owner.firstName} ${property.owner.lastName}` : 'AfriBayit',
      avatar: null,
      phone: '+229 97 00 00 00',
      email: 'contact@afribayit.com',
      rating: property.owner?.reputationScore ?? 0,
      reviewCount: 0,
      isVerified: property.owner?.kycLevel !== 'NONE',
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <SiteNavbar />
      <main id="main-content" className="pt-16">
        <PropertyDetail property={detailData} />
      </main>
    </div>
  );
}
