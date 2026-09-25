'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useActiveRole } from '@/components/Providers';
import { Contract } from '@/types';
import { INITIAL_CONTRACTS } from '@/lib/mock-data';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  Clock,
  ArrowRight,
  DollarSign,
  AlertCircle,
  FileCheck,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Info,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

export default function ContractsPage() {
  const { activeRole } = useActiveRole();
  const [contracts, setContracts] = useState<Contract[]>(INITIAL_CONTRACTS);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'escrow_active' | 'completed'>('all');

  useEffect(() => {
    async function loadContracts() {
      try {
        setLoading(true);
        const res = await fetch('/api/contracts');
        if (res.ok) {
          const data = await res.json();
          setContracts(data);
        }
      } catch {
        // Fall back to initial contracts
      } finally {
        setLoading(false);
      }
    }
    loadContracts();
  }, []);

  const totalHeldInEscrow = contracts.reduce(
    (sum, c) => (c.escrowStatus === 'HELD_IN_ESCROW' ? sum + c.agreedAmount : sum),
    0
  );

  const totalCompletedDisbursed = contracts.reduce(
    (sum, c) => (c.escrowStatus === 'RELEASED' ? sum + c.agreedAmount : sum),
    0
  );

  const filteredContracts = contracts.filter((c) => {
    if (activeTab === 'escrow_active') return c.escrowStatus === 'HELD_IN_ESCROW';
    if (activeTab === 'completed') return c.escrowStatus === 'RELEASED';
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-surface-800 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold mb-3 border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Stripe Connect Escrow Protocol</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Active Contracts & Milestone Escrow
            </h1>
            <p className="text-xs sm:text-sm text-surface-300 mt-2 max-w-xl leading-relaxed">
              {activeRole === 'CLIENT'
                ? 'Manage your funded milestone agreements, inspect pull requests, and disburse Stripe escrow payments upon approval.'
                : 'Track your active contracts, milestone deadlines, and real-time Stripe Connect disbursements.'}
            </p>
          </div>

          {/* Escrow Balances Summary Grid */}
          <div className="grid grid-cols-2 gap-3 bg-surface-900/90 p-4 rounded-2xl border border-surface-800 self-start lg:self-auto">
            <div className="space-y-0.5">
              <span className="text-[10px] text-surface-400 font-semibold uppercase tracking-wider">Locked in Escrow</span>
              <div className="text-2xl font-black text-emerald-400">{formatCurrency(totalHeldInEscrow)}</div>
              <span className="text-[10px] text-surface-400">100% Protected</span>
            </div>
            <div className="space-y-0.5 pl-3 border-l border-surface-800">
              <span className="text-[10px] text-surface-400 font-semibold uppercase tracking-wider">Total Disbursed</span>
              <div className="text-2xl font-black text-white">{formatCurrency(totalCompletedDisbursed || 7800)}</div>
              <span className="text-[10px] text-teal-400">Direct to Bank</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-surface-800">
          {[
            { id: 'all', label: `All Contracts (${contracts.length})` },
            { id: 'escrow_active', label: 'Held in Escrow' },
            { id: 'completed', label: 'Completed & Released' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                  : 'glass-card text-surface-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contracts List */}
      <div className="space-y-4">
        {filteredContracts.length === 0 ? (
          <div className="glass-panel p-16 rounded-3xl text-center border border-surface-800 space-y-4">
            <FileCheck className="w-12 h-12 text-surface-500 mx-auto" />
            <h3 className="text-lg font-bold text-white">No active contracts found in this view</h3>
            <p className="text-xs text-surface-400 max-w-md mx-auto leading-relaxed">
              Contracts are automatically initiated as soon as a client accepts a freelancer proposal and authorizes Stripe escrow funding.
            </p>
            <Link
              href="/jobs"
              className="inline-block mt-2 theme-gradient-btn bg-emerald-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs"
            >
              Explore Open Jobs
            </Link>
          </div>
        ) : (
          filteredContracts.map((contract) => {
            const counterparty = activeRole === 'CLIENT' ? contract.freelancer : contract.client;
            const isEscrowLocked = contract.escrowStatus === 'HELD_IN_ESCROW';

            return (
              <div
                key={contract.id}
                className="glass-card p-6 rounded-3xl border border-surface-800/80 hover:border-emerald-500/40 transition-all space-y-5"
              >
                {/* Top Row: Title, Escrow Badge & Amount */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold ${
                          isEscrowLocked
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-surface-800 text-surface-300 border border-surface-700'
                        }`}
                      >
                        <Lock className="w-3 h-3" />
                        <span>{isEscrowLocked ? 'Funds Secured in Stripe Escrow' : 'Milestones Released'}</span>
                      </span>
                      <span className="text-xs text-surface-500">Contract #{contract.id.slice(0, 8)}</span>
                    </div>

                    <h3 className="text-xl font-black text-white tracking-tight mt-1">
                      {contract.job?.title || 'Full-Stack Web3 Application'}
                    </h3>
                  </div>

                  <div className="text-left sm:text-right">
                    <div className="text-xs text-surface-400 font-medium">Contract Value</div>
                    <div className="text-2xl font-black text-emerald-400">
                      {formatCurrency(contract.agreedAmount)}
                    </div>
                  </div>
                </div>

                {/* Counterparty & Details Pill Bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-2xl bg-surface-900/80 border border-surface-800">
                  {/* Counterparty */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden relative border border-surface-700 flex-shrink-0">
                      <img
                        src={counterparty?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                        alt={counterparty?.name || 'User'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-[10px] text-surface-400 uppercase font-semibold">
                        {activeRole === 'CLIENT' ? 'Assigned Freelancer' : 'Contract Client'}
                      </div>
                      <div className="text-xs font-bold text-white">{counterparty?.name || 'Verified User'}</div>
                      <div className="text-[10px] text-emerald-400 font-medium">{counterparty?.title || 'Full Stack Engineer'}</div>
                    </div>
                  </div>

                  {/* Delivery Timeline */}
                  <div className="flex items-center gap-3 md:border-l md:border-surface-800 md:pl-4">
                    <Clock className="w-5 h-5 text-teal-400 flex-shrink-0" />
                    <div>
                      <div className="text-[10px] text-surface-400 uppercase font-semibold">Target Delivery</div>
                      <div className="text-xs font-bold text-white">
                        {contract.deadline ? formatDate(contract.deadline) : '3 weeks from kickoff'}
                      </div>
                      <div className="text-[10px] text-surface-400">Status: In Progress</div>
                    </div>
                  </div>

                  {/* Stripe Protection Status */}
                  <div className="flex items-center gap-3 md:border-l md:border-surface-800 md:pl-4">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <div>
                      <div className="text-[10px] text-surface-400 uppercase font-semibold">Payment Guarantee</div>
                      <div className="text-xs font-bold text-emerald-400">Stripe Escrow Verified</div>
                      <div className="text-[10px] text-surface-400">Dispute Arb. Active</div>
                    </div>
                  </div>
                </div>

                {/* Milestone Stepper Visualizer inside Contract */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-surface-300">Milestone Deliverable Progress:</span>
                    <span className="text-emerald-400 font-bold">1 of 2 Approved (50%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-900 overflow-hidden border border-surface-800">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full w-1/2 transition-all duration-500" />
                  </div>
                </div>

                {/* Action CTA Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-surface-800 text-xs">
                  <div className="text-surface-400 text-[11px] flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-surface-500" />
                    <span>Funds are released directly to Stripe account upon milestone signoff</span>
                  </div>

                  <Link
                    href={`/contracts/${contract.id}`}
                    className="theme-gradient-btn bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md"
                  >
                    <span>View Contract & Escrow Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
