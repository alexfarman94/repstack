'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AgentFormProps {
  mode: 'create' | 'edit';
  initialData?: {
    id: string;
    name: string;
    description: string | null;
    system_prompt: string;
    is_active: boolean;
  };
}

export function AgentForm({ mode, initialData }: AgentFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [systemPrompt, setSystemPrompt] = useState(initialData?.system_prompt || '');
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !systemPrompt.trim()) return;
    setSaving(true);
    setError('');

    try {
      const url = mode === 'create' ? '/api/agents' : `/api/agents/${initialData!.id}`;
      const method = mode === 'create' ? 'POST' : 'PATCH';

      const res = await fetch(url, {
        method,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          system_prompt: systemPrompt.trim(),
          is_active: isActive,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: 'Failed' }));
        throw new Error(body.error || `Error ${res.status}`);
      }

      router.push('/admin/agents');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Discovery Prep"
          className="glass-input w-full"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Description</label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="One-line description shown to reps"
          className="glass-input w-full"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">System Prompt</label>
        <textarea
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          rows={12}
          placeholder="You are a B2B sales AI assistant..."
          className="glass-input w-full resize-y font-mono text-xs"
        />
      </div>

      <div className="flex items-center gap-3">
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="peer sr-only"
          />
          <div className="peer h-5 w-9 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:bg-indigo-600 peer-checked:after:translate-x-full" />
        </label>
        <span className="text-sm text-slate-700">{isActive ? 'Active' : 'Inactive'}</span>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving || !name.trim() || !systemPrompt.trim()}
          className="glass-button-primary disabled:opacity-50"
        >
          {saving ? 'Saving...' : mode === 'create' ? 'Create Agent' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/agents')}
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
