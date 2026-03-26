import { ReactNode } from 'react';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { SidebarLinkClient, MobileTabClient } from './SidebarLinkClient';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  return (
    <div className="flex min-h-[calc(100vh-56px)]">
      {/* Sidebar — dark for professional CRM contrast */}
      <aside className="hidden md:flex flex-col w-56 bg-slate-800 shrink-0">
        <div className="px-3 py-5 space-y-0.5">
          <SidebarLinkClient href="/dashboard" exact label="Dashboard" icon="overview" />

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
          <SidebarLinkClient href="/tools" label="Tools" icon="tools" />
          <SidebarLinkClient href="/dashboard/agents" label="Agents" icon="agents" />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 bg-slate-50">
        {/* Mobile tab bar */}
        <nav className="md:hidden flex gap-1 px-4 py-2 border-b border-slate-200 bg-white overflow-x-auto">
          <MobileTabClient href="/dashboard" label="Dashboard" />
          <MobileTabClient href="/dashboard/accounts" label="Opportunities" />
          <MobileTabClient href="/tools" label="Tools" />
          <MobileTabClient href="/dashboard/agents" label="Agents" />
        </nav>
        <div className="p-6 max-w-5xl">{children}</div>
      </div>
    </div>
  );
}
