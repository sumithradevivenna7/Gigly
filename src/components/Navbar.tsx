'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut, signIn } from 'next-auth/react';
import { useActiveRole } from './Providers';
import { RoleSwitcher } from './RoleSwitcher';
import { ThemeSwitcher } from './ThemeSwitcher';
import {
  Sparkles,
  PlusCircle,
  Search,
  FileText,
  ShieldCheck,
  Bell,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  CheckCircle2,
} from 'lucide-react';

export function Navbar() {
  const { data: session } = useSession();
  const { activeRole } = useActiveRole();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notifications = [
    {
      id: '1',
      title: 'New proposal on your job',
      desc: 'Alex Rivera bid $4,300 on AI Copilot Dashboard',
      time: '12m ago',
      unread: true,
      href: '/jobs/job-1',
    },
    {
      id: '2',
      title: 'Escrow payment verified',
      desc: '$3,200 is held in secure Stripe escrow',
      time: '1h ago',
      unread: false,
      href: '/contracts/contract-1',
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-surface-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Main Nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-slate-950 font-bold" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">
                Gigly
              </span>
              <span className="text-[10px] font-medium tracking-wider text-emerald-400/90 uppercase -mt-1">
                Escrow Marketplace
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/jobs"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-surface-300 hover:text-white hover:bg-surface-800/60 transition-colors"
            >
              <Search className="w-4 h-4 text-emerald-400" />
              <span>{activeRole === 'FREELANCER' ? 'Find Jobs' : 'Explore Market'}</span>
            </Link>

            <Link
              href="/contracts"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-surface-300 hover:text-white hover:bg-surface-800/60 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Contracts & Escrow</span>
            </Link>

            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-surface-300 hover:text-white hover:bg-surface-800/60 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-cyan-400" />
              <span>Dashboard</span>
            </Link>
          </nav>
        </div>

        {/* Center / Right: Role Switcher & Action CTA */}
        <div className="flex items-center gap-3">
          {/* Prominent Role Switcher & Theme Switcher */}
          <div className="flex items-center gap-2">
            <RoleSwitcher />
            <ThemeSwitcher />
          </div>

          {/* Action button based on active role */}
          {activeRole === 'CLIENT' ? (
            <Link
              href="/jobs/create"
              className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-semibold text-xs px-3.5 py-2 rounded-lg shadow-md shadow-emerald-500/20 hover:scale-[1.02] transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post a Job</span>
            </Link>
          ) : (
            <Link
              href="/jobs"
              className="hidden sm:flex items-center gap-1.5 bg-surface-800 hover:bg-surface-700 text-emerald-400 border border-emerald-500/30 font-semibold text-xs px-3.5 py-2 rounded-lg transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>Browse Proposals</span>
            </Link>
          )}

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-lg text-surface-300 hover:text-white hover:bg-surface-800/70 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-surface-900" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 glass-panel rounded-xl shadow-2xl border border-surface-700/80 p-3 z-50">
                <div className="flex items-center justify-between border-b border-surface-800 pb-2 mb-2">
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                    Notifications
                  </h4>
                  <span className="text-[10px] text-emerald-400 font-medium cursor-pointer hover:underline">
                    Mark all read
                  </span>
                </div>
                <div className="space-y-2">
                  {notifications.map((n) => (
                    <Link
                      key={n.id}
                      href={n.href}
                      onClick={() => setNotificationsOpen(false)}
                      className="block p-2 rounded-lg hover:bg-surface-800/80 transition-colors text-xs"
                    >
                      <div className="flex items-start justify-between">
                        <p className="font-medium text-surface-200">{n.title}</p>
                        <span className="text-[10px] text-surface-500">{n.time}</span>
                      </div>
                      <p className="text-surface-400 text-[11px] mt-0.5">{n.desc}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile or Auth Buttons */}
          {session?.user ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-surface-800/70 transition-colors"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-emerald-500/40 relative">
                  <Image
                    src={session.user.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                    alt={session.user.name || 'User'}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-xs font-medium text-surface-200 hidden md:inline">
                  {session.user.name?.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-surface-400" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 glass-panel rounded-xl shadow-2xl border border-surface-700/80 py-2 z-50">
                  <div className="px-4 py-2 border-b border-surface-800 text-xs">
                    <p className="font-semibold text-white">{session.user.name}</p>
                    <p className="text-surface-400 text-[11px] truncate">{session.user.email}</p>
                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-medium border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{activeRole === 'CLIENT' ? 'Client Active' : 'Freelancer Active'}</span>
                    </div>
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-surface-300 hover:text-white hover:bg-surface-800 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                    <span>My Workspace</span>
                  </Link>

                  <Link
                    href="/contracts"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-surface-300 hover:text-white hover:bg-surface-800 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-teal-400" />
                    <span>Contracts & Escrow</span>
                  </Link>

                  <button
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors border-t border-surface-800/80 mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="text-xs font-semibold text-surface-300 hover:text-white px-3 py-2 rounded-lg hover:bg-surface-800 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3.5 py-2 rounded-lg shadow-sm shadow-emerald-500/20 transition-all hover:scale-[1.02]"
              >
                Join Gigly
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
