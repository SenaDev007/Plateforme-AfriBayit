import BottomNavBar from '@/components/ui/bottom-nav-bar';

export default function TestNavPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="space-y-4 text-center">
        <h1 className="text-navy text-2xl font-bold">Démo de la Barre de Navigation Mobile</h1>
        <p className="mx-auto max-w-md text-slate-500">
          Voici le nouveau composant premium pour la navigation mobile AfriBayit. Redimensionnez
          votre navigateur pour simuler un écran mobile.
        </p>
      </div>
      <BottomNavBar stickyBottom={true} />
    </div>
  );
}
