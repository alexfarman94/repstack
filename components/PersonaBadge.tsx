import { Persona, PERSONA_LABELS } from '@/lib/types';

const PERSONA_STYLES: Record<Persona, string> = {
  ae: 'bg-violet-100 text-violet-700 border border-violet-200',
  bdr: 'bg-sky-100 text-sky-700 border border-sky-200',
  se: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
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
