'use client';

import { useEffect, useMemo, useState } from 'react';
import { AccountRail } from '@/components/workspace/AccountRail';
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
  const { accountId, setAccountId, latestOutput, latestStatus, latestRunnerTitle } = useRunner();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [agents, setAgents] = useState<AgentRecord[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [accountsRes, agentsRes] = await Promise.all([fetch('/api/accounts'), fetch('/api/agents')]);
      const accountsData = await accountsRes.json();
      const agentsData = await agentsRes.json();
      const nextAccounts = Array.isArray(accountsData) ? accountsData : [];
      const nextAgents = Array.isArray(agentsData) ? agentsData : [];
      setAccounts(nextAccounts);
      setAgents(nextAgents);
      if (!accountId && nextAccounts[0]?.id) {
        setAccountId(nextAccounts[0].id);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredAccounts = useMemo(
    () =>
      accounts.filter((account) =>
        account.company_name.toLowerCase().includes(query.toLowerCase().trim())
      ),
    [accounts, query]
  );

  const activeAccount = accounts.find((item) => item.id === accountId);

  return (
    <div className="space-y-4">
      <header className="glass-panel flex flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-5">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Rep Workspace</h1>
          <p className="text-sm text-slate-500">Single-page command center for pipeline, context, and AI actions.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">Live</span>
          <span className="rounded-full bg-white/80 px-2.5 py-1 text-xs font-medium text-slate-600">
            {activeAccount?.company_name || 'No active account'}
          </span>
        </div>
      </header>

      {loading ? (
        <div className="glass-panel p-6 text-sm text-slate-600">Loading workspace...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[280px,minmax(0,1fr),360px]">
          <div className="xl:sticky xl:top-20 xl:h-[calc(100vh-96px)]">
            <AccountRail
              accounts={filteredAccounts}
              activeAccountId={accountId}
              query={query}
              onQueryChange={setQuery}
              onSelectAccount={setAccountId}
            />
          </div>

          <main className="space-y-4">
            <IntakePanel onCreated={fetchData} />
            <RepositoryDropzone accountId={accountId} />
            <AgentSelector accountId={accountId} agents={agents} />
          </main>

          <div className="xl:sticky xl:top-20 xl:h-[calc(100vh-96px)]">
            <InsightsPanel
              accountName={activeAccount?.company_name}
              runnerTitle={latestRunnerTitle}
              output={latestOutput}
              status={latestStatus}
            />
          </div>
        </div>
      )}
    </div>
  );
}
