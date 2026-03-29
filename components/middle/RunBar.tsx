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
    <div className="sticky bottom-0 z-10 -mx-4 border-t border-slate-800 bg-slate-950 px-5 py-3 sm:-mx-6">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 text-xs text-slate-400">
          {accountName && agentName ? (
            <span>
              Run <span className="font-medium text-white">{agentName}</span> on{' '}
              <span className="font-medium text-white">{accountName}</span>
            </span>
          ) : !accountName ? (
            <span className="text-slate-500">Select an account to get started</span>
          ) : (
            <span className="text-slate-500">Select an agent above</span>
          )}
        </div>

        <button
          onClick={onRun}
          disabled={!canRun}
          className="inline-flex shrink-0 items-center gap-2 rounded-md bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-30"
        >
          {isRunning ? (
            <>
              <span className="flex items-center gap-1">
                <span className="h-1 w-1 animate-pulse rounded-full bg-white" />
                <span className="h-1 w-1 animate-pulse rounded-full bg-white [animation-delay:0.2s]" />
                <span className="h-1 w-1 animate-pulse rounded-full bg-white [animation-delay:0.4s]" />
              </span>
              Running
            </>
          ) : (
            'Run Agent'
          )}
        </button>
      </div>
    </div>
  );
}
