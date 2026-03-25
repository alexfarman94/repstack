import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Rep Stack — AI tools built for salespeople',
  description: 'Copy-paste prompts, GPTs, and templates for Account Executives, BDRs, and Sales Engineers. Built by someone who ships AI for a living.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0c0c0e] text-stone-100 antialiased">
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
              <a
                href="https://alexfarman.me"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                alexfarman.me →
              </a>
            </div>
          </div>
        </nav>
        <main>{children}</main>
        <footer className="border-t border-white/[0.06] mt-24 py-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm text-stone-500">
                Built by{' '}
                <a
                  href="https://alexfarman.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-300 hover:text-white transition-colors"
                >
                  Alex Farman
                </a>{' '}
                — GTM AI Strategist
              </p>
            </div>
            <p className="text-xs text-stone-600">
              © {new Date().getFullYear()} Rep Stack. All tools free to use.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
