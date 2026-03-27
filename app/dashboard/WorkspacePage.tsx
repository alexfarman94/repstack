'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRunner } from './RunnerContext';
import { ContextHeader } from '@/components/middle/ContextHeader';
import { DocInventoryStrip } from '@/components/middle/DocInventoryStrip';
import { SmartSuggest } from '@/components/middle/SmartSuggest';
import { AgentGrid, AgentWithSource } from '@/components/middle/AgentGrid';
import { RunBar } from '@/components/middle/RunBar';
import { RepositoryDropzone } from '@/components/workspace/RepositoryDropzone';

type Account = { id: string; company_name: string };
type Opportunity = { id: string; name: string };
type Doc = { id: string; doc_type: string };

export function WorkspacePage() {
  const {
    activeAccountId,
    activeOpportunityId,
    selectedAgentId,
    isUserAgent,
    latestOutput,
    latestStatus,
    setLatestOutput,
    setLatestStatus,
    setLatestRunnerTitle,
    setRunId,
    refreshKey,
  } = useRunner();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [docs, setDocs] = useState<Doc[]>([]);
  const [allAgents, setAllAgents] = useState<AgentWithSource[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch accounts + agents on mount/refresh
  useEffect(() => {
    setLoading(true);
    Promise.all([fetch('/api/accounts'), fetch('/api/agents'), fetch('/api/user-agents')])
      .then(async ([acctRes, pRes, uRes]) => {
        const acctData = await acctRes.json();
        const pData = await pRes.json();
        const uData = await uRes.json();
        setAccounts(Array.isArray(acctData) ? acctData : []);
        const platform = (Array.isArray(pData) ? pData : []).map((a: AgentWithSource) => ({ ...a, isUser: false }));
        const user = (Array.isArray(uData) ? uData : []).map((a: AgentWithSource) => ({ ...a, isUser: true }));
        setAllAgents([...platform, ...user]);
      })
      .finally(() => setLoading(false));
  }, [refreshKey]);

  // Fetch opportunities when account changes
  useEffect(() => {
    if (!activeAccountId) {
      setOpportunities([]);
      return;
    }
    fetch(`/api/opportunities?accountId=${activeAccountId}`)
      .then((r) => r.json())
      .then((data) => setOpportunities(Array.isArray(data) ? data : []))
      .catch(() => setOpportunities([]));
  }, [activeAccountId, refreshKey]);

  // Fetch docs when account/opp changes
  useEffect(() => {
    if (!activeAccountId) {
      setDocs([]);
      return;
    }
    const params = new URLSearchParams({ accountId: activeAccountId });
    if (activeOpportunityId) params.set('opportunityId', activeOpportunityId);
    fetch(`/api/documents?${params}`)
      .then((r) => r.json())
      .then((data) => setDocs(Array.isArray(data) ? data : []))
      .catch(() => setDocs([]));
  }, [activeAccountId, activeOpportunityId, refreshKey]);

  const activeAccount = accounts.find((a) => a.id === activeAccountId);
  const activeOpp = opportunities.find((o) => o.id === activeOpportunityId);
  const selectedAgent = allAgents.find((a) => a.id === selectedAgentId);
  const docTypes = useMemo(() => docs.map((d) => d.doc_type), [docs]);

  // ─── Run handler ────────────────────────────────────────────────────────────
  const isRunning = latestStatus === 'loading' || latestStatus === 'streaming';

  const handleRun = async () => {
    if (!selectedAgentId || !activeAccountId) return;

    setLatestStatus('loading');
    setLatestOutput('');
    setLatestRunnerTitle(selectedAgent?.name || 'Agent');

    const body: Record<string, string | undefined> = {
      accountId: activeAccountId,
      opportunityId: activeOpportunityId || undefined,
    };
    if (isUserAgent) {
      body.userAgentId = selectedAgentId;
    } else {
      body.agentId = selectedAgentId;
    }

    try {
      const res = await fetch('/api/run', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Something went wrong' }));
        throw new Error(err.error ?? `Error ${res.status}`);
      }
      if (!res.body) throw new Error('No response body');

      setLatestStatus('streaming');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) {
          // Capture run ID from custom SSE event
          if (line.startsWith('event: run_id')) continue;
          if (line.startsWith('data: ') && !line.includes('"type"')) {
            // Could be the run_id data line
            const val = line.slice(6).trim();
            if (val && !val.startsWith('{') && !val.startsWith('[')) {
              setRunId(val);
              continue;
            }
          }
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            if (
              parsed.type === 'content_block_delta' &&
              parsed.delta?.type === 'text_delta' &&
              parsed.delta?.text
            ) {
              setLatestOutput((prev) => prev + parsed.delta.text);
            }
          } catch {
            // skip malformed
          }
        }
      }

      setLatestStatus('done');
    } catch (err) {
      setLatestOutput(err instanceof Error ? err.message : 'Something went wrong');
      setLatestStatus('error');
    }
  };

  if (loading) {
    return <div className="glass-panel p-6 text-sm text-slate-500">Loading workspace...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Context header */}
      <ContextHeader
        accountName={activeAccount?.company_name}
        opportunityName={activeOpp?.name}
        docCount={docs.length}
      />

      {/* Doc inventory */}
      {docs.length > 0 && <DocInventoryStrip docs={docs} />}

      {/* Upload zone (compact) */}
      {activeAccountId && (
        <RepositoryDropzone accountId={activeAccountId} />
      )}

      {/* Smart suggest */}
      {activeAccountId && docTypes.length > 0 && (
        <SmartSuggest docTypes={docTypes} agents={allAgents} />
      )}

      {/* Agent grid */}
      <AgentGrid agents={allAgents} />

      {/* Sticky run bar */}
      <RunBar
        accountName={activeAccount?.company_name}
        agentName={selectedAgent?.name}
        onRun={handleRun}
        isRunning={isRunning}
      />
    </div>
  );
}
