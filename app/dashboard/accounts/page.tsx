import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase';

export default async function AccountsPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const supabase = createServerClient();
  const { data: accounts } = await supabase
    .from('accounts')
    .select('id, company_name, industry, size, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  // Get doc counts per account
  const { data: docCounts } = await supabase
    .from('documents')
    .select('account_id')
    .eq('user_id', userId)
    .not('account_id', 'is', null);

  const countMap: Record<string, number> = {};
  docCounts?.forEach((d) => {
    if (d.account_id) countMap[d.account_id] = (countMap[d.account_id] ?? 0) + 1;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Accounts</h1>
          <p className="text-stone-400 mt-1 text-sm">
            Companies in your pipeline. Attach documents to auto-inject context into any tool.
          </p>
        </div>
        <Link
          href="/dashboard/accounts/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-3 py-2 text-sm transition-colors shrink-0"
        >
          <span className="text-lg leading-none">+</span> New account
        </Link>
      </div>

      {!accounts?.length ? (
        <div className="rounded-xl border border-dashed border-white/[0.12] bg-white/[0.02] p-10 text-center">
          <p className="text-stone-300 font-medium">No accounts yet</p>
          <p className="text-stone-500 text-sm mt-2 max-w-xs mx-auto">
            Add your first account to start storing documents and injecting context into tools.
          </p>
          <Link
            href="/dashboard/accounts/new"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 text-sm transition-colors"
          >
            Create account
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-white/[0.06] rounded-xl border border-white/[0.06] overflow-hidden">
          {accounts.map((account) => {
            const docs = countMap[account.id] ?? 0;
            return (
              <Link
                key={account.id}
                href={`/dashboard/accounts/${account.id}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-white/[0.03] transition-colors"
              >
                <div className="min-w-0">
                  <p className="font-medium text-white truncate">{account.company_name}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    {account.industry && (
                      <span className="text-xs text-stone-500">{account.industry}</span>
                    )}
                    {account.size && (
                      <span className="text-xs text-stone-600">{account.size}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0 ml-4">
                  <span className="text-xs text-stone-500">
                    {docs} {docs === 1 ? 'doc' : 'docs'}
                  </span>
                  <span className="text-stone-600 text-xs">
                    {new Date(account.created_at).toLocaleDateString()}
                  </span>
                  <span className="text-stone-600">→</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
