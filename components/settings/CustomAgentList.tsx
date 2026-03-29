'use client';

type Agent = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
};

interface CustomAgentListProps {
  agents: Agent[];
  onDelete: (id: string) => void;
}

export function CustomAgentList({ agents, onDelete }: CustomAgentListProps) {
  if (agents.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-white/50 p-4 text-center text-sm text-slate-400">
        No custom agents yet. Create one below.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {agents.map((agent) => (
        <div
          key={agent.id}
          className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3"
        >
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900">{agent.name}</p>
            <p className="mt-0.5 truncate text-xs text-slate-500">
              {agent.description || 'No description'}
            </p>
          </div>
          <button
            onClick={() => {
              if (confirm(`Delete "${agent.name}"?`)) onDelete(agent.id);
            }}
            className="shrink-0 rounded-md px-2 py-1 text-xs text-red-500 transition-colors hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
