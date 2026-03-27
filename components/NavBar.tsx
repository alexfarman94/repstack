'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs';

export function NavBar() {
  const pathname = usePathname();
  const inDashboard = pathname?.startsWith('/dashboard');
  const hasClerkKey = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <a href="/" className="text-slate-900 font-bold text-lg tracking-tight">
          Rep Stack
        </a>
        <div className="flex items-center gap-6">
          {hasClerkKey ? (
            <>
              <SignedIn>
                <Link
                  href="/dashboard"
                  className={`text-sm transition-colors ${
                    inDashboard
                      ? 'text-indigo-700 font-semibold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Workspace
                </Link>
                <Link href="/dashboard/accounts" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                  Accounts
                </Link>
                <Link href="/dashboard/agents" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                  Agents
                </Link>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: 'w-8 h-8',
                    },
                  }}
                />
              </SignedIn>
              <SignedOut>
                <Link
                  href="/sign-in"
                  className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  className="inline-flex items-center rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-3 py-1.5 text-sm transition-colors"
                >
                  Get started
                </Link>
              </SignedOut>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex items-center rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-3 py-1.5 text-sm transition-colors"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
