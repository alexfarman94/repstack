'use client';

import { ReactNode, Suspense } from 'react';
import { RunnerProvider } from './RunnerContext';
import { SidebarNav } from '@/components/sidebar/SidebarNav';
import { OutputPanel } from '@/components/output/OutputPanel';

function ShellContent({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen">
      {/* Left panel — dark sidebar */}
      <div className="hidden w-[240px] shrink-0 lg:block">
        <SidebarNav />
      </div>

      {/* Middle panel — main content */}
      <div className="flex-1 overflow-y-auto bg-[var(--bg-secondary)]">
        <div className="mx-auto max-w-[960px] px-4 py-5 sm:px-6">
          {children}
        </div>
      </div>

      {/* Right panel — persistent output */}
      <div className="hidden w-[380px] shrink-0 xl:block">
        <OutputPanel />
      </div>
    </div>
  );
}

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-[var(--bg-secondary)]">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:0ms]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:150ms]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:300ms]" />
        </div>
      </div>
    }>
      <RunnerProvider>
        <ShellContent>{children}</ShellContent>
      </RunnerProvider>
    </Suspense>
  );
}
