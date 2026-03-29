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

    const scores: Record<string, number> = {};
    const uniqueTypes = Array.from(new Set(docTypes));

    for (const type of uniqueTypes) {
      const names = SUGGEST_MAP[type] || SUGGEST_MAP.other;
      names.forEach((name, i) => {
        scores[name] = (scores[name] || 0) + (3 - i);
      });
    }

    const ranked = agents
      .map((a) => ({ ...a, score: scores[a.name] || 0 }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    return ranked;
  }, [docTypes, agents]);

  if (suggested.length === 0) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto">
      <span className="shrink-0 text-[11px] font-medium text-slate-400">Suggested:</span>
      {suggested.map((agent) => {
        const isSelected = selectedAgentId === agent.id;
        return (
          <button
            key={agent.id}
            onClick={() => setSelectedAgent(agent.id, !!agent.isUser)}
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-all ${
              isSelected
                ? 'bg-indigo-600 text-white'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            }`}
          >
            {agent.name}
          </button>
        );
      })}
    </div>
  );
}
