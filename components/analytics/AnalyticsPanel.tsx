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
    return (
      <div className="space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <div className="skeleton h-6 w-28" />
          <div className="skeleton mt-1 h-4 w-48" />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border border-slate-100 bg-white p-4">
              <div className="skeleton h-3 w-20" />
              <div className="skeleton mt-2 h-8 w-16" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-slate-100 bg-white p-4">
            <div className="skeleton h-3 w-24 mb-4" />
            <div className="skeleton h-32 w-full" />
          </div>
          <div className="rounded-lg border border-slate-100 bg-white p-4">
            <div className="skeleton h-3 w-32 mb-4" />
            <div className="skeleton h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-100 bg-red-50 p-6 text-sm text-red-600">{error}</div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="border-b border-slate-100 pb-3">
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
