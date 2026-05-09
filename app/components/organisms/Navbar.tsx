'use client';
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Lamp, Lightbulb, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../atoms/Button";

export function Navbar() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isWorkflowPage = pathname === '/workflow';

  // Avoid hydration mismatch by only rendering theme toggle after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const renderThemeToggle = () => {
    if (!mounted) return <div className="w-10 h-10"></div>;

    const currentTheme = theme === 'system' ? systemTheme : theme;

    return (
      <Button
        variant="outline"
        className="p-2 !rounded-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
        onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
        aria-label="Toggle Dark Mode"
      >
        {currentTheme === 'dark' ? (
          <Lightbulb className="w-5 h-5 text-amber-400" />
        ) : (
          <Lamp className="w-5 h-5 text-indigo-600" />
        )}
      </Button>
    );
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#12141a]/80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center gap-3">
            {isWorkflowPage && (
              <button
                onClick={() => router.back()}
                aria-label="Go back"
                className="w-8 h-8 rounded-lg border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-500/30 transition-all flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <Link href="/" className="flex items-center group">
              <span className="font-extrabold text-xl tracking-tight text-slate-800 dark:text-white">
                Device Assistant
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="primary" className="px-5 py-2 text-sm font-bold rounded-full shadow-md shadow-indigo-500/20 tracking-wide">
              Login
            </Button>
            {renderThemeToggle()}
          </div>
        </div>
      </div>
    </nav>
  );
}
