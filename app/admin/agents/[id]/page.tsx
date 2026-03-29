'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AgentForm } from '@/components/admin/AgentForm';

type Agent = {
  id: string;
  name: string;
  description: string | null;
  system_prompt: string;
  is_active: boolean;
};

export default function EditAgentPage() {
  const params = useParams();
  const id = params.id as string;
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/agents/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Agent not found');
        return res.json();
      })
      .then(setAgent)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-sm text-slate-500">Loading...</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!agent) return null;

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-slate-900">Edit: {agent.name}</h2>
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <AgentForm mode="edit" initialData={agent} />
      </div>
    </div>
  );
}
