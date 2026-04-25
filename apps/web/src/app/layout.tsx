import type React from 'react';
import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://afribayit.com'),
  title: {
    template: '%s | AfriBayit',
    default: 'AfriBayit — Immobilier Pan-Africain',
  },
  description:
    "La super-app immobilière de l'Afrique de l'Ouest. Achetez, vendez, louez en toute confiance avec notre système d'escrow sécurisé.",
  keywords: ['immobilier', 'afrique', 'bénin', "côte d'ivoire", 'propriété', 'location', 'achat'],
  authors: [{ name: 'AfriBayit' }],
  creator: 'YEHI OR Tech',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'AfriBayit',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'AfriBayit',
    title: 'AfriBayit — Immobilier Pan-Africain',
    description: "Achetez, vendez et louez des propriétés en Afrique de l'Ouest en toute sécurité.",
    images: [{ url: '/og-image.svg', width: 1200, height: 630, alt: 'AfriBayit' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AfriBayit',
    description: "La super-app immobilière de l'Afrique de l'Ouest",
    images: ['/og-image.svg'],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#003087',
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): Promise<React.ReactElement> {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#2C2E2F',
                color: '#fff',
                borderRadius: '8px',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#00A651', secondary: '#fff' } },
              error: { iconTheme: { primary: '#D93025', secondary: '#fff' } },
            }}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
