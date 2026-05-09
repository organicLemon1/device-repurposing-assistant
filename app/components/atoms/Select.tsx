import React from 'react';
interface SelectOption { label: string; value: string; }
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> { options: SelectOption[]; }
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ options, className = '', ...props }, ref) => (
  <select
    ref={ref}
    className={`flex w-full rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50/50 dark:bg-slate-900/40 backdrop-blur-md px-4 py-3 text-sm text-slate-900 dark:text-white shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/50 transition-all ${className}`}
    {...props}
  >
    {options.map((opt) => (
      <option key={opt.value} value={opt.value} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
        {opt.label}
      </option>
    ))}
  </select>
));
Select.displayName = 'Select';
