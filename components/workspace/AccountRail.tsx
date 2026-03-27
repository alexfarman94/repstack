'use client';

type Account = {
  id: string;
  company_name: string;
  industry: string | null;
  size: string | null;
};

interface AccountRailProps {
  accounts: Account[];
  activeAccountId: string;
  query: string;
  onQueryChange: (value: string) => void;
  onSelectAccount: (accountId: string) => void;
}

export function AccountRail({
  accounts,
  activeAccountId,
  query,
  onQueryChange,
  onSelectAccount,
}: AccountRailProps) {
  return (
    <aside className="glass-panel h-full p-4 md:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">Accounts</p>
          <h2 className="text-lg font-semibold text-slate-900">Pipeline</h2>
        </div>
      </div>

      <label className="sr-only" htmlFor="account-search">
        Search accounts
      </label>
      <input
        id="account-search"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Search accounts..."
        className="glass-input mb-4 w-full"
      />

      <div className="space-y-2">
        {accounts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white/50 p-4 text-sm text-slate-500">
            No accounts yet. Create one in the intake panel.
          </div>
        ) : (
          accounts.map((account) => {
            const isActive = activeAccountId === account.id;
            return (
              <button
                key={account.id}
                onClick={() => onSelectAccount(account.id)}
                className={`w-full rounded-xl border p-3 text-left transition ${
                  isActive
                    ? 'border-indigo-300 bg-indigo-50/80 shadow-sm'
                    : 'border-white/70 bg-white/70 hover:border-indigo-200 hover:bg-white'
                }`}
              >
                <p className="truncate text-sm font-semibold text-slate-900">{account.company_name}</p>
                <p className="mt-1 truncate text-xs text-slate-500">
                  {account.industry || 'General'}{account.size ? ` · ${account.size}` : ''}
                </p>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}
