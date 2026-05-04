import type { Config } from 'tailwindcss';

/** AfriBayit design tokens — shared across all apps */
const config: Omit<Config, 'content'> = {
  theme: {
    extend: {
      colors: {
        // Brand palette
        navy: {
          DEFAULT: '#003087',
          50: '#e6edf7',
          100: '#ccdaef',
          200: '#99b5df',
          300: '#6690cf',
          400: '#336bbf',
          500: '#003087',
          600: '#00266c',
          700: '#001c51',
          800: '#001336',
          900: '#00091b',
          deep: '#001F5B',
        },
        gold: {
          DEFAULT: '#D4AF37',
          50: '#fdf8e7',
          100: '#fbf1cf',
          200: '#f7e39f',
          300: '#f3d56f',
          400: '#efc73f',
          500: '#D4AF37',
          600: '#aa8c2c',
          700: '#7f6921',
          800: '#554616',
          900: '#2a230b',
        },
        sky: {
          DEFAULT: '#009CDE',
          50: '#e6f5fc',
          100: '#ccebf9',
          200: '#99d7f3',
          300: '#66c3ed',
          400: '#33afe7',
          500: '#009CDE',
          600: '#007db2',
          700: '#005e85',
          800: '#003f59',
          900: '#001f2c',
        },
        emerald: {
          DEFAULT: '#00A651',
          50: '#e6f7ee',
          100: '#ccefdd',
          200: '#99dfbb',
          300: '#66cf99',
          400: '#33bf77',
          500: '#00A651',
          600: '#008541',
          700: '#006431',
          800: '#004221',
          900: '#002110',
        },
        danger: {
          DEFAULT: '#D93025',
          50: '#fce9e8',
          100: '#f9d3d1',
          200: '#f3a7a3',
          300: '#ed7b75',
          400: '#e74f47',
          500: '#D93025',
          600: '#ae261e',
          700: '#821c16',
          800: '#57130f',
          900: '#2b0907',
        },
        charcoal: {
          DEFAULT: '#2C2E2F',
          50: '#f5f5f5',
          100: '#ebebeb',
          200: '#d7d7d7',
          300: '#c3c3c3',
          400: '#afafaf',
          500: '#2C2E2F',
          600: '#232526',
          700: '#1a1b1c',
          800: '#111213',
          900: '#08080a',
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['DM Mono', 'Menlo', 'monospace'],
      },
      fontSize: {
        // Section 2.4 — Typographic Scale
        'hero-mobile': ['48px', { lineHeight: '1.05', fontWeight: '900' }],
        'hero-desktop': ['80px', { lineHeight: '1.05', fontWeight: '900' }],
        'section-mobile': ['32px', { lineHeight: '1.1', fontWeight: '700' }],
        'section-desktop': ['56px', { lineHeight: '1.1', fontWeight: '700' }],
        'card-mobile': ['16px', { lineHeight: '1.3', fontWeight: '700' }],
        'card-desktop': ['22px', { lineHeight: '1.3', fontWeight: '700' }],
        'body-mobile': ['14px', { lineHeight: '1.7', fontWeight: '400' }],
        'body-desktop': ['16px', { lineHeight: '1.7', fontWeight: '400' }],
        'caption-mobile': ['11px', { lineHeight: '1.4', fontWeight: '500' }],
        'caption-desktop': ['12px', { lineHeight: '1.4', fontWeight: '500' }],
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
        pill: '9999px',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 48, 135, 0.12)',
        'glass-lg': '0 16px 48px rgba(0, 48, 135, 0.18)',
        card: '0 4px 24px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 12px 40px rgba(0, 48, 135, 0.16)',
        gold: '0 4px 20px rgba(212, 175, 55, 0.3)',
      },
      animation: {
        // Section 2.8 — Durations & Easing
        'fade-up': 'fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards', // 500ms for cards/pages
        float: 'float 6s ease-in-out infinite',
        'float-delay': 'float 6s ease-in-out 2s infinite',
        shimmer: 'shimmer 2s linear infinite',
        'slide-up': 'slideUp 0.28s cubic-bezier(0.16,1,0.3,1) forwards', // 280ms for transitions
        'micro-interaction': 'micro 0.15s ease-out forwards', // 150ms
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(32px)' }, // 32px from spec
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(2deg)' }, // Rotation from spec
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' }, // 40px from spec
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        micro: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.02)' },
        },
      },
      translate: {
        'card-hover': '-6px',
      },
      screens: {
        xs: '375px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1440px',
      },
      backdropBlur: {
        glass: '20px',
      },
    },
  },
  plugins: [],
};

export default config;
