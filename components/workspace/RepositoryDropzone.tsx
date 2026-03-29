'use client';

import { useRef, useState } from 'react';
import { useRunner } from '@/app/dashboard/RunnerContext';

type DocType = 'transcript' | 'email' | 'deal_note' | 'proposal' | 'other';

interface RepositoryDropzoneProps {
  accountId: string;
}

async function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1] ?? result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function RepositoryDropzone({ accountId }: RepositoryDropzoneProps) {
  const { activeOpportunityId, triggerRefresh } = useRunner();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [docType, setDocType] = useState<DocType>('transcript');
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const onFilePick = (picked: File | null) => {
    if (!picked) return;
    setFile(picked);
    setMessage('');
    setError('');
    setExpanded(true);
  };

  const onSave = async () => {
    if (!file || !accountId) return;
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const fileBase64 = await readFileAsBase64(file);
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileBase64,
          mimeType: file.type || 'text/plain',
          doc_type: docType,
          account_id: accountId,
          opportunity_id: activeOpportunityId || undefined,
        }),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(payload.error || 'Upload failed');
      }
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setMessage('Document uploaded successfully.');
      setExpanded(false);
      triggerRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setSaving(false);
    }
  };

  // Collapsed state — compact upload link
  if (!expanded && !file) {
    return (
      <div className="flex items-center gap-3">
        <button
          onClick={() => setExpanded(true)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 transition-colors hover:text-indigo-500"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
          </svg>
          Upload documents
        </button>
        {activeOpportunityId && (
          <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-medium text-indigo-600">
            Linked to opp
          </span>
        )}
        {message && <span className="text-[11px] text-emerald-600">{message}</span>}
      </div>
    );
  }

  // Expanded state — full dropzone
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="section-label">Upload Documents</p>
        <button
          onClick={() => { setExpanded(false); setFile(null); }}
          className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
        >
          Collapse
        </button>
      </div>

      <div
        onClick={() => fileInputRef.current?.click()}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          onFilePick(e.dataTransfer.files?.[0] ?? null);
        }}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        className={`flex min-h-[60px] cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed p-3 text-center transition-colors ${
          dragging
            ? 'border-indigo-400 bg-indigo-50/50'
            : file
            ? 'border-emerald-300 bg-emerald-50/30'
            : 'border-slate-200 bg-slate-50 hover:border-slate-300'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".txt,.docx,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={(e) => onFilePick(e.target.files?.[0] ?? null)}
        />
        {file ? (
          <p className="text-sm font-medium text-slate-700">{file.name}</p>
        ) : (
          <>
            <p className="text-xs text-slate-500">Drop file or click to upload</p>
            <p className="mt-0.5 text-[10px] text-slate-400">.txt or .docx up to 5MB</p>
          </>
        )}
      </div>

      {file && (
        <div className="mt-2 flex items-center gap-2">
          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value as DocType)}
            className="glass-input flex-1 text-xs"
          >
            <option value="transcript">Call Transcript</option>
            <option value="email">Email</option>
            <option value="deal_note">Deal Note</option>
            <option value="proposal">Proposal</option>
            <option value="other">Other</option>
          </select>
          <button
            onClick={onSave}
            disabled={!accountId || saving}
            className="glass-button-primary text-xs disabled:opacity-50"
          >
            {saving ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      )}

      {message && <p className="mt-2 text-xs text-emerald-600">{message}</p>}
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </section>
  );
}
