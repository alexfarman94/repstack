'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

type Account = { id: string; company_name: string };

type Mode = 'paste' | 'file';

const DOC_TYPES = [
  { value: 'transcript', label: 'Call transcript' },
  { value: 'product_info', label: 'Product info' },
  { value: 'meeting_notes', label: 'Meeting notes' },
  { value: 'other', label: 'Other' },
];

export function UploadForm({
  accounts,
  defaultAccountId,
}: {
  accounts: Account[];
  defaultAccountId: string;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<Mode>('paste');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [docType, setDocType] = useState('transcript');
  const [accountId, setAccountId] = useState(defaultAccountId);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      if (!title) setTitle(f.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) {
      setFile(f);
      if (!title) setTitle(f.name.replace(/\.[^/.]+$/, ''));
      setMode('file');
    }
  };

  const canSubmit = () => {
    if (mode === 'paste') return content.trim().length >= 50;
    return file !== null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit()) return;

    setLoading(true);
    setError('');

    try {
      let res: Response;

      if (mode === 'paste') {
        res = await fetch('/api/documents', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            title: title.trim() || undefined,
            content: content.trim(),
            doc_type: docType,
            account_id: accountId || undefined,
          }),
        });
      } else {
        // File upload — base64 encode
        const fileBuffer = await readFileAsBase64(file!);
        res = await fetch('/api/documents/upload', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            fileName: file!.name,
            fileBase64: fileBuffer,
            mimeType: file!.type || 'text/plain',
            title: title.trim() || undefined,
            doc_type: docType,
            account_id: accountId || undefined,
          }),
        });
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Upload failed');
      }

      // Navigate back to account or docs list
      if (accountId) {
        router.push(`/dashboard/accounts/${accountId}`);
      } else {
        // Documents are managed inside Opportunities.
        router.push('/dashboard/accounts');
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Mode toggle */}
      <div className="flex rounded-lg border border-slate-200 overflow-hidden w-fit">
        {(['paste', 'file'] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              mode === m
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {m === 'paste' ? 'Paste text' : 'Upload file'}
          </button>
        ))}
      </div>

      <div className="space-y-4 rounded-xl border border-slate-200 bg-white shadow-sm p-5">
        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">
            Title <span className="text-slate-500 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Q1 Discovery call with Acme"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Doc type */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Document type</label>
          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {DOC_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Account */}
        {accounts.length > 0 && (
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Attach to account <span className="text-slate-500 font-normal">(optional)</span>
            </label>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">— No account —</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.company_name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Content or file */}
        {mode === 'paste' ? (
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              placeholder="Paste your call transcript, meeting notes, or any account context here…"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-y"
            />
            {content.trim().length > 0 && content.trim().length < 50 && (
              <p className="text-xs text-amber-500">
                Content too short ({content.trim().length} chars — need at least 50)
              </p>
            )}
          </div>
        ) : (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="rounded-lg border-2 border-dashed border-slate-200 hover:border-slate-300 transition-colors p-8 text-center cursor-pointer bg-slate-50"
            onClick={() => fileRef.current?.click()}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".txt,.docx,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
              className="hidden"
            />
            {file ? (
              <div>
                <p className="text-sm font-medium text-slate-900">{file.name}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {(file.size / 1024).toFixed(0)} KB · Click to change
                </p>
              </div>
            ) : (
              <div>
                <p className="text-slate-500 text-sm">Drop a file here, or click to browse</p>
                <p className="text-slate-600 text-xs mt-1">Supports .txt and .docx · Max 5 MB</p>
              </div>
            )}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={!canSubmit() || loading}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-4 py-2 text-sm transition-colors"
        >
          {loading ? 'Saving…' : 'Save document'}
        </button>
        <a
          href={accountId ? `/dashboard/accounts/${accountId}` : '/dashboard/accounts'}
          className="inline-flex items-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 px-4 py-2 text-sm transition-colors"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}

async function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip data URL prefix
      resolve(result.split(',')[1] ?? result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
