'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { UserRole } from '@/types';
import {
  Sparkles,
  Briefcase,
  Code,
  Users2,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Lock,
  Mail,
  User as UserIcon,
} from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();

  // Form states
  const [selectedRole, setSelectedRole] = useState<UserRole>('FREELANCER');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [title, setTitle] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Call Register API
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          role: selectedRole,
          companyName: selectedRole === 'CLIENT' || selectedRole === 'BOTH' ? companyName : undefined,
          title: selectedRole === 'FREELANCER' || selectedRole === 'BOTH' ? title : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      // 2. Automatically sign in
      const signInRes = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (signInRes?.error) {
        // If signIn returned an error, redirect to login page
        router.push('/auth/login');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <div className="glass-panel p-8 rounded-3xl border border-surface-800 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/25">
            <Sparkles className="w-6 h-6 text-slate-950 font-black" />
          </div>
          <h1 className="text-2xl font-black text-white">Join Gigly Marketplace</h1>
          <p className="text-xs text-surface-400">
            Select your account type to get started with proposal-based hiring
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Role Selection Cards */}
          <div>
            <label className="block text-xs font-semibold text-surface-300 mb-2">
              How would you like to use Gigly?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Freelancer Card */}
              <button
                type="button"
                onClick={() => setSelectedRole('FREELANCER')}
                className={`p-4 rounded-2xl border text-left transition-all relative ${
                  selectedRole === 'FREELANCER'
                    ? 'bg-emerald-500/15 border-emerald-500 shadow-md shadow-emerald-500/15'
                    : 'bg-surface-900 border-surface-700/80 hover:border-surface-600'
                }`}
              >
                {selectedRole === 'FREELANCER' && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute top-3 right-3" />
                )}
                <Code className="w-5 h-5 text-emerald-400 mb-2" />
                <div className="font-bold text-xs text-white">I&apos;m a Freelancer</div>
                <div className="text-[11px] text-surface-400 mt-1 leading-snug">
                  Browse projects & submit custom bids
                </div>
              </button>

              {/* Client Card */}
              <button
                type="button"
                onClick={() => setSelectedRole('CLIENT')}
                className={`p-4 rounded-2xl border text-left transition-all relative ${
                  selectedRole === 'CLIENT'
                    ? 'bg-cyan-500/15 border-cyan-500 shadow-md shadow-cyan-500/15'
                    : 'bg-surface-900 border-surface-700/80 hover:border-surface-600'
                }`}
              >
                {selectedRole === 'CLIENT' && (
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 absolute top-3 right-3" />
                )}
                <Briefcase className="w-5 h-5 text-cyan-400 mb-2" />
                <div className="font-bold text-xs text-white">I&apos;m a Client</div>
                <div className="text-[11px] text-surface-400 mt-1 leading-snug">
                  Post requirements & hire top specialists
                </div>
              </button>

              {/* Both Card */}
              <button
                type="button"
                onClick={() => setSelectedRole('BOTH')}
                className={`p-4 rounded-2xl border text-left transition-all relative ${
                  selectedRole === 'BOTH'
                    ? 'bg-amber-500/15 border-amber-500 shadow-md shadow-amber-500/15'
                    : 'bg-surface-900 border-surface-700/80 hover:border-surface-600'
                }`}
              >
                {selectedRole === 'BOTH' && (
                  <CheckCircle2 className="w-4 h-4 text-amber-400 absolute top-3 right-3" />
                )}
                <Users2 className="w-5 h-5 text-amber-400 mb-2" />
                <div className="font-bold text-xs text-white">I Want Both</div>
                <div className="text-[11px] text-surface-400 mt-1 leading-snug">
                  Switch roles instantly on one account
                </div>
              </button>
            </div>
          </div>

          {/* Form Inputs */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-surface-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-surface-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface-900 text-white rounded-xl pl-10 pr-4 py-2.5 border border-surface-700 text-xs focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-surface-300 mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-surface-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-900 text-white rounded-xl pl-10 pr-4 py-2.5 border border-surface-700 text-xs focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-surface-300 mb-1.5">
                Password (min. 6 characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-surface-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-900 text-white rounded-xl pl-10 pr-4 py-2.5 border border-surface-700 text-xs focus:outline-none focus:border-emerald-500"
                  minLength={6}
                  required
                />
              </div>
            </div>

            {/* Role-Specific Fields */}
            {(selectedRole === 'CLIENT' || selectedRole === 'BOTH') && (
              <div>
                <label className="block text-xs font-semibold text-surface-300 mb-1.5">
                  Company / Organization Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acme Corp or Self"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-surface-900 text-white rounded-xl px-4 py-2.5 border border-surface-700 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}

            {(selectedRole === 'FREELANCER' || selectedRole === 'BOTH') && (
              <div>
                <label className="block text-xs font-semibold text-surface-300 mb-1.5">
                  Professional Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Senior Next.js & TypeScript Architect"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-surface-900 text-white rounded-xl px-4 py-2.5 border border-surface-700 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold py-3 rounded-xl text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 hover:scale-[1.01] transition-all disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Create Gigly Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-surface-400 pt-2 border-t border-surface-800">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-emerald-400 font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
