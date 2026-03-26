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
          <SidebarLinkClient href="/dashboard" exact label="Overview" icon={OverviewIcon} />
          <div className="pt-4 pb-1">
            <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-stone-600">
              Knowledge Base
            </p>
          </div>
          <SidebarLinkClient href="/dashboard/accounts" label="Accounts" icon={AccountsIcon} />
          <SidebarLinkClient href="/dashboard/knowledge-base" label="Documents" icon={DocsIcon} />
          <div className="pt-4 pb-1">
            <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-stone-600">
              Tools
            </p>
          </div>
          <SidebarLinkClient href="/tools" label="All tools" icon={ToolsIcon} />
          <SidebarLinkClient href="/dashboard/agents" label="My agents" icon={AgentsIcon} />
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

// ─── Icons ────────────────────────────────────────────────────────────────────

function OverviewIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="2" width="5" height="5" rx="1" />
      <rect x="9" y="2" width="5" height="5" rx="1" />
      <rect x="2" y="9" width="5" height="5" rx="1" />
      <rect x="9" y="9" width="5" height="5" rx="1" />
    </svg>
  );
}

function AccountsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="5" r="2.5" />
      <path d="M2 13c0-3.314 2.686-5 6-5s6 1.686 6 5" />
    </svg>
  );
}

function DocsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 2h6l3 3v9H3V2h1z" />
      <path d="M10 2v3h3" />
      <path d="M5 8h6M5 11h4" />
    </svg>
  );
}

function ToolsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9.5 2.5l-7 7 1 4 4-1 7-7-5-3z" />
    </svg>
  );
}

function AgentsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="8" r="5.5" />
      <path d="M5.5 8h5M8 5.5v5" />
    </svg>
  );
}
