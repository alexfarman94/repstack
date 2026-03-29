'use client';

interface TopAgent {
  id: string;
  name: string;
  runs: number;
}

interface TopAgentsChartProps {
  agents: TopAgent[];
}

// Agent icons matching AgentCard icons
const AGENT_ICONS: Record<string, JSX.Element> = {
  'Discovery Prep': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  ),
  'Objection Handler': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  'Deal Risk Audit': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" />
    </svg>
  ),
  'Email Draft': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><path d="m22 6-10 7L2 6" />
    </svg>
  ),
  'Call Summary': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
    </svg>
  ),
  'Exec Briefing': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
    </svg>
  ),
};

const DEFAULT_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);

export function TopAgentsChart({ agents }: TopAgentsChartProps) {
  if (agents.length === 0) {
    return (
      <div className="rounded-lg border border-slate-100 bg-white p-4">
        <p className="section-label">Top Agents</p>
        <p className="mt-3 text-sm text-slate-400">No agent runs yet.</p>
      </div>
    );
  }

  const maxRuns = Math.max(...agents.map((a) => a.runs), 1);

  return (
    <div className="rounded-lg border border-slate-100 bg-white p-4">
      <p className="mb-4 section-label">Top Agents</p>
      <div className="space-y-3">
        {agents.map((agent) => {
          const pct = (agent.runs / maxRuns) * 100;
          const icon = AGENT_ICONS[agent.name] || DEFAULT_ICON;
          return (
            <div key={agent.id}>
              <div className="mb-1.5 flex items-center gap-2">
                <span className="shrink-0 text-slate-400">{icon}</span>
                <span className="flex-1 text-xs font-medium text-slate-700">{agent.name}</span>
                <span className="text-xs tabular-nums text-slate-500">{agent.runs}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
