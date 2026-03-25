import Link from 'next/link';
import { Tool, FORMAT_ICONS, FORMAT_LABELS } from '@/lib/types';
import { PersonaBadge } from './PersonaBadge';

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const isLive = tool.format === 'embedded';

  return (
    <div className="group flex flex-col rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.06] transition-all duration-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 p-5 pb-3">
        <div className="flex flex-wrap gap-1.5">
          {tool.personas.map((p) => (
            <PersonaBadge key={p} persona={p} />
          ))}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-xs font-medium ${isLive ? 'text-indigo-300' : 'text-stone-400'}`}>
            {FORMAT_ICONS[tool.format]} {FORMAT_LABELS[tool.format]}
          </span>
          <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-2 py-0.5">
            Free
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 pb-4 flex-1">
        <h3 className="text-white font-semibold text-base mb-1 group-hover:text-indigo-200 transition-colors duration-150">
          {tool.title}
        </h3>
        {tool.hook && (
          <p className="text-indigo-300/70 text-xs italic mb-2">{tool.hook}</p>
        )}
        <p className="text-stone-400 text-sm leading-relaxed line-clamp-3">
          {tool.description}
        </p>
      </div>

      {/* Action */}
      <div className="px-5 py-4 border-t border-white/[0.06]">
        <Link
          href={`/tools/${tool.slug}`}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-150 ${
            isLive
              ? 'bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-600/40 hover:text-white'
              : 'bg-white/10 text-white border border-white/15 hover:bg-white/15'
          }`}
        >
          {isLive ? '⚡ Try it now' : 'View →'}
        </Link>
      </div>
    </div>
  );
}
