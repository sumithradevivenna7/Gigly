'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { JobCard } from '@/components/JobCard';
import { Job } from '@/types';
import { INITIAL_JOBS, INITIAL_SKILLS } from '@/lib/mock-data';
import {
  Search,
  Filter,
  DollarSign,
  Tag,
  ArrowUpDown,
  RotateCcw,
  Loader2,
  Briefcase,
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

  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [loading, setLoading] = useState(true);

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
    return jobs.filter((job) => {
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
  }, [jobs, selectedCategory, selectedSkill, budgetType, minBudget]);

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedSkill('');
    setBudgetType('ALL');
    setMinBudget(0);
    setSortBy('newest');
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-surface-800">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Freelancer Job Marketplace
          </span>
          <h1 className="text-3xl font-black text-white tracking-tight mt-1">
            Browse High-Budget Software Projects
          </h1>
          <p className="text-xs sm:text-sm text-surface-300 mt-2">
            Submit custom proposals with your milestones, bid amount, and technical delivery timeframe.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mt-6 flex items-center glass-card rounded-2xl p-2 border border-surface-700/80">
          <Search className="w-5 h-5 text-surface-400 ml-3 mr-2" />
          <input
            type="text"
            placeholder="Search keywords, tech stack, or job titles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder-surface-400 focus:outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="text-xs text-surface-400 hover:text-white px-2"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Jobs List */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar Filters */}
        <aside className="space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-surface-800 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-surface-800">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Filter className="w-4 h-4 text-emerald-400" />
                <span>Filters</span>
              </div>
              <button
                onClick={resetFilters}
                className="text-xs text-surface-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-surface-300">Category</label>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedCategory === cat
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'text-surface-400 hover:bg-surface-800 hover:text-surface-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget Type */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-surface-300 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>Budget Type</span>
              </label>
              <div className="grid grid-cols-3 gap-1 p-1 bg-surface-900 rounded-xl border border-surface-800">
                {(['ALL', 'FIXED', 'HOURLY'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setBudgetType(type)}
                    className={`py-1 rounded-lg text-[11px] font-semibold transition-all ${
                      budgetType === type
                        ? 'bg-emerald-500 text-slate-950 shadow-sm'
                        : 'text-surface-400 hover:text-surface-200'
                    }`}
                  >
                    {type === 'ALL' ? 'Any' : type === 'FIXED' ? 'Fixed' : 'Hourly'}
                  </button>
                ))}
              </div>
            </div>

            {/* Minimum Budget */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-surface-300">Min Budget</span>
                <span className="text-emerald-400 font-bold">${minBudget}+</span>
              </div>
              <input
                type="range"
                min="0"
                max="5000"
                step="250"
                value={minBudget}
                onChange={(e) => setMinBudget(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Popular Skills Chips */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-surface-300 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-teal-400" />
                <span>Filter by Skill</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {INITIAL_SKILLS.map((skill) => {
                  const isSelected = selectedSkill.toLowerCase() === skill.name.toLowerCase();
                  return (
                    <button
                      key={skill.id}
                      onClick={() => setSelectedSkill(isSelected ? '' : skill.name)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'bg-surface-800/80 text-surface-400 hover:bg-surface-800 hover:text-surface-200 border border-surface-700/40'
                      }`}
                    >
                      {skill.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* Right: Jobs List */}
        <section className="lg:col-span-3 space-y-4">
          {/* Results Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 glass-panel p-4 rounded-2xl border border-surface-800 text-xs">
            <div className="flex items-center gap-2 text-surface-400">
              <span className="font-bold text-white">{filteredJobs.length}</span>
              <span>jobs available matching criteria</span>
            </div>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-surface-400" />
              <span className="text-surface-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'budget_high' | 'budget_low')}
                className="bg-surface-900 text-white rounded-lg px-2.5 py-1.5 border border-surface-700 text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="newest">Newest First</option>
                <option value="budget_high">Highest Budget</option>
                <option value="budget_low">Lowest Budget</option>
              </select>
            </div>
          </div>

          {/* Jobs Listing */}
          {loading ? (
            <div className="p-16 text-center text-surface-400 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
              <p className="text-sm">Fetching verified job listings...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="glass-panel p-12 rounded-2xl text-center border border-surface-800 space-y-3">
              <Briefcase className="w-10 h-10 text-surface-500 mx-auto" />
              <h3 className="text-base font-bold text-white">No jobs match your current filters</h3>
              <p className="text-xs text-surface-400 max-w-sm mx-auto">
                Try loosening your filters or resetting the search query to discover more projects.
              </p>
              <button
                onClick={resetFilters}
                className="mt-2 bg-surface-800 hover:bg-surface-700 text-emerald-400 px-4 py-2 rounded-xl text-xs font-semibold"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-24 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
          <p className="text-surface-400 text-sm">Loading job marketplace...</p>
        </div>
      }
    >
      <JobsContent />
    </Suspense>
  );
}
