'use client';

import { useMemo } from 'react';
import { useRunner } from '@/app/dashboard/RunnerContext';

interface Agent {
  id: string;
  name: string;
  description: string | null;
  isUser?: boolean;
}

interface SmartSuggestProps {
  docTypes: string[];
  agents: Agent[];
}

// Maps doc types to the most relevant agent names
const SUGGEST_MAP: Record<string, string[]> = {
  transcript: ['Call Summary', 'Discovery Prep', 'Deal Risk Audit'],
  email: ['Email Draft', 'Objection Handler', 'Exec Briefing'],
  deal_note: ['Deal Risk Audit', 'Discovery Prep', 'Exec Briefing'],
  proposal: ['Objection Handler', 'Deal Risk Audit', 'Email Draft'],
  other: ['Discovery Prep', 'Call Summary', 'Email Draft'],
};

export function SmartSuggest({ docTypes, agents }: SmartSuggestProps) {
  const { selectedAgentId, setSelectedAgent } = useRunner();

  const suggested = useMemo(() => {
    if (agents.length === 0) return [];

    // Collect ranked agent names from doc types
    const scores: Record<string, number> = {};
    const uniqueTypes = Array.from(new Set(docTypes));

    for (const type of uniqueTypes) {
      const names = SUGGEST_MAP[type] || SUGGEST_MAP.other;
      names.forEach((name, i) => {
        scores[name] = (scores[name] || 0) + (3 - i); // higher score = more relevant
      });
    }

    // Match scored names to actual agents, take top 3
    const ranked = agents
      .map((a) => ({ ...a, score: scores[a.name] || 0 }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    return ranked;
  }, [docTypes, agents]);

  if (suggested.length === 0) return null;

  return (
    <div>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
        Suggested for your context
      </p>
      <div className="flex gap-2">
        {suggested.map((agent) => {
          const isSelected = selectedAgentId === agent.id;
          return (
            <button
              key={agent.id}
              onClick={() => setSelectedAgent(agent.id, !!agent.isUser)}
              className={`flex-1 rounded-xl border px-3 py-2.5 text-left transition-all ${
                isSelected
                  ? 'border-indigo-300 bg-indigo-50 ring-1 ring-indigo-200'
                  : 'border-slate-200 bg-white/80 hover:border-indigo-200 hover:bg-white'
              }`}
            >
              <p className={`text-xs font-semibold ${isSelected ? 'text-indigo-700' : 'text-slate-800'}`}>
                {agent.name}
              </p>
              {agent.score > 0 && (
                <p className="mt-0.5 text-[10px] text-indigo-400">Recommended</p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
