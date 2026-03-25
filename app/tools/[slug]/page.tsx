import { notFound } from 'next/navigation';
import Link from 'next/link';
import { tools, getToolBySlug, getRelatedTools } from '@/data/tools';
import { PersonaBadge } from '@/components/PersonaBadge';
import { CopyButton } from '@/components/CopyButton';
import { ToolCard } from '@/components/ToolCard';
import { ToolRunner } from '@/components/ToolRunner';
import { FORMAT_ICONS, FORMAT_LABELS } from '@/lib/types';

export async function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const tool = getToolBySlug(params.slug);
  if (!tool) return {};
  return {
    title: `${tool.title} — Rep Stack`,
    description: tool.description,
  };
}

export default function ToolPage({ params }: { params: { slug: string } }) {
  const tool = getToolBySlug(params.slug);
  if (!tool) notFound();

  const related = getRelatedTools(tool);
  const isLive = tool.format === 'embedded';

  // Strip systemPrompt before passing to client components
  const { systemPrompt: _sp, ...toolPublic } = tool;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Back */}
      <Link
        href="/tools"
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-white transition-colors mb-8"
      >
        ← All tools
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 flex-wrap mb-4">
          {tool.personas.map((p) => (
            <PersonaBadge key={p} persona={p} size="md" />
          ))}
          <span className={`text-sm ml-1 ${isLive ? 'text-indigo-300' : 'text-stone-400'}`}>
            {FORMAT_ICONS[tool.format]} {FORMAT_LABELS[tool.format]}
          </span>
          <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-2 py-0.5 ml-auto">
            Free
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{tool.title}</h1>
        {tool.hook && (
          <p className="text-lg text-indigo-300/80 italic mb-3">{tool.hook}</p>
        )}
        <p className="text-base text-stone-400 leading-relaxed">{tool.description}</p>
      </div>

      {/* Why it matters */}
      {tool.whyItMatters && (
        <div className="rounded-2xl bg-indigo-600/[0.08] border border-indigo-500/20 p-5 mb-8">
          <p className="text-sm text-stone-300 leading-relaxed">{tool.whyItMatters}</p>
        </div>
      )}

      {/* Live tool */}
      {isLive && tool.inputs && (
        <div className="mb-12">
          <h2 className="text-base font-semibold text-white mb-4">Try it now</h2>
          <ToolRunner toolId={tool.id} inputs={tool.inputs} />
        </div>
      )}

      {/* Prompt fallback (non-embedded tools) */}
      {!isLive && tool.format === 'prompt' && tool.content && (
        <div className="mb-12">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-white">The prompt</h2>
            <CopyButton text={tool.content} label="Copy prompt" />
          </div>
          <pre className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-6 text-sm text-stone-300 whitespace-pre-wrap leading-relaxed overflow-x-auto font-mono">
            {tool.content}
          </pre>
        </div>
      )}

      {!isLive && tool.format === 'gpt' && tool.externalUrl && (
        <div className="mb-12">
          <h2 className="text-base font-semibold text-white mb-3">Open the GPT / Gem</h2>
          <a
            href={tool.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2.5 text-sm transition-colors duration-150"
          >
            🔗 Open in ChatGPT / Gemini →
          </a>
        </div>
      )}

      {!isLive && tool.format === 'download' && tool.downloadUrl && (
        <div className="mb-12">
          <h2 className="text-base font-semibold text-white mb-3">Download</h2>
          <a
            href={tool.downloadUrl}
            download
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2.5 text-sm transition-colors duration-150"
          >
            📥 Download file →
          </a>
        </div>
      )}

      {/* Use cases */}
      {tool.useCases.length > 0 && (
        <div className="mb-8">
          <h2 className="text-base font-semibold text-white mb-3">When to use this</h2>
          <ul className="space-y-2">
            {tool.useCases.map((uc, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-stone-400">
                <span className="text-indigo-400 mt-0.5 flex-shrink-0">→</span>
                {uc}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Byline */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5 mb-12 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          AF
        </div>
        <div>
          <p className="text-sm text-stone-300 font-medium">Built by Alex Farman</p>
          <p className="text-xs text-stone-500">
            GTM AI Strategist · 26 AI products shipped ·{' '}
            <a
              href="https://alexfarman.me"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              alexfarman.me →
            </a>
          </p>
        </div>
      </div>

      {/* Related tools */}
      {related.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-white mb-4">Related tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((t) => {
              const { systemPrompt: _s, ...tPublic } = t;
              return <ToolCard key={tPublic.id} tool={tPublic as typeof t} />;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
