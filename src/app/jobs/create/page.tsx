'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { INITIAL_SKILLS } from '@/lib/mock-data';
import {
  Briefcase,
  DollarSign,
  Calendar,
  Clock,
  Plus,
  X,
  ShieldCheck,
  ArrowRight,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

const CATEGORIES = [
  'Web Development',
  'Backend & APIs',
  'Design & Creative',
  'DevOps & Architecture',
  'AI & Machine Learning',
];

export default function CreateJobPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [description, setDescription] = useState('');
  const [budgetType, setBudgetType] = useState<'FIXED' | 'HOURLY'>('FIXED');
  const [budgetAmount, setBudgetAmount] = useState('3500');
  const [budgetMin, setBudgetMin] = useState('50');
  const [budgetMax, setBudgetMax] = useState('80');
  const [estimatedDuration, setEstimatedDuration] = useState('1 to 3 months');
  const [deadline, setDeadline] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    'Next.js',
    'TypeScript',
    'Tailwind CSS',
  ]);
  const [customSkill, setCustomSkill] = useState('');

  const toggleSkill = (skillName: string) => {
    if (selectedSkills.includes(skillName)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skillName));
    } else {
      setSelectedSkills([...selectedSkills, skillName]);
    }
  };

  const addCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      setSelectedSkills([...selectedSkills, customSkill.trim()]);
      setCustomSkill('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please provide a job title.');
      return;
    }
    if (!description.trim() || description.length < 30) {
      setError('Please provide a detailed description (at least 30 characters).');
      return;
    }
    if (selectedSkills.length === 0) {
      setError('Please select at least one required skill.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          description,
          budgetType,
          budgetAmount: budgetType === 'FIXED' ? budgetAmount : null,
          budgetMin: budgetType === 'HOURLY' ? budgetMin : null,
          budgetMax: budgetType === 'HOURLY' ? budgetMax : null,
          estimatedDuration,
          deadline: deadline || null,
          requiredSkills: selectedSkills,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to post job');
      }

      const createdJob = await res.json();
      router.push(`/jobs/${createdJob.id}`);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-surface-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-slate-950 font-bold">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Post a Project & Receive Proposals
            </h1>
            <p className="text-xs sm:text-sm text-surface-400 mt-1">
              Top freelancers will craft customized technical bids. Client escrow is funded upon hiring.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Title & Category */}
        <div className="glass-panel p-6 rounded-2xl border border-surface-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center border border-emerald-500/30">
              1
            </span>
            Project Scope & Category
          </h2>

          <div>
            <label className="block text-xs font-semibold text-surface-300 mb-1.5">
              Job Title <span className="text-emerald-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Senior Full-Stack Engineer for Next.js AI Copilot"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-surface-900 text-white rounded-xl px-4 py-3 border border-surface-700 text-sm focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-surface-300 mb-1.5">
              Primary Category <span className="text-emerald-400">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-surface-900 text-white rounded-xl px-4 py-3 border border-surface-700 text-sm focus:outline-none focus:border-emerald-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-surface-300 mb-1.5">
              Detailed Description <span className="text-emerald-400">*</span>
            </label>
            <textarea
              rows={6}
              placeholder="Outline deliverables, required architectural skills, milestone expectations, and stack details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-surface-900 text-white rounded-xl px-4 py-3 border border-surface-700 text-sm focus:outline-none focus:border-emerald-500 leading-relaxed"
              required
            />
          </div>
        </div>

        {/* Step 2: Skills & Tech Stack */}
        <div className="glass-panel p-6 rounded-2xl border border-surface-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center border border-emerald-500/30">
              2
            </span>
            Required Skills & Tech Stack
          </h2>

          <div className="flex flex-wrap gap-2">
            {INITIAL_SKILLS.map((skill) => {
              const selected = selectedSkills.includes(skill.name);
              return (
                <button
                  type="button"
                  key={skill.id}
                  onClick={() => toggleSkill(skill.name)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                    selected
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                      : 'bg-surface-800 text-surface-400 hover:text-white border border-surface-700/60'
                  }`}
                >
                  {selected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  <span>{skill.name}</span>
                </button>
              );
            })}
          </div>

          {/* Custom Skill Input */}
          <div className="pt-2 flex items-center gap-2">
            <input
              type="text"
              placeholder="Add other skill (e.g. Redis, GraphQL)..."
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              className="bg-surface-900 text-white rounded-xl px-3 py-2 border border-surface-700 text-xs focus:outline-none focus:border-emerald-500 flex-1"
            />
            <button
              type="button"
              onClick={addCustomSkill}
              className="bg-surface-800 hover:bg-surface-700 text-emerald-400 font-semibold px-3 py-2 rounded-xl text-xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {/* Active Tagged Skills */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            {selectedSkills.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/30"
              >
                <span>{s}</span>
                <button
                  type="button"
                  onClick={() => toggleSkill(s)}
                  className="hover:text-rose-400 transition-colors ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Step 3: Budget & Timeline */}
        <div className="glass-panel p-6 rounded-2xl border border-surface-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center border border-emerald-500/30">
              3
            </span>
            Budget & Duration
          </h2>

          {/* Budget Type Toggle */}
          <div className="grid grid-cols-2 gap-3 max-w-md">
            <button
              type="button"
              onClick={() => setBudgetType('FIXED')}
              className={`p-3 rounded-xl border text-left transition-all ${
                budgetType === 'FIXED'
                  ? 'bg-emerald-500/15 border-emerald-500 text-white'
                  : 'bg-surface-900 border-surface-700/80 text-surface-400 hover:border-surface-600'
              }`}
            >
              <DollarSign className="w-5 h-5 text-emerald-400 mb-1" />
              <div className="font-bold text-xs">Fixed Price</div>
              <div className="text-[11px] text-surface-400">Pay single price for milestone deliverables</div>
            </button>

            <button
              type="button"
              onClick={() => setBudgetType('HOURLY')}
              className={`p-3 rounded-xl border text-left transition-all ${
                budgetType === 'HOURLY'
                  ? 'bg-teal-500/15 border-teal-500 text-white'
                  : 'bg-surface-900 border-surface-700/80 text-surface-400 hover:border-surface-600'
              }`}
            >
              <Clock className="w-5 h-5 text-teal-400 mb-1" />
              <div className="font-bold text-xs">Hourly Rate Range</div>
              <div className="text-[11px] text-surface-400">Pay by verified logged hours</div>
            </button>
          </div>

          {/* Budget Inputs */}
          {budgetType === 'FIXED' ? (
            <div className="max-w-xs">
              <label className="block text-xs font-semibold text-surface-300 mb-1.5">
                Total Budget (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 text-sm font-bold">
                  $
                </span>
                <input
                  type="number"
                  min="50"
                  step="50"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(e.target.value)}
                  className="w-full bg-surface-900 text-white rounded-xl pl-8 pr-4 py-3 border border-surface-700 text-sm focus:outline-none focus:border-emerald-500 font-bold"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 max-w-sm">
              <div>
                <label className="block text-xs font-semibold text-surface-300 mb-1.5">
                  Min $/hr
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 text-sm font-bold">
                    $
                  </span>
                  <input
                    type="number"
                    min="15"
                    value={budgetMin}
                    onChange={(e) => setBudgetMin(e.target.value)}
                    className="w-full bg-surface-900 text-white rounded-xl pl-8 pr-4 py-3 border border-surface-700 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-surface-300 mb-1.5">
                  Max $/hr
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 text-sm font-bold">
                    $
                  </span>
                  <input
                    type="number"
                    min="20"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(e.target.value)}
                    className="w-full bg-surface-900 text-white rounded-xl pl-8 pr-4 py-3 border border-surface-700 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Duration & Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-surface-300 mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-surface-400" />
                <span>Estimated Duration</span>
              </label>
              <select
                value={estimatedDuration}
                onChange={(e) => setEstimatedDuration(e.target.value)}
                className="w-full bg-surface-900 text-white rounded-xl px-4 py-3 border border-surface-700 text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="Less than 1 month">Less than 1 month</option>
                <option value="1 to 3 months">1 to 3 months</option>
                <option value="3 to 6 months">3 to 6 months</option>
                <option value="More than 6 months">More than 6 months</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-surface-300 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-surface-400" />
                <span>Target Deadline (Optional)</span>
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-surface-900 text-white rounded-xl px-4 py-3 border border-surface-700 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Stripe Escrow Security Guarantee */}
        <div className="glass-panel p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-400 flex-shrink-0" />
          <p className="text-xs text-surface-300 leading-relaxed">
            <strong className="text-white font-semibold">Stripe Escrow Guarantee:</strong> Posting a job is free.
            When you choose a proposal to hire, you fund escrow. Funds are securely locked until you review and approve
            the completed deliverables.
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-3 rounded-xl text-xs font-semibold text-surface-400 hover:text-white transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold px-7 py-3 rounded-xl text-xs shadow-lg shadow-emerald-500/25 flex items-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Publishing Project...</span>
              </>
            ) : (
              <>
                <span>Publish Job & Invite Talent</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
