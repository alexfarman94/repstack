'use client';

import { ReactNode, Suspense, useState } from 'react';
import { RunnerProvider } from './RunnerContext';
import { SidebarNav } from '@/components/sidebar/SidebarNav';
import { OutputPanel } from '@/components/output/OutputPanel';

function ShellContent({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left panel — dark sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-[240px] transform transition-transform duration-200 lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarNav onCloseMobile={() => setSidebarOpen(false)} />
      </div>

      {/* Mobile header bar with hamburger */}
      <div className="fixed top-0 left-0 right-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-2.5 lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="flex h-8 w-8 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100"
          aria-label="Open sidebar menu"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
        <span className="text-sm font-bold tracking-tight text-slate-900">Rep Stack</span>
      </div>

      {/* Middle panel — main content */}
      <div className="flex-1 overflow-y-auto bg-[var(--bg-secondary)] pt-12 lg:pt-0">
        <div className="mx-auto max-w-[960px] px-4 py-5 sm:px-6">
          {children}
        </div>
      </div>

      {/* Right panel — persistent output (slide-over on medium screens) */}
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
