'use client';
import React from 'react';

interface ChatInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onEnterSubmit?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onEnterSubmit, className = '', ...props }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onEnterSubmit?.();
    }
  };

  return (
    <textarea
      rows={1}
      onKeyDown={handleKeyDown}
      className={`w-full resize-none bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none leading-relaxed ${className}`}
      {...props}
    />
  );
};
