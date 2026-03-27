'use client';

interface DocInventoryStripProps {
  docs: { doc_type: string }[];
}

const DOC_TYPE_CONFIG: Record<string, { icon: string; label: string }> = {
  transcript: { icon: '\uD83C\uDFA4', label: 'Transcripts' },
  email: { icon: '\uD83D\uDCE7', label: 'Emails' },
  deal_note: { icon: '\uD83D\uDCDD', label: 'Notes' },
  proposal: { icon: '\uD83D\uDCC4', label: 'Proposals' },
  other: { icon: '\uD83D\uDCC1', label: 'Other' },
};

export function DocInventoryStrip({ docs }: DocInventoryStripProps) {
  if (docs.length === 0) return null;

  // Count by type
  const counts: Record<string, number> = {};
  for (const d of docs) {
    const type = d.doc_type || 'other';
    counts[type] = (counts[type] || 0) + 1;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {Object.entries(counts).map(([type, count]) => {
        const config = DOC_TYPE_CONFIG[type] || DOC_TYPE_CONFIG.other;
        return (
          <span
            key={type}
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white/80 px-2.5 py-1 text-xs text-slate-600"
          >
            <span>{config.icon}</span>
            {count} {config.label}
          </span>
        );
      })}
    </div>
  );
}
