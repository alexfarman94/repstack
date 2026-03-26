'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// ─── Icons (defined here so they stay client-side — can't pass functions across
//     the server/client boundary as props) ─────────────────────────────────────

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

const ICONS: Record<string, React.FC<{ className?: string }>> = {
  overview: OverviewIcon,
  accounts: AccountsIcon,
  docs: DocsIcon,
  tools: ToolsIcon,
  agents: AgentsIcon,
};

// ─── Components ───────────────────────────────────────────────────────────────

export function SidebarLinkClient({
  href,
  label,
  icon,
  exact,
}: {
  href: string;
  label: string;
  icon: string;
  exact?: boolean;
}) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname === href || pathname.startsWith(href + '/');
  const Icon = ICONS[icon];

  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
        isActive
          ? 'bg-white/[0.1] text-white font-medium'
          : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
      }`}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      {label}
    </Link>
  );
}

export function MobileTabClient({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + '/');

  return (
    <Link
      href={href}
      className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
        isActive
          ? 'bg-white/[0.1] text-white'
          : 'text-slate-400 hover:text-white'
      }`}
    >
      {label}
    </Link>
  );
}
