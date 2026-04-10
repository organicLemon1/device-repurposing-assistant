import React from 'react';
interface SectionHeaderProps { icon?: string; title: string; subtitle?: string; }
export const SectionHeader: React.FC<SectionHeaderProps> = ({ icon, title, subtitle }) => (
  <div className="mb-3 pb-2 border-b border-slate-200 dark:border-slate-800">
    <div className="flex items-center gap-2 mb-1">
      {icon && <span className="text-xl">{icon}</span>}
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
    </div>
    {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{subtitle}</p>}
  </div>
);
