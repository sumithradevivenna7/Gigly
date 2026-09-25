'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Sparkles, ArrowRight, Loader2, Lock, Mail, UserCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError(res.error);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoEmail: string) => {
    setLoading(true);
    setError('');
    setEmail(demoEmail);
    setPassword('password123');

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: demoEmail,
        password: 'password123',
      });

      if (res?.error) {
        setError(res.error);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch {
      setError('Failed demo login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="glass-panel p-8 rounded-3xl border border-surface-800 shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/25">
            <Sparkles className="w-6 h-6 text-slate-950 font-black" />
          </div>
          <h1 className="text-2xl font-black text-white">Welcome back to Gigly</h1>
          <p className="text-xs text-surface-400">
            Sign in to access your jobs, proposals, and escrow contracts
          </p>
        </div>

        {/* Demo Fast Login Pills */}
        <div className="p-3.5 rounded-2xl bg-surface-900/80 border border-surface-800 space-y-2">
          <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5" />
            Quick Demo Accounts (1-Click Sign In):
          </span>
          <div className="grid grid-cols-1 gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('client@gigly.com')}
              className="text-left px-3 py-1.5 rounded-lg bg-surface-800/80 hover:bg-surface-800 text-xs text-surface-200 hover:text-white flex items-center justify-between border border-surface-700/50"
            >
              <span>Sarah Jenkins (Client)</span>
              <span className="text-[10px] text-cyan-400 font-medium">Post & Hire</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('freelancer@gigly.com')}
              className="text-left px-3 py-1.5 rounded-lg bg-surface-800/80 hover:bg-surface-800 text-xs text-surface-200 hover:text-white flex items-center justify-between border border-surface-700/50"
            >
              <span>Alex Rivera (Freelancer)</span>
              <span className="text-[10px] text-emerald-400 font-medium">Bid & Earn</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('both@gigly.com')}
              className="text-left px-3 py-1.5 rounded-lg bg-surface-800/80 hover:bg-surface-800 text-xs text-surface-200 hover:text-white flex items-center justify-between border border-surface-700/50"
            >
              <span>Elena Rostova (Dual: Both Roles)</span>
              <span className="text-[10px] text-amber-400 font-medium">Role Switcher</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-surface-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-surface-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-900 text-white rounded-xl pl-10 pr-4 py-2.5 border border-surface-700 text-xs focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-surface-300">Password</label>
              <span className="text-[11px] text-emerald-400 hover:underline cursor-pointer">
                Forgot password?
              </span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-surface-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-900 text-white rounded-xl pl-10 pr-4 py-2.5 border border-surface-700 text-xs focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold py-3 rounded-xl text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 hover:scale-[1.01] transition-all disabled:opacity-50 mt-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Sign In to Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-xs text-surface-400 pt-2 border-t border-surface-800">
          Don&apos;t have an account yet?{' '}
          <Link href="/auth/signup" className="text-emerald-400 font-semibold hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
