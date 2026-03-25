import { Persona, PERSONA_LABELS } from '@/lib/types';

const PERSONA_STYLES: Record<Persona, string> = {
  ae: 'bg-violet-500/15 text-violet-300 border border-violet-500/25',
  bdr: 'bg-sky-500/15 text-sky-300 border border-sky-500/25',
  se: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25',
};

interface PersonaBadgeProps {
  persona: Persona;
  size?: 'sm' | 'md';
}

export function PersonaBadge({ persona, size = 'sm' }: PersonaBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      } ${PERSONA_STYLES[persona]}`}
    >
      {PERSONA_LABELS[persona]}
    </span>
  );
}
