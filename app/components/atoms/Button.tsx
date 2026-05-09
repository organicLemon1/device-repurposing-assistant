import React from 'react';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'emerald';
  children: React.ReactNode;
}
export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, className = '', ...props }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl text-sm font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 disabled:opacity-50 disabled:pointer-events-none px-6 py-3 cursor-pointer";
  const variants = {
    primary: "bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 text-white hover:from-indigo-400 hover:via-violet-400 hover:to-purple-500 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 border border-white/10",
    secondary: "bg-white/10 text-slate-900 dark:text-white hover:bg-white/20 backdrop-blur-md border border-slate-300 dark:border-white/10 shadow-sm hover:shadow-md",
    outline: "border border-slate-300 dark:border-white/20 bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-50/50 dark:hover:bg-white/10 backdrop-blur-md",
    emerald: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/30 border border-white/10"
  };
  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
