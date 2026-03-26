'use client';

import Link from 'next/link';
import { useRunner } from '@/app/dashboard/RunnerContext';
import type { ToolInput } from '@/lib/types';

type AgentCardData = {
  id: string;
  name: string;
  description: string | null;
  inputs: ToolInput[];
  created_at: string;
};

export function AgentCards({ agents }: { agents: AgentCardData[] }) {
  const { open } = useRunner();

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {agents.map((agent) => (
        <div
          key={agent.id}
          className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 flex flex-col hover:border-indigo-200 hover:shadow-md transition-all duration-150"
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <p className="font-medium text-slate-900">{agent.name}</p>
            <span className="text-xs text-slate-400 shrink-0">
              {new Date(agent.created_at).toLocaleDateString()}
            </span>
          </div>
          {agent.description && (
            <p className="text-sm text-slate-500 line-clamp-2 flex-1 mb-4">{agent.description}</p>
          )}
          {!agent.description && <div className="flex-1" />}

          <div className="flex items-center gap-2 mt-auto pt-2">
            <button
              onClick={() =>
                open({
                  type: 'agent',
                  agentId: agent.id,
                  name: agent.name,
                  description: agent.description,
                  inputs: agent.inputs,
                })
              }
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-3 py-1.5 text-xs transition-colors"
            >
              ⚡ Run
            </button>
            <Link
              href={`/dashboard/agents/${agent.id}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium px-3 py-1.5 text-xs transition-colors"
            >
              Edit →
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
