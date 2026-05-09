'use client';

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { SectionHeader } from "../components/molecules/SectionHeader";
import { Button } from "../components/atoms/Button";
import { Settings, Cpu, Wifi } from "lucide-react";
import { FloatingBackgroundIcons } from "../components/organisms/FloatingBackgroundIcons";

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
      // Check session storage cache first
      const cacheKey = `deviceSpecs_${data.device_id}`;
      const cachedSpecs = sessionStorage.getItem(cacheKey);
      if (cachedSpecs) {
        setSpecsData(JSON.parse(cachedSpecs));
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/device-specs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            device_id: data.device_id,
            device_name: data.device_name
          })
        });
        
        if (!response.ok) throw new Error("Failed to fetch specs");
        
        const result = await response.json();
        sessionStorage.setItem(cacheKey, JSON.stringify(result));
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
    <main className="relative w-full min-h-screen overflow-hidden bg-slate-50 dark:bg-[#060913] font-sans selection:bg-indigo-500/30 text-slate-900 dark:text-slate-200 flex flex-col items-center pt-3 pb-5 lg:pb-7">

      {/* Premium Tech Grid Background */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* Floating Doodles */}
      <FloatingBackgroundIcons />

      {/* Dynamic Background Glowing Orbs */}
      <div className="absolute top-0 left-[-10%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] bg-fuchsia-500/20 dark:bg-fuchsia-600/10 blur-[130px] rounded-full animate-pulse mix-blend-multiply dark:mix-blend-screen pointer-events-none transition-all duration-1000 z-0"></div>
      <div className="absolute bottom-[-10%] right-[-20%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-violet-500/15 dark:bg-violet-600/10 blur-[130px] rounded-full animate-pulse mix-blend-multiply dark:mix-blend-screen pointer-events-none transition-all duration-1000 z-0" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[30vw] max-w-[900px] max-h-[400px] bg-indigo-400/10 dark:bg-fuchsia-500/5 blur-[140px] rounded-full pointer-events-none z-0"></div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 lg:px-8 flex flex-col gap-5 lg:gap-6">

        {/* Hero Section */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Settings className="w-8 h-8 sm:w-10 sm:h-10 text-fuchsia-500 drop-shadow-sm animate-[spin_10s_linear_infinite]" />
            <h1 className="text-4xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-violet-500 to-indigo-500 dark:from-fuchsia-400 dark:via-violet-400 dark:to-indigo-400 drop-shadow-sm">
                Device Specifications
              </span>
            </h1>
          </div>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed hidden sm:block">
            {deviceDetails.device_name ? `Extracting structural knowledge for ${deviceDetails.device_name}` : "Extracting device knowledge..."}
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white/60 dark:bg-[#0f111a]/80 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-[2rem] shadow-2xl">
             <div className="w-12 h-12 border-4 border-slate-200 dark:border-white/10 border-t-fuchsia-500 rounded-full animate-spin mb-6"></div>
             <p className="text-slate-800 dark:text-slate-200 font-medium animate-pulse text-lg tracking-wide">Searching components and capabilities...</p>
             <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Connecting to device knowledge bases...</p>
          </div>
        ) : error ? (
           <div className="bg-rose-50/80 dark:bg-red-900/20 backdrop-blur-xl border border-rose-200 dark:border-red-500/50 rounded-2xl p-6 text-rose-600 dark:text-red-400 font-medium shadow-xl">
             {error}
           </div>
        ) : specsData ? (
          <div className="flex flex-col gap-4 lg:gap-6 bg-white/60 dark:bg-[#0f111a]/80 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-[2rem] shadow-2xl p-5 sm:p-7 lg:p-8">
            
            <section className="bg-slate-50/40 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-2xl p-4 sm:p-6 shadow-inner">
              <SectionHeader icon={<Cpu className="w-5 h-5" />} title="Hardware Components" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4 mt-4">
                {specsData.components.map((comp, idx) => (
                   <div key={idx} className="bg-white/80 dark:bg-[#16181e]/80 backdrop-blur-sm border border-slate-200 dark:border-white/10 rounded-xl p-4 flex items-center shadow-sm hover:shadow-md transition-all group">
                      <span className="text-fuchsia-500 dark:text-fuchsia-400 mr-4 text-xl group-hover:scale-110 transition-transform">▪</span>
                      <span className="text-slate-800 dark:text-slate-200 font-medium">{comp}</span>
                   </div>
                ))}
              </div>
            </section>

            <section className="bg-slate-50/40 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-2xl p-4 sm:p-6 shadow-inner">
              <SectionHeader icon={<Wifi className="w-5 h-5" />} title="Device Capabilities" />
              <div className="flex flex-wrap gap-3 mt-4">
                 {specsData.capabilities.map((cap, idx) => (
                   <span key={idx} className="bg-violet-50 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/20 text-violet-700 dark:text-violet-300 px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm hover:bg-violet-100 dark:hover:bg-violet-500/20 transition-colors cursor-default">
                     {cap}
                   </span>
                 ))}
              </div>
            </section>
            
            <div className="mt-2 pt-5 flex flex-col sm:flex-row justify-end items-center gap-4 border-t border-slate-200 dark:border-white/10">
               <Button 
                variant="primary" 
                className="text-base px-10 py-3.5 border-none font-bold shadow-xl shadow-fuchsia-500/20 w-full sm:w-auto transform transition-all hover:-translate-y-1 bg-gradient-to-r from-fuchsia-500 to-violet-600 hover:from-fuchsia-600 hover:to-violet-700 text-white"
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
