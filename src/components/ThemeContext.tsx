'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UITheme = 'orb-gallery' | 'emerald' | 'cyberpunk' | 'aurora' | 'minimalist';

interface ThemeContextType {
  theme: UITheme;
  setTheme: (theme: UITheme) => void;
  availableThemes: { id: UITheme; name: string; tag: string; icon: string; previewColor: string; accentColor: string }[];
}

export const AVAILABLE_THEMES = [
  {
    id: 'orb-gallery' as UITheme,
    name: 'Orb Gallery Editorial',
    tag: 'ThreeUI / Warm Charcoal & Cream',
    icon: '🌐',
    previewColor: '#1f1f21',
    accentColor: '#f4f3f0',
  },
  {
    id: 'emerald' as UITheme,
    name: 'Midnight Emerald',
    tag: 'Fintech & Trust',
    icon: '💎',
    previewColor: '#059669',
    accentColor: '#10b981',
  },
  {
    id: 'aurora' as UITheme,
    name: 'Glass Bento & Aurora',
    tag: 'Modern Apple/Bento',
    icon: '✨',
    previewColor: '#6366f1',
    accentColor: '#8b5cf6',
  },
  {
    id: 'cyberpunk' as UITheme,
    name: 'Cyberpunk Neon HUD',
    tag: 'High-Tech Web3',
    icon: '⚡',
    previewColor: '#06b6d4',
    accentColor: '#ec4899',
  },
  {
    id: 'minimalist' as UITheme,
    name: 'Linear SaaS Slate',
    tag: 'Vercel / Linear Precision',
    icon: '📐',
    previewColor: '#94a3b8',
    accentColor: '#ffffff',
  },
];

const ThemeContext = createContext<ThemeContextType>({
  theme: 'orb-gallery',
  setTheme: () => {},
  availableThemes: AVAILABLE_THEMES,
});

export function useUITheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<UITheme>('orb-gallery');

  useEffect(() => {
    const saved = localStorage.getItem('gigly_ui_theme') as UITheme;
    if (saved && ['orb-gallery', 'emerald', 'cyberpunk', 'aurora', 'minimalist'].includes(saved)) {
      setThemeState(saved);
      document.documentElement.setAttribute('data-theme', saved);
    } else {
      setThemeState('orb-gallery');
      document.documentElement.setAttribute('data-theme', 'orb-gallery');
    }
  }, []);

  const setTheme = (newTheme: UITheme) => {
    setThemeState(newTheme);
    localStorage.setItem('gigly_ui_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, availableThemes: AVAILABLE_THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}
