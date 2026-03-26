'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function NewAccountForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    company_name: '',
    industry: '',
    size: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company_name.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create account');
      }

      const account = await res.json();
      router.push(`/dashboard/accounts/${account.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-4 rounded-xl border border-slate-200 bg-white shadow-sm p-5">
        <Field
          label="Company name"
          required
          value={form.company_name}
          onChange={(v) => setForm((f) => ({ ...f, company_name: v }))}
          placeholder="Acme Corp"
        />
        <Field
          label="Industry"
          value={form.industry}
          onChange={(v) => setForm((f) => ({ ...f, industry: v }))}
          placeholder="SaaS, Financial Services, Manufacturing…"
        />
        <Field
          label="Company size"
          value={form.size}
          onChange={(v) => setForm((f) => ({ ...f, size: v }))}
          placeholder="200–500 employees"
        />
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">
            Notes <span className="text-slate-500 font-normal">(optional)</span>
          </label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            rows={3}
            placeholder="Key pain points, decision timeline, champion name…"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={!form.company_name.trim() || loading}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-4 py-2 text-sm transition-colors"
        >
          {loading ? 'Creating…' : 'Create opportunity'}
        </button>
        <a
          href="/dashboard/accounts"
          className="inline-flex items-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 px-4 py-2 text-sm transition-colors"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-700">
        {label}{' '}
        {!required && <span className="text-slate-500 font-normal">(optional)</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
  );
}
