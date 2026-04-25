import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';
import Facebook from 'next-auth/providers/facebook';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { api } from './api';

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  totpCode: z.string().optional(),
});

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env['GOOGLE_CLIENT_ID']!,
      clientSecret: process.env['GOOGLE_CLIENT_SECRET']!,
    }),
    Facebook({
      clientId: process.env['FACEBOOK_CLIENT_ID']!,
      clientSecret: process.env['FACEBOOK_CLIENT_SECRET']!,
    }),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
        totpCode: { label: 'Code 2FA', type: 'text' },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        try {
          const { email, password, totpCode } = parsed.data;
          const { data } = await api.auth.login({
            email,
            password,
            ...(totpCode !== undefined ? { totpCode } : {}),
          });
          const user = data.user as { id: string; email: string; firstName: string; role: string };
          return {
            id: user.id,
            email: user.email,
            name: user.firstName,
            role: user.role,
            accessToken: data.accessToken,
          };
        } catch {
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token['role'] = (user as { role?: string }).role;
        token['accessToken'] = (user as { accessToken?: string }).accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token['role'] as string;
        (session as { accessToken?: string }).accessToken = token['accessToken'] as string;
      }
      return session;
    },
  },

  pages: {
    signIn: '/connexion',
    error: '/connexion',
  },

  session: { strategy: 'jwt' },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nextAuth = NextAuth(authConfig) as any;
export const handlers = nextAuth.handlers as ReturnType<typeof NextAuth>['handlers'];
export const auth = nextAuth.auth as ReturnType<typeof NextAuth>['auth'];
export const signIn = nextAuth.signIn as ReturnType<typeof NextAuth>['signIn'];
export const signOut = nextAuth.signOut as ReturnType<typeof NextAuth>['signOut'];
