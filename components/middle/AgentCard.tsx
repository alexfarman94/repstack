'use client';

interface AgentCardProps {
  id: string;
  name: string;
  description: string | null;
  isUser: boolean;
  isSelected: boolean;
  onSelect: () => void;
}

export function AgentCard({ name, description, isUser, isSelected, onSelect }: AgentCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`w-full rounded-xl border p-3.5 text-left transition-all ${
        isSelected
          ? 'border-indigo-300 bg-indigo-50 ring-1 ring-indigo-200 shadow-sm'
          : 'border-slate-200 bg-white/80 hover:border-indigo-200 hover:bg-white hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className={`text-sm font-semibold ${isSelected ? 'text-indigo-700' : 'text-slate-900'}`}>
          {name}
        </p>
        <span
          className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
            isUser
              ? 'bg-violet-100 text-violet-600'
              : 'bg-slate-100 text-slate-500'
          }`}
        >
          {isUser ? 'Custom' : 'Platform'}
        </span>
      </div>
      <p className="mt-1 line-clamp-2 text-xs text-slate-500">
        {description || 'No description'}
      </p>
    </button>
  );
}
