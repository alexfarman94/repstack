'use client';

import { useRunner } from '@/app/dashboard/RunnerContext';
import { StreamingOutput } from './StreamingOutput';
import { OutputActions } from './OutputActions';

export function OutputPanel() {
  const {
    latestOutput,
    latestStatus,
    latestRunnerTitle,
    runId,
    activeAccountId,
    triggerRefresh,
  } = useRunner();

  const isStreaming = latestStatus === 'streaming';
  const isDone = latestStatus === 'done';
  const isLoading = latestStatus === 'loading';
  const isError = latestStatus === 'error';
  const hasOutput = latestOutput.length > 0;

  return (
    <aside className="flex h-full flex-col border-l border-slate-200 bg-white">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Output</p>
          {latestRunnerTitle && (
            <p className="mt-0.5 text-xs font-medium text-slate-700">{latestRunnerTitle}</p>
          )}
        </div>
        {isStreaming && (
          <span className="flex items-center gap-1.5 text-xs text-indigo-600">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" />
            Streaming
          </span>
        )}
        {isDone && (
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
            Complete
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        {/* Loading spinner */}
        {isLoading && !hasOutput && (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <svg className="mb-3 h-6 w-6 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <p className="text-sm">Thinking...</p>
          </div>
        )}

        {/* Streaming / Done output */}
        {hasOutput && (
          <StreamingOutput text={latestOutput} isStreaming={isStreaming} />
        )}

        {/* Error state */}
        {isError && (
          <div className="p-4">
            <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {latestOutput || 'Something went wrong. Please try again.'}
            </div>
          </div>
        )}

        {/* Empty state */}
        {latestStatus === 'idle' && !hasOutput && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-3 rounded-xl bg-slate-50 p-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-300">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-500">No output yet</p>
            <p className="mt-1 max-w-[200px] text-xs text-slate-400">
              Select an account and agent, then hit Run to generate output.
            </p>
          </div>
        )}
      </div>

      {/* Actions footer — only show when output is done */}
      {isDone && hasOutput && (
        <div className="shrink-0">
          <OutputActions
            output={latestOutput}
            runId={runId}
            accountId={activeAccountId}
            onSaved={triggerRefresh}
          />
        </div>
      )}
    </aside>
  );
}
