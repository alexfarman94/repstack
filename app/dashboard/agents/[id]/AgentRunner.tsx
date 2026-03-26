'use client';

import { useState, useRef } from 'react';
import { ToolInput } from '@/lib/types';
import { CopyButton } from '@/components/CopyButton';

type Account = { id: string; company_name: string };

interface AgentRunnerProps {
  agentId: string;
  inputs: ToolInput[];
  accounts: Account[];
}

export function AgentRunner({ agentId, inputs, accounts }: AgentRunnerProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [accountId, setAccountId] = useState('');
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'streaming' | 'done' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const outputRef = useRef<HTMLDivElement>(null);

  const isValid = inputs
    .filter((i) => i.required)
    .every((i) => values[i.id]?.trim());

  const handleRun = async () => {
    setStatus('loading');
    setOutput('');
    setErrorMsg('');

    try {
      const res = await fetch(`/api/agents/${agentId}/run`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ inputs: values, accountId: accountId || undefined }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Something went wrong' }));
        throw new Error(err.error || `Error ${res.status}`);
      }

      if (!res.body) throw new Error('No response body');

      setStatus('streaming');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') continue;

          try {
            const json = JSON.parse(data);
            if (json.type === 'content_block_delta' && json.delta?.type === 'text_delta') {
              setOutput((prev) => {
                const next = prev + json.delta.text;
                setTimeout(() => {
                  outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
                }, 0);
                return next;
              });
            }
          } catch {
            // ignore parse errors
          }
        }
      }

      setStatus('done');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
      setStatus('error');
    }
  };

  const reset = () => {
    setOutput('');
    setStatus('idle');
    setErrorMsg('');
    setValues({});
  };

  const isRunning = status === 'loading' || status === 'streaming';
  const hasOutput = output.length > 0;

  return (
    <div className="space-y-6">
      {/* Account selector */}
      {accounts.length > 0 && (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-4 space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-stone-300">Account context</label>
            {accountId && (
              <span className="text-[10px] font-medium bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded">
                KB loaded
              </span>
            )}
          </div>
          <p className="text-xs text-stone-600">
            Select an account to automatically inject its documents as context.
          </p>
          <select
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className="w-full rounded-lg border border-white/[0.08] bg-[#0c0c0e] px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
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

      {/* Input fields */}
      {inputs.length > 0 && (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-4">
          {inputs.map((inp) => (
            <InputField
              key={inp.id}
              input={inp}
              value={values[inp.id] ?? ''}
              onChange={(v) => setValues((prev) => ({ ...prev, [inp.id]: v }))}
              disabled={isRunning}
            />
          ))}
        </div>
      )}

      {/* No inputs — pure KB agent */}
      {inputs.length === 0 && (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-4">
          <p className="text-sm text-stone-500">
            This agent runs directly from knowledge base context. Select an account above and hit Run.
          </p>
        </div>
      )}

      {/* Run button */}
      <div className="flex items-center gap-3">
        {!isRunning && !hasOutput && (
          <button
            onClick={handleRun}
            disabled={!isValid && inputs.length > 0}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-5 py-2.5 text-sm transition-colors"
          >
            ⚡ Run agent
          </button>
        )}
        {isRunning && (
          <div className="inline-flex items-center gap-2 text-sm text-stone-400">
            <span className="w-3 h-3 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
            {status === 'loading' ? 'Starting…' : 'Generating…'}
          </div>
        )}
        {hasOutput && !isRunning && (
          <button
            onClick={reset}
            className="text-sm text-stone-400 hover:text-white transition-colors"
          >
            ↺ Run again
          </button>
        )}
      </div>

      {/* Error */}
      {status === 'error' && errorMsg && (
        <p className="text-sm text-red-400">{errorMsg}</p>
      )}

      {/* Output */}
      {hasOutput && (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-widest">Output</span>
            <CopyButton text={output} />
          </div>
          <div className="px-5 py-4">
            <div
              ref={outputRef}
              className="text-sm text-stone-200 whitespace-pre-wrap leading-relaxed font-mono"
            >
              {output}
              {isRunning && (
                <span className="inline-block w-0.5 h-4 bg-indigo-400 ml-0.5 animate-pulse align-text-bottom" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InputField({
  input,
  value,
  onChange,
  disabled,
}: {
  input: ToolInput;
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-stone-300">
        {input.label}
        {!input.required && (
          <span className="ml-1.5 text-stone-600 font-normal text-xs">(optional)</span>
        )}
      </label>
      {input.type === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={input.placeholder}
          rows={input.rows ?? 4}
          disabled={disabled}
          className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder-stone-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y disabled:opacity-50"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={input.placeholder}
          disabled={disabled}
          className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-white placeholder-stone-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
        />
      )}
    </div>
  );
}
