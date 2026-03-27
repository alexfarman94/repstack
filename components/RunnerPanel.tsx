'use client';

import { useState, useRef, useEffect } from 'react';
import { useRunner } from '@/app/dashboard/RunnerContext';
import { CopyButton } from './CopyButton';

type Account = { id: string; company_name: string };
type Status = 'idle' | 'loading' | 'streaming' | 'done' | 'error';

export function RunnerPanel() {
  const { runner, accountId, setAccountId, close, setLatestOutput, setLatestStatus, setLatestRunnerTitle } = useRunner();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const outputRef = useRef<HTMLDivElement>(null);
  const isOpen = runner !== null;

  // Fetch accounts once on mount
  useEffect(() => {
    fetch('/api/accounts')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setAccounts(data); })
      .catch(() => {});
  }, []);

  // Reset form state when the active tool / agent changes
  const runnerId =
    runner?.type === 'tool'
      ? runner.toolId
      : runner?.type === 'agent'
      ? runner.agentId
      : null;

  useEffect(() => {
    setValues({});
    setOutput('');
    setStatus('idle');
    setErrorMsg('');
    setLatestOutput('');
    setLatestStatus('idle');
    if (title) setLatestRunnerTitle(title);
  }, [runnerId]);

  // ESC key closes the panel
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) close();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, close]);

  const title =
    runner?.type === 'tool'
      ? runner.title
      : runner?.type === 'agent'
      ? runner.name
      : '';

  const description =
    runner?.type === 'tool'
      ? runner.description
      : runner?.type === 'agent'
      ? (runner.description ?? '')
      : '';

  const inputs = runner?.inputs ?? [];

  const handleGenerate = async () => {
    if (!runner) return;
    setStatus('loading');
    setLatestStatus('loading');
    setOutput('');
    setLatestOutput('');
    setErrorMsg('');

    const endpoint =
      runner.type === 'tool'
        ? '/api/tools/run'
        : `/api/agents/${runner.agentId}/run`;

    const body =
      runner.type === 'tool'
        ? { toolId: runner.toolId, inputs: values, accountId: accountId || undefined }
        : { inputs: values, accountId: accountId || undefined };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Something went wrong' }));
        throw new Error(err.error ?? `Error ${res.status}`);
      }
      if (!res.body) throw new Error('No response body');

      setStatus('streaming');
      setLatestStatus('streaming');

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
            if (
              parsed.type === 'content_block_delta' &&
              parsed.delta?.type === 'text_delta' &&
              parsed.delta?.text
            ) {
              setOutput((prev) => prev + parsed.delta.text);
              setLatestOutput((prev) => prev + parsed.delta.text);
            }
          } catch {
            // skip malformed SSE lines
          }
        }
      }

      setStatus('done');
      setLatestStatus('done');
      setTimeout(() => {
        outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
      setStatus('error');
      setLatestStatus('error');
    }
  };

  const isRunning = status === 'loading' || status === 'streaming';
  const isValid = inputs.filter((i) => i.required).every((i) => values[i.id]?.trim());
  const canRun = (isValid || !!accountId) && !isRunning;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={close}
        />
      )}

      {/* Slide-in panel */}
      <div
        className={`fixed top-14 right-0 bottom-0 w-full sm:w-[460px] bg-white border-l border-slate-200 shadow-2xl z-40 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-white shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm">⚡</span>
              <h2 className="text-sm font-semibold text-slate-900 truncate">{title || '—'}</h2>
            </div>
            {description && (
              <p className="text-[11px] text-slate-400 mt-0.5 truncate pl-5">{description}</p>
            )}
          </div>
          <button
            onClick={close}
            className="shrink-0 ml-3 w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors text-xl leading-none"
            aria-label="Close panel"
          >
            ×
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {isOpen && (
            <>
              <div className="p-5 space-y-5">
                {/* Opportunity context picker */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                    Opportunity context
                  </label>
                  <select
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">— No opportunity —</option>
                    {accounts.map((a) => (
                      <option key={a.id} value={a.id}>{a.company_name}</option>
                    ))}
                  </select>
                  {accountId && (
                    <p className="text-[11px] text-indigo-500">
                      All documents for this opportunity will be injected as context.
                    </p>
                  )}
                </div>

                {/* Input fields */}
                {inputs.length > 0 && (
                  <div className="space-y-4">
                    {inputs.map((input) => (
                      <div key={input.id} className="space-y-1.5">
                        <label className="block text-sm font-medium text-slate-700">
                          {input.label}
                          {!input.required && (
                            <span className="ml-1.5 text-xs text-slate-400 font-normal">(optional)</span>
                          )}
                          {input.required && accountId && (
                            <span className="ml-1.5 text-xs text-indigo-500 font-normal">
                              (or leave blank — docs loaded)
                            </span>
                          )}
                        </label>
                        {input.type === 'textarea' ? (
                          <textarea
                            value={values[input.id] ?? ''}
                            onChange={(e) =>
                              setValues((v) => ({ ...v, [input.id]: e.target.value }))
                            }
                            placeholder={input.placeholder}
                            rows={input.rows ?? 3}
                            disabled={isRunning}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-y disabled:opacity-50"
                          />
                        ) : input.type === 'select' ? (
                          <select
                            value={values[input.id] ?? ''}
                            onChange={(e) =>
                              setValues((v) => ({ ...v, [input.id]: e.target.value }))
                            }
                            disabled={isRunning}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 appearance-none"
                          >
                            <option value="" disabled>Select…</option>
                            {input.options?.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={values[input.id] ?? ''}
                            onChange={(e) =>
                              setValues((v) => ({ ...v, [input.id]: e.target.value }))
                            }
                            placeholder={input.placeholder}
                            disabled={isRunning}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Pure context agent — no inputs */}
                {inputs.length === 0 && runner?.type === 'agent' && (
                  <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3">
                    <p className="text-sm text-slate-500">
                      This agent runs directly from your opportunity documents. Select an opportunity above and hit Generate.
                    </p>
                  </div>
                )}

                {/* Generate button */}
                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={handleGenerate}
                    disabled={!canRun}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium px-4 py-2 text-sm transition-colors"
                  >
                    {status === 'loading' ? (
                      <>
                        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Thinking…
                      </>
                    ) : status === 'streaming' ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-white/70 animate-pulse" />
                        Generating…
                      </>
                    ) : (
                      <>⚡ Generate</>
                    )}
                  </button>
                  {(status === 'done' || status === 'error') && (
                    <button
                      onClick={() => {
                        setOutput('');
                        setStatus('idle');
                        setLatestOutput('');
                        setLatestStatus('idle');
                        setErrorMsg('');
                        setValues({});
                      }}
                      className="text-sm text-slate-400 hover:text-slate-700 font-medium transition-colors"
                    >
                      Clear ↺
                    </button>
                  )}
                </div>

                {/* Error message */}
                {status === 'error' && errorMsg && (
                  <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3 border border-red-100">
                    {errorMsg}
                  </p>
                )}
              </div>

              {/* Output */}
              {(status === 'streaming' || status === 'done') && output && (
                <div ref={outputRef} className="px-5 pb-8">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 bg-white">
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                        {status === 'streaming' ? 'Generating…' : 'Output'}
                      </span>
                      {status === 'done' && <CopyButton text={output} label="Copy" />}
                    </div>
                    <div className="px-4 py-4 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed font-mono">
                      {output}
                      {status === 'streaming' && (
                        <span className="inline-block w-1.5 h-4 bg-indigo-400 animate-pulse ml-0.5 align-middle" />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
