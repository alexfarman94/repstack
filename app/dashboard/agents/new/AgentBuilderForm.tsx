'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ToolInput } from '@/lib/types';

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

export function AgentBuilderForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [inputs, setInputs] = useState<ToolInput[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addInput = () => {
    setInputs((prev) => [
      ...prev,
      {
        id: generateId(),
        label: '',
        type: 'textarea',
        placeholder: '',
        required: true,
        rows: 4,
      },
    ]);
  };

  const updateInput = (id: string, patch: Partial<ToolInput>) => {
    setInputs((prev) => prev.map((inp) => (inp.id === id ? { ...inp, ...patch } : inp)));
  };

  const removeInput = (id: string) => {
    setInputs((prev) => prev.filter((inp) => inp.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !instructions.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || undefined,
          system_prompt: instructions.trim(),
          inputs,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create agent');
      }

      const agent = await res.json();
      router.push(`/dashboard/agents/${agent.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-4 rounded-xl border border-slate-200 bg-white shadow-sm p-5">
        {/* Name */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Agent name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Discovery Call Debrief"
            required
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">
            Short description <span className="text-slate-500 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Turns raw call notes into a structured debrief"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Instructions / system prompt */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">What should this agent do?</label>
          <p className="text-xs text-slate-500">
            Write plain-English instructions. Be specific about the output format you want.
          </p>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={7}
            required
            placeholder={`Example: After a discovery call, take the rep's raw notes and produce a structured debrief. Include:

1. Top 3 pain points with evidence from the notes
2. Key stakeholders mentioned and their roles
3. Proposed business case in 2–3 sentences
4. Recommended next steps with a suggested timeline

Be concise and actionable. Use the opportunity documents context to fill in any gaps.`}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-y"
          />
        </div>
      </div>

      {/* Input fields */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-medium text-slate-700">Input fields</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              What should the rep provide when running this agent?
            </p>
          </div>
          <button
            type="button"
            onClick={addInput}
            className="inline-flex items-center gap-1 text-xs text-indigo-700 hover:text-indigo-800 border border-indigo-500/20 bg-white hover:bg-indigo-50 rounded-lg px-3 py-1.5 transition-colors"
          >
            + Add field
          </button>
        </div>

        {inputs.length === 0 && (
          <p className="text-xs text-slate-600 italic">
            No input fields — agent will run using opportunity documents context only.
          </p>
        )}

        {inputs.map((inp, i) => (
          <div
            key={inp.id}
            className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Field {i + 1}
              </span>
              <button
                type="button"
                onClick={() => removeInput(inp.id)}
                className="text-xs text-slate-600 hover:text-red-600 transition-colors"
              >
                Remove
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-600">Label</label>
                <input
                  type="text"
                  value={inp.label}
                  onChange={(e) => updateInput(inp.id, { label: e.target.value })}
                  placeholder="Call notes"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-slate-600">Type</label>
                <select
                  value={inp.type}
                  onChange={(e) =>
                    updateInput(inp.id, { type: e.target.value as ToolInput['type'] })
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="textarea">Long text</option>
                  <option value="text">Short text</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-600">Placeholder</label>
              <input
                type="text"
                value={inp.placeholder}
                onChange={(e) => updateInput(inp.id, { placeholder: e.target.value })}
                placeholder="Hint shown inside the field…"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={inp.required}
                onChange={(e) => updateInput(inp.id, { required: e.target.checked })}
                className="rounded accent-indigo-500"
              />
              <span className="text-xs text-slate-600">Required</span>
            </label>
          </div>
        ))}
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={!name.trim() || !instructions.trim() || loading}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-4 py-2 text-sm transition-colors"
        >
          {loading ? 'Saving…' : 'Save agent'}
        </button>
        <a
          href="/dashboard/agents"
          className="inline-flex items-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 px-4 py-2 text-sm transition-colors"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
