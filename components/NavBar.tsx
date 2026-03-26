'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs';

export function NavBar() {
  const pathname = usePathname();
  const inDashboard = pathname?.startsWith('/dashboard');

  return (
    <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0c0c0e]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <a href="/" className="text-white font-bold text-lg tracking-tight">
          Rep Stack
        </a>
        <div className="flex items-center gap-6">
          <a href="/tools" className="text-sm text-stone-400 hover:text-white transition-colors">
            Tools
          </a>
          <a href="/about" className="text-sm text-stone-400 hover:text-white transition-colors">
            About
          </a>
          <SignedIn>
            <Link
              href="/dashboard"
              className={`text-sm transition-colors ${
                inDashboard ? 'text-white font-medium' : 'text-stone-400 hover:text-white'
              }`}
            >
              Dashboard
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
              className="text-sm text-stone-400 hover:text-white transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex items-center rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-3 py-1.5 text-sm transition-colors duration-150"
            >
              Get started
            </Link>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}
