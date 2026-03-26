'use client';

import { useState, useMemo } from 'react';
import { Tool, Persona, Format } from '@/lib/types';
import { filterTools } from '@/lib/filterTools';
import { ToolCard } from './ToolCard';
import { ToolFilter } from './ToolFilter';

interface ToolsGridProps {
  tools: Tool[];
}

export function ToolsGrid({ tools }: ToolsGridProps) {
  const [persona, setPersona] = useState<Persona | 'all'>('all');
  const [format, setFormat] = useState<Format | 'all'>('all');

  const filtered = useMemo(
    () => filterTools(tools, persona, format),
    [tools, persona, format]
  );

  return (
    <div>
      <ToolFilter
        persona={persona}
        format={format}
        onPersonaChange={setPersona}
        onFormatChange={setFormat}
        counts={{ total: tools.length, filtered: filtered.length }}
      />
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-16 text-slate-500">
            No tools match those filters yet — more coming soon.
          </div>
        ) : (
          filtered.map((tool) => <ToolCard key={tool.id} tool={tool} />)
        )}
      </div>
    </div>
  );
}
