'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Agent = {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
};

export default function AdminAgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/agents')
      .then((r) => r.json())
      .then((data) => setAgents(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this agent?')) return;
    await fetch(`/api/agents/${id}`, { method: 'DELETE' });
    setAgents((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Platform Agents</h2>
        <Link
          href="/admin/agents/new"
          className="glass-button-primary text-sm"
        >
          + New Agent
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Loading...</p>
      ) : agents.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          No platform agents yet. Create one to get started.
        </div>
      ) : (
        <div className="space-y-2">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-slate-900">{agent.name}</p>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                      agent.is_active
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {agent.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-slate-500">
                  {agent.description || 'No description'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/agents/${agent.id}`}
                  className="rounded-md px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(agent.id)}
                  className="rounded-md px-2.5 py-1 text-xs font-medium text-red-500 transition-colors hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
