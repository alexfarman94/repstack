'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRunner } from '@/app/dashboard/RunnerContext';
import { QuickAddModal } from './QuickAddModal';

type Opportunity = {
  id: string;
  name: string;
  stage: string | null;
  value: number | null;
  documents: { count: number }[];
};

type Account = {
  id: string;
  company_name: string;
  industry: string | null;
  documents: { count: number }[];
  opportunities: Opportunity[];
};

export function AccountTree() {
  const { activeAccountId, activeOpportunityId, setContext, refreshKey, triggerRefresh } = useRunner();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [addModal, setAddModal] = useState<{ type: 'account' | 'opportunity'; accountId?: string } | null>(null);

  const fetchAccounts = async () => {
    try {
      const res = await fetch('/api/accounts');
      const data = await res.json();
      if (!Array.isArray(data)) return;

      // For each account, fetch opportunities
      const withOpps = await Promise.all(
        data.map(async (acct: Account) => {
          const oppsRes = await fetch(`/api/opportunities?accountId=${acct.id}`);
          const oppsData = await oppsRes.json();
          return { ...acct, opportunities: Array.isArray(oppsData) ? oppsData : [] };
        })
      );
      setAccounts(withOpps);

      // Auto-select first account if nothing selected
      if (!activeAccountId && withOpps[0]?.id) {
        setContext(withOpps[0].id);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [refreshKey]);

  // Auto-expand the active account
  useEffect(() => {
    if (activeAccountId) {
      setExpanded((prev) => ({ ...prev, [activeAccountId]: true }));
    }
  }, [activeAccountId]);

  const filtered = useMemo(
    () =>
      accounts.filter((a) =>
        a.company_name.toLowerCase().includes(query.toLowerCase().trim())
      ),
    [accounts, query]
  );

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const docCount = (docs: { count: number }[]) => docs?.[0]?.count ?? 0;

  const handleCreated = () => {
    setAddModal(null);
    triggerRefresh();
    fetchAccounts();
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">Accounts</p>
        <button
          onClick={() => setAddModal({ type: 'account' })}
          className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          title="Add account"
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>

      {/* Search */}
      <div className="px-4 pb-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search accounts..."
          className="glass-input w-full text-xs"
        />
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {loading ? (
          <div className="px-2 py-4 text-xs text-slate-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="px-2 py-4 text-center text-xs text-slate-400">
            {accounts.length === 0 ? 'No accounts yet' : 'No matches'}
          </div>
        ) : (
          <div className="space-y-0.5">
            {filtered.map((acct) => {
              const isActiveAcct = activeAccountId === acct.id;
              const isExpanded = expanded[acct.id] ?? false;
              const totalDocs = docCount(acct.documents);
              const opps = acct.opportunities || [];

              return (
                <div key={acct.id}>
                  {/* Account node */}
                  <div
                    className={`group flex items-center gap-1 rounded-lg px-2 py-1.5 text-left transition-colors cursor-pointer ${
                      isActiveAcct && !activeOpportunityId
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                    onClick={() => {
                      setContext(acct.id);
                      toggleExpand(acct.id);
                    }}
                  >
                    {/* Expand chevron */}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className={`shrink-0 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>

                    <span className="flex-1 truncate text-sm font-medium">{acct.company_name}</span>

                    {/* Doc count badge */}
                    {totalDocs > 0 && (
                      <span className="shrink-0 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                        {totalDocs}
                      </span>
                    )}

                    {/* Add opp button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setAddModal({ type: 'opportunity', accountId: acct.id });
                      }}
                      className="shrink-0 rounded opacity-0 transition-opacity group-hover:opacity-100 hover:bg-slate-200 p-0.5"
                      title="Add opportunity"
                    >
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </button>
                  </div>

                  {/* Opportunities */}
                  {isExpanded && opps.length > 0 && (
                    <div className="ml-5 space-y-0.5 py-0.5">
                      {opps.map((opp) => {
                        const isActiveOpp = activeOpportunityId === opp.id;
                        const oppDocs = docCount(opp.documents);

                        return (
                          <div
                            key={opp.id}
                            onClick={() => setContext(acct.id, opp.id)}
                            className={`flex items-center gap-2 rounded-md px-2 py-1 text-left transition-colors cursor-pointer ${
                              isActiveOpp
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                            }`}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                            <span className="flex-1 truncate text-xs font-medium">{opp.name}</span>
                            {opp.stage && (
                              <span className="shrink-0 text-[10px] text-slate-400">{opp.stage}</span>
                            )}
                            {oppDocs > 0 && (
                              <span className="shrink-0 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                                {oppDocs}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Empty opp state */}
                  {isExpanded && opps.length === 0 && (
                    <div className="ml-5 py-1">
                      <button
                        onClick={() => setAddModal({ type: 'opportunity', accountId: acct.id })}
                        className="text-[11px] text-slate-400 hover:text-indigo-600 transition-colors"
                      >
                        + Add opportunity
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick add modal */}
      {addModal && (
        <QuickAddModal
          type={addModal.type}
          accountId={addModal.accountId}
          onClose={() => setAddModal(null)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
}
