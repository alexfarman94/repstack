'use client';

import { useEffect, useState } from 'react';
import { useRunner } from '@/app/dashboard/RunnerContext';
import { CustomAgentBuilder } from './CustomAgentBuilder';
import { CustomAgentList } from './CustomAgentList';

type Agent = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
};

export function SettingsPanel() {
  const { triggerRefresh } = useRunner();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAgents = () => {
    fetch('/api/user-agents')
      .then((r) => r.json())
      .then((data) => setAgents(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleDelete = async (id: string) => {
    await fetch(`/api/user-agents/${id}`, { method: 'DELETE' });
    setAgents((prev) => prev.filter((a) => a.id !== id));
    triggerRefresh();
  };

  const handleCreated = () => {
    fetchAgents();
    triggerRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel px-4 py-3">
        <h1 className="text-lg font-semibold text-slate-900">Settings</h1>
        <p className="text-xs text-slate-500">Manage your custom agents</p>
      </div>

      {/* Custom agents list */}
      <section className="glass-panel p-4">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
          Your Custom Agents
        </p>
        {loading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : (
          <CustomAgentList agents={agents} onDelete={handleDelete} />
        )}
      </section>

      {/* Builder */}
      <section className="glass-panel p-4">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
          Create New Agent
        </p>
        <CustomAgentBuilder onCreated={handleCreated} />
      </section>
    </div>
  );
}
