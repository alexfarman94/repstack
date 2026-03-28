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

export function RunHistory({ runs }: RunHistoryProps) {
  if (runs.length === 0) {
    return (
      <div className="glass-panel p-4">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Recent Runs</p>
        <p className="mt-3 text-sm text-slate-500">No runs yet. Run an agent to see history here.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel overflow-hidden">
      <div className="px-4 pt-4 pb-2">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Recent Runs</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400">
              <th className="px-4 py-2 font-medium">Agent</th>
              <th className="px-4 py-2 font-medium">Tokens</th>
              <th className="px-4 py-2 font-medium text-right">Date</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((run) => (
              <tr key={run.id} className="border-b border-slate-50 last:border-0">
                <td className="px-4 py-2 font-medium text-slate-700">{run.agent_name}</td>
                <td className="px-4 py-2 text-slate-500">
                  {run.tokens_used ? run.tokens_used.toLocaleString() : '—'}
                </td>
                <td className="px-4 py-2 text-right text-slate-400">
                  {new Date(run.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
