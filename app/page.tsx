import Link from 'next/link';
import { tools, getFeaturedTools } from '@/data/tools';
import { Tool } from '@/lib/types';
import { ToolCard } from '@/components/ToolCard';

export default function HomePage() {
  const allPublic: Tool[] = tools.map(({ systemPrompt: _sp, ...rest }) => rest as Tool);
  const featured: Tool[] = getFeaturedTools().map(({ systemPrompt: _sp, ...rest }) => rest as Tool);

  return (
    <div>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-16">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-sm text-indigo-300 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            {allPublic.length} live tools · All free
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-5 text-balance">
            Your unfair advantage{' '}
            <span className="text-indigo-400">in every deal</span>
          </h1>
          <p className="text-lg text-stone-400 leading-relaxed mb-8">
            Live AI tools for Account Executives, BDRs, and Sales Engineers.
            Paste your real situation. Get something ready to use in seconds.
            Built by someone who ships AI for a living.
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2.5 text-sm transition-colors duration-150"
            >
              ⚡ Browse the tools →
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-stone-300 font-medium px-5 py-2.5 text-sm transition-colors duration-150"
            >
              Who built this
            </Link>
          </div>
        </div>
      </section>

      {/* Persona strips */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              label: 'Account Executives',
              value: 'ae',
              emoji: '🎯',
              desc: 'Deal prep, business cases, champion enablement, demo direction, objection handling',
            },
            {
              label: 'BDRs',
              value: 'bdr',
              emoji: '📞',
              desc: 'Cold sequences, LinkedIn outreach, objection flips, ICP qualification',
            },
            {
              label: 'Sales Engineers',
              value: 'se',
              emoji: '🛠',
              desc: 'RFP responses, tailored demo arcs, pre-call intel, business case support',
            },
          ].map((p) => (
            <Link
              key={p.value}
              href={`/tools?persona=${p.value}`}
              className="group rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-white/[0.15] hover:bg-white/[0.05] p-5 transition-all duration-200"
            >
              <div className="text-2xl mb-3">{p.emoji}</div>
              <h3 className="text-white font-semibold mb-1.5 group-hover:text-indigo-200 transition-colors">
                {p.label}
              </h3>
              <p className="text-sm text-stone-500">{p.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured tools */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Featured tools</h2>
          <Link href="/tools" className="text-sm text-stone-400 hover:text-white transition-colors">
            View all {allPublic.length} →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <section className="border-t border-white/[0.06] bg-white/[0.02]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-semibold text-white mb-1">Tools that do the work, not just describe it.</h2>
            <p className="text-stone-400 text-sm">Paste your situation. Get output you can use. No [BRACKETS] to fill in.</p>
          </div>
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2.5 text-sm transition-colors duration-150 flex-shrink-0"
          >
            ⚡ Try a tool →
          </Link>
        </div>
      </section>
    </div>
  );
}
