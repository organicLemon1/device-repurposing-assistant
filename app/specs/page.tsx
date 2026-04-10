'use client';

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { SectionHeader } from "../components/molecules/SectionHeader";
import { Button } from "../components/atoms/Button";

interface SpecsData {
  device_id: string;
  device_name: string;
  components: string[];
  capabilities: string[];
  sources: string[];
}

export default function SpecsPage() {
  const router = useRouter();
  
  const [deviceDetails, setDeviceDetails] = useState<any>(null);
  const [specsData, setSpecsData] = useState<SpecsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("deviceDetails");
    if (!stored) {
      router.push('/');
      return;
    }
    const data = JSON.parse(stored);
    setDeviceDetails(data);
    
    const fetchSpecs = async () => {
      try {
        const response = await fetch('https://device-rag-backend.onrender.com/api/device-specs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            device_id: data.device_id,
            device_name: data.device_name
          })
        });
        
        if (!response.ok) throw new Error("Failed to fetch specs");
        
        const result = await response.json();
        setSpecsData(result);
      } catch (err: any) {
        setError(err.message || 'Error loading specs');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchSpecs();
    }
  }, [router]);

  const handleGenerateIdeas = async () => {
    if (!specsData) return;
    setIsGenerating(true);
    
    // API Step 4 (save-device) has been removed; advancing directly.
    router.push('/ideas');
  };

  if (!deviceDetails) return null;

  return (
    <main className="w-full h-full p-3 sm:p-4 lg:p-6 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="mb-5 lg:mb-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl sm:text-4xl">⚙️</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Device Specifications
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-lg ml-1">
            {deviceDetails.device_name ? `Extracting knowledge for ${deviceDetails.device_name}` : "Extracting device knowledge..."}
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-[#16181e] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-200/40 dark:shadow-inner">
             <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-700 border-t-emerald-500 rounded-full animate-spin mb-6"></div>
             <p className="text-slate-800 dark:text-slate-300 font-medium animate-pulse text-lg">Searching components and capabilities...</p>
             <p className="text-slate-500 mt-2">Connecting to device knowledge bases...</p>
          </div>
        ) : error ? (
           <div className="bg-rose-50 dark:bg-red-900/20 border border-rose-200 dark:border-red-500/50 rounded-xl p-6 text-rose-600 dark:text-red-400 font-medium">
             {error}
           </div>
        ) : specsData ? (
          <div className="flex flex-col gap-4 lg:gap-6">
            <section className="bg-white dark:bg-[#16181e] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none rounded-2xl p-4 sm:p-5">
              <SectionHeader icon="🔋" title="Hardware Components" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {specsData.components.map((comp, idx) => (
                   <div key={idx} className="bg-slate-50 dark:bg-[#1b1c23] border border-slate-200 dark:border-slate-700/60 rounded-xl p-5 flex items-center shadow-sm hover:shadow-md dark:hover:bg-[#1f2029] transition-all">
                      <span className="text-emerald-500 dark:text-emerald-400 mr-4 text-xl">▪</span>
                      <span className="text-slate-800 dark:text-slate-300 font-medium">{comp}</span>
                   </div>
                ))}
              </div>
            </section>

            <section className="bg-white dark:bg-[#16181e] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none rounded-2xl p-4 sm:p-5">
              <SectionHeader icon="📶" title="Device Capabilities" />
              <div className="flex flex-wrap gap-3">
                 {specsData.capabilities.map((cap, idx) => (
                   <span key={idx} className="bg-indigo-50 dark:bg-slate-800 border border-indigo-100 dark:border-slate-700 text-indigo-700 dark:text-slate-200 px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm">
                     {cap}
                   </span>
                 ))}
              </div>
            </section>
            
            <div className="mt-4 flex flex-col sm:flex-row justify-end items-center sm:items-end gap-6 border-t border-slate-200 dark:border-slate-800 pt-8">
               <Button 
                variant="emerald" 
                className="text-base px-10 py-3.5 border-none font-bold shadow-xl shadow-emerald-500/20 w-full sm:w-auto transform transition-all hover:-translate-y-1"
                onClick={handleGenerateIdeas}
                disabled={isGenerating}
               >
                 {isGenerating ? 'Preparing Assistant...' : 'Generate DIY Ideas ✨'}
               </Button>
            </div>
          </div>
        ) : null}

      </div>
    </main>
  );
}
