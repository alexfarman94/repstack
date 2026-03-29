'use client';

import { useMemo, useState } from 'react';

interface TimelinePoint {
  date: string;
  runs: number;
}

interface RunTimelineProps {
  timeline: TimelinePoint[];
}

export function RunTimeline({ timeline }: RunTimelineProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const maxRuns = Math.max(...timeline.map((t) => t.runs), 1);

  // Generate SVG sparkline path + fill area
  const { linePath, fillPath } = useMemo(() => {
    if (timeline.length === 0) return { linePath: '', fillPath: '' };

    const w = 400;
    const h = 100;
    const padding = 2;
    const stepX = (w - padding * 2) / Math.max(timeline.length - 1, 1);

    const points = timeline.map((pt, i) => ({
      x: padding + i * stepX,
      y: h - padding - ((pt.runs / maxRuns) * (h - padding * 2)),
    }));

    // Smooth curve using catmull-rom to bezier
    let d = `M${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(i - 1, 0)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(i + 2, points.length - 1)];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }

    const lastPt = points[points.length - 1];
    const fill = `${d} L${lastPt.x},${h} L${points[0].x},${h} Z`;

    return { linePath: d, fillPath: fill };
  }, [timeline, maxRuns]);

  const midLabel = timeline.length > 2 ? timeline[Math.floor(timeline.length / 2)]?.date.slice(5) : '';

  return (
    <div className="rounded-lg border border-slate-100 bg-white p-4">
      <p className="mb-3 section-label">Daily Runs — Last 30 Days</p>

      {/* SVG Sparkline */}
      <div className="relative">
        <svg viewBox="0 0 400 100" className="w-full" style={{ height: 100 }} preserveAspectRatio="none">
          {/* Fill area */}
          <path d={fillPath} fill="url(#sparkFill)" />
          {/* Line */}
          <path d={linePath} fill="none" stroke="#6366f1" strokeWidth="2" vectorEffect="non-scaling-stroke" />

          <defs>
            <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Hover hit areas */}
          {timeline.map((pt, i) => {
            const w = 400;
            const padding = 2;
            const stepX = (w - padding * 2) / Math.max(timeline.length - 1, 1);
            const x = padding + i * stepX;
            const y = 100 - padding - ((pt.runs / maxRuns) * (100 - padding * 2));
            return (
              <g key={pt.date}>
                <rect
                  x={x - stepX / 2}
                  y={0}
                  width={stepX}
                  height={100}
                  fill="transparent"
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
                {hoveredIdx === i && (
                  <>
                    <circle cx={x} cy={y} r="3" fill="#6366f1" />
                    <line x1={x} y1={0} x2={x} y2={100} stroke="#6366f1" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.3" />
                  </>
                )}
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {hoveredIdx !== null && timeline[hoveredIdx] && (
          <div
            className="pointer-events-none absolute -top-7 z-10 rounded bg-slate-800 px-2 py-1 text-[10px] text-white whitespace-nowrap"
            style={{
              left: `${(hoveredIdx / Math.max(timeline.length - 1, 1)) * 100}%`,
              transform: 'translateX(-50%)',
            }}
          >
            {timeline[hoveredIdx].date.slice(5)}: {timeline[hoveredIdx].runs} run{timeline[hoveredIdx].runs !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* X-axis labels */}
      <div className="mt-1.5 flex justify-between text-[10px] text-slate-400">
        <span>{timeline[0]?.date.slice(5)}</span>
        {midLabel && <span>{midLabel}</span>}
        <span>{timeline[timeline.length - 1]?.date.slice(5)}</span>
      </div>
    </div>
  );
}
