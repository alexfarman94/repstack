import Link from 'next/link';
import { Tool, FORMAT_ICONS, FORMAT_LABELS } from '@/lib/types';
import { PersonaBadge } from './PersonaBadge';
import { CopyButton } from './CopyButton';

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
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
          <span className="text-xs text-stone-400">
            {FORMAT_ICONS[tool.format]} {FORMAT_LABELS[tool.format]}
          </span>
          <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-2 py-0.5">
            Free
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 pb-4 flex-1">
        <h3 className="text-white font-semibold text-base mb-1.5 group-hover:text-indigo-200 transition-colors duration-150">
          {tool.title}
        </h3>
        <p className="text-stone-400 text-sm leading-relaxed line-clamp-3">
          {tool.description}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 px-5 py-4 border-t border-white/[0.06]">
        {tool.format === 'prompt' && tool.content && (
          <CopyButton text={tool.content} />
        )}
        {tool.format === 'gpt' && tool.externalUrl && (
          <a
            href={tool.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-white/10 text-white border border-white/15 hover:bg-white/15 transition-all duration-150"
          >
            Open GPT →
          </a>
        )}
        {tool.format === 'download' && tool.downloadUrl && (
          <a
            href={tool.downloadUrl}
            download
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-white/10 text-white border border-white/15 hover:bg-white/15 transition-all duration-150"
          >
            📥 Download
          </a>
        )}
        <Link
          href={`/tools/${tool.slug}`}
          className="inline-flex items-center gap-1 text-sm text-stone-400 hover:text-white transition-colors duration-150 ml-auto"
        >
          View →
        </Link>
      </div>
    </div>
  );
}
