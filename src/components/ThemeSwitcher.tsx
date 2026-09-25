'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useUITheme, UITheme } from './ThemeContext';
import { Palette, Check, Sparkles, Sliders } from 'lucide-react';

export function ThemeSwitcher() {
  const { theme, setTheme, availableThemes } = useUITheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentThemeObj = availableThemes.find((t) => t.id === theme) || availableThemes[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-card text-xs font-semibold text-surface-200 hover:text-white border border-surface-700/60 transition-all hover:border-emerald-500/50 group shadow-sm"
        title="Switch UI Design Theme"
      >
        <span className="text-sm">{currentThemeObj.icon}</span>
        <span className="hidden sm:inline font-medium">{currentThemeObj.name}</span>
        <span className="w-2.5 h-2.5 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: currentThemeObj.accentColor }} />
        <Palette className="w-3.5 h-3.5 text-surface-400 group-hover:text-emerald-400 transition-colors ml-0.5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 p-2 rounded-2xl glass-panel border border-surface-700/80 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-2 border-b border-surface-800/80 mb-1 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
              <span>Select UI Theme</span>
            </div>
            <span className="text-[10px] text-surface-400 uppercase font-semibold">Live Preview</span>
          </div>

          <div className="space-y-1">
            {availableThemes.map((item) => {
              const isSelected = theme === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setTheme(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-surface-800/90 border border-emerald-500/40 text-white shadow-md'
                      : 'hover:bg-surface-800/50 text-surface-300 hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        {item.name}
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />}
                      </div>
                      <div className="text-[10px] text-surface-400">{item.tag}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full border border-white/20 shadow-inner"
                      style={{ background: item.accentColor }}
                    />
                    {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
