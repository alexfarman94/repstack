'use client';

import { ReactNode } from 'react';
import { RunnerProvider } from './RunnerContext';
import { RunnerPanel } from '@/components/RunnerPanel';

function ShellContent({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-56px)] bg-[radial-gradient(circle_at_top,#e0e7ff_0%,#f8fafc_36%,#f1f5f9_100%)]">
      <div className="mx-auto max-w-[1600px] px-3 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto">{children}</div>
      </div>
      <RunnerPanel />
    </div>
  );
}

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <RunnerProvider>
      <ShellContent>{children}</ShellContent>
    </RunnerProvider>
  );
}
