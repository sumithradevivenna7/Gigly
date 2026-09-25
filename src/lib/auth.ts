import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { findUserByEmail, addUser } from '@/lib/user-store';
import { DEMO_USERS } from '@/lib/mock-data';
import { UserRole, ActiveRole } from '@/types';

// Ensure NEXTAUTH_SECRET always exists
const secret =
  process.env.NEXTAUTH_SECRET ||
  process.env.SECRET ||
  'gigly_super_secure_jwt_secret_key_32_chars_long!';

if (!process.env.NEXTAUTH_SECRET) {
  process.env.NEXTAUTH_SECRET = secret;
}



export const authOptions: NextAuthOptions = {
  secret,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'user@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter both email and password.');
        }

        const email = credentials.email.toLowerCase().trim();
        const password = credentials.password;

        // 1. Try checking PostgreSQL via Prisma
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email },
          });

          if (dbUser && dbUser.passwordHash) {
            const isValid = await bcrypt.compare(password, dbUser.passwordHash);
            if (isValid) {
              return {
                id: dbUser.id,
                email: dbUser.email,
                name: dbUser.name,
                image: dbUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(dbUser.name)}`,
                role: dbUser.role as UserRole,
                activeRole: dbUser.activeRole as ActiveRole,
              };
            }
          }
        } catch {
          // If database is not configured or offline, continue seamlessly to local store
        }

        // 2. Check registered in-memory store
        const storedUser = findUserByEmail(email);
        if (storedUser) {
          // Compare password with stored hash
          let isMatch = false;
          if (storedUser.passwordHash) {
            isMatch = await bcrypt.compare(password, storedUser.passwordHash).catch(() => false);
          }
          // Also allow 'password123' for demo test convenience
          if (!isMatch && password === 'password123') {
            isMatch = true;
          }

          if (isMatch) {
            return {
              id: storedUser.id,
              email: storedUser.email,
              name: storedUser.name,
              image: storedUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(storedUser.name)}`,
              role: storedUser.role,
              activeRole: storedUser.activeRole,
            };
          }
        }

        // 3. Check DEMO_USERS static list
        const demoUser = DEMO_USERS.find((u) => u.email.toLowerCase() === email);
        if (demoUser) {
          return {
            id: demoUser.id,
            email: demoUser.email,
            name: demoUser.name,
            image: demoUser.avatar,
            role: demoUser.role,
            activeRole: demoUser.activeRole,
          };
        }

        throw new Error('Invalid email or password. Please try again or use a demo account.');
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
        if (session.name) {
          token.name = session.name;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as unknown as { id: string }).id = token.id as string;
        (session.user as unknown as { role: UserRole }).role = token.role as UserRole;
        (session.user as unknown as { activeRole: ActiveRole }).activeRole = token.activeRole as ActiveRole;
        session.user.image = (token.picture as string) || session.user.image;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
};
