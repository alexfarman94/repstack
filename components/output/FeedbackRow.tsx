'use client';

import { useState } from 'react';

interface FeedbackRowProps {
  runId: string;
}

export function FeedbackRow({ runId }: FeedbackRowProps) {
  const [feedback, setFeedback] = useState<1 | -1 | null>(null);
  const [sending, setSending] = useState(false);

  const submit = async (value: 1 | -1) => {
    if (sending || feedback !== null) return;
    setSending(true);
    try {
      await fetch(`/api/run/${runId}/feedback`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ feedback: value }),
      });
      setFeedback(value);
    } catch {
      // silently fail
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <span className="mr-1 text-[11px] text-slate-400">Helpful?</span>
      <button
        onClick={() => submit(1)}
        disabled={sending || feedback !== null}
        className={`rounded-md p-1 transition-colors ${
          feedback === 1
            ? 'bg-emerald-100 text-emerald-600'
            : feedback === -1
            ? 'text-slate-300'
            : 'text-slate-400 hover:bg-emerald-50 hover:text-emerald-600'
        }`}
        title="Thumbs up"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
        </svg>
      </button>
      <button
        onClick={() => submit(-1)}
        disabled={sending || feedback !== null}
        className={`rounded-md p-1 transition-colors ${
          feedback === -1
            ? 'bg-red-100 text-red-600'
            : feedback === 1
            ? 'text-slate-300'
            : 'text-slate-400 hover:bg-red-50 hover:text-red-600'
        }`}
        title="Thumbs down"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10 15V19a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10zM17 2h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17" />
        </svg>
      </button>
    </div>
  );
}
