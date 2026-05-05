import { InteractiveMenu } from '@/components/ui/modern-mobile-menu';

export default function TestNavPage() {
  return (
    <div className="bg-navy flex min-h-screen items-center justify-center">
      <div className="space-y-8 text-center">
        <h1 className="font-serif text-3xl text-white">Demo Interactive Menu</h1>
        <InteractiveMenu />
      </div>
    </div>
  );
}
