'use client';

import { useRunner, DashboardTab } from '@/app/dashboard/RunnerContext';
import { AccountTree } from './AccountTree';

const tabs: { id: DashboardTab; label: string; icon: JSX.Element }[] = [
  {
    id: 'workspace',
    label: 'Workspace',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    ),
  },
];

interface SidebarNavProps {
  onCloseMobile?: () => void;
}

export function SidebarNav({ onCloseMobile }: SidebarNavProps) {
  const { activeTab, setActiveTab } = useRunner();

  const handleTabClick = (tabId: DashboardTab) => {
    setActiveTab(tabId);
    onCloseMobile?.();
  };

  return (
    <aside className="flex h-full flex-col bg-[#0f0f14]" role="navigation" aria-label="Main sidebar">
      {/* Logo area */}
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-sm font-bold tracking-tight text-white">Rep Stack</span>
        {/* Close button on mobile */}
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="flex h-6 w-6 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-white/[0.08] hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Account tree fills available space */}
      <div className="flex-1 overflow-hidden">
        <AccountTree />
      </div>

      {/* Bottom tab bar */}
      <div className="border-t border-white/[0.06] px-2 py-2">
        <div className="flex items-center gap-1" role="tablist" aria-label="Dashboard sections">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-current={activeTab === tab.id ? 'page' : undefined}
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-md px-2 py-2.5 text-[11px] font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white/[0.08] text-indigo-400'
                  : 'text-slate-500 hover:bg-white/[0.04] hover:text-slate-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
