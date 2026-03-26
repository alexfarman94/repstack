import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase';
import { AccountsList } from './AccountsList';

export default async function AccountsPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const supabase = createServerClient();

  const [{ data: accounts }, { data: docs }] = await Promise.all([
    supabase
      .from('accounts')
      .select('id, company_name, industry, size, notes, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
    supabase
      .from('documents')
      .select('id, account_id, title, doc_type, char_count')
      .eq('user_id', userId)
      .not('account_id', 'is', null)
      .order('created_at', { ascending: false }),
  ]);

  // Group docs by account_id
  const docsByAccount: Record<string, typeof docs> = {};
  docs?.forEach((d) => {
    if (d.account_id) {
      docsByAccount[d.account_id] = docsByAccount[d.account_id] ?? [];
      docsByAccount[d.account_id]!.push(d);
    }
  });

  const accountsWithDocs = (accounts ?? []).map((a) => ({
    ...a,
    docs: docsByAccount[a.id] ?? [],
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Opportunities</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Companies in your pipeline. Expand a row to see documents and run tools.
          </p>
        </div>
        <Link
          href="/dashboard/accounts/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-3 py-2 text-sm transition-colors shrink-0"
        >
          <span className="text-lg leading-none">+</span> New opportunity
        </Link>
      </div>

      {!accountsWithDocs.length ? (
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
        <AccountsList accounts={accountsWithDocs} />
      )}
    </div>
  );
}
