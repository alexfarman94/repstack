'use client';

import { useEffect, useRef } from 'react';

interface StreamingOutputProps {
  text: string;
  isStreaming: boolean;
}

export function StreamingOutput({ text, isStreaming }: StreamingOutputProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll during streaming
  useEffect(() => {
    if (isStreaming) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [text, isStreaming]);

  return (
    <div className="overflow-y-auto px-4 py-4">
      <div className="prose prose-sm prose-slate max-w-none whitespace-pre-wrap text-[13px] leading-[1.7] text-slate-700 prose-headings:text-slate-900 prose-headings:font-semibold prose-code:rounded-md prose-code:bg-slate-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[12px] prose-code:font-normal prose-code:text-slate-700 prose-pre:rounded-md prose-pre:bg-slate-50 prose-pre:border prose-pre:border-slate-100">
        {text}
        {isStreaming && (
          <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-indigo-500 align-middle" />
        )}
      </div>
      <div ref={bottomRef} />
    </div>
  );
}
