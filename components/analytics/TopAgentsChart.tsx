'use client';

interface TopAgent {
  id: string;
  name: string;
  runs: number;
}

interface TopAgentsChartProps {
  agents: TopAgent[];
}

export function TopAgentsChart({ agents }: TopAgentsChartProps) {
  if (agents.length === 0) {
    return (
      <div className="glass-panel p-4">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Top Agents</p>
        <p className="mt-3 text-sm text-slate-500">No agent runs yet.</p>
      </div>
    );
  }

  const maxRuns = Math.max(...agents.map((a) => a.runs), 1);

  return (
    <div className="glass-panel p-4">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400">Top Agents</p>
      <div className="space-y-2.5">
        {agents.map((agent) => (
          <div key={agent.id}>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-700">{agent.name}</span>
              <span className="text-xs text-slate-500">{agent.runs} runs</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-indigo-500 transition-all"
                style={{ width: `${(agent.runs / maxRuns) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
