'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useActiveRole } from '@/components/Providers';
import { Contract } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  Clock,
  DollarSign,
  ArrowLeft,
  AlertCircle,
  Loader2,
  CreditCard,
  Check,
} from 'lucide-react';

export default function ContractDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { activeRole } = useActiveRole();
  const contractId = params?.id as string;

  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [releasing, setReleasing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    async function loadContract() {
      try {
        setLoading(true);
        const res = await fetch(`/api/contracts/${contractId}`);
        if (!res.ok) throw new Error('Contract not found');
        const data = await res.json();
        setContract(data);
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    }
    if (contractId) {
      loadContract();
    }
  }, [contractId]);

  const handleReleaseEscrow = async () => {
    if (!confirm('Are you sure you want to approve milestone deliverables and release escrow funds to the freelancer?')) {
      return;
    }

    setReleasing(true);
    try {
      const res = await fetch(`/api/contracts/${contractId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'RELEASE_ESCROW' }),
      });

      if (!res.ok) throw new Error('Failed to release escrow');

      const data = await res.json();
      setContract((prev) =>
        prev
          ? {
              ...prev,
              escrowStatus: 'RELEASED',
              status: 'COMPLETED',
              completedDate: new Date().toISOString(),
            }
          : null
      );
      setSuccessMsg('Escrow funds have been successfully released to the freelancer via Stripe Connect!');
    } catch (err: unknown) {
      const e = err as Error;
      alert(`Error releasing escrow: ${e.message}`);
    } finally {
      setReleasing(false);
    }
  };

  if (loading) {
    return (
      <div className="p-24 text-center flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
        <p className="text-surface-400 text-sm">Loading contract & escrow details...</p>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="glass-panel p-12 rounded-3xl text-center border border-surface-800 space-y-4 max-w-md mx-auto">
        <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
        <h2 className="text-lg font-bold text-white">Contract Not Found</h2>
        <Link
          href="/contracts"
          className="inline-block bg-surface-800 text-emerald-400 px-4 py-2 rounded-xl text-xs font-semibold"
        >
          Return to Contracts
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/contracts"
          className="inline-flex items-center gap-2 text-xs font-medium text-surface-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Contracts</span>
        </Link>
      </div>

      {/* Main Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-surface-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
              Contract #{contract.id.slice(-6)}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                contract.status === 'COMPLETED'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              {contract.status === 'COMPLETED' ? 'Completed & Paid' : 'Active Contract'}
            </span>
          </div>

          <span className="text-xs text-surface-400">
            Initiated on {formatDate(contract.startDate)}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {contract.job?.title || 'Contract Deliverable Project'}
        </h1>

        {/* Escrow Status Ribbon */}
        <div className="p-4 rounded-2xl bg-surface-900/90 border border-surface-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
              {contract.escrowStatus === 'RELEASED' ? (
                <CheckCircle2 className="w-5 h-5 text-teal-400" />
              ) : (
                <Lock className="w-5 h-5 text-emerald-400" />
              )}
            </div>
            <div>
              <span className="text-[11px] text-surface-400 uppercase tracking-wider font-semibold">
                Stripe Escrow Status
              </span>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>
                  {contract.escrowStatus === 'RELEASED'
                    ? 'Disbursed to Freelancer Payout Account'
                    : 'Funds Locked in Escrow'}
                </span>
                <span className="text-emerald-400">({formatCurrency(contract.agreedAmount)})</span>
              </div>
            </div>
          </div>

          {/* Action: Client Release Escrow Button */}
          {contract.escrowStatus === 'HELD_IN_ESCROW' && (
            <button
              onClick={handleReleaseEscrow}
              disabled={releasing}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs shadow-lg shadow-emerald-500/25 flex items-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50"
            >
              {releasing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Releasing Escrow Payout...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Approve & Release Escrow</span>
                </>
              )}
            </button>
          )}
        </div>

        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>

        {/* Milestone Breakdown */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-surface-800 space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-emerald-400" />
          <span>Milestone Deliverables & Payment Terms</span>
        </h3>

        <div className="p-5 rounded-2xl bg-surface-900 border border-surface-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-surface-800">
            <div>
              <h4 className="text-sm font-bold text-white">Full Project Scope & Production Deployment</h4>
              <p className="text-xs text-surface-400 mt-0.5">
                Complete engineering deliverables as outlined in the accepted proposal.
              </p>
            </div>
            <div className="text-right">
              <span className="text-base font-black text-emerald-400">
                {formatCurrency(contract.agreedAmount)}
              </span>
              <span className="text-[11px] text-surface-400 block">Single Milestone</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-surface-400">
            <span>Stripe Payment Intent:</span>
            <code className="text-emerald-400 font-mono text-[11px]">
              {contract.stripePaymentIntentId || 'pi_test_live_escrow'}
            </code>
          </div>
        </div>

        {/* Counterparty profiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-surface-800">
          <div className="p-4 rounded-2xl bg-surface-900/60 border border-surface-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden relative border border-emerald-500/30 flex-shrink-0">
              <Image
                src={
                  contract.client?.avatar ||
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
                }
                alt="Client"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <span className="text-[10px] text-surface-400 uppercase font-semibold">Client</span>
              <div className="text-xs font-bold text-white">{contract.client?.name || 'Sarah Jenkins'}</div>
              <div className="text-[11px] text-surface-400">Apex Fintech Labs</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-surface-900/60 border border-surface-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden relative border border-teal-500/30 flex-shrink-0">
              <Image
                src={
                  contract.freelancer?.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
                }
                alt="Freelancer"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <span className="text-[10px] text-surface-400 uppercase font-semibold">Hired Freelancer</span>
              <div className="text-xs font-bold text-white">{contract.freelancer?.name || 'Alex Rivera'}</div>
              <div className="text-[11px] text-surface-400">Principal Next.js Specialist</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
