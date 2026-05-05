'use client';
import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export function CustomCursor() {
  const [isPointer, setIsPointer] = useState(false);

  const cursorX = useSpring(0, { damping: 20, stiffness: 250 });
  const cursorY = useSpring(0, { damping: 20, stiffness: 250 });

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);

      const target = e.target as HTMLElement;
      setIsPointer(window.getComputedStyle(target).cursor === 'pointer');
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="border-gold pointer-events-none fixed left-0 top-0 z-[9999] hidden h-8 w-8 rounded-full border mix-blend-difference lg:block"
      style={{
        x: cursorX,
        y: cursorY,
        scale: isPointer ? 1.5 : 1,
        backgroundColor: isPointer ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
      }}
      transition={{ type: 'spring', damping: 20, stiffness: 250 }}
    />
  );
}
