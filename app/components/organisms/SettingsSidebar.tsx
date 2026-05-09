'use client';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Settings, Sliders } from 'lucide-react';
import { Button } from '../atoms/Button';

interface SettingsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsSidebar({ isOpen, onClose }: SettingsSidebarProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <div className={`fixed inset-0 z-[100] ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar Panel */}
      <div 
        className={`absolute inset-y-0 right-0 z-[101] w-full max-w-sm sm:max-w-md bg-white/90 dark:bg-[#0f111a]/95 backdrop-blur-2xl border-l border-white/40 dark:border-white/10 shadow-2xl flex flex-col transform transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-label="Account Settings Sidebar"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-black/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">Settings</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Manage your preferences</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors"
            aria-label="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body - Empty State */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center">
          <div className="relative w-28 h-28 mb-6 flex items-center justify-center">
            <div className="absolute inset-0 bg-teal-500/20 dark:bg-emerald-500/10 rounded-full blur-xl animate-pulse"></div>
            <div className="relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/40 dark:to-emerald-900/40 border border-teal-100/50 dark:border-teal-500/20 shadow-lg flex items-center justify-center">
              <Sliders className="w-10 h-10 text-teal-600 dark:text-teal-400" />
            </div>
          </div>
          
          <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400 mb-3">
            Coming Soon
          </h3>
          
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-[260px] mb-10 leading-relaxed font-medium">
            We're building a new settings panel so you can customize your experience, notifications, and profile.
          </p>
          
          <Button 
            variant="outline" 
            onClick={onClose}
            className="w-40 shadow-sm py-2.5 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl"
          >
            Got it
          </Button>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-black/20 text-center">
          <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">Preferences Saved Locally</p>
        </div>
      </div>
    </div>,
    document.body
  );
}
