'use client';

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../components/atoms/Button";
import WorkflowModal from "../components/organisms/WorkflowModal";

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGraph, setSelectedGraph] = useState("");
  const [selectedProjectTitle, setSelectedProjectTitle] = useState("");

  const handleOpenWalkthrough = async (project: IdeaProject) => {
    try {
      setSelectedProjectTitle(project.title);
      setSelectedGraph("flowchart LR\n    A[Generating diagram... Please wait...]");
      setIsModalOpen(true);
      
      const response = await fetch('https://device-rag-backend.onrender.com/api/test-visuals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_title: project.title,
          steps: project.steps
        })
      });
      
      if (!response.ok) throw new Error("Failed to generate visual flowchart");
      const result = await response.json();
      setSelectedGraph(result.mermaid_chart);
      
    } catch(err: any) {
      console.error(err);
      setSelectedGraph("flowchart LR\n    A[Error loading flowchart: " + err.message + "]");
    }
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
          body: JSON.stringify({
            device_id: data.device_id
          })
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
      case 'easy': return 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20';
      case 'medium': return 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20';
      case 'hard': return 'bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20';
      default: return 'bg-slate-100 dark:bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-500/20';
    }
  };

  return (
    <main className="w-full h-full p-3 sm:p-4 lg:p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="mb-3 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-4xl text-amber-400">💡</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Your DIY Projects
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            {deviceDetails.device_name ? `Creative repurposing ideas generated specifically for your ${deviceDetails.device_name}.` : "Generating creative repurposing ideas..."}
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="flex gap-2 mb-3">
              <div className="w-4 h-4 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-4 h-4 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-4 h-4 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <p className="text-slate-800 dark:text-slate-300 font-bold animate-pulse text-xl">LLM is brainstorming projects...</p>
            <p className="text-slate-500 font-medium text-sm mt-3">Analyzing hardware capabilities for best use cases</p>
          </div>
        ) : error ? (
          <div className="bg-rose-50 dark:bg-red-900/20 border border-rose-200 dark:border-red-500/50 rounded-2xl p-5 text-rose-600 dark:text-red-400 max-w-2xl mx-auto text-center shadow-sm">
            <p className="font-semibold text-lg">{error}</p>
            <div className="mt-6">
              <Button variant="outline" onClick={() => window.location.reload()}>Retry Extraction</Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project, idx) => (
              <div key={idx} className="bg-white dark:bg-[#16181e] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 flex flex-col shadow-xl shadow-slate-200/40 dark:shadow-slate-900/50 hover:shadow-2xl hover:shadow-slate-300/60 dark:hover:shadow-black/60 transition-all hover:-translate-y-2 group">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 leading-tight pr-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{project.title}</h3>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${getDifficultyColor(project.difficulty)}`}>
                    {project.difficulty}
                  </span>
                </div>

                <div className="mt-2 flex-grow">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5 border-b border-slate-100 dark:border-slate-700/50 pb-3">Execution Steps</h4>
                  <ul className="space-y-5">
                    {Object.entries(project.steps).map(([stepNum, description]) => (
                      <li key={stepNum} className="flex gap-4 group/step">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800/80 text-indigo-600 dark:text-emerald-400 flex items-center justify-center text-sm font-bold border border-slate-200 dark:border-slate-700/50 shadow-sm group-hover/step:bg-indigo-600 group-hover/step:text-white dark:group-hover/step:bg-emerald-500 dark:group-hover/step:text-slate-900">
                          {stepNum}
                        </span>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed pt-1 font-medium">{description}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  <Button variant="secondary" className="w-full text-sm font-bold py-3" onClick={() => handleOpenWalkthrough(project)}>
                    View Full Guide ➔
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && !error && (
          <div className="mt-20 text-center">
            <Button variant="outline" className="px-10 py-3 font-semibold shadow-sm" onClick={() => {
              sessionStorage.removeItem("deviceDetails");
              router.push('/');
            }}>Start Over with New Device</Button>
          </div>
        )}

        <WorkflowModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          projectTitle={selectedProjectTitle}
          mermaidChartString={selectedGraph}
        />

      </div>
    </main>
  );
}
