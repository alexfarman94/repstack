import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase';
import { UploadForm } from './UploadForm';

export default async function UploadPage({
  searchParams,
}: {
  searchParams: { accountId?: string };
}) {
  const { userId } = await auth();
  if (!userId) return null;

  const supabase = createServerClient();
  const { data: accounts } = await supabase
    .from('accounts')
    .select('id, company_name')
    .eq('user_id', userId)
    .order('company_name');

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Upload document</h1>
        <p className="text-stone-400 mt-1 text-sm">
          Add a transcript, product brief, or meeting notes. Supports .txt and .docx files, or paste text directly.
        </p>
      </div>
      <UploadForm
        accounts={accounts ?? []}
        defaultAccountId={searchParams.accountId ?? ''}
      />
    </div>
  );
}
