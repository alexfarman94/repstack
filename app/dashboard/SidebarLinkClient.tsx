'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function SidebarLinkClient({
  href,
  label,
  icon: Icon,
  exact,
}: {
  href: string;
  label: string;
  icon: React.FC<{ className?: string }>;
  exact?: boolean;
}) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname === href || pathname.startsWith(href + '/');

  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
        isActive
          ? 'bg-white/[0.08] text-white font-medium'
          : 'text-stone-400 hover:text-white hover:bg-white/[0.04]'
      }`}
    >
      <Icon className="w-4 h-4 shrink-0" />
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
          ? 'bg-white/[0.08] text-white'
          : 'text-stone-400 hover:text-white'
      }`}
    >
      {label}
    </Link>
  );
}
