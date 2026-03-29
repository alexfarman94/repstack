'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import type { ToolInput } from '@/lib/types';

// ─── Config types ──────────────────────────────────────────────────────────────

export interface ToolRunnerConfig {
  type: 'tool';
  toolId: string;
  title: string;
  description: string;
  inputs: ToolInput[];
}

export interface AgentRunnerConfig {
  type: 'agent';
  agentId: string;
  name: string;
  description?: string | null;
  inputs: ToolInput[];
}

export type RunnerConfig = ToolRunnerConfig | AgentRunnerConfig;
export type DashboardTab = 'workspace' | 'analytics' | 'settings';

// ─── Context ──────────────────────────────────────────────────────────────────

interface RunnerContextValue {
  // Active context
  activeAccountId: string;
  activeOpportunityId: string;
  setActiveAccountId: (id: string) => void;
  setActiveOpportunityId: (id: string) => void;
  setContext: (accountId: string, opportunityId?: string) => void;

  // Tab navigation
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;

  // Agent selection (Phase 4)
  selectedAgentId: string;
  isUserAgent: boolean;
  setSelectedAgent: (id: string, isUser: boolean) => void;

  // Runner state (legacy compat + new)
  runner: RunnerConfig | null;
  accountId: string;
  latestOutput: string;
  latestStatus: 'idle' | 'loading' | 'streaming' | 'done' | 'error';
  latestRunnerTitle: string;
  runId: string;
  open: (config: RunnerConfig, initialAccountId?: string) => void;
  close: () => void;
  setAccountId: (id: string) => void;
  setLatestOutput: Dispatch<SetStateAction<string>>;
  setLatestStatus: Dispatch<SetStateAction<'idle' | 'loading' | 'streaming' | 'done' | 'error'>>;
  setLatestRunnerTitle: Dispatch<SetStateAction<string>>;
  setRunId: Dispatch<SetStateAction<string>>;

  // Data refresh trigger
  refreshKey: number;
  triggerRefresh: () => void;
}

const RunnerContext = createContext<RunnerContextValue>({
  activeAccountId: '',
  activeOpportunityId: '',
  setActiveAccountId: () => {},
  setActiveOpportunityId: () => {},
  setContext: () => {},
  activeTab: 'workspace',
  setActiveTab: () => {},
  selectedAgentId: '',
  isUserAgent: false,
  setSelectedAgent: () => {},
  runner: null,
  accountId: '',
  latestOutput: '',
  latestStatus: 'idle',
  latestRunnerTitle: '',
  runId: '',
  open: () => {},
  close: () => {},
  setAccountId: () => {},
  setLatestOutput: () => {},
  setLatestStatus: () => {},
  setLatestRunnerTitle: () => {},
  setRunId: () => {},
  refreshKey: 0,
  triggerRefresh: () => {},
});

export function RunnerProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Hydrate from URL params on mount
  const initialAccount = searchParams.get('account') || '';
  const initialOpp = searchParams.get('opp') || '';
  const initialTab = (searchParams.get('tab') as DashboardTab) || 'workspace';

  // Active context
  const [activeAccountId, setActiveAccountIdRaw] = useState(initialAccount);
  const [activeOpportunityId, setActiveOpportunityIdRaw] = useState(initialOpp);
  const [activeTab, setActiveTabRaw] = useState<DashboardTab>(initialTab);

  // Agent selection
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [isUserAgent, setIsUserAgent] = useState(false);

  // Runner state
  const [runner, setRunner] = useState<RunnerConfig | null>(null);
  const [accountId, setAccountIdRaw] = useState(initialAccount);
  const [latestOutput, setLatestOutput] = useState('');
  const [latestStatus, setLatestStatus] = useState<'idle' | 'loading' | 'streaming' | 'done' | 'error'>('idle');
  const [latestRunnerTitle, setLatestRunnerTitle] = useState('');
  const [runId, setRunId] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  // Sync state → URL params (debounced to avoid thrashing)
  useEffect(() => {
    const params = new URLSearchParams();
    if (activeAccountId) params.set('account', activeAccountId);
    if (activeOpportunityId) params.set('opp', activeOpportunityId);
    if (activeTab !== 'workspace') params.set('tab', activeTab);
    const qs = params.toString();
    const newUrl = qs ? `${pathname}?${qs}` : pathname;
    router.replace(newUrl, { scroll: false });
  }, [activeAccountId, activeOpportunityId, activeTab, pathname, router]);

  // Wrapper to clear agent selection when account changes
  const setActiveAccountId = useCallback((id: string) => {
    setActiveAccountIdRaw((prev) => {
      if (prev !== id) {
        // Account changed — clear agent selection
        setSelectedAgentId('');
        setIsUserAgent(false);
      }
      return id;
    });
  }, []);

  const setActiveOpportunityId = useCallback((id: string) => {
    setActiveOpportunityIdRaw(id);
  }, []);

  const setActiveTab = useCallback((tab: DashboardTab) => {
    setActiveTabRaw(tab);
  }, []);

  const setContext = useCallback((acctId: string, oppId?: string) => {
    setActiveAccountId(acctId);
    setActiveOpportunityIdRaw(oppId || '');
    // Sync legacy accountId
    setAccountIdRaw(acctId);
  }, [setActiveAccountId]);

  const setAccountId = useCallback((id: string) => {
    setAccountIdRaw(id);
    setActiveAccountId(id);
  }, [setActiveAccountId]);

  const open = useCallback((config: RunnerConfig, initialAccountId?: string) => {
    setRunner(config);
    setLatestRunnerTitle(config.type === 'tool' ? config.title : config.name);
    if (initialAccountId !== undefined) setAccountId(initialAccountId);
  }, [setAccountId]);

  const close = useCallback(() => setRunner(null), []);

  const setSelectedAgent = useCallback((id: string, isUser: boolean) => {
    setSelectedAgentId(id);
    setIsUserAgent(isUser);
  }, []);

  const triggerRefresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  return (
    <RunnerContext.Provider
      value={{
        activeAccountId,
        activeOpportunityId,
        setActiveAccountId,
        setActiveOpportunityId,
        setContext,
        activeTab,
        setActiveTab,
        selectedAgentId,
        isUserAgent,
        setSelectedAgent,
        runner,
        accountId,
        latestOutput,
        latestStatus,
        latestRunnerTitle,
        runId,
        open,
        close,
        setAccountId,
        setLatestOutput,
        setLatestStatus,
        setLatestRunnerTitle,
        setRunId,
        refreshKey,
        triggerRefresh,
      }}
    >
      {children}
    </RunnerContext.Provider>
  );
}

export function useRunner() {
  return useContext(RunnerContext);
}
