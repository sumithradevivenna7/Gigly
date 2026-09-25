import React from 'react';
import Link from 'next/link';
import { Sparkles, Shield, Lock, CreditCard } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-surface-800 bg-surface-950/80 pt-16 pb-12 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-surface-800">
          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-surface-900/60 border border-surface-800/80">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Stripe Escrow Protection</h4>
              <p className="text-xs text-surface-400">Client funds locked safely until milestone approval</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-surface-900/60 border border-surface-800/80">
            <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Proposal-Based Hiring</h4>
              <p className="text-xs text-surface-400">Custom tailored bids from verified software specialists</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-surface-900/60 border border-surface-800/80">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">0% Hidden Fees</h4>
              <p className="text-xs text-surface-400">Transparent 10% platform fee, automated freelancer payouts</p>
            </div>
          </div>
        </div>

        {/* Links Matrix */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-black text-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white">Gigly</span>
            </div>
            <p className="text-xs text-surface-400 leading-relaxed mb-4">
              The premier freelance marketplace for top engineers, architects, and high-growth technology companies.
            </p>
            <p className="text-[11px] text-surface-500">
              © {new Date().getFullYear()} Gigly Inc. All rights reserved.
            </p>
          </div>

          <div>
            <h5 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">For Clients</h5>
            <ul className="space-y-2 text-xs text-surface-400">
              <li><Link href="/jobs/create" className="hover:text-emerald-400 transition-colors">Post a Project</Link></li>
              <li><Link href="/jobs" className="hover:text-emerald-400 transition-colors">Review Talent Bids</Link></li>
              <li><Link href="/contracts" className="hover:text-emerald-400 transition-colors">Escrow Management</Link></li>
              <li><Link href="/dashboard" className="hover:text-emerald-400 transition-colors">Client Workspace</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">For Freelancers</h5>
            <ul className="space-y-2 text-xs text-surface-400">
              <li><Link href="/jobs" className="hover:text-emerald-400 transition-colors">Browse Open Jobs</Link></li>
              <li><Link href="/contracts" className="hover:text-emerald-400 transition-colors">Submit Proposals</Link></li>
              <li><Link href="/contracts" className="hover:text-emerald-400 transition-colors">Payment Transfers</Link></li>
              <li><Link href="/dashboard" className="hover:text-emerald-400 transition-colors">Earnings Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Tech Stack</h5>
            <ul className="space-y-2 text-xs text-surface-400">
              <li><span className="text-surface-300">Frontend:</span> Next.js 14 App Router</li>
              <li><span className="text-surface-300">Styling:</span> Tailwind CSS</li>
              <li><span className="text-surface-300">ORM & DB:</span> Prisma + PostgreSQL</li>
              <li><span className="text-surface-300">Escrow:</span> Stripe Connect</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
