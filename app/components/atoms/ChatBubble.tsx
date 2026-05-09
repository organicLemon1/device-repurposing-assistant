'use client';
import React from 'react';

export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

interface ChatBubbleProps {
  message: ChatMessage;
}

/** Render a single line with **bold** and *italic* support */
function renderLine(line: string, key: number): React.ReactNode {
  const parts = line.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return (
    <span key={key}>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
          return <em key={i}>{part.slice(1, -1)}</em>;
        }
        return part;
      })}
    </span>
  );
}

/** Render a full message preserving newlines and markdown */
function renderContent(content: string): React.ReactNode {
  const lines = content.split('\n');
  return lines.map((line, i) => (
    <React.Fragment key={i}>
      {renderLine(line, i)}
      {i < lines.length - 1 && <br />}
    </React.Fragment>
  ));
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 items-end ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-md ${
        isUser
          ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white'
          : 'bg-gradient-to-br from-amber-400 to-orange-500 text-white'
      }`}>
        {isUser ? 'You' : 'AI'}
      </div>

      {/* Bubble */}
      <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
        isUser
          ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-br-sm'
          : 'bg-white/70 dark:bg-white/5 backdrop-blur-sm border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100 rounded-bl-sm'
      }`}>
        <p>{renderContent(message.content)}</p>
        <p className={`text-[10px] mt-1.5 ${isUser ? 'text-indigo-200' : 'text-slate-400'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};
