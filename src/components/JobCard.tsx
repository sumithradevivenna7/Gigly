'use client';

import React from 'react';
import Link from 'next/link';
import { Job } from '@/types';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import {
  DollarSign,
  Clock,
  Star,
  ShieldCheck,
  Send,
  Users,
  Briefcase,
  Zap,
  ArrowRight,
} from 'lucide-react';

interface JobCardProps {
  job: Job;
  userRole?: 'CLIENT' | 'FREELANCER';
  viewMode?: 'grid' | 'list';
}

export function JobCard({ job, userRole = 'FREELANCER', viewMode = 'grid' }: JobCardProps) {
  const proposalCount = job._count?.proposals ?? job.proposals?.length ?? 0;

  if (viewMode === 'list') {
    return (
      <div className="glass-card rounded-2xl p-5 relative group transition-all duration-300 hover:border-emerald-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
              {job.category}
            </span>
            <span className="text-surface-400 flex items-center gap-1 text-[11px]">
              <Clock className="w-3 h-3" />
              {formatRelativeTime(job.createdAt)}
            </span>
            <span className="text-emerald-400 font-bold bg-surface-900 px-2 py-0.5 rounded border border-surface-800 text-xs">
              {job.budgetType === 'FIXED'
                ? `${formatCurrency(job.budgetAmount)} Fixed`
                : `$${job.budgetMin}-$${job.budgetMax}/hr`}
            </span>
          </div>

          <Link href={`/jobs/${job.id}`}>
            <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
              {job.title}
            </h3>
          </Link>

          <p className="text-xs text-surface-300 line-clamp-1 max-w-2xl leading-relaxed">
            {job.description}
          </p>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {job.requiredSkills.slice(0, 4).map((skill, idx) => (
              <span
                key={idx}
                className="text-[10px] px-2 py-0.5 rounded bg-surface-800/80 text-surface-300 font-medium border border-surface-700/50"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between md:flex-col md:items-end gap-3 flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-surface-800">
          <div className="flex items-center gap-2 text-xs text-surface-400">
            <div className="flex items-center gap-1 text-amber-400 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{job.client?.rating ? job.client.rating.toFixed(1) : '5.0'}</span>
            </div>
            <span>• {proposalCount} bids</span>
          </div>

          <Link
            href={`/jobs/${job.id}`}
            className="theme-gradient-btn bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md"
          >
            <span>{userRole === 'CLIENT' ? 'Manage' : 'Apply Now'}</span>
            <Send className="w-3 h-3" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 relative group transition-all duration-300 flex flex-col justify-between hover:border-emerald-500/40">
      <div>
        {/* Top Meta: Time & Category */}
        <div className="flex items-center justify-between gap-2 text-xs mb-3">
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20 text-[11px]">
            {job.category}
          </span>
          <span className="text-surface-400 flex items-center gap-1 text-[11px]">
            <Clock className="w-3.5 h-3.5" />
            {formatRelativeTime(job.createdAt)}
          </span>
        </div>

        {/* Title */}
        <Link href={`/jobs/${job.id}`}>
          <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1 mb-2.5">
            {job.title}
          </h3>
        </Link>

        {/* Budget Info */}
        <div className="flex items-center gap-2 text-xs font-semibold text-surface-200 mb-3">
          <div className="flex items-center gap-1 text-emerald-400 bg-surface-900/90 px-2.5 py-1 rounded-lg border border-surface-700/60">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400 -mr-0.5" />
            {job.budgetType === 'FIXED' ? (
              <span>{formatCurrency(job.budgetAmount)} Fixed-Price</span>
            ) : (
              <span>
                ${job.budgetMin} - ${job.budgetMax}/hr Hourly
              </span>
            )}
          </div>
          {job.estimatedDuration && (
            <span className="text-surface-400 bg-surface-900/60 px-2.5 py-1 rounded-lg border border-surface-800 text-[11px]">
              {job.estimatedDuration}
            </span>
          )}
        </div>

        {/* Description Snippet */}
        <p className="text-xs text-surface-300 leading-relaxed line-clamp-2 mb-4">
          {job.description}
        </p>

        {/* Required Skills Chips */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {job.requiredSkills.slice(0, 5).map((skill, idx) => (
            <span
              key={idx}
              className="text-[11px] px-2.5 py-0.5 rounded-md bg-surface-800/90 text-surface-300 font-medium border border-surface-700/50 hover:border-emerald-500/40 hover:text-white transition-colors"
            >
              {skill}
            </span>
          ))}
          {job.requiredSkills.length > 5 && (
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-surface-800/50 text-surface-400">
              +{job.requiredSkills.length - 5}
            </span>
          )}
        </div>
      </div>

      {/* Footer: Client Info & Action CTA */}
      <div className="flex items-center justify-between pt-4 border-t border-surface-800/80 text-xs mt-auto">
        {/* Client Reputation */}
        <div className="flex items-center gap-3 text-surface-400">
          <div className="flex items-center gap-1 text-amber-400 font-semibold" title="Client Rating">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{job.client?.rating ? job.client.rating.toFixed(1) : '5.0'}</span>
          </div>

          <div className="flex items-center gap-1 text-teal-400 hidden sm:flex" title="Stripe Escrow Verified">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="text-[11px]">Escrow Ready</span>
          </div>

          <div className="flex items-center gap-1 text-surface-400" title="Incoming proposals">
            <Users className="w-3.5 h-3.5" />
            <span className="text-[11px]">{proposalCount} bids</span>
          </div>
        </div>

        {/* Action Link */}
        <Link
          href={`/jobs/${job.id}`}
          className="flex items-center gap-1.5 bg-surface-800 hover:bg-emerald-500 hover:text-slate-950 text-emerald-400 font-bold px-3 py-1.5 rounded-lg border border-emerald-500/30 hover:border-emerald-500 transition-all text-xs shadow-sm"
        >
          <span>{userRole === 'CLIENT' ? 'Manage' : 'Apply'}</span>
          <Send className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
