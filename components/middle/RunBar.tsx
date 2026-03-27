'use client';

import { useRunner } from '@/app/dashboard/RunnerContext';

interface RunBarProps {
  accountName: string | undefined;
  agentName: string | undefined;
  onRun: () => void;
  isRunning: boolean;
}

export function RunBar({ accountName, agentName, onRun, isRunning }: RunBarProps) {
  const { activeAccountId, selectedAgentId } = useRunner();
  const canRun = !!activeAccountId && !!selectedAgentId && !isRunning;

  return (
    <div className="sticky bottom-0 z-10 border-t border-slate-200 bg-white/90 backdrop-blur-lg px-5 py-3">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 text-xs text-slate-500">
          {accountName && agentName ? (
            <span>
              Run <span className="font-semibold text-slate-700">{agentName}</span> on{' '}
              <span className="font-semibold text-slate-700">{accountName}</span>
            </span>
          ) : !accountName ? (
            <span>Select an account</span>
          ) : (
            <span>Select an agent</span>
          )}
        </div>

        <button
          onClick={onRun}
          disabled={!canRun}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isRunning ? (
            <>
              <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Running...
            </>
          ) : (
            'Run Agent'
          )}
        </button>
      </div>
    </div>
  );
}
