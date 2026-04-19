import type { Config } from 'tailwindcss';
import baseConfig from '@afribayit/config/tailwind/base';

const config: Config = {
  ...baseConfig,
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  plugins: [],
};

export default config;
