'use client';

interface StatsRowProps {
  totalRuns: number;
  totalTokens: number;
  timeSavedMinutes: number;
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="glass-panel px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-slate-500">{sub}</p>}
    </div>
  );
}

export function StatsRow({ totalRuns, totalTokens, timeSavedMinutes }: StatsRowProps) {
  const hours = Math.floor(timeSavedMinutes / 60);
  const mins = timeSavedMinutes % 60;
  const timeSaved = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <StatCard label="Runs this month" value={totalRuns.toLocaleString()} />
      <StatCard
        label="Tokens used"
        value={totalTokens >= 1000 ? `${(totalTokens / 1000).toFixed(1)}K` : totalTokens.toString()}
      />
      <StatCard label="Time saved" value={timeSaved} sub="Based on 15 min per run" />
    </div>
  );
}
