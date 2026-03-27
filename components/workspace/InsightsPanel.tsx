'use client';

import { CopyButton } from '@/components/CopyButton';

interface InsightsPanelProps {
  accountName?: string;
  runnerTitle?: string;
  output: string;
  status: 'idle' | 'loading' | 'streaming' | 'done' | 'error';
}

function buildSummary(output: string) {
  const compact = output.replace(/\s+/g, ' ').trim();
  if (!compact) return 'Run a tool or agent to generate an executive summary.';
  return compact.slice(0, 240) + (compact.length > 240 ? '...' : '');
}

export function InsightsPanel({ accountName, runnerTitle, output, status }: InsightsPanelProps) {
  return (
    <aside className="glass-panel h-full p-4 md:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">Agent Insights</p>
          <h2 className="text-sm font-medium text-slate-700">
            {accountName ? `For ${accountName}` : 'Select account'}
          </h2>
        </div>
        <span className="rounded-full bg-indigo-600 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-white">
          Workspace
        </span>
      </div>

      <div className="space-y-3">
        <section className="rounded-xl border border-white/80 bg-white/80 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">Executive Summary</p>
          <p className="mt-2 text-sm text-slate-700">{buildSummary(output)}</p>
        </section>

        <section className="rounded-xl border border-white/80 bg-white/80 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">Key Opportunities</p>
          <ul className="mt-2 space-y-1 text-sm text-slate-700">
            <li>- Consolidate all rep actions around one account context.</li>
            <li>- Use transcript-informed output before next customer touchpoint.</li>
            <li>- Convert generated output into immediate next-step messaging.</li>
          </ul>
        </section>

        <section className="rounded-xl border border-indigo-200 bg-indigo-50/70 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-indigo-600">Next Suggested Step</p>
          <p className="mt-2 text-sm text-indigo-900">
            {runnerTitle
              ? `Run ${runnerTitle} and send one concrete follow-up within 15 minutes.`
              : 'Choose a tool or agent from the center panel and generate your first output.'}
          </p>
        </section>
      </div>

      <div className="mt-4 rounded-xl border border-white/80 bg-white/80 p-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">Latest Output</p>
          {status === 'done' && output && <CopyButton text={output} label="Copy" />}
        </div>
        <div className="max-h-64 overflow-auto rounded-lg bg-slate-50 p-3 text-xs text-slate-700">
          {status === 'loading' || status === 'streaming'
            ? 'Generating...'
            : output || 'No output yet. Generate from a tool or agent.'}
        </div>
      </div>
    </aside>
  );
}
