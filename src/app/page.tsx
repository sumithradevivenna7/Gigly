'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { JobCard } from '@/components/JobCard';
import { INITIAL_JOBS, DEMO_USERS } from '@/lib/mock-data';
import { useUITheme } from '@/components/ThemeContext';
import { Scene } from '@/components/Scene';
import {
  Sparkles,
  Search,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle,
  Briefcase,
  FileCheck2,
  Users2,
  Lock,
  DollarSign,
  Layers,
  Cpu,
  ChevronRight,
  TrendingUp,
  Award,
  Clock,
  ShieldAlert,
  ArrowUpRight,
  Code2,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { theme } = useUITheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFeedTab, setSelectedFeedTab] = useState<'all' | 'high_budget' | 'ai' | 'fixed'>('all');

  // Interactive Escrow Calculator State
  const [calcBudget, setCalcBudget] = useState(4500);
  const [calcMilestones, setCalcMilestones] = useState(3);

  const giglyFee = Math.round(calcBudget * 0.1);
  const freelancerPayout = calcBudget - giglyFee;
  const milestoneAmount = Math.round(calcBudget / calcMilestones);

  // Escrow Stepper Demo State
  const [activeStep, setActiveStep] = useState(1);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/jobs?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/jobs');
    }
  };

  const trendingTags = ['Next.js 14', 'PostgreSQL', 'Stripe Connect', 'TypeScript', 'AI & LLMs', 'Tailwind CSS'];

  const filteredFeedJobs = useMemo(() => {
    if (selectedFeedTab === 'high_budget') {
      return INITIAL_JOBS.filter((j) => (j.budgetAmount ?? 0) >= 4000 || (j.budgetMax ?? 0) >= 80);
    }
    if (selectedFeedTab === 'ai') {
      return INITIAL_JOBS.filter((j) => j.requiredSkills.some((s) => s.toLowerCase().includes('ai') || s.toLowerCase().includes('llm') || s.toLowerCase().includes('python')));
    }
    if (selectedFeedTab === 'fixed') {
      return INITIAL_JOBS.filter((j) => j.budgetType === 'FIXED');
    }
    return INITIAL_JOBS;
  }, [selectedFeedTab]);

  return (
    <div className="space-y-28">
      {/* 1. HERO SECTION */}
      <section className="relative text-center pt-8 pb-10 overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[400px] bg-gradient-to-tr from-emerald-500/20 via-cyan-500/15 to-indigo-500/20 blur-3xl pointer-events-none -z-10 rounded-full animate-pulse-glow" />

        {/* Top Announcement Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass-card text-xs font-medium mb-6 shadow-md border border-white/10">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
          <span className="text-surface-200">Next-Generation Proposal Hiring &amp; Stripe Connect Escrow</span>
          <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] text-white font-semibold uppercase tracking-wider">v2.4</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.08] max-w-5xl mx-auto">
          Hire Elite Tech Talent with{' '}
          <span className="serif-accent text-emerald-300 font-normal">
            Proposal Precision
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-surface-300 max-w-3xl mx-auto leading-relaxed font-normal">
          Skip generic catalogs. Post complex technical requirements, evaluate structured milestone bids from vetted engineers, and lock payments in safe <strong className="text-emerald-400 font-bold">Stripe Connect Escrow</strong>.
        </p>

        {/* Hero Search Bar */}
        <form onSubmit={handleSearch} className="mt-9 max-w-3xl mx-auto relative group">
          <div className="flex items-center glass-panel rounded-2xl p-2.5 border border-surface-700/80 shadow-2xl focus-within:border-emerald-500/80 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
            <Search className="w-5 h-5 text-surface-400 ml-3 mr-2 group-focus-within:text-emerald-400 transition-colors" />
            <input
              type="text"
              placeholder="Search by skill or project (e.g. Next.js, Stripe Escrow, AI Agent, Rust)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm sm:text-base text-white placeholder-surface-400 focus:outline-none"
            />
            <button
              type="submit"
              className="theme-gradient-btn bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-all shadow-lg flex items-center gap-2 flex-shrink-0"
            >
              <span>Search Projects</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Filter Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
            <span className="text-surface-400 font-medium">Trending Tech:</span>
            {trendingTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => router.push(`/jobs?skill=${encodeURIComponent(tag)}`)}
                className="px-3 py-1 rounded-full glass-card text-surface-300 hover:text-white border border-surface-700/60 hover:border-emerald-500/50 transition-all"
              >
                {tag}
              </button>
            ))}
          </div>
        </form>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          <Link
            href="/jobs"
            className="theme-gradient-btn bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-7 py-3.5 rounded-xl shadow-xl hover:scale-[1.03] transition-all text-sm flex items-center gap-2"
          >
            <Briefcase className="w-4 h-4" />
            <span>Explore 50+ Open Jobs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/jobs/create"
            className="glass-card hover:bg-surface-800 text-white font-semibold px-7 py-3.5 rounded-xl border border-surface-700/80 hover:border-emerald-500/50 transition-all text-sm flex items-center gap-2 shadow-lg"
          >
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>Post Job Requirements</span>
          </Link>
        </div>
      </section>

      {/* 2. METRICS BANNER */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Stripe Escrow Protected', value: '$3.4M+', icon: ShieldCheck, color: 'text-emerald-400', desc: 'Zero unauthorized payouts' },
          { label: 'Tailored Proposals Sent', value: '48,200+', icon: FileCheck2, color: 'text-teal-400', desc: 'Custom milestone breakdowns' },
          { label: 'Dispute-Free Delivery', value: '99.6%', icon: CheckCircle, color: 'text-cyan-400', desc: 'Contract milestone verification' },
          { label: 'Avg. First Bid Response', value: '< 11 mins', icon: Zap, color: 'text-amber-400', desc: 'From top 3% developers' },
        ].map((metric, idx) => (
          <div key={idx} className="glass-card p-6 rounded-2xl border border-surface-800/80 text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <metric.icon className={`w-6 h-6 mx-auto mb-2.5 ${metric.color}`} />
            <div className="text-3xl font-black text-white tracking-tight">{metric.value}</div>
            <div className="text-xs font-semibold text-surface-200 mt-1">{metric.label}</div>
            <div className="text-[11px] text-surface-400 mt-0.5">{metric.desc}</div>
          </div>
        ))}
      </section>

      {/* 2.5 3D ORB GALLERY SPHERE SHOWCASE */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Three.js 3D Orb Gallery & Embedded Canvas</span>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">
              Interactive 3D Interface Sphere
            </h2>
            <p className="text-xs sm:text-sm text-surface-300 mt-1">
              Drag to spin the 3D globe &middot; hover over UI components &middot; inertial physics &amp; depth lighting
            </p>
          </div>
        </div>

        <Scene />
      </section>

      {/* 3. INTERACTIVE BENTO GRID: PLATFORM SUPERPOWERS */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Next-Gen Architecture</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-1 tracking-tight">
            Designed for High-Value Engineering
          </h2>
          <p className="text-xs sm:text-sm text-surface-300 mt-2 leading-relaxed">
            Everything you need to formulate proposals, fund milestones, and release escrow with full confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {/* Bento Item 1: Escrow Vault (Large 2 cols) */}
          <div className="md:col-span-2 glass-panel p-7 rounded-3xl border border-emerald-500/30 relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-3 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                <Lock className="w-3.5 h-3.5" />
                <span>Stripe Connect Milestone Escrow</span>
              </div>
              <h3 className="text-2xl font-black text-white">Guaranteed Safe Payments</h3>
              <p className="text-xs sm:text-sm text-surface-300 max-w-md leading-relaxed">
                Clients deposit funds upfront. Developers start with 100% confidence. Funds are released step-by-step only upon milestone approval.
              </p>
            </div>

            {/* Interactive Escrow Simulator inside card */}
            <div className="mt-6 p-4 rounded-2xl bg-surface-900/90 border border-surface-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-surface-400">Simulate Contract Budget:</span>
                <span className="font-bold text-emerald-400 text-sm">${calcBudget.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="15000"
                step="500"
                value={calcBudget}
                onChange={(e) => setCalcBudget(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-surface-800 text-center">
                <div className="p-2 rounded-xl bg-surface-950/60">
                  <div className="text-[10px] text-surface-400">Escrow Locked</div>
                  <div className="text-xs font-bold text-white">${calcBudget.toLocaleString()}</div>
                </div>
                <div className="p-2 rounded-xl bg-surface-950/60">
                  <div className="text-[10px] text-surface-400">{calcMilestones} Milestones</div>
                  <div className="text-xs font-bold text-teal-400">${milestoneAmount}/ea</div>
                </div>
                <div className="p-2 rounded-xl bg-surface-950/60">
                  <div className="text-[10px] text-surface-400">Dev Net Payout</div>
                  <div className="text-xs font-bold text-emerald-400">${freelancerPayout.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bento Item 2: Proposal Studio */}
          <div className="glass-card p-6 rounded-3xl border border-surface-700/60 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Detailed Proposals</h3>
              <p className="text-xs text-surface-300 leading-relaxed">
                Structured bids with custom deliverable milestones, timeline breakdown, and direct chat.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-surface-800 text-[11px] text-teal-400 font-semibold flex items-center gap-1">
              <span>92% faster acceptance</span>
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Bento Item 3: Dual Role Architecture */}
          <div className="glass-card p-6 rounded-3xl border border-surface-700/60 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Users2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Dual Perspectives</h3>
              <p className="text-xs text-surface-300 leading-relaxed">
                Switch instantly between Client and Freelancer modes without creating separate logins.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-surface-800 text-[11px] text-cyan-400 font-semibold flex items-center gap-1">
              <span>Unified single profile</span>
              <CheckCircle className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Bento Item 4: Verified Tech Stack */}
          <div className="glass-card p-6 rounded-3xl border border-surface-700/60 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Tech Matchmaking</h3>
              <p className="text-xs text-surface-300 leading-relaxed">
                Direct matching with verified React, Next.js, AI/ML, and Cloud architecture engineers.
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-1">
              <span className="text-[10px] px-2 py-0.5 rounded bg-surface-800 text-surface-300">Next.js 14</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-surface-800 text-surface-300">TypeScript</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-surface-800 text-surface-300">Stripe</span>
            </div>
          </div>

          {/* Bento Item 5: Transparent Milestone Tracker (3 cols) */}
          <div className="md:col-span-3 glass-card p-6 rounded-3xl border border-surface-700/60 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1 max-w-md">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Automated Dispute Protection</span>
              </div>
              <h4 className="text-lg font-bold text-white">Deterministic Deliverables & Code Reviews</h4>
              <p className="text-xs text-surface-300">
                Every contract includes clear GitHub commits or artifact deliverables for seamless inspection before payout release.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/contracts"
                className="theme-gradient-btn bg-emerald-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5"
              >
                <span>View Escrow Live Demo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ESCROW WORKFLOW VISUALIZER */}
      <section className="glass-panel p-8 sm:p-10 rounded-3xl border border-surface-800 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">How It Works</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">The 4-Step Escrow Protocol</h2>
            <p className="text-xs sm:text-sm text-surface-300 mt-1">
              Click through the steps below to see how funds move safely through Stripe Connect.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((step) => (
              <button
                key={step}
                onClick={() => setActiveStep(step)}
                className={`w-9 h-9 rounded-xl font-bold text-xs transition-all ${
                  activeStep === step
                    ? 'bg-emerald-500 text-slate-950 scale-110 shadow-lg shadow-emerald-500/30'
                    : 'glass-card text-surface-400 hover:text-white'
                }`}
              >
                0{step}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              step: 1,
              title: 'Post Job & Specs',
              desc: 'Client publishes requirements, budget limits, and target stack.',
              icon: Briefcase,
              status: 'Open for Bids',
            },
            {
              step: 2,
              title: 'Submit Custom Bids',
              desc: 'Engineers submit milestones, cover letters, and proposed quotes.',
              icon: FileCheck2,
              status: 'Proposal Review',
            },
            {
              step: 3,
              title: 'Fund Stripe Escrow',
              desc: 'Client accepts bid; funds are securely locked in Stripe vault.',
              icon: Lock,
              status: 'Escrow Active',
            },
            {
              step: 4,
              title: 'Inspect & Release',
              desc: 'Milestones verified; payout transfers directly to freelancer account.',
              icon: CheckCircle,
              status: 'Payout Complete',
            },
          ].map((item) => {
            const isCurrent = activeStep === item.step;
            return (
              <div
                key={item.step}
                onClick={() => setActiveStep(item.step)}
                className={`cursor-pointer p-6 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'glass-card border-emerald-500/80 bg-surface-800/80 ring-2 ring-emerald-500/20 shadow-xl'
                    : 'glass-card border-surface-800 hover:border-surface-700 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isCurrent
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'bg-surface-800 text-surface-400'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      isCurrent
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-surface-900 text-surface-500'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mb-1.5">{item.title}</h3>
                <p className="text-xs text-surface-300 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. DYNAMIC JOB FEED WITH FILTER TABS */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Recent Featured Projects</h2>
            <p className="text-xs sm:text-sm text-surface-400 mt-0.5">
              High-impact projects accepting proposals right now
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-surface-900/90 p-1 rounded-xl border border-surface-800">
              {[
                { id: 'all', label: 'All Jobs' },
                { id: 'high_budget', label: 'High Budget ($4k+)' },
                { id: 'ai', label: 'AI & ML' },
                { id: 'fixed', label: 'Fixed Price' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedFeedTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedFeedTab === tab.id
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'text-surface-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <Link
              href="/jobs"
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 ml-2"
            >
              <span>View all {INITIAL_JOBS.length}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredFeedJobs.slice(0, 4).map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>

      {/* 6. VERIFIED SPECIALISTS SPOTLIGHT */}
      <section className="glass-panel p-8 sm:p-10 rounded-3xl border border-surface-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Verified Talent Pool</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">Hire Top 3% Specialized Engineers</h2>
            <p className="text-xs sm:text-sm text-surface-400 mt-1">
              Screened specialists ready to provide instant milestone proposals
            </p>
          </div>

          <Link
            href="/jobs/create"
            className="theme-gradient-btn bg-emerald-500 text-slate-950 font-bold px-5 py-3 rounded-xl text-xs flex items-center gap-2 self-start sm:self-auto shadow-lg"
          >
            <span>Post a Job to Invite Talent</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {DEMO_USERS.filter((u) => u.role === 'FREELANCER' || u.role === 'BOTH').map((freelancer) => (
            <div key={freelancer.id} className="glass-card p-5 rounded-2xl border border-surface-700/60 group hover:border-emerald-500/40">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden relative border border-emerald-500/30 flex-shrink-0">
                  <img
                    src={freelancer.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={freelancer.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{freelancer.name}</h4>
                    <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      ${freelancer.hourlyRate}/hr
                    </span>
                  </div>
                  <p className="text-xs text-surface-300 mt-0.5 font-medium">{freelancer.title}</p>
                  <div className="flex items-center gap-2 text-[11px] text-surface-400 mt-1">
                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      <Award className="w-3 h-3" />
                      {freelancer.rating}
                    </span>
                    <span>• {freelancer.reviewCount} reviews</span>
                    <span>• ${freelancer.totalEarnings.toLocaleString()} earned</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-surface-300 mt-3 line-clamp-2 leading-relaxed">
                {freelancer.bio}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. DUAL ROLE ACTION BANNER */}
      <section className="glass-card p-8 sm:p-10 rounded-3xl border border-emerald-500/40 bg-gradient-to-r from-surface-900 via-surface-900 to-emerald-950/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
            <Users2 className="w-3.5 h-3.5" />
            <span>Unified Marketplace Identity</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white">
            One Account. Unlimited Flexibility.
          </h3>
          <p className="text-xs sm:text-sm text-surface-300 leading-relaxed">
            Switch between hiring talent and submitting proposals at any time using the interactive role switcher in the top navigation bar.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <Link
            href="/jobs"
            className="theme-gradient-btn bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-6 py-3.5 rounded-xl text-xs sm:text-sm transition-all shadow-xl"
          >
            Start Exploring Now
          </Link>
        </div>
      </section>
    </div>
  );
}
