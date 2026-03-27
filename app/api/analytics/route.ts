import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createServerClient();

  // Get current month start
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  // All queries scoped to this user
  const [runsRes, allRunsRes, topAgentsRes] = await Promise.all([
    // Runs this month + tokens
    supabase
      .from('agent_runs')
      .select('id, tokens_used, created_at')
      .eq('user_id', userId)
      .gte('created_at', monthStart),

    // Last 30 days of runs for timeline
    supabase
      .from('agent_runs')
      .select('id, agent_id, user_agent_id, account_id, tokens_used, created_at')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false }),

    // Top agents — get all runs this month with agent info
    supabase
      .from('agent_runs')
      .select('agent_id, user_agent_id')
      .eq('user_id', userId)
      .gte('created_at', monthStart),
  ]);

  const monthRuns = runsRes.data || [];
  const last30Runs = allRunsRes.data || [];
  const agentRuns = topAgentsRes.data || [];

  // Compute totals
  const totalRunsThisMonth = monthRuns.length;
  const totalTokensThisMonth = monthRuns.reduce((sum, r) => sum + (r.tokens_used || 0), 0);
  const timeSavedMinutes = totalRunsThisMonth * 15;

  // Top agents by run count
  const agentCounts: Record<string, number> = {};
  for (const r of agentRuns) {
    const key = r.agent_id || r.user_agent_id || 'unknown';
    agentCounts[key] = (agentCounts[key] || 0) + 1;
  }

  // Resolve agent names for top 5
  const topAgentIds = Object.entries(agentCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const platformIds = topAgentIds.map(([id]) => id).filter((id) => id !== 'unknown');
  const { data: agentNames } = await supabase
    .from('agents')
    .select('id, name')
    .in('id', platformIds);

  const { data: userAgentNames } = await supabase
    .from('user_agents')
    .select('id, name')
    .in('id', platformIds);

  const nameMap: Record<string, string> = {};
  for (const a of agentNames || []) nameMap[a.id] = a.name;
  for (const a of userAgentNames || []) nameMap[a.id] = a.name;

  const topAgents = topAgentIds.map(([id, count]) => ({
    id,
    name: nameMap[id] || 'Unknown Agent',
    runs: count,
  }));

  // Daily run counts for last 30 days
  const dailyCounts: Record<string, number> = {};
  for (const r of last30Runs) {
    const day = r.created_at.slice(0, 10); // YYYY-MM-DD
    dailyCounts[day] = (dailyCounts[day] || 0) + 1;
  }

  // Fill in missing days
  const timeline: { date: string; runs: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    timeline.push({ date: key, runs: dailyCounts[key] || 0 });
  }

  // Recent runs for table
  const recentRuns = last30Runs.slice(0, 20).map((r) => ({
    id: r.id,
    agent_id: r.agent_id,
    user_agent_id: r.user_agent_id,
    agent_name: nameMap[r.agent_id || r.user_agent_id || ''] || 'Unknown',
    account_id: r.account_id,
    tokens_used: r.tokens_used,
    created_at: r.created_at,
  }));

  return NextResponse.json({
    totalRunsThisMonth,
    totalTokensThisMonth,
    timeSavedMinutes,
    topAgents,
    timeline,
    recentRuns,
  });
}
