'use client';

import { useMemo, useState } from 'react';
import { tools } from '@/data/tools';
import { useRunner, AgentRunnerConfig } from '@/app/dashboard/RunnerContext';
import type { ToolInput } from '@/lib/types';

type AgentRecord = {
  id: string;
  name: string;
  description: string | null;
  inputs: ToolInput[];
};

interface AgentSelectorProps {
  accountId: string;
  agents: AgentRecord[];
}

export function AgentSelector({ accountId, agents }: AgentSelectorProps) {
  const { open } = useRunner();
  const [tab, setTab] = useState<'tools' | 'agents'>('tools');

  const featuredTools = useMemo(() => tools.slice(0, 4), []);

  return (
    <section className="glass-panel p-4 md:p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">Select Action</p>
        <div className="rounded-lg border border-slate-200 bg-white/70 p-1">
          <button
            onClick={() => setTab('tools')}
            className={`rounded-md px-3 py-1 text-xs font-medium ${
              tab === 'tools' ? 'bg-indigo-600 text-white' : 'text-slate-600'
            }`}
          >
            Tools
          </button>
          <button
            onClick={() => setTab('agents')}
            className={`rounded-md px-3 py-1 text-xs font-medium ${
              tab === 'agents' ? 'bg-indigo-600 text-white' : 'text-slate-600'
            }`}
          >
            Agents
          </button>
        </div>
      </div>

      {tab === 'tools' ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {featuredTools.map((tool) => (
            <button
              key={tool.id}
              onClick={() =>
                open(
                  {
                    type: 'tool',
                    toolId: tool.id,
                    title: tool.title,
                    description: tool.hook,
                    inputs: tool.inputs ?? [],
                  },
                  accountId
                )
              }
              className="rounded-xl border border-white/80 bg-white/80 p-3 text-left transition hover:border-indigo-200 hover:bg-white"
            >
              <p className="text-sm font-semibold text-slate-900">{tool.title}</p>
              <p className="mt-1 line-clamp-2 text-xs text-slate-500">{tool.hook}</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {agents.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white/50 p-4 text-sm text-slate-500">
              No custom agents yet. You can still run built-in tools.
            </div>
          ) : (
            agents.map((agent) => (
              <button
                key={agent.id}
                onClick={() =>
                  open(
                    {
                      type: 'agent',
                      agentId: agent.id,
                      name: agent.name,
                      description: agent.description,
                      inputs: agent.inputs ?? [],
                    } as AgentRunnerConfig,
                    accountId
                  )
                }
                className="w-full rounded-xl border border-white/80 bg-white/80 p-3 text-left transition hover:border-indigo-200 hover:bg-white"
              >
                <p className="text-sm font-semibold text-slate-900">{agent.name}</p>
                <p className="mt-1 line-clamp-2 text-xs text-slate-500">{agent.description || 'Custom workflow agent'}</p>
              </button>
            ))
          )}
        </div>
      )}
    </section>
  );
}
