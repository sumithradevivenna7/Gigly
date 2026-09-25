import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

// Force every page in this app to be server-rendered on demand.
// This prevents NextAuth from being called with an empty NEXTAUTH_URL
// during Vercel's static prerender phase.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Gigly — Proposal-Based Freelance Marketplace & Escrow Platform',
  description:
    'Connect with elite developers, designers, and tech talent. Post jobs, receive tailored proposals, and secure payments with Stripe Connect escrow.',
  keywords: [
    'freelance marketplace',
    'hire developers',
    'proposal based hiring',
    'escrow payments',
    'Next.js jobs',
    'Gigly',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-[#090d16] text-surface-100 antialiased selection:bg-emerald-500 selection:text-slate-950">
        <Providers>
          <Navbar />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
