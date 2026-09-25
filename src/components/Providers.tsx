'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
import { ActiveRole } from '@/types';

interface RoleContextType {
  activeRole: ActiveRole;
  setActiveRole: (role: ActiveRole) => Promise<void>;
  isLoading: boolean;
}

const RoleContext = createContext<RoleContextType>({
  activeRole: 'FREELANCER',
  setActiveRole: async () => {},
  isLoading: false,
});

export function useActiveRole() {
  return useContext(RoleContext);
}

function RoleProviderInner({ children }: { children: React.ReactNode }) {
  const { data: session, update } = useSession();
  const [activeRole, setLocalRole] = useState<ActiveRole>('FREELANCER');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 1. Sync from session if present
    const sessionRole = (session?.user as unknown as { activeRole?: ActiveRole })?.activeRole;
    if (sessionRole) {
      setLocalRole(sessionRole);
      localStorage.setItem('gigly_active_role', sessionRole);
      return;
    }

    // 2. Check localStorage
    const saved = localStorage.getItem('gigly_active_role') as ActiveRole;
    if (saved === 'CLIENT' || saved === 'FREELANCER') {
      setLocalRole(saved);
    }
  }, [session]);

  const handleRoleChange = async (newRole: ActiveRole) => {
    setIsLoading(true);
    setLocalRole(newRole);
    localStorage.setItem('gigly_active_role', newRole);

    try {
      await fetch('/api/auth/switch-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetRole: newRole }),
      });

      if (update) {
        await update({ activeRole: newRole });
      }
    } catch {
      // Local state is already updated
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RoleContext.Provider
      value={{
        activeRole,
        setActiveRole: handleRoleChange,
        isLoading,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

import { ThemeProvider } from './ThemeContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <RoleProviderInner>{children}</RoleProviderInner>
      </ThemeProvider>
    </SessionProvider>
  );
}
