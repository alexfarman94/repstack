'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function DeleteAgentButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    await fetch(`/api/agents/${id}`, { method: 'DELETE' });
    router.push('/dashboard/agents');
    router.refresh();
  };

  if (confirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-stone-400">Delete &quot;{name}&quot;?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-xs text-red-400 hover:text-red-300 font-medium"
        >
          {loading ? 'Deleting…' : 'Yes, delete'}
        </button>
        <button onClick={() => setConfirm(false)} className="text-xs text-stone-500 hover:text-stone-300">
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      className="inline-flex items-center rounded-lg border border-red-900/40 text-red-500 hover:border-red-700/60 hover:text-red-400 px-3 py-1.5 text-xs transition-colors"
    >
      Delete
    </button>
  );
}
