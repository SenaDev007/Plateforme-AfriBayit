import Link from 'next/link';
import { Button } from '@afribayit/ui';

export default function NotFound(): React.ReactElement {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-hero text-white p-4">
      <div className="text-center">
        <p className="font-mono text-8xl font-bold text-gold mb-4">404</p>
        <h1 className="font-serif text-3xl font-bold mb-2">Page introuvable</h1>
        <p className="text-white/60 max-w-sm">
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
      </div>
      <div className="flex gap-3">
        <Link href="/">
          <Button variant="gold">Retour à l'accueil</Button>
        </Link>
        <Link href="/recherche">
          <Button variant="ghost">Voir les annonces</Button>
        </Link>
      </div>
    </div>
  );
}
