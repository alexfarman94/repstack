'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

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
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Close on ESC + focus trap
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }
    // Focus trap
    if (e.key === 'Tab' && modalRef.current) {
      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'input, select, textarea, button, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, [onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={type === 'account' ? 'New Account' : 'New Opportunity'}
    >
      <div
        ref={modalRef}
        className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-5 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-sm font-semibold text-slate-900">
          {type === 'account' ? 'New Account' : 'New Opportunity'}
        </h3>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label htmlFor="qa-name" className="mb-1 block text-[11px] font-medium text-slate-500">
              {type === 'account' ? 'Company name' : 'Opportunity name'}
            </label>
            <input
              id="qa-name"
              ref={inputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={type === 'account' ? 'e.g. Acme Corp' : 'e.g. Q2 Enterprise Deal'}
              className="glass-input w-full"
            />
          </div>

          {type === 'account' && (
            <div>
              <label htmlFor="qa-industry" className="mb-1 block text-[11px] font-medium text-slate-500">
                Industry <span className="text-slate-400">(optional)</span>
              </label>
              <input
                id="qa-industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. SaaS, Healthcare"
                className="glass-input w-full"
              />
            </div>
          )}

          {type === 'opportunity' && (
            <div>
              <label htmlFor="qa-stage" className="mb-1 block text-[11px] font-medium text-slate-500">
                Stage <span className="text-slate-400">(optional)</span>
              </label>
              <select
                id="qa-stage"
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="glass-input w-full"
              >
                <option value="">Select stage...</option>
                <option value="Discovery">Discovery</option>
                <option value="Qualification">Qualification</option>
                <option value="Proposal">Proposal</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Closed Won">Closed Won</option>
                <option value="Closed Lost">Closed Lost</option>
              </select>
            </div>
          )}

          {error && <p className="text-xs text-red-600" role="alert">{error}</p>}

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
