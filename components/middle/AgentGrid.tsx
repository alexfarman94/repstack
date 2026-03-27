'use client';

import { useMemo, useState } from 'react';
import { useRunner } from '@/app/dashboard/RunnerContext';
import { AgentCard } from './AgentCard';

export type AgentWithSource = {
  id: string;
  name: string;
  description: string | null;
  isUser: boolean;
};

type Filter = 'all' | 'platform' | 'custom';

interface AgentGridProps {
  agents: AgentWithSource[];
}

export function AgentGrid({ agents }: AgentGridProps) {
  const { selectedAgentId, setSelectedAgent } = useRunner();
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = useMemo(() => {
    if (filter === 'platform') return agents.filter((a) => !a.isUser);
    if (filter === 'custom') return agents.filter((a) => a.isUser);
    return agents;
  }, [agents, filter]);

  return (
    <section>
      {/* Filter tabs */}
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Agents</p>
        <div className="flex gap-1 rounded-lg border border-slate-200 bg-white/70 p-0.5">
          {(['all', 'platform', 'custom'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium capitalize transition-colors ${
                filter === f
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white/50 p-6 text-center text-sm text-slate-400">
          {filter === 'custom' ? 'No custom agents yet. Create one in Settings.' : 'No agents available.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {filtered.map((agent) => (
            <AgentCard
              key={agent.id}
              id={agent.id}
              name={agent.name}
              description={agent.description}
              isUser={agent.isUser}
              isSelected={selectedAgentId === agent.id}
              onSelect={() => setSelectedAgent(agent.id, agent.isUser)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
