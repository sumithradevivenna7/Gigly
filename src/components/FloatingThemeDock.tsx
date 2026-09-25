'use client';

import React, { useState } from 'react';
import { useUITheme } from './ThemeContext';
import { Palette, Sparkles, X } from 'lucide-react';

export function FloatingThemeDock() {
  const { theme, setTheme, availableThemes } = useUITheme();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2">
      {collapsed ? (
        <button
          onClick={() => setCollapsed(false)}
          className="p-3 rounded-full glass-panel border border-emerald-500/40 text-emerald-400 hover:scale-110 transition-transform shadow-xl shadow-emerald-950/50 flex items-center justify-center group"
          title="Open UI Theme Selector"
        >
          <Palette className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        </button>
      ) : (
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl glass-panel border border-surface-700/80 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-bold text-surface-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Theme:</span>
          </div>

          <div className="flex items-center gap-1">
            {availableThemes.map((t) => {
              const active = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-surface-800 text-white border border-emerald-500/50 shadow-md scale-105'
                      : 'text-surface-400 hover:text-white hover:bg-surface-800/40 border border-transparent'
                  }`}
                  title={`${t.name} (${t.tag})`}
                >
                  <span>{t.icon}</span>
                  <span className="text-[11px] hidden md:inline">{t.name.split(' ')[0]}</span>
                  <div
                    className="w-2 h-2 rounded-full border border-white/20"
                    style={{ background: t.accentColor }}
                  />
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCollapsed(true)}
            className="p-1.5 text-surface-400 hover:text-surface-200 rounded-lg hover:bg-surface-800/60 ml-1 transition-colors"
            title="Minimize"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
