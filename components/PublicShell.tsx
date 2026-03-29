import { ReactNode } from 'react';
import { NavBar } from './NavBar';

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <NavBar variant="transparent" />
      <main>{children}</main>
      <footer className="border-t border-white/[0.06] py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
          <p className="text-sm text-slate-500">
            Built by{' '}
            <a
              href="https://alexfarman.me"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 transition-colors hover:text-white"
            >
              Alex Farman
            </a>
          </p>
          <p className="text-xs text-slate-600">&copy; {new Date().getFullYear()} Rep Stack</p>
        </div>
      </footer>
    </div>
  );
}
