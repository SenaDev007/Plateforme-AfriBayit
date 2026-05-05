'use client';

import { motion, type Variants } from 'framer-motion';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { SearchBar } from '@afribayit/ui'; // Import from the UI package

type Point = {
  x: number;
  y: number;
};

interface WaveConfig {
  offset: number;
  amplitude: number;
  frequency: number;
  color: string;
  opacity: number;
}

const heroStats: { label: string; value: string }[] = [
  { label: 'Biens vérifiés', value: '4,200+' },
  { label: 'Transactions', value: '2,800+' },
  { label: 'Satisfaction', value: '98%' },
];

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, staggerChildren: 0.12 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const statsVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: 'easeOut', staggerChildren: 0.08 },
  },
};

export function GlowyWavesHero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<Point>({ x: 0, y: 0 });
  const targetMouseRef = useRef<Point>({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let animationId: number;
    let time = 0;

    // Hardcoded AfriBayit theme colors for optimal performance
    const themeColors = {
      backgroundTop: 'rgba(0, 48, 135, 0.85)', // Navy with opacity
      backgroundBottom: 'rgba(0, 48, 135, 0.95)', // Navy darker
      wavePalette: [
        {
          offset: 0,
          amplitude: 70,
          frequency: 0.003,
          color: 'rgba(212, 175, 55, 0.8)', // Gold
          opacity: 0.45,
        },
        {
          offset: Math.PI / 2,
          amplitude: 90,
          frequency: 0.0026,
          color: 'rgba(255, 255, 255, 0.5)', // White
          opacity: 0.35,
        },
        {
          offset: Math.PI,
          amplitude: 60,
          frequency: 0.0034,
          color: 'rgba(212, 175, 55, 0.6)', // Gold
          opacity: 0.3,
        },
        {
          offset: Math.PI * 1.5,
          amplitude: 80,
          frequency: 0.0022,
          color: 'rgba(255, 255, 255, 0.3)', // White
          opacity: 0.25,
        },
        {
          offset: Math.PI * 2,
          amplitude: 55,
          frequency: 0.004,
          color: 'rgba(212, 175, 55, 0.4)', // Gold
          opacity: 0.2,
        },
      ] satisfies WaveConfig[],
    };

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const mouseInfluence = prefersReducedMotion ? 10 : 70;
    const influenceRadius = prefersReducedMotion ? 160 : 320;
    const smoothing = prefersReducedMotion ? 0.04 : 0.1;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const recenterMouse = () => {
      const centerPoint = { x: canvas.width / 2, y: canvas.height / 2 };
      mouseRef.current = centerPoint;
      targetMouseRef.current = centerPoint;
    };

    const handleResize = () => {
      resizeCanvas();
      recenterMouse();
    };

    const handleMouseMove = (event: MouseEvent) => {
      targetMouseRef.current = { x: event.clientX, y: event.clientY };
    };

    const handleMouseLeave = () => {
      recenterMouse();
    };

    resizeCanvas();
    recenterMouse();

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const drawWave = (wave: WaveConfig) => {
      ctx.save();
      ctx.beginPath();

      for (let x = 0; x <= canvas.width; x += 4) {
        const dx = x - mouseRef.current.x;
        const dy = canvas.height / 2 - mouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - distance / influenceRadius);
        const mouseEffect =
          influence * mouseInfluence * Math.sin(time * 0.001 + x * 0.01 + wave.offset);

        const y =
          canvas.height / 2 +
          Math.sin(x * wave.frequency + time * 0.002 + wave.offset) * wave.amplitude +
          Math.sin(x * wave.frequency * 0.4 + time * 0.003) * (wave.amplitude * 0.45) +
          mouseEffect;

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.lineWidth = 2.5;
      ctx.strokeStyle = wave.color;
      ctx.globalAlpha = wave.opacity;
      ctx.shadowBlur = 35;
      ctx.shadowColor = wave.color;
      ctx.stroke();

      ctx.restore();
    };

    const animate = () => {
      time += 1;

      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * smoothing;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * smoothing;

      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, themeColors.backgroundTop);
      gradient.addColorStop(1, themeColors.backgroundBottom);

      // We clear the canvas so the CSS background image shows through where alpha < 1
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw gradient overlay
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      themeColors.wavePalette.forEach(drawWave);

      animationId = window.requestAnimationFrame(animate);
    };

    animationId = window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <section
      className="relative isolate flex min-h-[100svh] w-full items-center justify-center overflow-hidden pt-20"
      role="region"
      aria-label="Hero Section AfriBayit"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000&auto=format&fit=crop')",
        }}
      />

      {/* Canvas Overlay for Waves and Darkening */}
      <canvas ref={canvasRef} className="absolute inset-0 -z-10 h-full w-full" aria-hidden="true" />

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-gold/10 absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-[360px] w-[360px] rounded-full bg-white/5 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-4 py-12 text-center sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex w-full flex-col items-center"
        >
          <motion.div
            variants={itemVariants}
            className="text-gold mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-md"
          >
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            0% de fausses annonces. 100% vérifié.
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="mb-6 max-w-4xl font-serif text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-7xl lg:leading-[1.1]"
          >
            L'Afrique mérite un marché immobilier{' '}
            <span className="from-gold via-gold-400 bg-gradient-to-r to-white bg-clip-text italic text-transparent">
              digne de ce nom.
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mx-auto mb-12 max-w-2xl text-lg font-light leading-relaxed text-white/80 md:text-xl"
          >
            Achetez, louez et investissez en toute sécurité au Bénin, en Côte d'Ivoire, au Togo et
            au Sénégal avec la première plateforme escrow d'Afrique de l'Ouest.
          </motion.p>

          <motion.div variants={itemVariants} className="mb-16 w-full max-w-4xl">
            <SearchBar variant="hero" />
          </motion.div>

          <motion.div
            variants={statsVariants}
            className="bg-navy-900/40 grid w-full max-w-3xl gap-4 rounded-3xl border border-white/10 p-6 backdrop-blur-md sm:grid-cols-3"
          >
            {heroStats.map((stat) => (
              <motion.div key={stat.label} variants={itemVariants} className="space-y-1">
                <div className="text-[10px] uppercase tracking-[0.2em] text-white/60">
                  {stat.label}
                </div>
                <div className="text-2xl font-bold text-white sm:text-3xl">{stat.value}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
