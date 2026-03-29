'use client';

import { useState } from 'react';
import { CopyButton } from '@/components/CopyButton';
import { FeedbackRow } from './FeedbackRow';

interface OutputActionsProps {
  output: string;
  runId: string;
  accountId: string;
  onSaved: () => void;
}

export function OutputActions({ output, runId, accountId, onSaved }: OutputActionsProps) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');

  const saveToAccount = async () => {
    if (saving || saved || !accountId || !output) return;
    setSaving(true);
    setSaveError('');
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          title: `Agent Output — ${new Date().toLocaleDateString()}`,
          content: output,
          doc_type: 'deal_note',
          account_id: accountId,
        }),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({ error: 'Save failed' }));
        throw new Error(payload.error || 'Save failed');
      }
      setSaved(true);
      onSaved();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border-t border-slate-100 px-4 py-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CopyButton text={output} label="Copy" />
          <button
            onClick={saveToAccount}
            disabled={saving || saved || !accountId}
            className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-all ${
              saved
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40'
            }`}
          >
            {saved ? (
              <>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Saved
              </>
            ) : (
              <>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                {saving ? 'Saving...' : 'Save to Account'}
              </>
            )}
          </button>
        </div>

        {runId && <FeedbackRow runId={runId} />}
      </div>

      {/* Error toast inline */}
      {saveError && (
        <div className="mt-2 flex items-center justify-between rounded-md bg-red-50 px-3 py-1.5 text-xs text-red-600">
          <span>{saveError}</span>
          <button
            onClick={() => setSaveError('')}
            className="ml-2 text-red-400 hover:text-red-600"
            aria-label="Dismiss error"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
