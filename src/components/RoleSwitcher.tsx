'use client';

import React from 'react';
import { useActiveRole } from './Providers';
import { Briefcase, Code, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function RoleSwitcher() {
  const { activeRole, setActiveRole, isLoading } = useActiveRole();

  return (
    <div className="flex items-center bg-surface-900/80 p-1 rounded-full border border-surface-700/60 shadow-inner">
      <button
        onClick={() => setActiveRole('FREELANCER')}
        disabled={isLoading}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200",
          activeRole === 'FREELANCER'
            ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25 scale-[1.02]"
            : "text-surface-400 hover:text-surface-200"
        )}
        title="Switch to Freelancer perspective to search jobs and submit proposals"
      >
        <Code className="w-3.5 h-3.5" />
        <span>Freelancer</span>
      </button>

      <button
        onClick={() => setActiveRole('CLIENT')}
        disabled={isLoading}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200",
          activeRole === 'CLIENT'
            ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25 scale-[1.02]"
            : "text-surface-400 hover:text-surface-200"
        )}
        title="Switch to Client perspective to post jobs, review bids, and fund escrow"
      >
        <Briefcase className="w-3.5 h-3.5" />
        <span>Client</span>
      </button>

      {isLoading && <Loader2 className="w-3 h-3 text-surface-400 animate-spin ml-1 mr-1" />}
    </div>
  );
}
