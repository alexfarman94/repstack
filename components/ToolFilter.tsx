'use client';

import { Persona, Format, PERSONA_LABELS, FORMAT_LABELS, FORMAT_ICONS } from '@/lib/types';

type PersonaFilter = Persona | 'all';
type FormatFilter = Format | 'all';

interface ToolFilterProps {
  persona: PersonaFilter;
  format: FormatFilter;
  onPersonaChange: (p: PersonaFilter) => void;
  onFormatChange: (f: FormatFilter) => void;
  counts: { total: number; filtered: number };
}

const PERSONAS: { value: PersonaFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'ae', label: PERSONA_LABELS.ae },
  { value: 'bdr', label: PERSONA_LABELS.bdr },
  { value: 'se', label: PERSONA_LABELS.se },
];

const FORMATS: { value: FormatFilter; label: string }[] = [
  { value: 'all', label: 'All formats' },
  { value: 'prompt', label: `${FORMAT_ICONS.prompt} ${FORMAT_LABELS.prompt}` },
  { value: 'gpt', label: `${FORMAT_ICONS.gpt} ${FORMAT_LABELS.gpt}` },
  { value: 'embedded', label: `${FORMAT_ICONS.embedded} ${FORMAT_LABELS.embedded}` },
  { value: 'download', label: `${FORMAT_ICONS.download} ${FORMAT_LABELS.download}` },
];

export function ToolFilter({ persona, format, onPersonaChange, onFormatChange, counts }: ToolFilterProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Persona filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-slate-500 uppercase tracking-wider font-medium w-full sm:w-auto">Role</span>
        {PERSONAS.map((p) => (
          <button
            key={p.value}
            onClick={() => onPersonaChange(p.value)}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-all duration-150 ${
              persona === p.value
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Format filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-slate-500 uppercase tracking-wider font-medium w-full sm:w-auto">Format</span>
        {FORMATS.map((f) => (
          <button
            key={f.value}
            onClick={() => onFormatChange(f.value)}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-all duration-150 ${
              format === f.value
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="text-sm text-slate-500">
        Showing {counts.filtered} of {counts.total} tools
      </p>
    </div>
  );
}
