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
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Opportunities</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Companies in your pipeline. Attach documents to auto-inject context into every tool run.
          </p>
        </div>
        <Link
          href="/dashboard/accounts/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-3 py-2 text-sm transition-colors shrink-0"
        >
          <span className="text-lg leading-none">+</span> New opportunity
        </Link>
      </div>

      {!accounts?.length ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center">
          <p className="text-slate-900 font-medium">No opportunities yet</p>
          <p className="text-slate-500 text-sm mt-2 max-w-xs mx-auto">
            Add your first opportunity to start storing documents and injecting context into tools.
          </p>
          <Link
            href="/dashboard/accounts/new"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 text-sm transition-colors"
          >
            Add opportunity
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4 font-medium">Company</th>
                  <th className="py-3 px-4 font-medium">Details</th>
                  <th className="py-3 px-4 font-medium">Docs</th>
                  <th className="py-3 px-4 font-medium">Created</th>
                  <th className="py-3 px-4 font-medium text-right"> </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {accounts.map((account) => {
                  const docs = countMap[account.id] ?? 0;
                  return (
                    <tr key={account.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 align-top">
                        <Link
                          href={`/dashboard/accounts/${account.id}`}
                          className="text-sm font-medium text-slate-900 hover:text-indigo-700 transition-colors"
                        >
                          {account.company_name}
                        </Link>
                      </td>
                      <td className="py-3 px-4 align-top">
                        <div className="flex flex-wrap gap-x-3 gap-y-1">
                          {account.industry && (
                            <span className="text-sm text-slate-600">{account.industry}</span>
                          )}
                          {account.size && <span className="text-sm text-slate-500">{account.size}</span>}
                          {!account.industry && !account.size && (
                            <span className="text-sm text-slate-400">—</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 align-top">
                        <span className="text-sm text-slate-600">
                          {docs} {docs === 1 ? 'doc' : 'docs'}
                        </span>
                      </td>
                      <td className="py-3 px-4 align-top">
                        <span className="text-sm text-slate-500">
                          {new Date(account.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-3 px-4 align-top text-right">
                        <Link
                          href={`/dashboard/accounts/${account.id}`}
                          className="inline-flex items-center rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1.5 text-sm font-medium transition-colors"
                        >
                          Open →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
