'use client';

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../components/atoms/Button";
import { Lightbulb } from "lucide-react";
import { FloatingBackgroundIcons } from "../components/organisms/FloatingBackgroundIcons";

interface IdeaProject {
  title: string;
  difficulty: string;
  steps: Record<string, string>;
}

export default function IdeasPage() {
  const router = useRouter();

  const [deviceDetails, setDeviceDetails] = useState<any>(null);
  const [projects, setProjects] = useState<IdeaProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);


  // Navigate to the dedicated /workflow page with project data passed via sessionStorage
  const handleOpenWalkthrough = (project: IdeaProject) => {
    const key = encodeURIComponent(project.title.replace(/\s+/g, '-').toLowerCase());
    sessionStorage.setItem(`project_${key}`, JSON.stringify(project));
    router.push(`/workflow?project=${key}`);
  };

  useEffect(() => {
    const stored = sessionStorage.getItem("deviceDetails");
    if (!stored) {
      router.push('/');
      return;
    }
    const data = JSON.parse(stored);
    setDeviceDetails(data);

    const fetchIdeas = async () => {
      try {
        const response = await fetch('https://device-rag-backend.onrender.com/api/generate-ideas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ device_id: data.device_id })
        });
        if (!response.ok) throw new Error("Failed to generate ideas");
        const result = await response.json();
        setProjects(result.projects);
      } catch (err: any) {
        setError(err.message || 'Error generating ideas');
      } finally {
        setIsLoading(false);
      }
    };

    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchIdeas();
    }
  }, [router]);

  if (!deviceDetails) return null;

  const getDifficultyColor = (diff: string) => {
    switch (diff.toLowerCase()) {
      case 'easy': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'medium': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'hard': return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      default: return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
    }
  };

  return (
    <main className="relative w-full min-h-screen overflow-hidden bg-slate-50 dark:bg-[#060913] font-sans selection:bg-amber-500/30 text-slate-900 dark:text-slate-200 flex flex-col items-center pt-3 pb-5 lg:pb-7">
      
      {/* Premium Tech Grid Background */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* Floating Doodles */}
      <FloatingBackgroundIcons />

      {/* Dynamic Background Glowing Orbs */}
      <div className="absolute top-0 left-[-10%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] bg-amber-500/20 dark:bg-amber-600/10 blur-[130px] rounded-full animate-pulse mix-blend-multiply dark:mix-blend-screen pointer-events-none transition-all duration-1000 z-0"></div>
      <div className="absolute bottom-[-10%] right-[-20%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-rose-500/15 dark:bg-rose-600/10 blur-[130px] rounded-full animate-pulse mix-blend-multiply dark:mix-blend-screen pointer-events-none transition-all duration-1000 z-0" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[30vw] max-w-[900px] max-h-[400px] bg-yellow-400/10 dark:bg-amber-500/5 blur-[140px] rounded-full pointer-events-none z-0"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* Hero Section */}
        <div className="mb-6 lg:mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Lightbulb className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500 drop-shadow-sm animate-[pulse_3s_ease-in-out_infinite]" />
            <h1 className="text-4xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 dark:from-amber-400 dark:via-orange-400 dark:to-rose-400 drop-shadow-sm">
                Your DIY Projects
              </span>
            </h1>
          </div>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            {deviceDetails.device_name ? `Creative repurposing ideas generated specifically for your ${deviceDetails.device_name}.` : "Generating creative repurposing ideas..."}
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white/60 dark:bg-[#0f111a]/80 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-[2rem] shadow-2xl">
            <div className="flex gap-3 mb-5">
              <div className="w-4 h-4 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-4 h-4 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-4 h-4 rounded-full bg-rose-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <p className="text-slate-800 dark:text-slate-200 font-bold animate-pulse text-xl tracking-wide">LLM is brainstorming projects...</p>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-3">Analyzing hardware capabilities for best use cases</p>
          </div>
        ) : error ? (
          <div className="bg-rose-50/80 dark:bg-red-900/20 backdrop-blur-xl border border-rose-200 dark:border-red-500/50 rounded-2xl p-5 text-rose-600 dark:text-red-400 max-w-2xl mx-auto text-center shadow-xl">
            <p className="font-semibold text-lg">{error}</p>
            <div className="mt-6">
              <Button variant="outline" onClick={() => window.location.reload()}>Retry Extraction</Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {projects.map((project, idx) => (
              <div key={idx} className="bg-white/60 dark:bg-[#0f111a]/80 backdrop-blur-xl border border-white/40 dark:border-white/5 rounded-3xl p-6 sm:p-7 flex flex-col shadow-xl shadow-slate-200/40 dark:shadow-black/50 hover:shadow-2xl hover:bg-white/80 dark:hover:bg-[#161822]/80 transition-all hover:-translate-y-2 group">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-tight pr-4 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">{project.title}</h3>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${getDifficultyColor(project.difficulty)}`}>
                    {project.difficulty}
                  </span>
                </div>

                <div className="mt-2 flex-grow">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5 border-b border-slate-200 dark:border-white/10 pb-3">Execution Steps</h4>
                  <ul className="space-y-4">
                    {Object.entries(project.steps).map(([stepNum, description]) => (
                      <li key={stepNum} className="flex gap-4 group/step items-start">
                        <span className="flex-shrink-0 w-7 h-7 mt-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs font-bold border border-slate-200 dark:border-white/10 shadow-sm group-hover/step:bg-amber-500 group-hover/step:text-white dark:group-hover/step:bg-amber-500 dark:group-hover/step:text-slate-900 transition-colors">
                          {stepNum}
                        </span>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{description}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-200 dark:border-white/10">
                  <Button variant="secondary" className="w-full text-sm font-bold py-3.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border-transparent dark:text-white" onClick={() => handleOpenWalkthrough(project)}>
                    View Full Guide ➔
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && !error && (
          <div className="mt-12 lg:mt-16 text-center">
            <Button variant="outline" className="px-10 py-3.5 font-bold shadow-sm" onClick={() => {
              sessionStorage.removeItem("deviceDetails");
              router.push('/');
            }}>Start Over with New Device</Button>
          </div>
        )}

      </div>
    </main>
  );
}
