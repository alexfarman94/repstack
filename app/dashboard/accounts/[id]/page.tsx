import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { DeleteAccountButton } from './DeleteAccountButton';
import { DeleteDocButton } from './DeleteDocButton';

export default async function AccountDetailPage({ params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId) return null;

  const supabase = createServerClient();

  const [{ data: account }, { data: docs }] = await Promise.all([
    supabase
      .from('accounts')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', userId)
      .single(),
    supabase
      .from('documents')
      .select('id, title, doc_type, char_count, created_at')
      .eq('user_id', userId)
      .eq('account_id', params.id)
      .order('created_at', { ascending: false }),
  ]);

  if (!account) notFound();

  const totalChars = docs?.reduce((sum, d) => sum + (d.char_count ?? 0), 0) ?? 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
            <Link href="/dashboard/accounts" className="hover:text-stone-300 transition-colors">
              Accounts
            </Link>
            <span>/</span>
            <span className="text-stone-400">{account.company_name}</span>
          </div>
          <h1 className="text-2xl font-bold text-white">{account.company_name}</h1>
          <div className="flex items-center gap-3 mt-1">
            {account.industry && <span className="text-sm text-stone-400">{account.industry}</span>}
            {account.size && (
              <>
                <span className="text-stone-700">·</span>
                <span className="text-sm text-stone-500">{account.size}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={`/dashboard/knowledge-base/upload?accountId=${params.id}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] text-stone-300 hover:text-white hover:border-white/[0.16] px-3 py-1.5 text-sm transition-colors"
          >
            + Add doc
          </Link>
          <DeleteAccountButton id={params.id} name={account.company_name} />
        </div>
      </div>

      {/* Notes */}
      {account.notes && (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-600 mb-2">Notes</p>
          <p className="text-sm text-stone-300 whitespace-pre-wrap">{account.notes}</p>
        </div>
      )}

      {/* Documents */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-stone-300 uppercase tracking-widest">
            Documents
            {docs?.length ? (
              <span className="ml-2 text-stone-600 font-normal normal-case tracking-normal">
                {docs.length} · ~{Math.round(totalChars / 1000)}k chars
              </span>
            ) : null}
          </h2>
          <Link
            href={`/dashboard/knowledge-base/upload?accountId=${params.id}`}
            className="text-xs text-indigo-400 hover:text-indigo-300"
          >
            Upload →
          </Link>
        </div>

        {!docs?.length ? (
          <div className="rounded-xl border border-dashed border-white/[0.10] bg-white/[0.01] p-8 text-center">
            <p className="text-stone-400 text-sm">No documents yet</p>
            <p className="text-stone-600 text-xs mt-1">
              Upload call transcripts, product briefs, or meeting notes.
            </p>
            <Link
              href={`/dashboard/knowledge-base/upload?accountId=${params.id}`}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-stone-300 px-3 py-1.5 text-xs transition-colors"
            >
              Upload a document
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.06] rounded-xl border border-white/[0.06] overflow-hidden">
            {docs.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between px-5 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{doc.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <DocTypeBadge type={doc.doc_type} />
                    {doc.char_count && (
                      <span className="text-xs text-stone-600">
                        ~{Math.round(doc.char_count / 1000)}k chars
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <span className="text-xs text-stone-600">
                    {new Date(doc.created_at).toLocaleDateString()}
                  </span>
                  <DeleteDocButton id={doc.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Run tools against this account */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-stone-300 uppercase tracking-widest">
          Run with this context
        </h2>
        <p className="text-sm text-stone-500">
          Open any tool and select <strong className="text-stone-400">{account.company_name}</strong> from
          the account picker — all documents above will be automatically injected as context.
        </p>
        <Link
          href={`/tools?accountId=${params.id}`}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 text-sm transition-colors"
        >
          Browse tools →
        </Link>
      </section>
    </div>
  );
}

function DocTypeBadge({ type }: { type: string }) {
  const labels: Record<string, string> = {
    transcript: 'Transcript',
    product_info: 'Product info',
    meeting_notes: 'Meeting notes',
    other: 'Other',
  };
  const colours: Record<string, string> = {
    transcript: 'bg-blue-500/10 text-blue-400',
    product_info: 'bg-purple-500/10 text-purple-400',
    meeting_notes: 'bg-green-500/10 text-green-400',
    other: 'bg-white/[0.06] text-stone-400',
  };
  return (
    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${colours[type] ?? colours.other}`}>
      {labels[type] ?? type}
    </span>
  );
}
