'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { RunnerProvider } from './RunnerContext';
import { RunnerPanel } from '@/components/RunnerPanel';
import { SidebarLinkClient, MobileTabClient } from './SidebarLinkClient';

function ShellContent({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-56px)]">
      {/* Dark sidebar — always visible on md+ */}
      <aside className="hidden md:flex flex-col w-56 bg-slate-800 shrink-0 sticky top-14 self-start h-[calc(100vh-56px)] overflow-y-auto">
        <nav className="px-3 py-5 flex flex-col h-full">
          <div className="space-y-0.5">
            <SidebarLinkClient href="/dashboard" exact label="Overview" icon="overview" />

            <div className="pt-5 pb-1.5 px-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                Pipeline
              </p>
            </div>
            <SidebarLinkClient href="/dashboard/accounts" label="Opportunities" icon="accounts" />

            <div className="pt-5 pb-1.5 px-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                AI
              </p>
            </div>
            <SidebarLinkClient href="/dashboard/tools" label="Tools" icon="tools" />
            <SidebarLinkClient href="/dashboard/agents" label="Agents" icon="agents" />
          </div>

          <div className="mt-4 border-t border-white/[0.06] pt-4">
            <Link
              href="/dashboard/agents/new"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              <span className="w-4 h-4 shrink-0 flex items-center justify-center text-base leading-none">+</span>
              New agent
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main content area */}
      <div className="flex-1 min-w-0 bg-slate-50">
        {/* Mobile tab bar */}
        <nav className="md:hidden flex gap-1 px-4 py-2 border-b border-slate-200 bg-white overflow-x-auto shrink-0">
          <MobileTabClient href="/dashboard" label="Overview" />
          <MobileTabClient href="/dashboard/accounts" label="Opportunities" />
          <MobileTabClient href="/dashboard/tools" label="Tools" />
          <MobileTabClient href="/dashboard/agents" label="Agents" />
        </nav>
        <div className="p-6 max-w-5xl">
          {children}
        </div>
      </div>

      {/* Slide-in runner panel — fixed, overlays from right */}
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
