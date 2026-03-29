'use client';

import { useRunner } from '@/app/dashboard/RunnerContext';

interface ContextHeaderProps {
  accountName: string | undefined;
  opportunityName: string | undefined;
  docCount: number;
}

export function ContextHeader({ accountName, opportunityName, docCount }: ContextHeaderProps) {
  const { activeAccountId } = useRunner();

  if (!activeAccountId) {
    return (
      <div className="border-b border-slate-100 px-1 py-3">
        <p className="text-sm text-slate-400">Select an account from the sidebar to get started.</p>
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-10 -mx-4 border-b border-slate-100 bg-[var(--bg-secondary)] px-5 py-2.5 sm:-mx-6">
      <div className="flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-1.5 text-sm">
          <span className="font-semibold text-slate-900 truncate">{accountName}</span>
          {opportunityName && (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0 text-slate-300">
                <path d="M9 18l6-6-6-6" />
              </svg>
              <span className="font-medium text-indigo-600 truncate">{opportunityName}</span>
            </>
          )}
          <span className="ml-2 text-xs text-slate-400">
            {docCount > 0
              ? `${docCount} doc${docCount !== 1 ? 's' : ''}`
              : 'No docs'}
          </span>
        </div>

        {docCount > 0 && (
          <span className="shrink-0 flex items-center gap-1 text-[10px] font-medium text-emerald-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Ready
          </span>
        )}
      </div>
    </div>
  );
}
