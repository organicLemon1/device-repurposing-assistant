import React from 'react';
interface SectionHeaderProps { icon?: React.ReactNode; title: string; subtitle?: string; }
export const SectionHeader: React.FC<SectionHeaderProps> = ({ icon, title, subtitle }) => (
  <div className="mb-3 pb-2 border-b border-slate-200 dark:border-white/10">
    <div className="flex items-center gap-2.5 mb-1">
      {icon && <span className="text-indigo-500 dark:text-indigo-400 flex items-center justify-center p-1.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg border border-indigo-100 dark:border-indigo-500/20">{icon}</span>}
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
    </div>
    {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{subtitle}</p>}
  </div>
);
