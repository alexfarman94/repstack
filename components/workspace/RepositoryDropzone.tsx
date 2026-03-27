'use client';

import { useRef, useState } from 'react';

type DocType = 'transcript' | 'product_info' | 'meeting_notes' | 'other';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [docType, setDocType] = useState<DocType>('transcript');
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const onFilePick = (picked: File | null) => {
    if (!picked) return;
    setFile(picked);
    setMessage('');
    setError('');
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
        }),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(payload.error || 'Upload failed');
      }
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setMessage('Document uploaded successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="glass-panel p-4 md:p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">Repository</p>
        <span className="text-xs text-slate-500">{accountId ? 'Attached to account' : 'Select account first'}</span>
      </div>

      <div
        onClick={() => fileInputRef.current?.click()}
        onDrop={(e) => {
          e.preventDefault();
          onFilePick(e.dataTransfer.files?.[0] ?? null);
        }}
        onDragOver={(e) => e.preventDefault()}
        className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white/60 p-5 text-center"
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".txt,.docx,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={(e) => onFilePick(e.target.files?.[0] ?? null)}
        />
        <p className="text-sm font-medium text-slate-700">
          {file ? file.name : 'Drop transcript or notes'}
        </p>
        <p className="mt-1 text-xs text-slate-500">.txt or .docx up to 5MB</p>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <select
          value={docType}
          onChange={(e) => setDocType(e.target.value as DocType)}
          className="glass-input w-full"
        >
          <option value="transcript">Call transcript</option>
          <option value="product_info">Product info</option>
          <option value="meeting_notes">Meeting notes</option>
          <option value="other">Other</option>
        </select>
        <button
          onClick={onSave}
          disabled={!file || !accountId || saving}
          className="glass-button-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? 'Uploading...' : 'Save Document'}
        </button>
      </div>

      {message && <p className="mt-2 text-xs text-emerald-600">{message}</p>}
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </section>
  );
}
