'use client';

import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useActiveRole } from '@/components/Providers';
import { RoleSwitcher } from '@/components/RoleSwitcher';
import { INITIAL_JOBS, INITIAL_PROPOSALS, INITIAL_CONTRACTS, DEMO_USERS } from '@/lib/mock-data';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import {
  Briefcase,
  DollarSign,
  FileText,
  ShieldCheck,
  PlusCircle,
  Search,
  ArrowRight,
  Clock,
  CheckCircle,
  Users,
  Sparkles,
} from 'lucide-react';

export default function DashboardPage() {
  const { data: session } = useSession();
  const { activeRole } = useActiveRole();

  const isClient = activeRole === 'CLIENT';

  return (
    <div className="space-y-8">
      {/* Welcome Banner with Role Switcher */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-surface-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isClient ? 'Client Workspace' : 'Freelancer Workspace'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome back, {session?.user?.name || (isClient ? 'Sarah Jenkins' : 'Alex Rivera')}
            </h1>
            <p className="text-xs sm:text-sm text-surface-400 mt-1">
              {isClient
                ? 'Manage your job requirements, evaluate incoming proposals, and disburse escrow.'
                : 'Track submitted proposals, active milestones, and Stripe Connect payouts.'}
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2 bg-surface-900/60 p-3.5 rounded-2xl border border-surface-800">
            <span className="text-[11px] font-semibold text-surface-400">Current Perspective:</span>
            <RoleSwitcher />
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {isClient ? (
          <>
            <div className="glass-panel p-5 rounded-2xl border border-surface-800">
              <span className="text-xs text-surface-400 block mb-1">Total Spent</span>
              <div className="text-2xl font-black text-white">$42,500</div>
              <span className="text-[11px] text-emerald-400 mt-1 block">14 hires completed</span>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-surface-800">
              <span className="text-xs text-surface-400 block mb-1">Active Job Posts</span>
              <div className="text-2xl font-black text-white">{INITIAL_JOBS.length}</div>
              <span className="text-[11px] text-cyan-400 mt-1 block">Accepting proposals</span>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-surface-800">
              <span className="text-xs text-surface-400 block mb-1">Total Bids Received</span>
              <div className="text-2xl font-black text-white">14</div>
              <span className="text-[11px] text-teal-400 mt-1 block">Across all jobs</span>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-surface-800">
              <span className="text-xs text-surface-400 block mb-1">Held in Escrow</span>
              <div className="text-2xl font-black text-emerald-400">$3,200</div>
              <span className="text-[11px] text-surface-400 mt-1 block">Protected by Stripe</span>
            </div>
          </>
        ) : (
          <>
            <div className="glass-panel p-5 rounded-2xl border border-surface-800">
              <span className="text-xs text-surface-400 block mb-1">Total Earnings</span>
              <div className="text-2xl font-black text-emerald-400">$78,900</div>
              <span className="text-[11px] text-surface-400 mt-1 block">29 projects completed</span>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-surface-800">
              <span className="text-xs text-surface-400 block mb-1">Active Contracts</span>
              <div className="text-2xl font-black text-white">1</div>
              <span className="text-[11px] text-teal-400 mt-1 block">In progress</span>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-surface-800">
              <span className="text-xs text-surface-400 block mb-1">Proposals Submitted</span>
              <div className="text-2xl font-black text-white">2</div>
              <span className="text-[11px] text-cyan-400 mt-1 block">1 accepted, 1 pending</span>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-surface-800">
              <span className="text-xs text-surface-400 block mb-1">Pending Escrow Payout</span>
              <div className="text-2xl font-black text-white">$3,200</div>
              <span className="text-[11px] text-emerald-400 mt-1 block">Upon client sign-off</span>
            </div>
          </>
        )}
      </div>

      {/* Main Workspace Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Spans: Relevant Tables */}
        <div className="lg:col-span-2 space-y-6">
          {isClient ? (
            /* Client: Posted Jobs & incoming proposals */
            <div className="glass-panel p-6 rounded-3xl border border-surface-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-surface-800">
                <div>
                  <h3 className="text-base font-bold text-white">My Open Projects</h3>
                  <p className="text-xs text-surface-400">Review proposals and hire candidates</p>
                </div>
                <Link
                  href="/jobs/create"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Post Job</span>
                </Link>
              </div>

              <div className="space-y-3">
                {INITIAL_JOBS.map((job) => (
                  <div
                    key={job.id}
                    className="p-4 rounded-2xl bg-surface-900/60 border border-surface-800 flex items-center justify-between gap-4 hover:border-surface-700 transition-all"
                  >
                    <div>
                      <Link href={`/jobs/${job.id}`}>
                        <h4 className="text-sm font-bold text-white hover:text-emerald-400 transition-colors">
                          {job.title}
                        </h4>
                      </Link>
                      <div className="flex items-center gap-3 text-xs text-surface-400 mt-1">
                        <span>{formatCurrency(job.budgetAmount)}</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-medium">
                          {job._count?.proposals || 3} Proposals
                        </span>
                        <span>•</span>
                        <span>{formatRelativeTime(job.createdAt)}</span>
                      </div>
                    </div>

                    <Link
                      href={`/jobs/${job.id}`}
                      className="bg-surface-800 hover:bg-surface-700 text-surface-200 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 flex-shrink-0"
                    >
                      <span>Review Bids</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Freelancer: Submitted Proposals */
            <div className="glass-panel p-6 rounded-3xl border border-surface-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-surface-800">
                <div>
                  <h3 className="text-base font-bold text-white">My Submitted Proposals</h3>
                  <p className="text-xs text-surface-400">Track client responses to your bids</p>
                </div>
                <Link
                  href="/jobs"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Find Jobs</span>
                </Link>
              </div>

              <div className="space-y-3">
                {INITIAL_PROPOSALS.map((proposal) => (
                  <div
                    key={proposal.id}
                    className="p-4 rounded-2xl bg-surface-900/60 border border-surface-800 flex items-center justify-between gap-4"
                  >
                    <div>
                      <Link href={`/jobs/${proposal.jobId}`}>
                        <h4 className="text-sm font-bold text-white hover:text-emerald-400 transition-colors">
                          {proposal.jobId === 'job-1'
                            ? 'Full-Stack Next.js Developer for AI Copilot'
                            : 'Stripe Connect Escrow Payment Gateway'}
                        </h4>
                      </Link>
                      <div className="flex items-center gap-3 text-xs text-surface-400 mt-1">
                        <span className="text-emerald-400 font-bold">${proposal.bidAmount}</span>
                        <span>•</span>
                        <span>{proposal.estimatedDuration}</span>
                        <span>•</span>
                        <span>{formatRelativeTime(proposal.createdAt)}</span>
                      </div>
                    </div>

                    <div>
                      {proposal.status === 'ACCEPTED' ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold text-xs border border-emerald-500/30">
                          Accepted & Funded
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs border border-cyan-500/30">
                          Under Review
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Span: Active Contracts & Escrow Widget */}
        <aside className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-surface-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Active Escrow Contracts</span>
              </h3>
              <Link href="/contracts" className="text-xs text-emerald-400 hover:underline">
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {INITIAL_CONTRACTS.map((c) => (
                <div key={c.id} className="p-3.5 rounded-2xl bg-surface-900 border border-surface-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">Stripe Escrow Gateway</span>
                    <span className="text-emerald-400 font-bold">{formatCurrency(c.agreedAmount)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-surface-400">
                    <span>Status: In Progress</span>
                    <span className="text-teal-400 font-semibold">100% Escrow Funded</span>
                  </div>
                  <Link
                    href={`/contracts/${c.id}`}
                    className="block text-center bg-surface-800 hover:bg-surface-700 text-emerald-400 font-semibold py-1.5 rounded-lg text-xs transition-colors mt-2"
                  >
                    Open Milestone
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
