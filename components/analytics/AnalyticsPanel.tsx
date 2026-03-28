'use client';

import { useEffect, useState } from 'react';
import { StatsRow } from './StatsRow';
import { TopAgentsChart } from './TopAgentsChart';
import { RunTimeline } from './RunTimeline';
import { RunHistory } from './RunHistory';

interface AnalyticsData {
  totalRunsThisMonth: number;
  totalTokensThisMonth: number;
  timeSavedMinutes: number;
  topAgents: { id: string; name: string; runs: number }[];
  timeline: { date: string; runs: number }[];
  recentRuns: { id: string; agent_name: string; tokens_used: number | null; created_at: string }[];
}

export function AnalyticsPanel() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/analytics')
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to load analytics');
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="glass-panel p-6 text-sm text-slate-500">Loading analytics...</div>;
  }

  if (error) {
    return <div className="glass-panel p-6 text-sm text-red-600">{error}</div>;
  }

  if (!data) return null;

  return (
    <div className="space-y-4">
      <div className="glass-panel px-4 py-3">
        <h1 className="text-lg font-semibold text-slate-900">Analytics</h1>
        <p className="text-xs text-slate-500">Your agent usage this month</p>
      </div>

      <StatsRow
        totalRuns={data.totalRunsThisMonth}
        totalTokens={data.totalTokensThisMonth}
        timeSavedMinutes={data.timeSavedMinutes}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TopAgentsChart agents={data.topAgents} />
        <RunTimeline timeline={data.timeline} />
      </div>

      <RunHistory runs={data.recentRuns} />
    </div>
  );
}
