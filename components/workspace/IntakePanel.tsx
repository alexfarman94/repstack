'use client';

import { useState } from 'react';

interface IntakePanelProps {
  onCreated: () => Promise<void> | void;
}

export function IntakePanel({ onCreated }: IntakePanelProps) {
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [size, setSize] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          company_name: companyName.trim(),
          industry: industry.trim() || undefined,
          size: size.trim() || undefined,
          notes: notes.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({ error: 'Unable to create account' }));
        throw new Error(payload.error || 'Unable to create account');
      }
      setCompanyName('');
      setIndustry('');
      setSize('');
      setNotes('');
      await onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="glass-panel p-4 md:p-5">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">Account Intelligence Intake</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Account name"
          className="glass-input w-full"
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            placeholder="Industry vertical"
            className="glass-input w-full"
          />
          <input
            value={size}
            onChange={(e) => setSize(e.target.value)}
            placeholder="Deal size / company size"
            className="glass-input w-full"
          />
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Quick notes (optional)"
          className="glass-input w-full resize-y"
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={saving || !companyName.trim()}
          className="glass-button-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Create Account'}
        </button>
      </form>
    </section>
  );
}
