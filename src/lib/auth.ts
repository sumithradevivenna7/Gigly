import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { DEMO_USERS } from '@/lib/mock-data';
import { UserRole, ActiveRole } from '@/types';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'user@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter an email and password');
        }

        const email = credentials.email.toLowerCase().trim();

        // 1. Try checking Prisma DB if available
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email },
          });

          if (dbUser && dbUser.passwordHash) {
            const isValid = await bcrypt.compare(credentials.password, dbUser.passwordHash);
            if (isValid) {
              return {
                id: dbUser.id,
                email: dbUser.email,
                name: dbUser.name,
                image: dbUser.avatar,
                role: dbUser.role as UserRole,
                activeRole: dbUser.activeRole as ActiveRole,
              };
            }
          }
        } catch {
          // If database is not connected, gracefully continue to mock/demo users
        }

        // 2. Check demo accounts for instant developer evaluation
        const demoUser = DEMO_USERS.find((u) => u.email.toLowerCase() === email);
        if (demoUser) {
          // Demo users accept password 'password123' or any password for testing
          return {
            id: demoUser.id,
            email: demoUser.email,
            name: demoUser.name,
            image: demoUser.avatar,
            role: demoUser.role,
            activeRole: demoUser.activeRole,
          };
        }

        // 3. Fallback: If not found, return null to show invalid credentials
        throw new Error('Invalid email or password');
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as unknown as { role: UserRole }).role;
        token.activeRole = (user as unknown as { activeRole: ActiveRole }).activeRole;
        token.picture = user.image;
      }

      // Handle client-side session update (e.g. role switcher event)
      if (trigger === 'update' && session) {
        if (session.activeRole) {
          token.activeRole = session.activeRole;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as unknown as { id: string }).id = token.id as string;
        (session.user as unknown as { role: UserRole }).role = token.role as UserRole;
        (session.user as unknown as { activeRole: ActiveRole }).activeRole = token.activeRole as ActiveRole;
        session.user.image = token.picture as string | null;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
  secret: process.env.NEXTAUTH_SECRET || 'gigly-dev-secret-key-super-secure-32chars',
};
