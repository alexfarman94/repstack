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
      <div className="glass-panel px-5 py-4">
        <p className="text-sm text-slate-500">Select an account from the sidebar to get started.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel px-5 py-4">
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-sm">
            <span className="font-semibold text-slate-900 truncate">{accountName}</span>
            {opportunityName && (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0 text-slate-300">
                  <path d="M9 18l6-6-6-6" />
                </svg>
                <span className="font-medium text-indigo-600 truncate">{opportunityName}</span>
              </>
            )}
          </div>
          <p className="mt-0.5 text-xs text-slate-400">
            {docCount > 0
              ? `${docCount} document${docCount !== 1 ? 's' : ''} in context`
              : 'No documents uploaded yet'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {docCount > 0 && (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
              Context ready
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
