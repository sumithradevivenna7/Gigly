'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useActiveRole } from '@/components/Providers';
import { ProposalCard } from '@/components/ProposalCard';
import { Job, Proposal } from '@/types';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import {
  DollarSign,
  Clock,
  Calendar,
  Star,
  ShieldCheck,
  Send,
  CheckCircle,
  FileText,
  AlertCircle,
  Loader2,
  Lock,
  Plus,
  Trash2,
  Layers,
  Sparkles,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface MilestoneItem {
  id: string;
  title: string;
  amount: number;
  duration: string;
}

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { activeRole } = useActiveRole();
  const jobId = params?.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Proposal Submission State
  const [bidAmount, setBidAmount] = useState('4200');
  const [estimatedDuration, setEstimatedDuration] = useState('3 to 4 weeks');
  const [coverLetter, setCoverLetter] = useState('');
  const [submittingProposal, setSubmittingProposal] = useState(false);
  const [proposalSuccess, setProposalSuccess] = useState('');
  const [escrowSuccessModal, setEscrowSuccessModal] = useState<string | null>(null);

  // Dynamic Milestones Builder
  const [milestones, setMilestones] = useState<MilestoneItem[]>([
    { id: '1', title: 'Architecture & Initial MVP Prototype', amount: 2000, duration: '1 week' },
    { id: '2', title: 'Core Features, Integration & QA Testing', amount: 2200, duration: '2 weeks' },
  ]);

  // Active Tab for Client: 'description' or 'proposals'
  const [activeTab, setActiveTab] = useState<'description' | 'proposals'>('description');

  useEffect(() => {
    async function fetchJobData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/jobs/${jobId}`);
        if (!res.ok) throw new Error('Job not found');
        const data = await res.json();
        setJob(data);

        // Fetch proposals for this job
        const propRes = await fetch(`/api/jobs/${jobId}/proposals`);
        if (propRes.ok) {
          const propData = await propRes.json();
          setProposals(propData);
        }
      } catch (err: unknown) {
        const e = err as Error;
        setError(e.message || 'Failed to load project');
      } finally {
        setLoading(false);
      }
    }

    if (jobId) {
      fetchJobData();
    }
  }, [jobId]);

  // Fee calculation (10% platform fee)
  const bidNum = parseFloat(bidAmount) || 0;
  const giglyFee = Math.round(bidNum * 0.1);
  const netEarnings = Math.max(0, bidNum - giglyFee);

  // Check if current user already submitted a proposal
  const currentUserId = (session?.user as unknown as { id: string })?.id || 'user-freelancer-1';
  const existingProposal = proposals.find((p) => p.freelancerId === currentUserId);

  // Check if user is the client who posted the job
  const isClientOwner =
    activeRole === 'CLIENT' ||
    (session?.user as unknown as { id: string })?.id === job?.clientId;

  const addMilestone = () => {
    setMilestones([
      ...milestones,
      {
        id: Date.now().toString(),
        title: `Milestone ${milestones.length + 1} Deliverable`,
        amount: 1000,
        duration: '1 week',
      },
    ]);
  };

  const removeMilestone = (id: string) => {
    if (milestones.length <= 1) return;
    setMilestones(milestones.filter((m) => m.id !== id));
  };

  const updateMilestone = (id: string, field: keyof MilestoneItem, value: any) => {
    setMilestones(
      milestones.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const handleProposalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverLetter.trim() || coverLetter.length < 30) {
      setError('Please write a detailed cover letter explaining your approach (at least 30 characters).');
      return;
    }

    setSubmittingProposal(true);
    setError('');

    try {
      const res = await fetch(`/api/jobs/${jobId}/proposals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bidAmount,
          coverLetter: `${coverLetter}\n\n[Proposed Milestones: ${milestones.map((m) => `${m.title} ($${m.amount})`).join(' -> ')}]`,
          estimatedDuration,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit proposal');
      }

      const newProposal = await res.json();
      setProposals([newProposal, ...proposals]);
      setProposalSuccess('Your proposal and milestone plan have been submitted to the client! You will be notified upon review.');
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || 'Submission error');
    } finally {
      setSubmittingProposal(false);
    }
  };

  const handleAcceptProposal = async (proposalId: string) => {
    try {
      const res = await fetch(`/api/proposals/${proposalId}/accept`, {
        method: 'POST',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to accept proposal');
      }

      const data = await res.json();
      setEscrowSuccessModal(data.contractId);

      // Refresh job status and proposals list
      setJob((prev) => (prev ? { ...prev, status: 'IN_PROGRESS' } : null));
      setProposals((prev) =>
        prev.map((p) => (p.id === proposalId ? { ...p, status: 'ACCEPTED' } : p))
      );
    } catch (err: unknown) {
      const e = err as Error;
      alert(`Error accepting proposal: ${e.message}`);
    }
  };

  if (loading) {
    return (
      <div className="p-24 text-center flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
        <p className="text-surface-400 text-sm">Loading project specifications...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="glass-panel p-12 rounded-3xl text-center border border-surface-800 space-y-4 max-w-md mx-auto">
        <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
        <h2 className="text-lg font-bold text-white">Project Not Found</h2>
        <p className="text-xs text-surface-400">{error || 'This job listing is no longer available.'}</p>
        <Link
          href="/jobs"
          className="inline-block bg-surface-800 text-emerald-400 px-4 py-2 rounded-xl text-xs font-semibold"
        >
          Return to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Escrow Funded Modal */}
      {escrowSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full p-8 rounded-3xl border border-emerald-500/40 text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-white">Escrow Successfully Funded!</h3>
            <p className="text-xs text-surface-300 leading-relaxed">
              Your contract is now active. The agreed funds are securely held in Stripe Connect escrow and will only be
              released to the freelancer upon your milestone sign-off.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Link
                href={`/contracts/${escrowSuccessModal}`}
                className="theme-gradient-btn bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs shadow-md shadow-emerald-500/20"
              >
                View Contract & Milestones
              </Link>
              <button
                onClick={() => setEscrowSuccessModal(null)}
                className="bg-surface-800 text-surface-300 hover:text-white px-4 py-2.5 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Left Job Spec / Proposals + Right Client Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: 2 Spans */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-surface-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                  {job.category}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    job.status === 'OPEN'
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {job.status === 'OPEN' ? 'Accepting Proposals' : 'In Progress'}
                </span>
              </div>
              <span className="text-xs text-surface-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Posted {formatRelativeTime(job.createdAt)}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              {job.title}
            </h1>

            {/* Budget & Timeline Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-surface-900/80 border border-surface-800">
              <div>
                <span className="text-[11px] text-surface-400 uppercase font-semibold">Budget</span>
                <div className="text-base font-black text-emerald-400 flex items-center mt-0.5">
                  <DollarSign className="w-4 h-4 -mr-1" />
                  {job.budgetType === 'FIXED' ? (
                    <span>{formatCurrency(job.budgetAmount).replace('$', '')} Fixed</span>
                  ) : (
                    <span>
                      ${job.budgetMin} - ${job.budgetMax}/hr
                    </span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-[11px] text-surface-400 uppercase font-semibold">Project Duration</span>
                <div className="text-xs font-bold text-white mt-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-teal-400" />
                  <span>{job.estimatedDuration || '1 to 3 months'}</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] text-surface-400 uppercase font-semibold">Deadline</span>
                <div className="text-xs font-bold text-white mt-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Flexible'}</span>
                </div>
              </div>
            </div>

            {/* Tab Navigation for Client */}
            {isClientOwner && (
              <div className="flex items-center gap-2 pt-2 border-b border-surface-800">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`pb-3 text-xs font-bold transition-all border-b-2 ${
                    activeTab === 'description'
                      ? 'border-emerald-500 text-emerald-400'
                      : 'border-transparent text-surface-400 hover:text-surface-200'
                  }`}
                >
                  Job Overview
                </button>
                <button
                  onClick={() => setActiveTab('proposals')}
                  className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
                    activeTab === 'proposals'
                      ? 'border-emerald-500 text-emerald-400'
                      : 'border-transparent text-surface-400 hover:text-surface-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Received Proposals ({proposals.length})</span>
                </button>
              </div>
            )}
          </div>

          {/* Job Description View */}
          {(!isClientOwner || activeTab === 'description') && (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-surface-800 space-y-6">
              <div>
                <h3 className="text-base font-bold text-white mb-3">Project Specifications & Deliverables</h3>
                <div className="text-xs sm:text-sm text-surface-300 leading-relaxed whitespace-pre-line">
                  {job.description}
                </div>
              </div>

              {/* Skills Tags */}
              <div className="pt-4 border-t border-surface-800">
                <h4 className="text-xs font-semibold text-surface-400 mb-3">Required Technical Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg bg-surface-800 text-surface-200 text-xs font-medium border border-surface-700/60"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Proposals Tab View for Client */}
          {isClientOwner && activeTab === 'proposals' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">
                    Received Proposals ({proposals.length})
                  </h3>
                  <p className="text-xs text-surface-400 mt-0.5">
                    Compare technical milestone plans and fund Stripe escrow on hire
                  </p>
                </div>
              </div>

              {proposals.length === 0 ? (
                <div className="glass-panel p-12 rounded-2xl text-center border border-surface-800 text-surface-400 text-xs">
                  No proposals submitted for this project yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {proposals.map((proposal) => (
                    <ProposalCard
                      key={proposal.id}
                      proposal={proposal}
                      isClientOwner={true}
                      onAccept={handleAcceptProposal}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Freelancer: Submit Proposal Section */}
          {activeRole === 'FREELANCER' && (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-surface-800 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-surface-800">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Send className="w-5 h-5 text-emerald-400" />
                    <span>Submit Your Tailored Proposal</span>
                  </h3>
                  <p className="text-xs text-surface-400 mt-1">
                    Define structured deliverables, milestone amounts, and your technical execution plan.
                  </p>
                </div>
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] text-surface-400 uppercase font-semibold">Competition</span>
                  <div className="text-sm font-bold text-white">{proposals.length} bids received</div>
                </div>
              </div>

              {existingProposal ? (
                <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                    <CheckCircle className="w-5 h-5" />
                    <span>Proposal Submitted Successfully!</span>
                  </div>
                  <p className="text-xs text-surface-300">
                    Your bid of <strong>${existingProposal.bidAmount}</strong> is under review. Current status:{' '}
                    <span className="font-semibold text-emerald-300">{existingProposal.status}</span>.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleProposalSubmit} className="space-y-6">
                  {proposalSuccess && (
                    <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>{proposalSuccess}</span>
                    </div>
                  )}

                  {/* Bid Calculation Box */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-surface-900 border border-surface-800">
                    <div>
                      <label className="block text-xs font-semibold text-surface-300 mb-1">
                        Total Bid Amount ($)
                      </label>
                      <input
                        type="number"
                        min="50"
                        step="50"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        className="w-full bg-surface-950 text-white font-bold rounded-xl px-3 py-2 border border-surface-700 text-sm focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>

                    <div>
                      <span className="block text-xs font-semibold text-surface-400 mb-1">
                        Gigly Platform Fee (10%)
                      </span>
                      <div className="text-sm font-bold text-surface-400 py-2">
                        -${giglyFee.toLocaleString()}
                      </div>
                    </div>

                    <div>
                      <span className="block text-xs font-semibold text-emerald-400 mb-1">
                        Your Net Payout (in Escrow)
                      </span>
                      <div className="text-base font-black text-emerald-400 py-1.5">
                        ${netEarnings.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Milestone Planner */}
                  <div className="space-y-3 p-4 rounded-2xl bg-surface-900/60 border border-surface-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-white">
                        <Layers className="w-4 h-4 text-emerald-400" />
                        <span>Proposed Milestone Schedule</span>
                      </div>
                      <button
                        type="button"
                        onClick={addMilestone}
                        className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Milestone</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {milestones.map((milestone, idx) => (
                        <div
                          key={milestone.id}
                          className="flex flex-col sm:flex-row items-center gap-2 p-2.5 rounded-xl bg-surface-950/80 border border-surface-800 text-xs"
                        >
                          <span className="w-6 h-6 rounded-full bg-surface-800 flex items-center justify-center font-bold text-surface-300 text-[10px] flex-shrink-0">
                            {idx + 1}
                          </span>
                          <input
                            type="text"
                            value={milestone.title}
                            onChange={(e) => updateMilestone(milestone.id, 'title', e.target.value)}
                            placeholder="Milestone title..."
                            className="flex-1 bg-transparent text-white border-b sm:border-b-0 border-surface-700 py-1 px-2 focus:outline-none focus:border-emerald-500 w-full sm:w-auto"
                          />
                          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                            <div className="flex items-center gap-1 bg-surface-900 px-2 py-1 rounded border border-surface-800">
                              <span className="text-surface-400">$</span>
                              <input
                                type="number"
                                value={milestone.amount}
                                onChange={(e) => updateMilestone(milestone.id, 'amount', Number(e.target.value))}
                                className="w-16 bg-transparent text-white font-bold focus:outline-none"
                              />
                            </div>
                            <input
                              type="text"
                              value={milestone.duration}
                              onChange={(e) => updateMilestone(milestone.id, 'duration', e.target.value)}
                              className="w-20 bg-surface-900 px-2 py-1 rounded text-surface-300 border border-surface-800 text-center focus:outline-none"
                            />
                            {milestones.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeMilestone(milestone.id)}
                                className="p-1 text-surface-500 hover:text-rose-400"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Duration Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-surface-300 mb-1.5">
                      Estimated Completion Timeline
                    </label>
                    <select
                      value={estimatedDuration}
                      onChange={(e) => setEstimatedDuration(e.target.value)}
                      className="w-full bg-surface-900 text-white rounded-xl px-4 py-3 border border-surface-700 text-sm focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Less than 1 week">Less than 1 week</option>
                      <option value="1 to 2 weeks">1 to 2 weeks</option>
                      <option value="3 to 4 weeks">3 to 4 weeks</option>
                      <option value="1 to 3 months">1 to 3 months</option>
                      <option value="More than 3 months">More than 3 months</option>
                    </select>
                  </div>

                  {/* Cover Letter */}
                  <div>
                    <label className="block text-xs font-semibold text-surface-300 mb-1.5">
                      Cover Letter & Technical Approach
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Explain your approach, why you're a fit for this project, relevant repositories, and deliverables..."
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      className="w-full bg-surface-900 text-white rounded-xl px-4 py-3 border border-surface-700 text-sm focus:outline-none focus:border-emerald-500 leading-relaxed"
                      required
                    />
                  </div>

                  {/* Submit CTA */}
                  <div className="flex items-center justify-end">
                    <button
                      type="submit"
                      disabled={submittingProposal}
                      className="theme-gradient-btn bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-7 py-3 rounded-xl text-xs shadow-lg shadow-emerald-500/25 flex items-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50"
                    >
                      {submittingProposal ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Submitting to Client...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Proposal to Client</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Client Reputation & Escrow Badge */}
        <aside className="space-y-6">
          {/* Client Card */}
          <div className="glass-panel p-6 rounded-3xl border border-surface-800 space-y-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-surface-400">
              About the Client
            </h4>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl overflow-hidden relative border border-emerald-500/30 flex-shrink-0">
                <img
                  src={
                    job.client?.avatar ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                      job.client?.name || 'Client'
                    )}`
                  }
                  alt={job.client?.name || 'Client'}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{job.client?.name || 'Verified Client'}</h4>
                <p className="text-xs text-surface-400">
                  {job.client?.companyName || 'Technology Enterprise'}
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-surface-800 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-surface-400">Client Rating:</span>
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{job.client?.rating ? job.client.rating.toFixed(1) : '5.0'}</span>
                  <span className="text-surface-500">({job.client?.reviewCount || 14} reviews)</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-surface-400">Total Spent:</span>
                <span className="text-white font-semibold">
                  {formatCurrency(job.client?.totalSpent || 42500)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-surface-400">Payment Status:</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified & Escrow Ready
                </span>
              </div>
            </div>
          </div>

          {/* Escrow Guarantee Callout */}
          <div className="glass-card p-6 rounded-3xl border border-emerald-500/30 bg-emerald-950/20 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
              <Lock className="w-4 h-4" />
              <span>Stripe Connect Escrow</span>
            </div>
            <h5 className="text-sm font-bold text-white">Payment is 100% Protected</h5>
            <p className="text-xs text-surface-300 leading-relaxed">
              When a proposal is accepted, client funds are transferred into a dedicated escrow account. Payout is released
              only once milestones are verified and approved.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
