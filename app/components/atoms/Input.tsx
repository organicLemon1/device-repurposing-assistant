import React from 'react';
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className = '', ...props }, ref) => (
  <input
    ref={ref}
    className={`flex w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#12141a] px-3 py-2 text-sm text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 ${className}`}
    {...props}
  />
));
Input.displayName = 'Input';
