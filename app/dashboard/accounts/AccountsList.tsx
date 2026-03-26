'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRunner } from '@/app/dashboard/RunnerContext';

type Doc = {
  id: string;
  title: string;
  doc_type: string;
  char_count: number | null;
};

type AccountWithDocs = {
  id: string;
  company_name: string;
  industry: string | null;
  size: string | null;
  notes: string | null;
  created_at: string;
  docs: Doc[];
};

const DOC_TYPE_STYLES: Record<string, string> = {
  transcript: 'bg-blue-50 text-blue-600',
  product_info: 'bg-purple-50 text-purple-600',
  meeting_notes: 'bg-green-50 text-green-600',
  other: 'bg-slate-100 text-slate-600',
};

const DOC_TYPE_LABELS: Record<string, string> = {
  transcript: 'Transcript',
  product_info: 'Product info',
  meeting_notes: 'Meeting notes',
  other: 'Other',
};

export function AccountsList({ accounts }: { accounts: AccountWithDocs[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deletingDoc, setDeletingDoc] = useState<string | null>(null);
  const { setAccountId } = useRunner();
  const router = useRouter();

  const toggle = (id: string) => setExpanded((prev) => (prev === id ? null : id));

  const handleDeleteDoc = async (docId: string) => {
    setDeletingDoc(docId);
    try {
      await fetch(`/api/documents/${docId}`, { method: 'DELETE' });
      router.refresh();
    } catch {
      // silent fail — refresh will show correct state
    } finally {
      setDeletingDoc(null);
    }
  };

  const handleRunTool = (accountId: string) => {
    setAccountId(accountId);
    router.push('/dashboard/tools');
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {accounts.map((account, idx) => {
        const isExpanded = expanded === account.id;
        const isLast = idx === accounts.length - 1;

        return (
          <div key={account.id} className={!isLast ? 'border-b border-slate-200' : ''}>
            {/* Row header */}
            <button
              onClick={() => toggle(account.id)}
              className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 transition-colors text-left"
            >
              {/* Chevron */}
              <span
                className={`shrink-0 w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  isExpanded ? 'rotate-90' : ''
                }`}
              >
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>

              {/* Company name */}
              <span className="text-sm font-medium text-slate-900 flex-1 min-w-0 truncate">
                {account.company_name}
              </span>

              {/* Meta */}
              <div className="hidden sm:flex items-center gap-3 shrink-0">
                {(account.industry || account.size) && (
                  <span className="text-xs text-slate-500">
                    {[account.industry, account.size].filter(Boolean).join(' · ')}
                  </span>
                )}
                <span
                  className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                    account.docs.length > 0
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {account.docs.length} {account.docs.length === 1 ? 'doc' : 'docs'}
                </span>
              </div>
            </button>

            {/* Expanded body */}
            {isExpanded && (
              <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4 space-y-4">
                {/* Notes */}
                {account.notes && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1">
                      Notes
                    </p>
                    <p className="text-sm text-slate-600 whitespace-pre-wrap">{account.notes}</p>
                  </div>
                )}

                {/* Documents */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                      Documents
                    </p>
                    <Link
                      href={`/dashboard/knowledge-base/upload?accountId=${account.id}`}
                      className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                    >
                      + Upload
                    </Link>
                  </div>

                  {account.docs.length === 0 ? (
                    <p className="text-xs text-slate-400 py-2">
                      No documents yet.{' '}
                      <Link
                        href={`/dashboard/knowledge-base/upload?accountId=${account.id}`}
                        className="text-indigo-500 hover:text-indigo-700 transition-colors"
                      >
                        Upload one →
                      </Link>
                    </p>
                  ) : (
                    <div className="space-y-1.5">
                      {account.docs.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between gap-3 bg-white rounded-lg border border-slate-200 px-3 py-2"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className={`text-[10px] font-medium px-1.5 py-0.5 rounded shrink-0 ${
                                DOC_TYPE_STYLES[doc.doc_type] ?? DOC_TYPE_STYLES.other
                              }`}
                            >
                              {DOC_TYPE_LABELS[doc.doc_type] ?? doc.doc_type}
                            </span>
                            <span className="text-sm text-slate-700 truncate">{doc.title}</span>
                            {doc.char_count && (
                              <span className="text-xs text-slate-400 shrink-0">
                                ~{Math.round(doc.char_count / 1000)}k
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => handleDeleteDoc(doc.id)}
                            disabled={deletingDoc === doc.id}
                            className="shrink-0 text-slate-300 hover:text-red-500 transition-colors disabled:opacity-50 text-sm leading-none"
                            aria-label="Delete document"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => handleRunTool(account.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-3 py-1.5 text-xs transition-colors"
                  >
                    ⚡ Run a tool
                  </button>
                  <Link
                    href={`/dashboard/accounts/${account.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium px-3 py-1.5 text-xs transition-colors"
                  >
                    View details →
                  </Link>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
