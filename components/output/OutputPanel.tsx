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
    <aside className="flex h-full flex-col border-l border-slate-100 bg-white">
      {/* Progress bar — thin indigo line at top during streaming/loading */}
      {(isStreaming || isLoading) && (
        <div className="h-0.5 w-full overflow-hidden bg-indigo-100">
          <div className="h-full w-1/3 animate-[shimmer_1.5s_ease-in-out_infinite] bg-gradient-to-r from-indigo-400 via-indigo-500 to-indigo-400" />
        </div>
      )}

      {/* Done indicator — top accent bar */}
      {isDone && <div className="h-0.5 w-full bg-indigo-500" />}

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
            <span className="flex items-center gap-0.5">
              <span className="h-1 w-1 animate-pulse rounded-full bg-indigo-500" />
              <span className="h-1 w-1 animate-pulse rounded-full bg-indigo-500 [animation-delay:0.2s]" />
              <span className="h-1 w-1 animate-pulse rounded-full bg-indigo-500 [animation-delay:0.4s]" />
            </span>
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
        {/* Loading — three dot animation */}
        {isLoading && !hasOutput && (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <div className="mb-3 flex items-center gap-1.5">
              <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:0ms]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:150ms]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:300ms]" />
            </div>
            <p className="text-sm text-slate-500">Thinking...</p>
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

        {/* Empty state — sparkles icon */}
        {latestStatus === 'idle' && !hasOutput && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-3 rounded-xl bg-slate-50 p-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-300">
                <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-500">Run an agent to see output</p>
            <p className="mt-1 max-w-[200px] text-xs text-slate-400">
              Select an account and agent, then hit Run.
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
