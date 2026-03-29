import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const accountId = searchParams.get('accountId');

  const supabase = createServerClient();
  let query = supabase
    .from('documents')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (accountId) {
    query = query.eq('account_id', accountId);
  }

  const opportunityId = searchParams.get('opportunityId');
  if (opportunityId) {
    query = query.eq('opportunity_id', opportunityId);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { title, content, doc_type, account_id, opportunity_id } = body;

  if (!title?.trim()) return NextResponse.json({ error: 'title is required' }, { status: 400 });
  if (!content?.trim()) return NextResponse.json({ error: 'content is required' }, { status: 400 });
  if (!doc_type) return NextResponse.json({ error: 'doc_type is required' }, { status: 400 });

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('documents')
    .insert({
      user_id: userId,
      title: title.trim(),
      content: content.trim(),
      doc_type,
      account_id: account_id || null,
      opportunity_id: opportunity_id || null,
      char_count: content.trim().length,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
