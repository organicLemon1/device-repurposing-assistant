'use client';
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import Link from "next/link";
import { Button } from "../atoms/Button";

export function Navbar() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

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
          <Sun className="w-5 h-5 text-amber-400" />
        ) : (
          <Moon className="w-5 h-5 text-indigo-600" />
        )}
      </Button>
    );
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#12141a]/80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center space-x-3 cursor-pointer">
            <Link href="/" className="flex items-center space-x-3 group">
               <span className="font-extrabold text-xl tracking-tight text-slate-800 dark:text-white">
                 Device Assistant
               </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {renderThemeToggle()}
          </div>
        </div>
      </div>
    </nav>
  );
}
