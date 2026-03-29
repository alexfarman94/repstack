import Link from 'next/link';
import { NavBar } from '@/components/NavBar';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <NavBar variant="transparent" />

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 pt-24 pb-20 sm:px-6">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-sm text-indigo-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-400" />
            AI-powered deal workspace
          </div>
          <h1 className="text-4xl font-bold leading-tight text-balance sm:text-5xl">
            Your deals. Full context.{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              AI that actually knows your account.
            </span>
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-400">
            Upload your call transcripts, emails, and deal notes. Run AI agents that have full context on every account. Get discovery prep, risk audits, email drafts, and more — in seconds.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
            >
              Start free trial →
            </Link>
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/[0.08]"
            >
              Try free tools
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-white/[0.06] bg-white/[0.02]">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
          <p className="mb-8 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
            How it works
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Upload your deal docs',
                desc: 'Call transcripts, emails, proposals, notes — drag and drop into your account workspace.',
              },
              {
                step: '02',
                title: 'Pick an AI agent',
                desc: 'Discovery prep, objection handling, deal risk audit, email drafts, exec briefings — or build your own.',
              },
              {
                step: '03',
                title: 'Get contextual output',
                desc: 'Every agent has full context on your account. No re-pasting, no context limits, no generic answers.',
              },
            ].map((item) => (
              <div key={item.step} className="group">
                <p className="mb-3 text-xs font-medium text-indigo-400">{item.step}</p>
                <h3 className="mb-2 text-base font-semibold text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agents preview */}
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <p className="mb-8 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
          Pre-built agents
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: '🔍', name: 'Discovery Prep', desc: 'Targeted questions and gap analysis from your deal docs' },
            { icon: '🛡', name: 'Objection Handler', desc: 'Likely objections with psychologically-informed responses' },
            { icon: '⚠️', name: 'Deal Risk Audit', desc: 'MEDDIC scorecard and red flag detection' },
            { icon: '✉️', name: 'Email Draft', desc: 'Context-aware follow-up emails for any deal stage' },
            { icon: '📞', name: 'Call Summary', desc: 'Structured summary with decisions and next steps' },
            { icon: '📋', name: 'Exec Briefing', desc: 'One-pager for senior stakeholder meetings' },
          ].map((agent) => (
            <div
              key={agent.name}
              className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 transition-colors hover:border-white/[0.12] hover:bg-white/[0.04]"
            >
              <span className="mb-2 block text-lg">{agent.icon}</span>
              <h3 className="text-sm font-semibold text-white">{agent.name}</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">{agent.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/[0.06] bg-white/[0.02]">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 px-4 py-14 sm:flex-row sm:px-6">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Stop re-pasting context into ChatGPT.
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              RepStack makes the database the context — so every agent run is fully informed.
            </p>
          </div>
          <Link
            href="/sign-up"
            className="inline-flex flex-shrink-0 items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
          >
            Get started free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
          <p className="text-sm text-slate-500">
            Built by{' '}
            <a href="https://alexfarman.me" target="_blank" rel="noopener noreferrer" className="text-slate-400 transition-colors hover:text-white">
              Alex Farman
            </a>
          </p>
          <p className="text-xs text-slate-600">&copy; {new Date().getFullYear()} Rep Stack</p>
        </div>
      </footer>
    </div>
  );
}
