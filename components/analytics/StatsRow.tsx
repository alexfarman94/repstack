'use client';

interface StatsRowProps {
  totalRuns: number;
  totalTokens: number;
  timeSavedMinutes: number;
}

function TrendArrow({ positive }: { positive: boolean }) {
  return (
    <span className={`inline-flex items-center gap-0.5 text-[11px] font-medium ${positive ? 'text-emerald-600' : 'text-red-500'}`}>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={positive ? '' : 'rotate-180'}>
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </span>
  );
}

function StatCard({ label, value, sub, trend }: { label: string; value: string; sub?: string; trend?: 'up' | 'down' }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-white px-4 py-4">
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <div className="mt-1.5 flex items-baseline gap-2">
        <p className="text-3xl font-bold text-slate-900">{value}</p>
        {trend && <TrendArrow positive={trend === 'up'} />}
      </div>
      {sub && <p className="mt-1 text-[11px] text-slate-400">{sub}</p>}
    </div>
  );
}

export function StatsRow({ totalRuns, totalTokens, timeSavedMinutes }: StatsRowProps) {
  const hours = Math.floor(timeSavedMinutes / 60);
  const mins = timeSavedMinutes % 60;
  const timeSaved = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <StatCard
        label="Runs this month"
        value={totalRuns.toLocaleString()}
        trend={totalRuns > 0 ? 'up' : undefined}
      />
      <StatCard
        label="Tokens used"
        value={totalTokens >= 1000 ? `${(totalTokens / 1000).toFixed(1)}K` : totalTokens.toString()}
        trend={totalTokens > 0 ? 'up' : undefined}
      />
      <StatCard
        label="Time saved"
        value={timeSaved}
        sub="Based on 15 min per run"
        trend={timeSavedMinutes > 0 ? 'up' : undefined}
      />
    </div>
  );
}
