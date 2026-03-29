'use client';

import Link from 'next/link';
import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs';

interface NavBarProps {
  variant?: 'default' | 'transparent';
}

export function NavBar({ variant = 'default' }: NavBarProps) {
  const hasClerkKey = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  const isTransparent = variant === 'transparent';

  return (
    <nav
      className={`sticky top-0 z-50 ${
        isTransparent
          ? 'border-b border-white/[0.06] bg-transparent'
          : 'border-b border-slate-200 bg-white/90 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className={`text-lg font-bold tracking-tight ${
            isTransparent ? 'text-white' : 'text-slate-900'
          }`}
        >
          Rep Stack
        </Link>
        <div className="flex items-center gap-4">
          {hasClerkKey ? (
            <>
              <SignedIn>
                <Link
                  href="/dashboard"
                  className={`text-sm font-medium transition-colors ${
                    isTransparent
                      ? 'text-slate-300 hover:text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Workspace
                </Link>
                <UserButton
                  appearance={{
                    elements: { avatarBox: 'w-8 h-8' },
                  }}
                />
              </SignedIn>
              <SignedOut>
                <Link
                  href="/sign-in"
                  className={`text-sm transition-colors ${
                    isTransparent
                      ? 'text-slate-400 hover:text-white'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  className="inline-flex items-center rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
                >
                  Get started
                </Link>
              </SignedOut>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className={`text-sm transition-colors ${
                  isTransparent
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex items-center rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
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
