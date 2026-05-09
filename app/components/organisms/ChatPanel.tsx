'use client';
import React, { useRef, useEffect } from 'react';
import { ChatBubble, ChatMessage } from '../atoms/ChatBubble';
import { ChatInput } from '../atoms/ChatInput';
import { Button } from '../atoms/Button';
import { Send, Bot } from 'lucide-react';

export interface ActionButton {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'outline' | 'emerald';
}

interface ChatPanelProps {
  messages: ChatMessage[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  isInputDisabled?: boolean;       // disables input bar (non-issue states)
  inputPlaceholder?: string;       // custom placeholder text
  loadingMessage?: string;         // message shown next to typing dots
  actionButtons?: ActionButton[];  // quick-reply chips above input bar
  projectTitle: string;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  inputValue,
  onInputChange,
  onSend,
  isLoading,
  isInputDisabled = false,
  inputPlaceholder = 'Ask a question about this project...',
  loadingMessage,
  actionButtons = [],
  projectTitle,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, actionButtons]);

  const inputActuallyDisabled = isLoading || isInputDisabled;

  return (
    <div className="flex flex-col h-full bg-white/60 dark:bg-[#0f111a]/80 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-[2rem] shadow-2xl overflow-hidden">

      {/* Chat Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-black/20 flex-shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md shadow-amber-500/20 flex-shrink-0">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="font-bold text-sm text-slate-900 dark:text-white">Project Assistant</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{projectTitle}</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-amber-400' : 'bg-emerald-500'} animate-pulse shadow-[0_0_6px_2px_rgba(52,211,153,0.4)]`} />
          <span className={`text-xs font-semibold ${isLoading ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {isLoading ? 'Thinking...' : 'Online'}
          </span>
        </div>
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-5 scroll-smooth">
        {messages.length === 0 && !isLoading && (
          <div className="h-full flex flex-col items-center justify-center text-center py-12 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 border border-amber-500/20 flex items-center justify-center">
              <Bot className="w-8 h-8 text-amber-500" />
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200 text-lg">Your AI Guide is Starting...</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                Hang tight while I analyze your project and create a personalized plan.
              </p>
            </div>
          </div>
        )}

        {messages.map(msg => (
          <ChatBubble key={msg.id} message={msg} />
        ))}

        {/* AI Thinking Indicator */}
        {isLoading && (
          <div className="flex gap-3 items-end">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
              AI
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-white/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-sm shadow-sm">
              <div className="flex gap-2 items-center">
                <div className="flex gap-1.5 items-center h-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                {loadingMessage && (
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium animate-pulse">{loadingMessage}</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons (quick-reply chips) */}
      {actionButtons.length > 0 && !isLoading && (
        <div className="flex-shrink-0 px-4 pb-3 flex flex-wrap gap-2 justify-end">
          {actionButtons.map((btn, i) => (
            <Button
              key={i}
              variant={btn.variant ?? 'outline'}
              onClick={btn.onClick}
              className="text-sm !py-2 !px-4 !rounded-xl"
            >
              {btn.label}
            </Button>
          ))}
        </div>
      )}

      {/* Input Bar */}
      <div className="flex-shrink-0 px-4 pb-4 pt-2 border-t border-slate-200 dark:border-white/10">
        <div className={`flex items-center gap-2 bg-white/80 dark:bg-white/5 border rounded-2xl px-4 py-3 shadow-sm transition-colors ${inputActuallyDisabled
            ? 'border-slate-100 dark:border-white/5 opacity-60 cursor-not-allowed'
            : 'border-slate-200 dark:border-white/10 focus-within:border-indigo-400 dark:focus-within:border-indigo-500/50'
          }`}>
          <ChatInput
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onEnterSubmit={onSend}
            placeholder={inputActuallyDisabled ? 'Use the buttons above to continue...' : inputPlaceholder}
            disabled={inputActuallyDisabled}
            className="flex-1"
          />
          <Button
            type="button"
            onClick={onSend}
            disabled={inputActuallyDisabled || !inputValue.trim()}
            className="!p-2.5 !rounded-xl flex-shrink-0 !px-3 !py-2.5"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-[10px] text-center text-slate-400 mt-2">
          {inputActuallyDisabled ? 'Select an option above to continue' : 'Press Enter to send · Shift+Enter for new line'}
        </p>
      </div>
    </div>
  );
};
