'use client';

interface TimelinePoint {
  date: string;
  runs: number;
}

interface RunTimelineProps {
  timeline: TimelinePoint[];
}

export function RunTimeline({ timeline }: RunTimelineProps) {
  const maxRuns = Math.max(...timeline.map((t) => t.runs), 1);

  return (
    <div className="glass-panel p-4">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
        Daily Runs — Last 30 Days
      </p>
      <div className="flex items-end gap-[3px]" style={{ height: 64 }}>
        {timeline.map((point) => {
          const height = point.runs > 0 ? Math.max((point.runs / maxRuns) * 100, 8) : 4;
          return (
            <div
              key={point.date}
              className="group relative flex-1"
              style={{ height: '100%' }}
            >
              <div
                className={`absolute bottom-0 w-full rounded-sm transition-colors ${
                  point.runs > 0 ? 'bg-indigo-400 hover:bg-indigo-500' : 'bg-slate-100'
                }`}
                style={{ height: `${height}%` }}
              />
              {/* Tooltip */}
              <div className="pointer-events-none absolute -top-8 left-1/2 z-10 hidden -translate-x-1/2 rounded bg-slate-800 px-2 py-1 text-[10px] text-white whitespace-nowrap group-hover:block">
                {point.date}: {point.runs} run{point.runs !== 1 ? 's' : ''}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-1.5 flex justify-between text-[10px] text-slate-400">
        <span>{timeline[0]?.date.slice(5)}</span>
        <span>{timeline[timeline.length - 1]?.date.slice(5)}</span>
      </div>
    </div>
  );
}
