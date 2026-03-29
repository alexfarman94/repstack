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
    .from('opportunities')
    .select('*, documents(count)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (accountId) {
    query = query.eq('account_id', accountId);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { name, account_id, stage, value, close_date, notes } = body;

  if (!name?.trim()) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 });
  }
  if (!account_id) {
    return NextResponse.json({ error: 'account_id is required' }, { status: 400 });
  }

  // Verify the account belongs to this user
  const supabase = createServerClient();
  const { data: account, error: acctErr } = await supabase
    .from('accounts')
    .select('id')
    .eq('id', account_id)
    .eq('user_id', userId)
    .single();

  if (acctErr || !account) {
    return NextResponse.json({ error: 'Account not found' }, { status: 404 });
  }

  const { data, error } = await supabase
    .from('opportunities')
    .insert({
      user_id: userId,
      account_id,
      name: name.trim(),
      stage: stage || null,
      value: value || null,
      close_date: close_date || null,
      notes: notes || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
