import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase';
import { DeleteDocButton } from '../accounts/[id]/DeleteDocButton';

export default async function KnowledgeBasePage() {
  const { userId } = await auth();
  if (!userId) return null;

  const supabase = createServerClient();

  const [{ data: docs }, { data: accounts }] = await Promise.all([
    supabase
      .from('documents')
      .select('id, title, doc_type, char_count, account_id, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
    supabase
      .from('accounts')
      .select('id, company_name')
      .eq('user_id', userId),
  ]);

  const accountMap: Record<string, string> = {};
  accounts?.forEach((a) => { accountMap[a.id] = a.company_name; });

  const totalChars = docs?.reduce((sum, d) => sum + (d.char_count ?? 0), 0) ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Documents</h1>
          <p className="text-stone-400 mt-1 text-sm">
            {docs?.length
              ? `${docs.length} document${docs.length !== 1 ? 's' : ''} · ~${Math.round(totalChars / 1000)}k chars stored`
              : 'All uploaded transcripts, briefs, and notes across every account.'}
          </p>
        </div>
        <Link
          href="/dashboard/knowledge-base/upload"
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-3 py-2 text-sm transition-colors shrink-0"
        >
          <span className="text-lg leading-none">+</span> Upload
        </Link>
      </div>

      {!docs?.length ? (
        <div className="rounded-xl border border-dashed border-white/[0.12] bg-white/[0.02] p-10 text-center">
          <p className="text-stone-300 font-medium">No documents yet</p>
          <p className="text-stone-500 text-sm mt-2 max-w-xs mx-auto">
            Upload call transcripts, product briefs, or meeting notes — then run tools
            with full context auto-injected.
          </p>
          <Link
            href="/dashboard/knowledge-base/upload"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 text-sm transition-colors"
          >
            Upload a document
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-white/[0.06] rounded-xl border border-white/[0.06] overflow-hidden">
          {docs.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between px-5 py-3.5">
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{doc.title}</p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <DocTypeBadge type={doc.doc_type} />
                  {doc.account_id && accountMap[doc.account_id] && (
                    <Link
                      href={`/dashboard/accounts/${doc.account_id}`}
                      className="text-xs text-stone-500 hover:text-stone-300 transition-colors"
                    >
                      {accountMap[doc.account_id]}
                    </Link>
                  )}
                  {!doc.account_id && (
                    <span className="text-xs text-stone-700">Unattached</span>
                  )}
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
