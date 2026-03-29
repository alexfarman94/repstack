import Link from 'next/link';
import { PublicShell } from '@/components/PublicShell';

export const metadata = {
  title: 'About — Rep Stack',
  description: 'Rep Stack is built by Alex Farman, GTM AI Strategist.',
};

export default function AboutPage() {
  return (
    <PublicShell>
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold text-white mb-6">About Rep Stack</h1>

      <div className="space-y-5 text-slate-400 leading-relaxed">
        <p>
          Rep Stack is a library of AI tools built specifically for salespeople — Account Executives,
          BDRs, and Sales Engineers. Every tool here has been designed around real GTM workflows,
          not hypothetical use cases.
        </p>

        <p>
          The prompts, templates, and tools on this site are adapted from work done in live sales
          organisations — the same kind of AI products that have driven measurable outcomes: faster
          deal prep, higher RFP response rates, shorter time-to-qualified-meeting, and thousands of
          hours saved across GTM teams.
        </p>

        <p>
          The goal is simple: democratise access to AI tools that actually work in sales, so every
          rep — not just the ones at well-resourced companies — can benefit from the same
          productivity gains.
        </p>

        <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-6 mt-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold flex-shrink-0">
              AF
            </div>
            <div>
              <p className="text-white font-semibold">Alex Farman</p>
              <p className="text-sm text-slate-500">GTM AI Strategist</p>
            </div>
          </div>
          <p className="text-sm text-slate-400 mb-4">
            I build AI tools for sales teams and own the strategy for how AI gets used across GTM
            orgs. 26 AI products shipped. 75–80% adoption. ~15,000 hours freed up annually.
            Previously Sales Engineer at Bullhorn ($3.5m ACV closed in FY22/23) and HiBob.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://alexfarman.me"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Interactive CV →
            </a>
            <a
              href="https://www.linkedin.com/in/alex-farman-53575a106/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              LinkedIn →
            </a>
          </div>
        </div>

        <p className="pt-4">
          All tools on Rep Stack are free to use. If you find them valuable, the best thing you
          can do is share them with your team or connect on LinkedIn.
        </p>

        <div className="pt-4">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2.5 text-sm transition-colors duration-150"
          >
            Browse the tools →
          </Link>
        </div>
      </div>
    </div>
    </PublicShell>
  );
}
