'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@afribayit/ui';
import { cn } from '@afribayit/ui/src/lib/cn';
import { ShieldCheck, Smartphone, RefreshCw } from 'lucide-react';

interface OTPInputProps {
  length?: number;
  onComplete?: (code: string) => void;
}

export function OTPInput({ length = 6, onComplete }: OTPInputProps): React.ReactElement {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const [timer, setTimer] = useState(30);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [timer]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next
    if (element.value !== '' && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }

    if (newOtp.every((v) => v !== '') && onComplete) {
      onComplete(newOtp.join(''));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const resendCode = () => {
    setTimer(30);
    // Logic to resend code
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex gap-3">
        {otp.map((data, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            ref={(el) => {
              inputs.current[index] = el;
            }}
            value={data}
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              'h-16 w-12 rounded-xl border-2 bg-white/5 text-center text-2xl font-bold text-white outline-none transition-all',
              data
                ? 'border-gold shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                : 'border-white/10 focus:border-white/40',
            )}
          />
        ))}
      </div>

      <div className="flex flex-col items-center gap-4">
        {timer > 0 ? (
          <p className="text-xs font-medium uppercase tracking-widest text-white/40">
            Renvoyer le code dans <span className="text-gold font-bold">{timer}s</span>
          </p>
        ) : (
          <button
            onClick={resendCode}
            className="text-gold flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors hover:text-white"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Renvoyer le code
          </button>
        )}
      </div>
    </div>
  );
}
