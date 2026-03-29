import Link from 'next/link';
import { Tool, FORMAT_ICONS, FORMAT_LABELS } from '@/lib/types';
import { PersonaBadge } from './PersonaBadge';

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const isLive = tool.format === 'embedded';

  return (
    <div className="group flex flex-col rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 p-5 pb-3">
        <div className="flex flex-wrap gap-1.5">
          {tool.personas.map((p) => (
            <PersonaBadge key={p} persona={p} />
          ))}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-xs font-medium ${isLive ? 'text-indigo-700' : 'text-slate-500'}`}>
            {FORMAT_ICONS[tool.format]} {FORMAT_LABELS[tool.format]}
          </span>
          <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-2 py-0.5">
            Free
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 pb-4 flex-1">
        <h3 className="text-slate-900 font-semibold text-base mb-1 group-hover:text-indigo-800 transition-colors duration-150">
          {tool.title}
        </h3>
        {tool.hook && (
          <p className="text-indigo-700/70 text-xs italic mb-2">{tool.hook}</p>
        )}
        <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
          {tool.description}
        </p>
      </div>

      {/* Action */}
      <div className="px-5 py-4 border-t border-slate-200">
        <Link
          href={`/tools/${tool.slug}`}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-150 ${
            isLive
              ? 'bg-indigo-50 border border-indigo-500/30 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          {isLive ? '⚡ Try it now' : 'View →'}
        </Link>
      </div>
    </div>
  );
}
