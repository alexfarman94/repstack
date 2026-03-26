import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { NavBar } from '@/components/NavBar';
import './globals.css';

export const metadata: Metadata = {
  title: 'Rep Stack — Your unfair advantage in every deal',
  description:
    'Live AI tools for Account Executives, BDRs, and Sales Engineers. Paste your real situation. Get something ready to use in seconds.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const hasClerkKey = Boolean(clerkPublishableKey);

  const content = (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <NavBar />
        <main>{children}</main>
        <footer className="border-t border-slate-200 mt-24 py-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">
                Built by{' '}
                <a
                  href="https://alexfarman.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-700 hover:text-slate-900 transition-colors"
                >
                  Alex Farman
                </a>{' '}
                — GTM AI Strategist
              </p>
            </div>
            <p className="text-xs text-slate-400">© {new Date().getFullYear()} Rep Stack. All tools free to use.</p>
          </div>
        </footer>
      </body>
    </html>
  );

  if (!hasClerkKey) return content;

  return <ClerkProvider publishableKey={clerkPublishableKey}>{content}</ClerkProvider>;
}
