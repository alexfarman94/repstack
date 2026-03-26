import { ReactNode } from 'react';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { SidebarLinkClient, MobileTabClient } from './SidebarLinkClient';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  return (
    <div className="flex min-h-[calc(100vh-56px)]">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-56 border-r border-white/[0.06] bg-[#0e0e10] shrink-0">
        <div className="px-4 py-6 space-y-1">
          <SidebarLinkClient href="/dashboard" exact label="Overview" icon="overview" />
          <div className="pt-4 pb-1">
            <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-stone-600">
              Knowledge Base
            </p>
          </div>
          <SidebarLinkClient href="/dashboard/accounts" label="Accounts" icon="accounts" />
          <SidebarLinkClient href="/dashboard/knowledge-base" label="Documents" icon="docs" />
          <div className="pt-4 pb-1">
            <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-stone-600">
              Tools
            </p>
          </div>
          <SidebarLinkClient href="/tools" label="All tools" icon="tools" />
          <SidebarLinkClient href="/dashboard/agents" label="My agents" icon="agents" />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Mobile tab bar */}
        <nav className="md:hidden flex gap-1 px-4 py-3 border-b border-white/[0.06] overflow-x-auto">
          <MobileTabClient href="/dashboard" label="Overview" />
          <MobileTabClient href="/dashboard/accounts" label="Accounts" />
          <MobileTabClient href="/dashboard/knowledge-base" label="Docs" />
          <MobileTabClient href="/tools" label="Tools" />
          <MobileTabClient href="/dashboard/agents" label="Agents" />
        </nav>
        <div className="p-6 max-w-5xl">{children}</div>
      </div>
    </div>
  );
}
