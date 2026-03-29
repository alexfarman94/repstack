'use client';

interface RecentRun {
  id: string;
  agent_name: string;
  tokens_used: number | null;
  created_at: string;
}

interface RunHistoryProps {
  runs: RecentRun[];
}

function relativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay === 1) return 'Yesterday';
  if (diffDay < 7) return `${diffDay}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Small agent icons for the table
const AGENT_ICONS: Record<string, string> = {
  'Discovery Prep': '🔍',
  'Objection Handler': '🛡',
  'Deal Risk Audit': '⚠',
  'Email Draft': '✉',
  'Call Summary': '📞',
  'Exec Briefing': '💼',
};

export function RunHistory({ runs }: RunHistoryProps) {
  if (runs.length === 0) {
    return (
      <div className="rounded-lg border border-slate-100 bg-white p-4">
        <p className="section-label">Recent Runs</p>
        <p className="mt-3 text-sm text-slate-400">No runs yet. Run an agent to see history here.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-100 bg-white overflow-hidden">
      <div className="px-4 pt-4 pb-2">
        <p className="section-label">Recent Runs</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] text-slate-400">
              <th className="px-4 py-2 font-medium">Agent</th>
              <th className="px-4 py-2 font-medium">Tokens</th>
              <th className="px-4 py-2 font-medium text-right">When</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((run, i) => (
              <tr
                key={run.id}
                className={`transition-colors hover:bg-slate-50 ${i % 2 === 1 ? 'bg-slate-50/50' : ''}`}
              >
                <td className="px-4 py-2.5 font-medium text-slate-700">
                  <span className="mr-1.5 inline-block w-4 text-center text-[11px]">
                    {AGENT_ICONS[run.agent_name] || '⚡'}
                  </span>
                  {run.agent_name}
                </td>
                <td className="px-4 py-2.5 font-mono text-[11px] text-slate-500">
                  {run.tokens_used ? run.tokens_used.toLocaleString() : '—'}
                </td>
                <td className="px-4 py-2.5 text-right text-slate-400">
                  {relativeTime(run.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
