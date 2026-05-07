import { z } from 'zod';

const serverSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url().optional(),
  NEXT_PUBLIC_API_URL: z.string().url(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  FACEBOOK_CLIENT_ID: z.string().optional(),
  FACEBOOK_CLIENT_SECRET: z.string().optional(),
});

const clientSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_MAPBOX_TOKEN: z.string().optional(),
});

function createEnv() {
  const isProd = process.env.NODE_ENV === 'production';
  const isBuild = !!process.env.VERCEL || !!process.env.CI;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  if (isProd && apiUrl.includes('localhost') && !isBuild) {
    console.warn(
      '⚠️ WARNING: Running in production mode but NEXT_PUBLIC_API_URL is defaulting to localhost. ' +
        'API calls will likely fail.',
    );
  }

  const parsed = serverSchema.safeParse(process.env);

  // Throw only if we are in production AND NOT in the build phase
  if (!parsed.success && isProd && !isBuild) {
    console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
    throw new Error('Invalid environment variables');
  }

  return {
    ...(parsed.success ? parsed.data : ({} as any)),
    NEXT_PUBLIC_API_URL: apiUrl,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
    NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? '',
    // Provide a dummy secret during build if missing
    NEXTAUTH_SECRET:
      process.env.NEXTAUTH_SECRET || 'build_placeholder_secret_min_32_characters_long',
  };
}

export const env = createEnv();
