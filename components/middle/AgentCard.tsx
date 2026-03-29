'use client';

interface AgentCardProps {
  id: string;
  name: string;
  description: string | null;
  isUser: boolean;
  isSelected: boolean;
  onSelect: () => void;
}

// SVG icons per agent name (16x16, stroke-based)
const AGENT_ICONS: Record<string, JSX.Element> = {
  'Discovery Prep': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  ),
  'Objection Handler': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  'Deal Risk Audit': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" />
    </svg>
  ),
  'Email Draft': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><path d="m22 6-10 7L2 6" />
    </svg>
  ),
  'Call Summary': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
    </svg>
  ),
  'Exec Briefing': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
    </svg>
  ),
};

const DEFAULT_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);

export function AgentCard({ name, description, isUser, isSelected, onSelect }: AgentCardProps) {
  const icon = AGENT_ICONS[name] || DEFAULT_ICON;

  return (
    <button
      onClick={onSelect}
      className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-all ${
        isSelected
          ? 'border-l-2 border-indigo-500 bg-indigo-50/60 pl-[10px]'
          : 'hover:bg-slate-50'
      }`}
    >
      {/* Icon */}
      <span className={`shrink-0 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`}>
        {icon}
      </span>

      {/* Name + description */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${isSelected ? 'text-indigo-700' : 'text-slate-900'}`}>
            {name}
          </span>
          {description && (
            <span className="truncate text-xs text-slate-400">
              {description}
            </span>
          )}
        </div>
      </div>

      {/* Badge */}
      <span
        className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${
          isUser
            ? 'bg-violet-100 text-violet-600'
            : 'bg-slate-100 text-slate-500'
        }`}
      >
        {isUser ? 'Custom' : 'Platform'}
      </span>
    </button>
  );
}
