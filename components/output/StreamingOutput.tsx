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
      <div className="prose prose-sm prose-slate max-w-none whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
        {text}
        {isStreaming && (
          <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-indigo-400 align-middle" />
        )}
      </div>
      <div ref={bottomRef} />
    </div>
  );
}
