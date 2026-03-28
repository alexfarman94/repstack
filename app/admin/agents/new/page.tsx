'use client';

import { AgentForm } from '@/components/admin/AgentForm';

export default function NewAgentPage() {
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-slate-900">Create Platform Agent</h2>
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <AgentForm mode="create" />
      </div>
    </div>
  );
}
