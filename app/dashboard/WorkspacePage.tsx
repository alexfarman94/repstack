'use client';

import { useEffect, useState } from 'react';
import { IntakePanel } from '@/components/workspace/IntakePanel';
import { RepositoryDropzone } from '@/components/workspace/RepositoryDropzone';
import { AgentSelector } from '@/components/workspace/AgentSelector';
import { InsightsPanel } from '@/components/workspace/InsightsPanel';
import { useRunner } from './RunnerContext';
import type { ToolInput } from '@/lib/types';

type Account = {
  id: string;
  company_name: string;
  industry: string | null;
  size: string | null;
};

type AgentRecord = {
  id: string;
  name: string;
  description: string | null;
  inputs: ToolInput[];
};

export function WorkspacePage() {
  const {
    activeAccountId,
    activeOpportunityId,
    latestOutput,
    latestStatus,
    latestRunnerTitle,
    refreshKey,
  } = useRunner();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [agents, setAgents] = useState<AgentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetch('/api/accounts'), fetch('/api/agents')])
      .then(async ([acctRes, agentsRes]) => {
        const acctData = await acctRes.json();
        const agentsData = await agentsRes.json();
        setAccounts(Array.isArray(acctData) ? acctData : []);
        setAgents(Array.isArray(agentsData) ? agentsData : []);
      })
      .finally(() => setLoading(false));
  }, [refreshKey]);

  const activeAccount = accounts.find((a) => a.id === activeAccountId);

  if (loading) {
    return <div className="glass-panel p-6 text-sm text-slate-500">Loading workspace...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Context header */}
      <div className="glass-panel flex items-center justify-between px-4 py-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            {activeAccount?.company_name || 'Rep Workspace'}
          </h1>
          <p className="text-xs text-slate-500">
            {activeAccount
              ? `${activeAccount.industry || 'General'}${activeOpportunityId ? ' — Opportunity selected' : ''}`
              : 'Select an account from the sidebar to get started'}
          </p>
        </div>
        {activeAccount && (
          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
            Active
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr),360px]">
        <main className="space-y-4">
          <IntakePanel onCreated={() => {}} />
          <RepositoryDropzone accountId={activeAccountId} />
          <AgentSelector accountId={activeAccountId} agents={agents} />
        </main>

        <div className="hidden xl:block">
          <div className="sticky top-6">
            <InsightsPanel
              accountName={activeAccount?.company_name}
              runnerTitle={latestRunnerTitle}
              output={latestOutput}
              status={latestStatus}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
