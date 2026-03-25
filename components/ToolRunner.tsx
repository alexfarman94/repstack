'use client';

import { useState, useRef } from 'react';
import { ToolInput } from '@/lib/types';
import { CopyButton } from './CopyButton';

interface ToolRunnerProps {
  toolId: string;
  inputs: ToolInput[];
}

export function ToolRunner({ toolId, inputs }: ToolRunnerProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'streaming' | 'done' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const outputRef = useRef<HTMLDivElement>(null);

  const isValid = inputs
    .filter((i) => i.required)
    .every((i) => values[i.id]?.trim());

  const handleSubmit = async () => {
    if (!isValid) return;

    setStatus('loading');
    setOutput('');
    setErrorMsg('');

    try {
      const res = await fetch('/api/tools/run', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ toolId, inputs: values }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Something went wrong' }));
        throw new Error(err.error || `Error ${res.status}`);
      }

      if (!res.body) throw new Error('No response body');

      setStatus('streaming');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            // Anthropic SSE: content_block_delta events carry text
            if (
              parsed.type === 'content_block_delta' &&
              parsed.delta?.type === 'text_delta' &&
              parsed.delta?.text
            ) {
              setOutput((prev) => prev + parsed.delta.text);
              // Scroll output into view
              if (outputRef.current) {
                outputRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }
            }
          } catch {
            // Skip malformed SSE lines
          }
        }
      }

      setStatus('done');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
      setStatus('error');
    }
  };

  const handleReset = () => {
    setValues({});
    setOutput('');
    setStatus('idle');
    setErrorMsg('');
  };

  return (
    <div className="rounded-2xl border border-white/[0.1] overflow-hidden">
      {/* Input form */}
      <div className="p-6 space-y-5 bg-white/[0.02]">
        {inputs.map((input) => (
          <div key={input.id}>
            <label className="block text-sm font-medium text-stone-300 mb-1.5">
              {input.label}
              {!input.required && (
                <span className="ml-2 text-xs text-stone-600 font-normal">optional</span>
              )}
            </label>
            {input.type === 'textarea' ? (
              <textarea
                value={values[input.id] ?? ''}
                onChange={(e) => setValues((v) => ({ ...v, [input.id]: e.target.value }))}
                placeholder={input.placeholder}
                rows={input.rows ?? 4}
                className="w-full rounded-xl bg-white/[0.05] border border-white/[0.1] text-stone-200 placeholder-stone-600 text-sm px-4 py-3 resize-y focus:outline-none focus:border-indigo-500/60 focus:bg-white/[0.07] transition-all duration-150"
              />
            ) : input.type === 'select' ? (
              <select
                value={values[input.id] ?? ''}
                onChange={(e) => setValues((v) => ({ ...v, [input.id]: e.target.value }))}
                className="w-full rounded-xl bg-white/[0.05] border border-white/[0.1] text-stone-200 text-sm px-4 py-3 focus:outline-none focus:border-indigo-500/60 transition-all duration-150 appearance-none"
              >
                <option value="" disabled>Select…</option>
                {input.options?.map((opt) => (
                  <option key={opt} value={opt} className="bg-[#1a1a1e]">
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={values[input.id] ?? ''}
                onChange={(e) => setValues((v) => ({ ...v, [input.id]: e.target.value }))}
                placeholder={input.placeholder}
                className="w-full rounded-xl bg-white/[0.05] border border-white/[0.1] text-stone-200 placeholder-stone-600 text-sm px-4 py-3 focus:outline-none focus:border-indigo-500/60 focus:bg-white/[0.07] transition-all duration-150"
              />
            )}
          </div>
        ))}

        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={handleSubmit}
            disabled={!isValid || status === 'loading' || status === 'streaming'}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium px-5 py-2.5 text-sm transition-all duration-150"
          >
            {status === 'loading' ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Thinking…
              </>
            ) : status === 'streaming' ? (
              <>
                <span className="w-2 h-2 rounded-full bg-indigo-300 animate-pulse" />
                Generating…
              </>
            ) : (
              <>
                <span>⚡</span>
                Generate
              </>
            )}
          </button>
          {(status === 'done' || status === 'error') && (
            <button
              onClick={handleReset}
              className="text-sm text-stone-500 hover:text-stone-300 transition-colors"
            >
              Start over
            </button>
          )}
        </div>
      </div>

      {/* Output */}
      {(status === 'streaming' || status === 'done' || status === 'error') && (
        <div ref={outputRef} className="border-t border-white/[0.08]">
          {status === 'error' ? (
            <div className="p-6">
              <p className="text-sm text-red-400">
                {errorMsg || 'Something went wrong. Please try again.'}
              </p>
            </div>
          ) : (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-stone-500 uppercase tracking-wider font-medium">
                  {status === 'streaming' ? 'Generating…' : 'Output'}
                </span>
                {status === 'done' && output && (
                  <CopyButton text={output} label="Copy output" />
                )}
              </div>
              <div className="text-sm text-stone-300 leading-relaxed whitespace-pre-wrap font-mono">
                {output}
                {status === 'streaming' && (
                  <span className="inline-block w-1.5 h-4 bg-indigo-400 animate-pulse ml-0.5 align-middle" />
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
