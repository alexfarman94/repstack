'use client';

import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';
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
  latestOutput: string;
  latestStatus: 'idle' | 'loading' | 'streaming' | 'done' | 'error';
  latestRunnerTitle: string;
  open: (config: RunnerConfig, initialAccountId?: string) => void;
  close: () => void;
  setAccountId: (id: string) => void;
  setLatestOutput: Dispatch<SetStateAction<string>>;
  setLatestStatus: Dispatch<SetStateAction<'idle' | 'loading' | 'streaming' | 'done' | 'error'>>;
  setLatestRunnerTitle: Dispatch<SetStateAction<string>>;
}

const RunnerContext = createContext<RunnerContextValue>({
  runner: null,
  accountId: '',
  latestOutput: '',
  latestStatus: 'idle',
  latestRunnerTitle: '',
  open: () => {},
  close: () => {},
  setAccountId: () => {},
  setLatestOutput: () => {},
  setLatestStatus: () => {},
  setLatestRunnerTitle: () => {},
});

export function RunnerProvider({ children }: { children: ReactNode }) {
  const [runner, setRunner] = useState<RunnerConfig | null>(null);
  const [accountId, setAccountId] = useState('');
  const [latestOutput, setLatestOutput] = useState('');
  const [latestStatus, setLatestStatus] = useState<'idle' | 'loading' | 'streaming' | 'done' | 'error'>('idle');
  const [latestRunnerTitle, setLatestRunnerTitle] = useState('');

  const open = (config: RunnerConfig, initialAccountId?: string) => {
    setRunner(config);
    setLatestRunnerTitle(config.type === 'tool' ? config.title : config.name);
    if (initialAccountId !== undefined) setAccountId(initialAccountId);
  };

  const close = () => setRunner(null);

  return (
    <RunnerContext.Provider
      value={{
        runner,
        accountId,
        latestOutput,
        latestStatus,
        latestRunnerTitle,
        open,
        close,
        setAccountId,
        setLatestOutput,
        setLatestStatus,
        setLatestRunnerTitle,
      }}
    >
      {children}
    </RunnerContext.Provider>
  );
}

export function useRunner() {
  return useContext(RunnerContext);
}
