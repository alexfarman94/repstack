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
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Agent name"
        className="glass-input w-full"
      />
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Short description (optional)"
        className="glass-input w-full"
      />
      <textarea
        value={systemPrompt}
        onChange={(e) => setSystemPrompt(e.target.value)}
        rows={6}
        placeholder="System prompt — tell the agent how to behave and what to output..."
        className="glass-input w-full resize-y font-mono text-xs"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
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
