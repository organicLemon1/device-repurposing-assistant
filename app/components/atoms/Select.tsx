import React from 'react';
interface SelectOption { label: string; value: string; }
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> { options: SelectOption[]; }
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ options, className = '', ...props }, ref) => (
  <select
    ref={ref}
    className={`flex w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#12141a] px-3 py-2 text-sm text-slate-900 dark:text-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 ${className}`}
    {...props}
  >
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>{opt.label}</option>
    ))}
  </select>
));
Select.displayName = 'Select';
