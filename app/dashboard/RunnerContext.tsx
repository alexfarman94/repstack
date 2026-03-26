'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
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

// ─── Context ──────────────────────────────────────────────────────────────────

interface RunnerContextValue {
  runner: RunnerConfig | null;
  accountId: string;
  open: (config: RunnerConfig, initialAccountId?: string) => void;
  close: () => void;
  setAccountId: (id: string) => void;
}

const RunnerContext = createContext<RunnerContextValue>({
  runner: null,
  accountId: '',
  open: () => {},
  close: () => {},
  setAccountId: () => {},
});

export function RunnerProvider({ children }: { children: ReactNode }) {
  const [runner, setRunner] = useState<RunnerConfig | null>(null);
  const [accountId, setAccountId] = useState('');

  const open = (config: RunnerConfig, initialAccountId?: string) => {
    setRunner(config);
    if (initialAccountId !== undefined) setAccountId(initialAccountId);
  };

  const close = () => setRunner(null);

  return (
    <RunnerContext.Provider value={{ runner, accountId, open, close, setAccountId }}>
      {children}
    </RunnerContext.Provider>
  );
}

export function useRunner() {
  return useContext(RunnerContext);
}
