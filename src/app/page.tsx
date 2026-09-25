'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { JobCard } from '@/components/JobCard';
import { INITIAL_JOBS, DEMO_USERS } from '@/lib/mock-data';
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
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/jobs?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/jobs');
    }
  };

  const trendingTags = ['Next.js', 'PostgreSQL', 'Stripe API', 'TypeScript', 'AI/ML', 'Tailwind CSS'];

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative text-center pt-8 pb-12 overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-emerald-500/20 via-teal-500/10 to-cyan-500/20 blur-3xl pointer-events-none -z-10 rounded-full" />

        {/* Top Announcement Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Generation Proposal Hiring & Stripe Escrow</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
          Hire Elite Tech Talent with{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Proposal-Based Precision
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-surface-300 max-w-2xl mx-auto leading-relaxed">
          Skip rigid gig catalogs. Post your technical requirements, receive tailored proposals from verified software
          engineers, and secure milestones in <strong className="text-emerald-400">Stripe Connect escrow</strong>.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mt-8 max-w-2xl mx-auto relative">
          <div className="flex items-center glass-panel rounded-2xl p-2 border border-surface-700/80 shadow-2xl focus-within:border-emerald-500 transition-all">
            <Search className="w-5 h-5 text-surface-400 ml-3 mr-2" />
            <input
              type="text"
              placeholder="Search by skill, title, or keyword (e.g. Next.js, Stripe, AI)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-white placeholder-surface-400 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-md shadow-emerald-500/25 flex items-center gap-1.5"
            >
              <span>Search</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Filter Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
            <span className="text-surface-400 font-medium">Popular:</span>
            {trendingTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => router.push(`/jobs?skill=${encodeURIComponent(tag)}`)}
                className="px-2.5 py-1 rounded-full bg-surface-900/80 hover:bg-surface-800 text-surface-300 hover:text-emerald-400 border border-surface-800 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </form>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          <Link
            href="/jobs"
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition-all text-sm"
          >
            <span>Explore Open Jobs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/jobs/create"
            className="flex items-center gap-2 bg-surface-900/80 hover:bg-surface-800 text-white font-semibold px-6 py-3.5 rounded-xl border border-surface-700/80 hover:border-emerald-500/50 transition-all text-sm"
          >
            <Briefcase className="w-4 h-4 text-emerald-400" />
            <span>Post a Job as Client</span>
          </Link>
        </div>
      </section>

      {/* Metrics Banner */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Stripe Escrow Protected', value: '$2.8M+', icon: ShieldCheck, color: 'text-emerald-400' },
          { label: 'Tailored Proposals Sent', value: '45,000+', icon: FileCheck2, color: 'text-teal-400' },
          { label: 'Dispute-Free Delivery', value: '99.4%', icon: CheckCircle, color: 'text-cyan-400' },
          { label: 'Avg. First Bid Time', value: '< 14 mins', icon: Zap, color: 'text-amber-400' },
        ].map((metric, idx) => (
          <div key={idx} className="glass-panel p-5 rounded-2xl border border-surface-800/80 text-center">
            <metric.icon className={`w-5 h-5 mx-auto mb-2 ${metric.color}`} />
            <div className="text-2xl font-black text-white">{metric.value}</div>
            <div className="text-xs text-surface-400 mt-1">{metric.label}</div>
          </div>
        ))}
      </section>

      {/* How Proposal-Based Hiring Works */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">The Hiring Workflow</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Engineered for High-Trust Collaboration
          </h2>
          <p className="text-xs sm:text-sm text-surface-400 mt-2">
            No cookie-cutter templates. Custom proposals, transparent milestone reviews, and automated payments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Post Detailed Job',
              desc: 'Define scope, tech stack, budget parameters, and delivery timeline.',
              icon: Briefcase,
            },
            {
              step: '02',
              title: 'Review Tailored Bids',
              desc: 'Compare freelancer cover letters, estimated milestones, and hourly or fixed bids.',
              icon: FileCheck2,
            },
            {
              step: '03',
              title: 'Fund Escrow on Hire',
              desc: 'Accept winning proposal; client funds are safely locked in Stripe escrow.',
              icon: Lock,
            },
            {
              step: '04',
              title: 'Inspect & Release',
              desc: 'Approve completed milestones to automatically release funds and leave ratings.',
              icon: CheckCircle,
            },
          ].map((item, idx) => (
            <div key={idx} className="glass-card p-6 rounded-2xl border border-surface-800/80 relative">
              <span className="text-3xl font-black text-surface-800 absolute top-4 right-4">{item.step}</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                <item.icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
              <p className="text-xs text-surface-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Recent Featured Jobs</h2>
            <p className="text-xs text-surface-400 mt-0.5">High-impact projects looking for proposals right now</p>
          </div>

          <Link
            href="/jobs"
            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
          >
            <span>View all {INITIAL_JOBS.length} jobs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {INITIAL_JOBS.slice(0, 4).map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>

      {/* Verified Talent Spotlight */}
      <section className="glass-panel p-8 rounded-3xl border border-surface-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Verified Specialists</span>
            <h2 className="text-2xl font-black text-white mt-1">Hire Top 3% Engineering Talent</h2>
            <p className="text-xs text-surface-400 mt-1">Vetted specialists ready to submit custom proposals</p>
          </div>

          <Link
            href="/jobs/create"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow-md shadow-emerald-500/20"
          >
            <span>Post a Job to Invite Talent</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {DEMO_USERS.filter((u) => u.role === 'FREELANCER' || u.role === 'BOTH').map((freelancer) => (
            <div key={freelancer.id} className="glass-card p-5 rounded-2xl border border-surface-700/60">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden relative border border-emerald-500/30 flex-shrink-0">
                  <img
                    src={freelancer.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={freelancer.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{freelancer.name}</h4>
                    <span className="text-xs text-emerald-400 font-bold">${freelancer.hourlyRate}/hr</span>
                  </div>
                  <p className="text-xs text-surface-400 mt-0.5">{freelancer.title}</p>
                  <p className="text-[11px] text-surface-500 mt-1">
                    Rating: {freelancer.rating} ({freelancer.reviewCount} reviews) • ${freelancer.totalEarnings.toLocaleString()} earned
                  </p>
                </div>
              </div>
              <p className="text-xs text-surface-300 mt-3 line-clamp-2 leading-relaxed">
                {freelancer.bio}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Dual Role Callout */}
      <section className="glass-card p-8 rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-surface-900 via-surface-900 to-emerald-950/30 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
            <Users2 className="w-3.5 h-3.5" />
            <span>Dual Perspective Architecture</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            One Unified Account. Switch Roles in One Click.
          </h3>
          <p className="text-xs sm:text-sm text-surface-300 leading-relaxed">
            Need to hire a specialist today and take on client work tomorrow? Use the interactive role switcher in the
            navigation bar anytime to toggle seamlessly between Client and Freelancer perspectives.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <Link
            href="/auth/signup"
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-3 rounded-xl text-xs transition-all shadow-md shadow-emerald-500/25"
          >
            Create Your Account
          </Link>
        </div>
      </section>
    </div>
  );
}
