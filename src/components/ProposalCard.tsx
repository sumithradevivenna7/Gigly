'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Proposal } from '@/types';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import {
  Star,
  CheckCircle,
  Clock,
  DollarSign,
  ArrowRight,
  ShieldAlert,
  Loader2,
} from 'lucide-react';

interface ProposalCardProps {
  proposal: Proposal;
  isClientOwner: boolean;
  onAccept?: (proposalId: string) => Promise<void>;
}

export function ProposalCard({
  proposal,
  isClientOwner,
  onAccept,
}: ProposalCardProps) {
  const [isAccepting, setIsAccepting] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const freelancer = proposal.freelancer;

  const handleAcceptClick = async () => {
    if (!onAccept) return;
    setIsAccepting(true);
    try {
      await onAccept(proposal.id);
    } finally {
      setIsAccepting(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-surface-700/60 relative">
      {/* Header: Freelancer Info & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-800">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl overflow-hidden relative border border-emerald-500/30 flex-shrink-0">
            <Image
              src={
                freelancer?.avatar ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                  freelancer?.name || 'Freelancer'
                )}`
              }
              alt={freelancer?.name || 'Freelancer'}
              fill
              className="object-cover"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white">{freelancer?.name || 'Verified Freelancer'}</h4>
              <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{freelancer?.rating ? freelancer.rating.toFixed(1) : '5.0'}</span>
                <span className="text-surface-500 font-normal">
                  ({freelancer?.reviewCount ?? 12})
                </span>
              </div>
            </div>
            <p className="text-xs text-surface-400 line-clamp-1">
              {freelancer?.title || 'Senior Software Engineer'}
            </p>
          </div>
        </div>

        {/* Status Badge & Bid Amount */}
        <div className="flex items-center gap-3 self-end sm:self-center">
          <div className="text-right">
            <div className="text-base font-black text-emerald-400 flex items-center justify-end">
              <DollarSign className="w-4 h-4 -mr-1" />
              <span>{formatCurrency(proposal.bidAmount).replace('$', '')}</span>
            </div>
            <span className="text-[11px] text-surface-400 flex items-center gap-1 justify-end">
              <Clock className="w-3 h-3" />
              {proposal.estimatedDuration}
            </span>
          </div>

          <div>
            {proposal.status === 'ACCEPTED' ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold text-xs border border-emerald-500/40">
                <CheckCircle className="w-3.5 h-3.5" />
                Hired
              </span>
            ) : proposal.status === 'REJECTED' ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-surface-800 text-surface-400 text-xs">
                Declined
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-medium border border-cyan-500/30">
                Pending Review
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Cover Letter Content */}
      <div className="py-4 text-xs text-surface-300 leading-relaxed">
        <p className={expanded ? '' : 'line-clamp-3'}>{proposal.coverLetter}</p>
        {proposal.coverLetter.length > 200 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-emerald-400 hover:text-emerald-300 font-medium text-[11px] mt-1.5 underline"
          >
            {expanded ? 'Show less' : 'Read full proposal'}
          </button>
        )}
      </div>

      {/* Footer: Date submitted & Client Action */}
      <div className="flex items-center justify-between pt-3 border-t border-surface-800 text-xs text-surface-400">
        <span>Submitted {formatRelativeTime(proposal.createdAt)}</span>

        {isClientOwner && proposal.status === 'PENDING' && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleAcceptClick}
              disabled={isAccepting}
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold px-4 py-2 rounded-xl shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] text-xs"
            >
              {isAccepting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Securing Escrow...</span>
                </>
              ) : (
                <>
                  <span>Accept Proposal & Fund Escrow</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        )}

        {proposal.status === 'ACCEPTED' && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <ShieldAlert className="w-4 h-4" />
            <span>Escrow funded with Stripe Connect</span>
          </div>
        )}
      </div>
    </div>
  );
}
