'use client';

import { useState, useRef, useEffect } from 'react';

interface QuickAddModalProps {
  type: 'account' | 'opportunity';
  accountId?: string;
  onClose: () => void;
  onCreated: () => void;
}

export function QuickAddModal({ type, accountId, onClose, onCreated }: QuickAddModalProps) {
  const [name, setName] = useState('');
  const [stage, setStage] = useState('');
  const [industry, setIndustry] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError('');

    try {
      if (type === 'account') {
        const res = await fetch('/api/accounts', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            company_name: name.trim(),
            industry: industry.trim() || undefined,
          }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({ error: 'Failed' }));
          throw new Error(body.error);
        }
      } else {
        const res = await fetch('/api/opportunities', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            account_id: accountId,
            stage: stage.trim() || undefined,
          }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({ error: 'Failed' }));
          throw new Error(body.error);
        }
      }
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-5 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-sm font-semibold text-slate-900">
          {type === 'account' ? 'New Account' : 'New Opportunity'}
        </h3>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <input
            ref={inputRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={type === 'account' ? 'Company name' : 'Opportunity name'}
            className="glass-input w-full"
          />

          {type === 'account' && (
            <input
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="Industry (optional)"
              className="glass-input w-full"
            />
          )}

          {type === 'opportunity' && (
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="glass-input w-full"
            >
              <option value="">Stage (optional)</option>
              <option value="Discovery">Discovery</option>
              <option value="Qualification">Qualification</option>
              <option value="Proposal">Proposal</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Closed Won">Closed Won</option>
              <option value="Closed Lost">Closed Lost</option>
            </select>
          )}

          {error && <p className="text-xs text-red-600">{error}</p>}

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-3 py-1.5 text-sm text-slate-500 transition-colors hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="glass-button-primary text-sm disabled:opacity-50"
            >
              {saving ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
