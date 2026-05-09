'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { GitBranch, Tv, X, Maximize2 } from 'lucide-react';

import { ChatMessage } from '../components/atoms/ChatBubble';
import { ActionButton } from '../components/organisms/ChatPanel';
import { MermaidDiagram } from '../components/molecules/MermaidDiagram';
import { RetroTV } from '../components/molecules/RetroTV';
import { ChatPanel } from '../components/organisms/ChatPanel';
import { FloatingBackgroundIcons } from '../components/organisms/FloatingBackgroundIcons';
import { SectionHeader } from '../components/molecules/SectionHeader';

// ─── Constants ────────────────────────────────────────────────────────────────

const API_BASE = '/api';
const DEFAULT_VIDEO_URL = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

// Rotating messages shown while /run-project is loading (it takes 20-40s)
const PLANNING_MESSAGES = [
  'Analyzing your device capabilities...',
  'Generating a personalized plan...',
  'Reviewing steps for accuracy...',
  'Almost ready...',
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface RawProject {
  title: string;
  difficulty: string;
  steps: Record<string, string>;
}

interface RunProjectResponse {
  project_id: string;
  title: string;
  goal: string;
  plan: string[];
  total_steps: number;
  status: string;
  mermaid_chart: string | null;
  video_url: string | null;
}

interface NextStepResponse {
  project_id: string;
  step_number: number;
  total_steps: number;
  step_title: string;
  instruction: string;
  tips: string[];
  video_url: string | null;
  status: 'in_progress' | 'complete';
  message?: string;
}

interface SubmitStepResponse {
  status: 'advanced' | 'complete' | 'issue_diagnosed';
  next_step?: number;
  message?: string;
  step_number?: number;
  diagnosis?: string;
  solutions?: string[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeId(): string {
  return crypto.randomUUID();
}

function makeMsg(role: 'user' | 'assistant', content: string): ChatMessage {
  return { id: makeId(), role, content, timestamp: new Date() };
}

/** Parse "1. do this 2. do that" into a line-broken list */
function parseInstruction(raw: string): string {
  // Only split if a number follows a sentence terminator (. ! ?) and a space
  return raw.trim().replace(/([.!?])\s+(\d+\.)\s+/g, '$1\n$2 ');
}

/** Format the /run-project response into a friendly first AI message */
function formatRunProjectMessage(data: RunProjectResponse): string {
  const planLines = data.plan.map((step, i) => {
    // Remove redundant "Step X:" or "X." prefix if the backend included it
    const cleanedStep = step.replace(/^(?:Step\s+\d+[:.]?\s*|\d+[:.]?\s*)/i, '').trim();
    return `${i + 1}. ${cleanedStep}`;
  }).join('\n');
  return `🚀 I've analyzed your project and I'm ready to guide you!\n\n**Goal:** ${data.goal}\n\n**Here's your plan (${data.plan.length} steps):**\n${planLines}\n\nClick **Proceed** whenever you're ready to start Step 1!`;
}

/** Format the /next-step response into a step AI message */
function formatNextStepMessage(data: NextStepResponse): string {
  const parsed = parseInstruction(data.instruction);
  const tipsSection = data.tips.length > 0
    ? `\n\n💡 **Tips:**\n${data.tips.map(t => `• ${t}`).join('\n')}`
    : '';
  return `📍 **Step ${data.step_number} of ${data.total_steps} — ${data.step_title}**\n\n${parsed}${tipsSection}`;
}

/** Format the issue diagnosis into an AI message */
function formatDiagnosisMessage(diagnosis: string, solutions: string[]): string {
  const solutionLines = solutions.map((s, i) => `${i + 1}. ${s}`).join('\n');
  return `🔍 **I found the issue!**\n\n**Diagnosis:** ${diagnosis}\n\n**Here's how to fix it:**\n${solutionLines}`;
}

// ─── Page Wrapper with Suspense ──────────────────────────────────────────────

export default function WorkflowPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-slate-50 dark:bg-[#060913] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-200 dark:border-white/10 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    }>
      <WorkflowContent />
    </React.Suspense>
  );
}

function WorkflowContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ── Raw project & device data from sessionStorage ───────────────────────────
  const [rawProject, setRawProject] = useState<RawProject | null>(null);
  const [deviceId, setDeviceId] = useState<string>('');
  const [deviceName, setDeviceName] = useState<string>('');

  // ── Visuals (left panel) ────────────────────────────────────────────────────
  const [mermaidChart, setMermaidChart] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isDiagramExpanded, setIsDiagramExpanded] = useState(false);
  const [isLoadingVisuals, setIsLoadingVisuals] = useState(true);

  // ── Chatbot-illusion state ──────────────────────────────────────────────────
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [actionButtons, setActionButtons] = useState<ActionButton[]>([]);
  type ActionState = 'none' | 'proceed_to_step_1' | 'step_active' | 'completed' | 'issue_diagnosed';
  const [actionState, setActionState] = useState<ActionState>('none');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(true);
  const [awaitingIssueInput, setAwaitingIssueInput] = useState(false);

  // ── Backend session ─────────────────────────────────────────────────────────
  const [projectId, setProjectId] = useState<string>('');
  const [totalSteps, setTotalSteps] = useState<number>(0);
  const [currentStepNumber, setCurrentStepNumber] = useState<number>(0);

  // ── Prevent double-init ─────────────────────────────────────────────────────
  const hasFetched = useRef(false);

  // ── Rotating loading message for long /run-project call ────────────────────
  const loadingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRotatingMessages = useCallback((msgs: string[]) => {
    let i = 0;
    setLoadingMessage(msgs[0]);
    loadingTimerRef.current = setInterval(() => {
      i = Math.min(i + 1, msgs.length - 1);
      setLoadingMessage(msgs[i]);
    }, 8000);
  }, []);

  const stopRotatingMessages = useCallback(() => {
    if (loadingTimerRef.current) {
      clearInterval(loadingTimerRef.current);
      loadingTimerRef.current = null;
    }
    setLoadingMessage('');
  }, []);

  // ── Helpers to push messages ────────────────────────────────────────────────
  const pushMsg = useCallback((msg: ChatMessage) => {
    setMessages(prev => [...prev, msg]);
  }, []);

  const pushUserBubble = useCallback((text: string) => {
    pushMsg(makeMsg('user', text));
  }, [pushMsg]);

  const pushAIBubble = useCallback((text: string) => {
    pushMsg(makeMsg('assistant', text));
  }, [pushMsg]);

  // ── Error handler ───────────────────────────────────────────────────────────
  const handleApiError = useCallback((label: string, retry: () => void) => {
    pushAIBubble(`❌ Something went wrong while ${label}. Please try again.`);
    setActionButtons([{ label: '↩ Retry', onClick: retry, variant: 'outline' }]);
    setActionState('none');
  }, [pushAIBubble]);

  // ── Action Buttons Rebuilder ────────────────────────────────────────────────
  // Need to define it inside or pass deps, but since it calls nextStep and submitStep,
  // we can define it later or use a separate useEffect.
  // We'll use a useEffect to listen to `actionState` and `projectId`.
  // API 1: /run-project
  // ─────────────────────────────────────────────────────────────────────────────
  const runProject = useCallback(async (project: RawProject, devId: string, devName: string) => {
    setIsLoading(true);
    setIsLoadingVisuals(true);
    setActionButtons([]);
    startRotatingMessages(PLANNING_MESSAGES);

    try {
      const response = await fetch(`${API_BASE}/run-project`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          device_id: devId,
          device_name: devName,
          title: project.title,
          difficulty: project.difficulty,
          steps: project.steps,
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data: RunProjectResponse = await response.json();

      // Store session state
      setProjectId(data.project_id);
      setTotalSteps(data.total_steps);

      // Update visuals
      if (data.mermaid_chart) {
        setMermaidChart(data.mermaid_chart);
      }
      // Use backend URL if provided, otherwise fallback to default
      setVideoUrl(data.video_url || DEFAULT_VIDEO_URL);
      setIsLoadingVisuals(false);

      // Drop the AI overview message
      pushAIBubble(formatRunProjectMessage(data));

      // Show Proceed button
      setActionState('proceed_to_step_1');
    } catch {
      setIsLoadingVisuals(false);
      handleApiError('starting your project', () => runProject(project, devId, devName));
    } finally {
      stopRotatingMessages();
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pushAIBubble, pushUserBubble, handleApiError, startRotatingMessages, stopRotatingMessages]);

  // ─────────────────────────────────────────────────────────────────────────────
  // API 2: /next-step
  // ─────────────────────────────────────────────────────────────────────────────
  const nextStep = useCallback(async (pid: string) => {
    setIsLoading(true);
    setLoadingMessage('AI is preparing your next step...');
    setActionState('none');
    setActionButtons([]);

    try {
      const response = await fetch(`${API_BASE}/next-step`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: pid }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data: NextStepResponse = await response.json();

      setCurrentStepNumber(data.step_number);

      if (data.video_url) {
        setVideoUrl(data.video_url);
      }

      if (data.status === 'complete') {
        pushAIBubble(`🎉 **Project Complete!**\n\nYou've successfully finished all steps! Your device has been transformed. Amazing work! 👏\n\nWant to try another project? Head back to the Ideas page.`);
        setActionState('completed');
        return;
      }

      pushAIBubble(formatNextStepMessage(data));

      setActionState('step_active');
    } catch {
      handleApiError('loading the next step', () => nextStep(pid));
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pushAIBubble, pushUserBubble, handleApiError, router]);

  // ─────────────────────────────────────────────────────────────────────────────
  // API 3: /submit-step
  // ─────────────────────────────────────────────────────────────────────────────
  const submitStep = useCallback(async (pid: string, action: 'done' | 'issue', issueDetail?: string) => {
    setIsLoading(true);
    setLoadingMessage(action === 'done' ? 'Saving your progress...' : 'AI is diagnosing your issue...');
    setActionState('none');
    setActionButtons([]);

    try {
      const body: Record<string, string> = { project_id: pid, action };
      if (action === 'issue' && issueDetail) body.issue_detail = issueDetail;

      const response = await fetch(`${API_BASE}/submit-step`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data: SubmitStepResponse = await response.json();

      if (data.status === 'complete') {
        pushAIBubble(`🎉 **Project Complete!**\n\nYou've successfully finished all steps! Amazing work! 👏`);
        setActionState('completed');
        return;
      }

      if (data.status === 'advanced') {
        // Automatically fetch the next step
        await nextStep(pid);
        return;
      }

      if (data.status === 'issue_diagnosed') {
        const diagnosis = data.diagnosis ?? 'An issue was detected.';
        const solutions = data.solutions ?? [];
        pushAIBubble(formatDiagnosisMessage(diagnosis, solutions));
        setIsInputDisabled(true);
        setAwaitingIssueInput(false);
        setActionState('issue_diagnosed');
      }
    } catch {
      handleApiError('submitting your response', () => submitStep(pid, action, issueDetail));
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pushAIBubble, pushUserBubble, nextStep, handleApiError, router]);

  const handleSend = useCallback(() => {
    if (!awaitingIssueInput || !inputValue.trim() || isLoading) return;
    const text = inputValue.trim();
    pushUserBubble(text);
    setInputValue('');
    setIsInputDisabled(true);
    setAwaitingIssueInput(false);
    submitStep(projectId, 'issue', text);
  }, [awaitingIssueInput, inputValue, isLoading, projectId, pushUserBubble, submitStep]);

  // ── Effect: Rebuild action buttons when actionState changes ─────────────────
  useEffect(() => {
    switch (actionState) {
      case 'proceed_to_step_1':
        setActionButtons([{
          label: '🚀 Proceed to Step 1',
          onClick: () => { setActionState('none'); pushUserBubble("Let's get started! 🚀"); nextStep(projectId); },
          variant: 'primary'
        }]);
        break;
      case 'step_active':
        const isLastStep = currentStepNumber > 0 && currentStepNumber === totalSteps;
        setActionButtons([
          {
            label: '✓ Done',
            onClick: () => {
              setActionState('none');
              pushUserBubble(isLastStep ? "I've finished the last step! 🎉" : 'Done! Moving to the next step. ✅');
              submitStep(projectId, 'done');
            },
            variant: 'emerald',
          },
          {
            label: '⚠️ I have an issue',
            onClick: () => {
              setActionState('none');
              pushUserBubble("I'm having an issue with this step.");
              setIsInputDisabled(false);
              setAwaitingIssueInput(true);
              pushAIBubble('No worries! Please describe your issue in the input below and I\'ll help you fix it. 🔧');
            },
            variant: 'outline',
          },
        ]);
        break;
      case 'completed':
        setActionButtons([
          { label: '← Back to Ideas', onClick: () => router.push('/ideas'), variant: 'outline' },
          { label: '🏠 Start Over', onClick: () => router.push('/'), variant: 'outline' },
        ]);
        break;
      case 'issue_diagnosed':
        setActionButtons([{
          label: '↩ Try again',
          onClick: () => { setActionState('none'); pushUserBubble('Got it, let me try again. 💪'); nextStep(projectId); },
          variant: 'primary'
        }]);
        break;
      case 'none':
      default:
        setActionButtons([]);
        break;
    }
  }, [actionState, projectId, currentStepNumber, totalSteps, router, nextStep, submitStep, pushUserBubble, pushAIBubble]);

  // ── Session State Persistence Effect ───────────────────────────────────────
  useEffect(() => {
    const key = searchParams.get('project');
    if (!key || !projectId) return;

    const stateToSave = {
      projectId,
      totalSteps,
      currentStepNumber,
      mermaidChart,
      videoUrl,
      messages,
      actionState,
      isInputDisabled,
      awaitingIssueInput
    };
    sessionStorage.setItem(`workflowState_${key}`, JSON.stringify(stateToSave));
  }, [searchParams, projectId, totalSteps, currentStepNumber, mermaidChart, videoUrl, messages, actionState, isInputDisabled, awaitingIssueInput]);

  // ── Bootstrap: read sessionStorage and kick off /run-project ───────────────
  useEffect(() => {
    const key = searchParams.get('project');
    if (!key) { router.push('/ideas'); return; }

    const storedProject = sessionStorage.getItem(`project_${key}`);
    const storedDevice = sessionStorage.getItem('deviceDetails');

    if (!storedProject) { router.push('/ideas'); return; }

    const project: RawProject = JSON.parse(storedProject);
    const device = storedDevice ? JSON.parse(storedDevice) : {};

    const devId = device.device_id ?? '';
    const devName = device.device_name ?? `${device.brand ?? ''} ${device.model ?? ''}`.trim();

    setRawProject(project);
    setDeviceId(devId);
    setDeviceName(devName);

    if (!hasFetched.current) {
      hasFetched.current = true;
      
      const cachedStateStr = sessionStorage.getItem(`workflowState_${key}`);
      if (cachedStateStr) {
        const cachedState = JSON.parse(cachedStateStr);
        setProjectId(cachedState.projectId);
        setTotalSteps(cachedState.totalSteps);
        setCurrentStepNumber(cachedState.currentStepNumber);
        setMermaidChart(cachedState.mermaidChart);
        setVideoUrl(cachedState.videoUrl);
        // Dates need parsing back from string to Date objects
        const parsedMessages = cachedState.messages.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
        setMessages(parsedMessages);
        setActionState(cachedState.actionState);
        setIsInputDisabled(cachedState.isInputDisabled);
        setAwaitingIssueInput(cachedState.awaitingIssueInput);
        setIsLoadingVisuals(false);
      } else {
        runProject(project, devId, devName);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!rawProject) return null;

  return (
    <>
      <main className="relative w-full min-h-screen overflow-hidden bg-slate-50 dark:bg-[#060913] font-sans selection:bg-indigo-500/30 text-slate-900 dark:text-slate-200 flex flex-col">

        {/* ── Background ──────────────────────────────────────────────────── */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>
        <FloatingBackgroundIcons />
        <div className="absolute top-0 left-[-10%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] bg-indigo-500/20 dark:bg-indigo-600/10 blur-[130px] rounded-full animate-pulse mix-blend-multiply dark:mix-blend-screen pointer-events-none z-0" />
        <div className="absolute bottom-[-10%] right-[-20%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-amber-500/15 dark:bg-amber-600/10 blur-[130px] rounded-full animate-pulse mix-blend-multiply dark:mix-blend-screen pointer-events-none z-0" style={{ animationDelay: '2s' }} />

        {/* ── Content ─────────────────────────────────────────────────────── */}
        <div className="relative z-10 flex flex-col flex-1 w-full max-w-[1600px] mx-auto px-4 lg:px-8 py-4 lg:py-5 gap-4">

          {/* ── Two-Column Layout ────────────────────────────────────────── */}
          <div className="flex flex-col lg:flex-row gap-4 items-stretch">

            {/* LEFT SIDE: Diagram + Retro TV */}
            <div className="w-full lg:w-[45%] xl:w-[42%] flex flex-col gap-4">

              {/* Mermaid Diagram Card */}
              <div className="bg-white/60 dark:bg-[#0f111a]/80 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-[2rem] shadow-2xl p-5 sm:px-6 sm:py-4">
                <SectionHeader icon={<GitBranch className="w-5 h-5" />} title="Project Workflow" />
                {isLoadingVisuals ? (
                  <div className="flex flex-col items-center justify-center py-2 gap-4">
                    <div className="w-10 h-10 border-4 border-slate-200 dark:border-white/10 border-t-indigo-500 rounded-full animate-spin" />
                    <p className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">Generating workflow diagram...</p>
                  </div>
                ) : mermaidChart ? (
                  <div
                    className="mt-4 bg-slate-50/60 dark:bg-black/30 rounded-2xl p-4 border border-slate-200 dark:border-white/5 cursor-zoom-in relative group"
                    onClick={() => setIsDiagramExpanded(true)}
                    title="Click to expand"
                  >
                    <MermaidDiagram chartString={mermaidChart} />
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="flex items-center gap-1.5 bg-slate-800/70 dark:bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1.5 rounded-lg">
                        <Maximize2 className="w-3 h-3" />
                        Click to expand
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-10 text-sm text-slate-400 dark:text-slate-600">
                    No diagram available
                  </div>
                )}
              </div>

              {/* Retro TV — dynamic YouTube URL from backend */}
              <div className="bg-white/60 dark:bg-[#0f111a]/80 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-[2rem] shadow-2xl p-5 sm:px-6 sm:pt-4 sm:pb-4">
                <SectionHeader icon={<Tv className="w-5 h-5" />} title="Tutorial Video" subtitle="Reference video for this project" />
                <div className="mt-4">
                  {isLoadingVisuals ? (
                    <div className="aspect-video bg-slate-100/50 dark:bg-white/5 rounded-2xl flex flex-col items-center justify-center gap-3 border border-dashed border-slate-300 dark:border-white/10">
                      <div className="w-8 h-8 border-3 border-slate-200 dark:border-white/10 border-t-indigo-500 rounded-full animate-spin" />
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Finding tutorial video...</p>
                    </div>
                  ) : (
                    <RetroTV youtubeUrl={videoUrl || DEFAULT_VIDEO_URL} />
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: Chat Panel - Strictly matches left side height */}
            <div className="w-full lg:flex-1 relative min-h-[500px] lg:min-h-0">
              <div className="lg:absolute lg:inset-0 flex flex-col">
                <ChatPanel
                  messages={messages}
                  inputValue={inputValue}
                  onInputChange={setInputValue}
                  onSend={handleSend}
                  isLoading={isLoading}
                  isInputDisabled={isInputDisabled}
                  inputPlaceholder="Describe your issue here..."
                  loadingMessage={loadingMessage}
                  actionButtons={actionButtons}
                  projectTitle={rawProject.title}
                />
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* ── Diagram Lightbox Modal ───────────────────────────────────── */}
      {isDiagramExpanded && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
          onClick={() => setIsDiagramExpanded(false)}
        >
          <div
            className="relative bg-white dark:bg-[#0f111a] rounded-3xl shadow-2xl border border-white/20 dark:border-white/10 p-6 max-w-5xl w-full max-h-[90vh] overflow-auto"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setIsDiagramExpanded(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-lg bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-all"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-5 pr-10">
              Project Workflow — {rawProject?.title}
            </h2>
            <div className="bg-slate-50 dark:bg-black/30 rounded-2xl p-6 border border-slate-200 dark:border-white/10 flex items-center justify-center">
              <MermaidDiagram chartString={mermaidChart} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
