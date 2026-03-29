import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
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
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );

  if (!hasClerkKey) return content;

  return <ClerkProvider publishableKey={clerkPublishableKey}>{content}</ClerkProvider>;
}
