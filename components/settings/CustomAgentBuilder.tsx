'use client';

import { useState } from 'react';

interface CustomAgentBuilderProps {
  onCreated: () => void;
}

export function CustomAgentBuilder({ onCreated }: CustomAgentBuilderProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !systemPrompt.trim()) return;
    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/user-agents', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          system_prompt: systemPrompt.trim(),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: 'Failed' }));
        throw new Error(body.error);
      }
      setName('');
      setDescription('');
      setSystemPrompt('');
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="cab-name" className="mb-1 block text-[11px] font-medium text-slate-500">
          Agent name <span className="text-red-400">*</span>
        </label>
        <input
          id="cab-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Competitive Intel"
          className="glass-input w-full"
        />
      </div>
      <div>
        <label htmlFor="cab-desc" className="mb-1 block text-[11px] font-medium text-slate-500">
          Description <span className="text-slate-400">(optional)</span>
        </label>
        <input
          id="cab-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short description of what this agent does"
          className="glass-input w-full"
        />
      </div>
      <div>
        <label htmlFor="cab-prompt" className="mb-1 block text-[11px] font-medium text-slate-500">
          System prompt <span className="text-red-400">*</span>
        </label>
        <textarea
          id="cab-prompt"
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          rows={6}
          placeholder="Tell the agent how to behave and what to output..."
          className="glass-input w-full resize-y font-mono text-xs"
        />
      </div>
      {error && <p className="text-xs text-red-600" role="alert">{error}</p>}
      <button
        type="submit"
        disabled={saving || !name.trim() || !systemPrompt.trim()}
        className="glass-button-primary text-sm disabled:opacity-50"
      >
        {saving ? 'Creating...' : 'Create Custom Agent'}
      </button>
    </form>
  );
}
