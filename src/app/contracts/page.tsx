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
} from 'lucide-react';

export default function ContractsPage() {
  const { activeRole } = useActiveRole();
  const [contracts, setContracts] = useState<Contract[]>(INITIAL_CONTRACTS);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-surface-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Stripe Connect Escrow</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Active Contracts & Escrow Balances
            </h1>
            <p className="text-xs sm:text-sm text-surface-400 mt-1">
              {activeRole === 'CLIENT'
                ? 'Manage your funded milestone contracts and release payments upon work verification.'
                : 'Track your active projects, milestone deliveries, and pending escrow disbursements.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-surface-900/80 border border-surface-800 flex items-center gap-4">
            <div>
              <span className="text-[11px] text-surface-400">Total in Escrow</span>
              <div className="text-xl font-black text-emerald-400">
                {formatCurrency(
                  contracts.reduce((sum, c) => (c.escrowStatus === 'HELD_IN_ESCROW' ? sum + c.agreedAmount : sum), 0)
                )}
              </div>
            </div>
            <div className="w-px h-8 bg-surface-800" />
            <div>
              <span className="text-[11px] text-surface-400">Active Contracts</span>
              <div className="text-xl font-black text-white">{contracts.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Contracts List */}
      <div className="space-y-4">
        {contracts.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl text-center border border-surface-800 space-y-3">
            <FileCheck className="w-10 h-10 text-surface-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No active contracts yet</h3>
            <p className="text-xs text-surface-400 max-w-sm mx-auto">
              Contracts are automatically created as soon as a client accepts a freelancer proposal and funds escrow.
            </p>
            <Link
              href="/jobs"
              className="inline-block mt-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs"
            >
              Browse Open Jobs
            </Link>
          </div>
        ) : (
          contracts.map((contract) => {
            const counterparty = activeRole === 'CLIENT' ? contract.freelancer : contract.client;

            return (
              <div
                key={contract.id}
                className="glass-card rounded-2xl p-6 border border-surface-700/60 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-800">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                        Contract #{contract.id.slice(-6)}
                      </span>
                      <span className="text-surface-500">•</span>
                      <span className="text-xs text-surface-400">Started {formatDate(contract.startDate)}</span>
                    </div>
                    <Link href={`/contracts/${contract.id}`}>
                      <h3 className="text-lg font-bold text-white hover:text-emerald-400 transition-colors">
                        {contract.job?.title || 'Contract Project'}
                      </h3>
                    </Link>
                  </div>

                  {/* Status Badges */}
                  <div className="flex items-center gap-2.5">
                    {contract.escrowStatus === 'HELD_IN_ESCROW' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold text-xs border border-emerald-500/30">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Escrow Funded</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 font-semibold text-xs border border-teal-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Escrow Released</span>
                      </span>
                    )}

                    <div className="text-right pl-3 border-l border-surface-800">
                      <span className="text-[11px] text-surface-400 block">Agreed Value</span>
                      <span className="text-base font-black text-white">
                        {formatCurrency(contract.agreedAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Counterparty & Details */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden relative border border-surface-700 flex-shrink-0">
                      <Image
                        src={
                          counterparty?.avatar ||
                          `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                            counterparty?.name || 'User'
                          )}`
                        }
                        alt={counterparty?.name || 'Counterparty'}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-surface-400 text-[11px]">
                        {activeRole === 'CLIENT' ? 'Hired Freelancer:' : 'Client:'}
                      </span>
                      <h4 className="font-bold text-white">{counterparty?.name || 'Marketplace Member'}</h4>
                      <p className="text-surface-400 text-[11px]">
                        {counterparty?.title || counterparty?.companyName || 'Verified Partner'}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/contracts/${contract.id}`}
                    className="inline-flex items-center gap-1.5 bg-surface-800 hover:bg-emerald-500 hover:text-slate-950 text-emerald-400 font-semibold px-4 py-2 rounded-xl text-xs border border-emerald-500/30 hover:border-emerald-500 transition-all shadow-sm"
                  >
                    <span>View Milestones & Escrow</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
