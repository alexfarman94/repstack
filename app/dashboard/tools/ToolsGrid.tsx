'use client';

import { useRunner } from '@/app/dashboard/RunnerContext';
import type { ToolInput, Persona } from '@/lib/types';

export interface ToolPublic {
  id: string;
  title: string;
  description: string;
  hook: string;
  personas: Persona[];
  inputs: ToolInput[];
  format: string;
}

export function ToolsGrid({ tools }: { tools: ToolPublic[] }) {
  const { open } = useRunner();

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {tools.map((tool) => (
        <div
          key={tool.id}
          className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 flex flex-col hover:border-indigo-200 hover:shadow-md transition-all duration-150"
        >
          {/* Persona badges */}
          <div className="flex gap-1 mb-3">
            {tool.personas.map((p) => (
              <span
                key={p}
                className="text-[10px] font-semibold uppercase tracking-wide bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded"
              >
                {p}
              </span>
            ))}
          </div>

          {/* Title + description */}
          <h2 className="text-sm font-semibold text-slate-900 mb-1.5">{tool.title}</h2>
          <p className="text-xs text-slate-500 leading-relaxed flex-1 mb-4">{tool.hook}</p>

          {/* Run button */}
          <button
            onClick={() =>
              open({
                type: 'tool',
                toolId: tool.id,
                title: tool.title,
                description: tool.description,
                inputs: tool.inputs,
              })
            }
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 text-sm transition-colors"
          >
            ⚡ Run
          </button>
        </div>
      ))}
    </div>
  );
}
