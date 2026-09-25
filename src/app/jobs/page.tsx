'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { JobCard } from '@/components/JobCard';
import { Job } from '@/types';
import { INITIAL_JOBS, INITIAL_SKILLS } from '@/lib/mock-data';
import { useActiveRole } from '@/components/Providers';
import {
  Search,
  Filter,
  DollarSign,
  Tag,
  ArrowUpDown,
  RotateCcw,
  Loader2,
  Briefcase,
  LayoutGrid,
  List,
  Sparkles,
  SlidersHorizontal,
  X,
  ShieldCheck,
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Web Development',
  'Backend & APIs',
  'Design & Creative',
  'DevOps & Architecture',
  'AI & Machine Learning',
];

function JobsContent() {
  const searchParams = useSearchParams();
  const initialSkill = searchParams.get('skill') || '';
  const initialSearch = searchParams.get('search') || '';
  const { activeRole } = useActiveRole();

  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter States
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSkill, setSelectedSkill] = useState(initialSkill);
  const [budgetType, setBudgetType] = useState<'ALL' | 'FIXED' | 'HOURLY'>('ALL');
  const [minBudget, setMinBudget] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'newest' | 'budget_high' | 'budget_low'>('newest');

  // Fetch jobs from API
  useEffect(() => {
    async function loadJobs() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (selectedCategory && selectedCategory !== 'All') params.set('category', selectedCategory);
        if (selectedSkill) params.set('skill', selectedSkill);
        if (budgetType !== 'ALL') params.set('budgetType', budgetType);
        if (minBudget > 0) params.set('minBudget', minBudget.toString());
        params.set('sort', sortBy);

        const res = await fetch(`/api/jobs?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setJobs(data);
        } else {
          setJobs(INITIAL_JOBS);
        }
      } catch {
        setJobs(INITIAL_JOBS);
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, [search, selectedCategory, selectedSkill, budgetType, minBudget, sortBy]);

  // Client-side quick filter for smooth responsiveness
  const filteredJobs = useMemo(() => {
    let result = jobs.filter((job) => {
      if (selectedCategory !== 'All' && job.category !== selectedCategory) return false;
      if (selectedSkill && !job.requiredSkills.some((s) => s.toLowerCase() === selectedSkill.toLowerCase()))
        return false;
      if (budgetType !== 'ALL' && job.budgetType !== budgetType) return false;
      if (minBudget > 0) {
        const val = job.budgetType === 'FIXED' ? (job.budgetAmount ?? 0) : (job.budgetMin ?? 0);
        if (val < minBudget) return false;
      }
      return true;
    });

    if (sortBy === 'budget_high') {
      result.sort((a, b) => (b.budgetAmount || b.budgetMax || 0) - (a.budgetAmount || a.budgetMax || 0));
    } else if (sortBy === 'budget_low') {
      result.sort((a, b) => (a.budgetAmount || a.budgetMin || 0) - (b.budgetAmount || b.budgetMin || 0));
    }

    return result;
  }, [jobs, selectedCategory, selectedSkill, budgetType, minBudget, sortBy]);

  const totalMarketVolume = useMemo(() => {
    return jobs.reduce((sum, j) => sum + (j.budgetAmount || (j.budgetMin ? j.budgetMin * 40 : 2000)), 0);
  }, [jobs]);

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedSkill('');
    setBudgetType('ALL');
    setMinBudget(0);
    setSortBy('newest');
  };

  const hasActiveFilters = search || selectedCategory !== 'All' || selectedSkill || budgetType !== 'ALL' || minBudget > 0 || sortBy !== 'newest';

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-surface-800 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified Tech Opportunities</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Browse Software Projects & Bids
            </h1>
            <p className="text-xs sm:text-sm text-surface-300 mt-2 leading-relaxed">
              Submit structured proposals with milestone deliverables, timeline estimates, and secure Stripe escrow coverage.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 bg-surface-900/90 p-3.5 rounded-2xl border border-surface-800 self-start lg:self-auto">
            <div>
              <span className="text-[10px] text-surface-400 font-semibold uppercase">Open Projects</span>
              <div className="text-xl font-black text-white">{filteredJobs.length}</div>
            </div>
            <div className="w-px h-8 bg-surface-800" />
            <div>
              <span className="text-[10px] text-surface-400 font-semibold uppercase">Total Escrow Budget</span>
              <div className="text-xl font-black text-emerald-400">${totalMarketVolume.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-6 flex items-center glass-card rounded-2xl p-2 border border-surface-700/80 focus-within:border-emerald-500/80 shadow-lg">
          <Search className="w-5 h-5 text-surface-400 ml-3 mr-2" />
          <input
            type="text"
            placeholder="Search keywords, tech stack, or job titles (e.g. Next.js, Stripe, AI)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder-surface-400 focus:outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="p-1.5 text-surface-400 hover:text-white mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Filter & Layout Controls */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar Filter Controls */}
        <div className="w-full lg:w-72 flex-shrink-0 space-y-5">
          <div className="glass-panel p-5 rounded-2xl border border-surface-800 space-y-5">
            <div className="flex items-center justify-between border-b border-surface-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
                <span>Filters & Options</span>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1 text-[11px] text-emerald-400 hover:underline font-semibold"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Category Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-surface-300 block">Category</label>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedCategory === cat
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold'
                        : 'text-surface-400 hover:bg-surface-800 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget Type Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-surface-300 block">Payment Type</label>
              <div className="grid grid-cols-3 gap-1 bg-surface-900/80 p-1 rounded-xl border border-surface-800">
                {(['ALL', 'FIXED', 'HOURLY'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setBudgetType(type)}
                    className={`py-1 text-[11px] font-semibold rounded-lg transition-all ${
                      budgetType === type
                        ? 'bg-emerald-500 text-slate-950 shadow-sm'
                        : 'text-surface-400 hover:text-white'
                    }`}
                  >
                    {type === 'ALL' ? 'All' : type === 'FIXED' ? 'Fixed' : 'Hourly'}
                  </button>
                ))}
              </div>
            </div>

            {/* Min Budget Range */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-surface-300">Min Budget</label>
                <span className="text-emerald-400 font-bold">${minBudget.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="0"
                max="8000"
                step="500"
                value={minBudget}
                onChange={(e) => setMinBudget(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Popular Skills Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-surface-300 block">Filter by Tech Stack</label>
              <div className="flex flex-wrap gap-1.5">
                {INITIAL_SKILLS.slice(0, 10).map((skill) => {
                  const isSelected = selectedSkill.toLowerCase() === skill.toLowerCase();
                  return (
                    <button
                      key={skill}
                      onClick={() => setSelectedSkill(isSelected ? '' : skill)}
                      className={`text-[11px] px-2.5 py-1 rounded-md transition-all ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                          : 'bg-surface-800 text-surface-300 hover:text-white border border-surface-700/50'
                      }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Job Feed Area */}
        <div className="flex-1 space-y-4">
          {/* Controls Bar: Sort & View Toggle */}
          <div className="glass-card p-3 rounded-2xl border border-surface-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-surface-300">
              <span>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-surface-900 border border-surface-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="newest">Most Recent</option>
                <option value="budget_high">Highest Budget</option>
                <option value="budget_low">Lowest Budget</option>
              </select>
            </div>

            {/* View Mode Switcher: Grid vs List */}
            <div className="flex items-center bg-surface-900 p-1 rounded-xl border border-surface-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'grid' ? 'bg-emerald-500 text-slate-950' : 'text-surface-400 hover:text-white'
                }`}
                title="Grid Bento View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'list' ? 'bg-emerald-500 text-slate-950' : 'text-surface-400 hover:text-white'
                }`}
                title="Compact List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Jobs Listing */}
          {loading ? (
            <div className="glass-panel p-16 rounded-3xl text-center border border-surface-800 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
              <span className="text-xs text-surface-400">Loading marketplace opportunities...</span>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="glass-panel p-16 rounded-3xl text-center border border-surface-800 space-y-3">
              <Briefcase className="w-10 h-10 text-surface-500 mx-auto" />
              <h3 className="text-base font-bold text-white">No jobs match your filter criteria</h3>
              <p className="text-xs text-surface-400 max-w-sm mx-auto">
                Try clearing your search query or selecting &quot;All&quot; categories to view all active openings.
              </p>
              <button
                onClick={resetFilters}
                className="mt-3 theme-gradient-btn bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-3'}>
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} userRole={activeRole} viewMode={viewMode} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-surface-400">Loading jobs marketplace...</div>}>
      <JobsContent />
    </Suspense>
  );
}
